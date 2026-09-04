import "server-only";

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

import { env } from "@/lib/env";
import { AiProviderError, AiSchemaError } from "@/lib/errors";
import { redactEvidence } from "@/lib/redaction";
import { conversationAnalysisPrompt, IMAGE_ANALYSIS_PROMPT, SYSTEM_INSTRUCTION, textAnalysisPrompt } from "@/server/ai/prompts";
import { AiSemanticJsonSchema, AiSemanticResultSchema, ConversationAiSemanticJsonSchema, ConversationAiSemanticResultSchema, type AiSemanticResult, type ConversationAiSemanticResult } from "@/server/ai/schemas";
import type { AiAnalysis, AiClient, AnalyzeConversationInput, AnalyzeImageInput, AnalyzeTextInput, ConversationAiAnalysis } from "@/server/ai/client";
import { withAiConcurrency } from "@/server/ai/concurrency";

function cleanJsonString(raw: string | undefined): string {
  if (!raw) return "";
  let clean = raw.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  const firstBrace = clean.indexOf("{");
  const lastBrace = clean.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    clean = clean.slice(firstBrace, lastBrace + 1);
  }
  return clean;
}

const VALID_CATEGORIES = new Set([
  "impersonation",
  "credential_theft",
  "otp_theft",
  "payment_request",
  "fake_prize",
  "investment",
  "delivery",
  "account_takeover",
  "social_engineering",
  "benign_or_unclear",
  "unknown",
]);

const VALID_INDICATOR_CATEGORIES = new Set([
  "urgency",
  "credential_request",
  "otp_request",
  "payment_request",
  "impersonation",
  "threat",
  "prize",
  "investment",
  "remote_access",
  "brand_domain_mismatch",
  "url_obfuscation",
  "secrecy",
  "verification_link",
  "other",
]);

const VALID_ACTION_TAGS = new Set([
  "do_not_click",
  "do_not_share_credentials",
  "do_not_share_otp",
  "verify_independently",
  "contact_provider",
  "secure_account",
  "preserve_evidence",
  "report_officially",
]);

type SemanticCategory = AiSemanticResult["category"];
type IndicatorCategory = AiSemanticResult["indicators"][number]["category"];
type IndicatorSeverity = AiSemanticResult["indicators"][number]["severity"];
type ActionTag = AiSemanticResult["recommendedActionTags"][number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSemanticCategory(value: unknown): value is SemanticCategory {
  return typeof value === "string" && VALID_CATEGORIES.has(value);
}

function isIndicatorCategory(value: unknown): value is IndicatorCategory {
  return typeof value === "string" && VALID_INDICATOR_CATEGORIES.has(value);
}

function isIndicatorSeverity(value: unknown): value is IndicatorSeverity {
  return value === "low" || value === "medium" || value === "high";
}

function isActionTag(value: unknown): value is ActionTag {
  return typeof value === "string" && VALID_ACTION_TAGS.has(value);
}

function boundedText(value: unknown, fallback: string, maxLength: number): string {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : fallback;
}

type AiInput = string | Array<
  | { type: "text"; text: string }
  | { type: "image"; data: string; mime_type: string }
>;

type GenerateContentInput = Parameters<GoogleGenAI["models"]["generateContent"]>[0]["contents"];

function toGenerateContentInput(input: AiInput): GenerateContentInput {
  if (typeof input === "string") return input;

  return [{
    role: "user",
    parts: input.map((part) => part.type === "text"
      ? { text: part.text }
      : { inlineData: { data: part.data, mimeType: part.mime_type } }),
  }];
}

function thinkingLevelFor(model: string): "minimal" | "low" | undefined {
  const normalizedModel = model.toLocaleLowerCase("en-US");

  if (normalizedModel.startsWith("gemini-3.") && normalizedModel.includes("flash-lite")) {
    return "minimal";
  }

  if (normalizedModel.startsWith("gemini-3.")) {
    return "low";
  }

  return undefined;
}

function modelCandidates(): string[] {
  return [...new Set([
    env.GEMINI_MODEL,
    env.GEMINI_FALLBACK_MODEL,
  ])];
}

function usesGenerateContentApi(model: string): boolean {
  return model.toLocaleLowerCase("en-US").startsWith("gemini-3.8-");
}

function coerceSemanticResult(obj: Record<string, unknown>): AiSemanticResult {
  const semanticRisk = Math.min(100, Math.max(0, Math.round(Number(obj.semanticRisk) || 0)));
  const confidence = obj.confidence === "low" || obj.confidence === "medium" || obj.confidence === "high"
    ? obj.confidence
    : "medium";

  const category = isSemanticCategory(obj.category)
    ? obj.category
    : "unknown";

  const summary = typeof obj.summary === "string" && obj.summary.trim()
    ? obj.summary.trim().slice(0, 500)
    : "Pesan ini terdeteksi memiliki pola risiko.";

  const uncertainty = typeof obj.uncertainty === "string" && obj.uncertainty.trim()
    ? obj.uncertainty.trim().slice(0, 500)
    : "Yang belum bisa dipastikan: konteks lengkap dari pengirim pesan.";

  const claimedBrands = Array.isArray(obj.claimedBrands)
    ? obj.claimedBrands.filter((b): b is string => typeof b === "string" && Boolean(b.trim())).map((b) => b.trim().slice(0, 80)).slice(0, 10)
    : [];

  const rawIndicators = Array.isArray(obj.indicators) ? obj.indicators : [];
  const indicators: AiSemanticResult["indicators"] = [];
  const seenCategories = new Set<string>();

  for (const item of rawIndicators) {
    if (!isRecord(item)) continue;
    const category = isIndicatorCategory(item.category)
      ? item.category
      : "other";
    if (seenCategories.has(category)) continue;
    seenCategories.add(category);

    const severity = isIndicatorSeverity(item.severity)
      ? item.severity
      : "medium";

    indicators.push({
      category,
      label: boundedText(item.label, "Pola mencurigakan", 120),
      technique: boundedText(item.technique, "Manipulasi informasi", 120),
      severity,
      evidence: typeof item.evidence === "string" ? redactEvidence(item.evidence, 120) : "",
      explanation: boundedText(item.explanation, "Terdeteksi teknik rekayasa sosial.", 500),
    });
    if (indicators.length >= 12) break;
  }

  const rawTags = Array.isArray(obj.recommendedActionTags) ? obj.recommendedActionTags : [];
  const recommendedActionTags: AiSemanticResult["recommendedActionTags"] = [];
  for (const tag of rawTags) {
    if (isActionTag(tag)) {
      recommendedActionTags.push(tag);
      if (recommendedActionTags.length >= 8) break;
    }
  }
  if (!recommendedActionTags.length) {
    recommendedActionTags.push("verify_independently");
  }

  const extractedText = typeof obj.extractedText === "string" ? obj.extractedText.slice(0, 10_000) : undefined;

  return {
    semanticRisk,
    confidence,
    category,
    summary,
    extractedText,
    claimedBrands,
    indicators,
    uncertainty,
    recommendedActionTags,
  };
}

function coerceConversationResult(obj: Record<string, unknown>): ConversationAiSemanticResult {
  const semanticRisk = Math.min(100, Math.max(0, Math.round(Number(obj.semanticRisk) || 0)));
  const confidence = obj.confidence === "low" || obj.confidence === "medium" || obj.confidence === "high"
    ? obj.confidence
    : "medium";
  const summary = typeof obj.summary === "string" && obj.summary.trim()
    ? obj.summary.trim().slice(0, 500)
    : "Percakapan ini menunjukkan indikasi manipulasi.";
  const progressionSummary = typeof obj.progressionSummary === "string" && obj.progressionSummary.trim()
    ? obj.progressionSummary.trim().slice(0, 500)
    : "Tahapan percakapan mengarah pada upaya manipulasi informasi.";
  const uncertainty = typeof obj.uncertainty === "string" && obj.uncertainty.trim()
    ? obj.uncertainty.trim().slice(0, 500)
    : "Yang belum bisa dipastikan: identitas sebenarnya dari pengirim.";

  const rawIndicators = Array.isArray(obj.indicators) ? obj.indicators : [];
  const indicators: ConversationAiSemanticResult["indicators"] = [];
  const seen = new Set<string>();

  for (const item of rawIndicators) {
    if (!isRecord(item)) continue;
    const category = isIndicatorCategory(item.category)
      ? item.category
      : "other";
    if (seen.has(category)) continue;
    seen.add(category);

    const messageIds = Array.isArray(item.messageIds)
      ? item.messageIds.filter((id): id is string => typeof id === "string" && Boolean(id.trim())).slice(0, 6)
      : ["m1"];

    indicators.push({
      category,
      label: boundedText(item.label, "Indikator manipulasi", 120),
      severity: isIndicatorSeverity(item.severity) ? item.severity : "medium",
      evidence: typeof item.evidence === "string" ? redactEvidence(item.evidence, 120) : "",
      explanation: boundedText(item.explanation, "Penjelasan indikator.", 500),
      messageIds: messageIds.length ? messageIds : ["m1"],
    });
  }

  const rawTags = Array.isArray(obj.recommendedActionTags) ? obj.recommendedActionTags : [];
  const recommendedActionTags: ConversationAiSemanticResult["recommendedActionTags"] = [];
  for (const tag of rawTags) {
    if (isActionTag(tag)) {
      recommendedActionTags.push(tag);
      if (recommendedActionTags.length >= 8) break;
    }
  }
  if (!recommendedActionTags.length) recommendedActionTags.push("verify_independently");

  return {
    semanticRisk,
    confidence,
    summary,
    indicators,
    progressionSummary,
    uncertainty,
    recommendedActionTags,
  };
}

function parseResponse(raw: string | undefined): AiSemanticResult {
  const cleaned = cleanJsonString(raw);
  if (!cleaned) throw new AiSchemaError("Gemini returned an empty response");

  try {
    const json = JSON.parse(cleaned);
    const parsed = AiSemanticResultSchema.safeParse(json);
    if (parsed.success) {
      const seen = new Set<string>();
      return {
        ...parsed.data,
        summary: parsed.data.summary.trim(),
        uncertainty: parsed.data.uncertainty.trim(),
        indicators: parsed.data.indicators.filter((indicator) => {
          if (seen.has(indicator.category)) return false;
          seen.add(indicator.category);
          return true;
        }).map((indicator) => ({
          ...indicator,
          evidence: redactEvidence(indicator.evidence, 120),
        })),
      };
    }
    return coerceSemanticResult(json as Record<string, unknown>);
  } catch (error) {
    throw new AiSchemaError(error instanceof Error ? error.message : "Invalid Gemini response");
  }
}

function parseConversationResponse(raw: string | undefined): ConversationAiSemanticResult {
  const cleaned = cleanJsonString(raw);
  if (!cleaned) throw new AiSchemaError("Gemini returned an empty conversation response");
  try {
    const json = JSON.parse(cleaned);
    const parsed = ConversationAiSemanticResultSchema.safeParse(json);
    if (parsed.success) {
      const seen = new Set<string>();
      return {
        ...parsed.data,
        indicators: parsed.data.indicators.filter((indicator) => {
          const key = indicator.category;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).map((indicator) => ({ ...indicator, evidence: redactEvidence(indicator.evidence, 120) })),
      };
    }
    return coerceConversationResult(json as Record<string, unknown>);
  } catch (error) {
    throw new AiSchemaError(error instanceof Error ? error.message : "Invalid Gemini conversation response");
  }
}

export class GeminiAiClient implements AiClient {
  private readonly ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  private generate(input: AiInput): Promise<AiAnalysis> {
    return withAiConcurrency(() => this.generateWithinLimit(input));
  }

  private async createStructuredInteraction(
    model: string,
    input: AiInput,
    schema: Record<string, unknown>,
    logContext: string,
  ): Promise<string | undefined> {
    const thinkingLevel = thinkingLevelFor(model);
    const request = {
      model,
      input,
      store: false,
      system_instruction: SYSTEM_INSTRUCTION,
      generation_config: {
        max_output_tokens: 4_096,
        ...(thinkingLevel ? { thinking_level: thinkingLevel } : {}),
      },
    };
    const requestOptions = {
      timeout: env.AI_TIMEOUT_MS,
      // The application owns cross-model fallback; SDK retries would multiply
      // the user-facing timeout before the next model gets a chance to run.
      maxRetries: 0,
    };

    try {
      const response = await this.ai.interactions.create({
        ...request,
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema,
        },
      }, requestOptions);
      return response.output_text;
    } catch (callError) {
      const message = callError instanceof Error ? callError.message : String(callError);
      const isSchemaError = message.includes("400")
        || message.toLowerCase().includes("schema")
        || message.toLowerCase().includes("invalid_argument");

      if (!isSchemaError) throw callError;

      console.warn(`[AmanKlik AI ${logContext} Schema Fallback on ${model}]:`, message);
      const response = await this.ai.interactions.create({
        ...request,
        response_format: {
          type: "text",
          mime_type: "application/json",
        },
      }, requestOptions);
      return response.output_text;
    }
  }

  private async createStructuredContent(
    model: string,
    input: AiInput,
    schema: Record<string, unknown>,
    logContext: string,
  ): Promise<string | undefined> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      Math.min(env.AI_TIMEOUT_MS, 15_000),
    );
    const contents = toGenerateContentInput(input);
    const config = {
      abortSignal: controller.signal,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } as const,
      maxOutputTokens: 4_096,
    };

    try {
      let response;
      try {
        response = await this.ai.models.generateContent({
          model,
          contents,
          config: { ...config, responseJsonSchema: schema },
        });
      } catch (callError) {
        const message = callError instanceof Error ? callError.message : String(callError);
        const isSchemaError = message.includes("400")
          || message.toLowerCase().includes("schema")
          || message.toLowerCase().includes("invalid_argument");

        if (!isSchemaError) throw callError;

        console.warn(`[AmanKlik AI ${logContext} Schema Fallback on ${model}]:`, message);
        response = await this.ai.models.generateContent({ model, contents, config });
      }

      return response.text
        ?? response.candidates?.[0]?.content?.parts
          ?.map((part) => ("text" in part ? part.text : ""))
          .join("");
    } finally {
      clearTimeout(timeout);
    }
  }

  private createStructuredResponse(
    model: string,
    input: AiInput,
    schema: Record<string, unknown>,
    logContext: string,
  ): Promise<string | undefined> {
    if (usesGenerateContentApi(model)) {
      return this.createStructuredContent(model, input, schema, logContext);
    }

    return this.createStructuredInteraction(model, input, schema, logContext);
  }

  private async generateWithinLimit(input: AiInput): Promise<AiAnalysis> {
    const startedAt = Date.now();
    let attemptedFallback = false;
    let lastError: unknown;
    const models = modelCandidates();

    for (const [index, model] of models.entries()) {
      if (index === 1) attemptedFallback = true;

      try {
        const rawText = await this.createStructuredResponse(
          model,
          input,
          AiSemanticJsonSchema,
          "Text",
        );

        return {
          result: parseResponse(rawText),
          meta: {
            provider: "google",
            modelId: model,
            latencyMs: Date.now() - startedAt,
            attemptedFallback,
          },
        };
      } catch (error) {
        console.error(`[AmanKlik AI Error on ${model}]:`, error instanceof Error ? error.message : error);
        lastError = error;
        if (index < models.length - 1) continue;
        break;
      }
    }

    throw new AiProviderError(lastError instanceof Error ? lastError.message : "Gemini analysis failed");
  }

  analyzeText(input: AnalyzeTextInput): Promise<AiAnalysis> {
    return this.generate(textAnalysisPrompt({
      normalizedText: input.normalizedText,
      deterministicSignals: input.deterministicSignals,
      urlAnalysis: input.urlAnalysis,
      knowledge: input.knowledge ?? [],
    }));
  }

  analyzeImage(input: AnalyzeImageInput): Promise<AiAnalysis> {
    return this.generate([
      {
        type: "text",
        text: IMAGE_ANALYSIS_PROMPT,
      },
      {
        type: "image",
        data: Buffer.from(input.bytes).toString("base64"),
        mime_type: input.mimeType,
      },
    ]);
  }

  private async generateConversation(input: AnalyzeConversationInput): Promise<ConversationAiAnalysis> {
    return withAiConcurrency(async () => {
      const startedAt = Date.now();
      let attemptedFallback = false;
      let lastError: unknown;
      const models = modelCandidates();
      for (const [index, model] of models.entries()) {
        if (index === 1) attemptedFallback = true;
        try {
          const rawText = await this.createStructuredResponse(
            model,
            conversationAnalysisPrompt(input),
            ConversationAiSemanticJsonSchema,
            "Conversation",
          );

          return { result: parseConversationResponse(rawText), meta: { provider: "google", modelId: model, latencyMs: Date.now() - startedAt, attemptedFallback } };
        } catch (error) {
          console.error(`[AmanKlik AI Conversation Error on ${model}]:`, error instanceof Error ? error.message : error);
          lastError = error;
          if (index < models.length - 1) continue;
          break;
        }
      }
      throw new AiProviderError(lastError instanceof Error ? lastError.message : "Gemini conversation analysis failed");
    });
  }

  analyzeConversation(input: AnalyzeConversationInput): Promise<ConversationAiAnalysis> {
    return this.generateConversation(input);
  }
}

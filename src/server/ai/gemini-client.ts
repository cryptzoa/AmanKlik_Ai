import "server-only";

import { GoogleGenAI } from "@google/genai";

import { env } from "@/lib/env";
import { AiProviderError, AiSchemaError } from "@/lib/errors";
import { redactEvidence } from "@/lib/redaction";
import { IMAGE_ANALYSIS_PROMPT, SYSTEM_INSTRUCTION, textAnalysisPrompt } from "@/server/ai/prompts";
import { AiSemanticJsonSchema, AiSemanticResultSchema, type AiSemanticResult } from "@/server/ai/schemas";
import type { AiAnalysis, AiClient, AnalyzeImageInput, AnalyzeTextInput } from "@/server/ai/client";
import { withAiConcurrency } from "@/server/ai/concurrency";

function parseResponse(raw: string | undefined): AiSemanticResult {
  if (!raw) throw new AiSchemaError("Gemini returned an empty response");

  try {
    const parsed = AiSemanticResultSchema.parse(JSON.parse(raw));
    const seen = new Set<string>();

    return {
      ...parsed,
      summary: parsed.summary.trim(),
      uncertainty: parsed.uncertainty.trim(),
      indicators: parsed.indicators.filter((indicator) => {
        if (seen.has(indicator.category)) return false;
        seen.add(indicator.category);
        return true;
      }).map((indicator) => ({
        ...indicator,
        evidence: redactEvidence(indicator.evidence, 120),
      })),
    };
  } catch (error) {
    throw new AiSchemaError(error instanceof Error ? error.message : "Invalid Gemini response");
  }
}

function retryable(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return message.includes("429") || message.includes("timeout") || message.includes("temporarily") || message.includes("503");
}

export class GeminiAiClient implements AiClient {
  private readonly ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

  private generate(contents: Parameters<GoogleGenAI["models"]["generateContent"]>[0]["contents"]): Promise<AiAnalysis> {
    return withAiConcurrency(() => this.generateWithinLimit(contents));
  }

  private async generateWithinLimit(contents: Parameters<GoogleGenAI["models"]["generateContent"]>[0]["contents"]): Promise<AiAnalysis> {
    const startedAt = Date.now();
    let attemptedFallback = false;
    let lastError: unknown;
    const models = [env.GEMINI_MODEL, env.GEMINI_FALLBACK_MODEL];

    for (const [index, model] of models.entries()) {
      if (index === 1) attemptedFallback = true;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);

      try {
        const response = await this.ai.models.generateContent({
          model,
          contents,
          config: {
            abortSignal: controller.signal,
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseJsonSchema: AiSemanticJsonSchema,
            temperature: 0.2,
            maxOutputTokens: 2_500,
          },
        });

        return {
          result: parseResponse(response.text),
          meta: {
            provider: "google",
            modelId: model,
            latencyMs: Date.now() - startedAt,
            attemptedFallback,
          },
        };
      } catch (error) {
        lastError = error;
        if (index === 0 && retryable(error)) continue;
        break;
      } finally {
        clearTimeout(timeout);
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
        role: "user",
        parts: [
          { text: IMAGE_ANALYSIS_PROMPT },
          {
            inlineData: {
              data: Buffer.from(input.bytes).toString("base64"),
              mimeType: input.mimeType,
            },
          },
        ],
      },
    ]);
  }
}

import type { AiAnalysis } from "@/server/ai/client";
import { getAiClient } from "@/server/ai";
import { AiProviderError } from "@/lib/errors";
import { preprocessImage, type UploadFile } from "@/server/image/preprocess";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { detectMessageSignals, normalizeText } from "@/server/risk/signals";
import { aiSignalsFromResult, createResult, extractUrls, persistResult } from "@/server/scan/shared";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { retrieveKnowledge } from "@/server/rag/retriever";

export async function analyzeImage(input: { file: UploadFile; sessionId?: string }) {
  const processed = await preprocessImage(input.file);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  let aiAnalysis: AiAnalysis;

  try {
    aiAnalysis = await getAiClient().analyzeImage(processed);
  } catch {
    throw new AiProviderError("Image AI analysis unavailable", true);
  }

  const extractedText = aiAnalysis.result.extractedText ? normalizeText(aiAnalysis.result.extractedText) : "";
  const ruleSignals = extractedText ? detectMessageSignals(extractedText) : [];
  const urls = extractUrls(extractedText);
  const urlAnalysis = urls[0] ? analyzeUrl(urls[0]) : null;
  const knowledge = await retrieveKnowledge([
    extractedText,
    ...aiAnalysis.result.recommendedActionTags,
    ...ruleSignals.map((signal) => signal.label),
  ].join(" "));
  const fusion = fuseRisk({
    inputType: "image",
    ruleSignals,
    urlSignals: urlAnalysis?.signals,
    urlScore: urlAnalysis?.structuralScore,
    aiSignals: aiSignalsFromResult(aiAnalysis),
    semanticRisk: aiAnalysis.result.semanticRisk,
    aiAvailable: true,
    claimedFinanceContext: /\b(?:bank|banking|rekening|kartu|akun)\b/i.test(extractedText),
  });

  const result = createResult({
    inputType: "image",
    score: fusion.finalScore,
    riskLevel: fusion.riskLevel,
    summary: aiAnalysis.result.summary,
    confidence: aiAnalysis.result.confidence,
    analysisMode: fusion.analysisMode,
    aiAvailable: true,
    modelId: aiAnalysis.meta.modelId,
    preview: extractedText || null,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: aiAnalysis.result.recommendedActionTags,
    knowledge: knowledge.matches,
    uncertainty: aiAnalysis.result.uncertainty,
  });

  await persistResult({
    sessionId,
    inputType: "image",
    canonicalInput: processed.bytes,
    result,
    analysisMode: fusion.analysisMode,
    aiAvailable: true,
    cacheHit: false,
    modelId: aiAnalysis.meta.modelId,
    providerLatencyMs: aiAnalysis.meta.latencyMs,
  });

  return { result, degraded: false, sessionId };
}

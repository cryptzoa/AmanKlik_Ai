import type { AiAnalysis } from "@/server/ai/client";
import { getAiClient } from "@/server/ai";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { aiSignalsFromResult, createResult, persistResult } from "@/server/scan/shared";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export async function analyzeSubmittedUrl(input: { url: string; sessionId?: string }) {
  const urlAnalysis = analyzeUrl(input.url);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  let aiAnalysis: AiAnalysis | null = null;

  try {
    aiAnalysis = await getAiClient().analyzeText({
      normalizedText: urlAnalysis.displayUrl,
      deterministicSignals: urlAnalysis.signals,
      urlAnalysis,
    });
  } catch {
    aiAnalysis = null;
  }

  const fusion = fuseRisk({
    inputType: "url",
    ruleSignals: [],
    urlSignals: urlAnalysis.signals,
    urlScore: urlAnalysis.structuralScore,
    aiSignals: aiSignalsFromResult(aiAnalysis),
    semanticRisk: aiAnalysis?.result.semanticRisk,
    aiAvailable: Boolean(aiAnalysis),
  });

  const result = createResult({
    inputType: "url",
    score: fusion.finalScore,
    riskLevel: fusion.riskLevel,
    summary: aiAnalysis?.result.summary ?? "Pemeriksaan struktur tautan selesai; analisis konteks AI sedang terbatas.",
    confidence: aiAnalysis?.result.confidence ?? "low",
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    modelId: aiAnalysis?.meta.modelId,
    preview: urlAnalysis.displayUrl,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: ["do_not_click", "verify_independently", ...(aiAnalysis?.result.recommendedActionTags ?? [])],
    uncertainty: aiAnalysis?.result.uncertainty ?? "Analisis AI tidak tersedia; hasil hanya berdasarkan struktur URL.",
  });

  await persistResult({
    sessionId,
    inputType: "url",
    canonicalInput: input.url.trim(),
    result,
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    cacheHit: false,
    modelId: aiAnalysis?.meta.modelId,
    providerLatencyMs: aiAnalysis?.meta.latencyMs,
  });

  return { result, degraded: !aiAnalysis, sessionId };
}

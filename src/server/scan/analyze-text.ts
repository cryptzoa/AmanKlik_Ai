import { getAiClient } from "@/server/ai";
import type { AiAnalysis } from "@/server/ai/client";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { detectMessageSignals, normalizeText } from "@/server/risk/signals";
import { aiSignalsFromResult, createResult, extractUrls, persistResult } from "@/server/scan/shared";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export async function analyzeText(input: { text: string; sessionId?: string }) {
  const normalizedText = normalizeText(input.text);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  const ruleSignals = detectMessageSignals(normalizedText);
  const urls = extractUrls(normalizedText);
  const urlAnalysis = urls[0] ? analyzeUrl(urls[0]) : null;

  let aiAnalysis: AiAnalysis | null = null;
  try {
    aiAnalysis = await getAiClient().analyzeText({
      normalizedText,
      deterministicSignals: ruleSignals,
      urlAnalysis,
    });
  } catch {
    aiAnalysis = null;
  }

  const fusion = fuseRisk({
    inputType: "text",
    ruleSignals,
    urlSignals: urlAnalysis?.signals,
    urlScore: urlAnalysis?.structuralScore,
    aiSignals: aiSignalsFromResult(aiAnalysis),
    semanticRisk: aiAnalysis?.result.semanticRisk,
    aiAvailable: Boolean(aiAnalysis),
    claimedFinanceContext: /\b(?:bank|banking|rekening|kartu|akun)\b/i.test(normalizedText),
  });

  const result = createResult({
    inputType: "text",
    score: fusion.finalScore,
    riskLevel: fusion.riskLevel,
    summary: aiAnalysis?.result.summary ?? "Pemeriksaan pola deterministik selesai, tetapi analisis konteks AI sedang terbatas.",
    confidence: aiAnalysis?.result.confidence ?? "low",
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    modelId: aiAnalysis?.meta.modelId,
    preview: normalizedText,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: aiAnalysis?.result.recommendedActionTags,
    uncertainty: aiAnalysis?.result.uncertainty ?? "Analisis AI tidak tersedia; hasil hanya berdasarkan pola dan struktur yang terdeteksi.",
  });

  await persistResult({
    sessionId,
    inputType: "text",
    canonicalInput: normalizedText,
    result,
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    cacheHit: false,
    modelId: aiAnalysis?.meta.modelId,
    providerLatencyMs: aiAnalysis?.meta.latencyMs,
  });

  return {
    result,
    degraded: !aiAnalysis,
    sessionId,
  };
}

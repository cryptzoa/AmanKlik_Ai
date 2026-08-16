import { getAiClient } from "@/server/ai";
import type { AiAnalysis } from "@/server/ai/client";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { detectMessageSignals, normalizeText } from "@/server/risk/signals";
import { aiSignalsFromResult, createResult, extractUrls, getCachedResult, materializeCachedResult, persistResult } from "@/server/scan/shared";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { formatKnowledgeForPrompt, retrieveKnowledge } from "@/server/rag/retriever";
import { reportServerError } from "@/server/observability/report-error";

export async function analyzeText(input: { text: string; sessionId?: string }) {
  const normalizedText = normalizeText(input.text);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  const cached = await getCachedResult("text", normalizedText);
  if (cached) {
    const result = materializeCachedResult(cached.resultJson);
    await persistResult({
      sessionId,
      inputType: "text",
      canonicalInput: normalizedText,
      result,
      analysisMode: "cached_hybrid",
      aiAvailable: true,
      cacheHit: true,
      modelId: cached.modelId,
    });
    return { result, degraded: false, sessionId };
  }

  const ruleSignals = detectMessageSignals(normalizedText);
  const urls = extractUrls(normalizedText);
  const urlAnalysis = urls[0] ? analyzeUrl(urls[0]) : null;
  const knowledge = await retrieveKnowledge(normalizedText);

  let aiAnalysis: AiAnalysis | null = null;
  try {
    aiAnalysis = await getAiClient().analyzeText({
      normalizedText,
      deterministicSignals: ruleSignals,
      urlAnalysis,
      knowledge: formatKnowledgeForPrompt(knowledge.matches),
    });
  } catch (error) {
    reportServerError("scan.text.ai", error);
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
    summary: aiAnalysis?.result.summary ?? "Pola pesan sudah diperiksa, tetapi AI sedang tidak dapat membaca konteksnya.",
    confidence: aiAnalysis?.result.confidence ?? "low",
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    modelId: aiAnalysis?.meta.modelId,
    preview: normalizedText,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: aiAnalysis?.result.recommendedActionTags,
    knowledge: knowledge.matches,
    uncertainty: aiAnalysis?.result.uncertainty ?? "Yang belum bisa dipastikan: konteks lengkap pesan. Hasil ini hanya memakai pola dan susunan yang ditemukan.",
    scoreExplanation: fusion.scoreExplanation,
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

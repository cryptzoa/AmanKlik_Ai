import type { AiAnalysis } from "@/server/ai/client";
import { getAiClient } from "@/server/ai";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { aiSignalsFromResult, createResult, getCachedResult, materializeCachedResult, persistResult } from "@/server/scan/shared";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { formatKnowledgeForPrompt, retrieveKnowledge } from "@/server/rag/retriever";
import { reportServerError } from "@/server/observability/report-error";

export async function analyzeSubmittedUrl(input: { url: string; sessionId?: string }) {
  const urlAnalysis = analyzeUrl(input.url);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  const canonicalInput = input.url.trim();
  const cached = await getCachedResult("url", canonicalInput);
  if (cached) {
    const result = materializeCachedResult(cached.resultJson);
    await persistResult({
      sessionId,
      inputType: "url",
      canonicalInput,
      result,
      analysisMode: "cached_hybrid",
      aiAvailable: true,
      cacheHit: true,
      modelId: cached.modelId,
    });
    return { result, degraded: false, sessionId };
  }

  const knowledge = await retrieveKnowledge([
    "tautan url domain phishing login",
    urlAnalysis.displayUrl,
    ...urlAnalysis.signals.map((signal) => signal.label),
  ].join(" "));
  let aiAnalysis: AiAnalysis | null = null;

  try {
    aiAnalysis = await getAiClient().analyzeText({
      normalizedText: urlAnalysis.displayUrl,
      deterministicSignals: urlAnalysis.signals,
      urlAnalysis,
      knowledge: formatKnowledgeForPrompt(knowledge.matches),
    });
  } catch (error) {
    reportServerError("scan.url.ai", error);
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
    summary: aiAnalysis?.result.summary ?? "Susunan tautan sudah diperiksa, tetapi AI sedang tidak dapat membaca konteksnya.",
    confidence: aiAnalysis?.result.confidence ?? "low",
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    modelId: aiAnalysis?.meta.modelId,
    preview: urlAnalysis.displayUrl,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: ["do_not_click", "verify_independently", ...(aiAnalysis?.result.recommendedActionTags ?? [])],
    knowledge: knowledge.matches,
    uncertainty: aiAnalysis?.result.uncertainty ?? "Yang belum bisa dipastikan: tujuan dan pemilik situs. Hasil ini hanya memakai susunan alamat tautan.",
    scoreExplanation: fusion.scoreExplanation,
  });

  await persistResult({
    sessionId,
    inputType: "url",
    canonicalInput,
    result,
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    cacheHit: false,
    modelId: aiAnalysis?.meta.modelId,
    providerLatencyMs: aiAnalysis?.meta.latencyMs,
  });

  return { result, degraded: !aiAnalysis, sessionId };
}

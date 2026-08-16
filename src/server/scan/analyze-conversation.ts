import { getAiClient } from "@/server/ai";
import type { ConversationAiAnalysis } from "@/server/ai/client";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { aiSignalsFromConversationResult, createResult, extractUrls, getCachedResult, materializeCachedResult, persistResult } from "@/server/scan/shared";
import { detectConversationSignals, canonicalConversation, normalizeConversation } from "@/server/risk/conversation-signals";
import { redactEvidence, redactText } from "@/lib/redaction";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { retrieveKnowledge } from "@/server/rag/retriever";
import type { ConversationMessageInput } from "@/types/conversation";
import { reportServerError } from "@/server/observability/report-error";

export async function analyzeConversation(input: { messages: ConversationMessageInput[]; sessionId?: string }) {
  const messages = normalizeConversation(input.messages);
  const canonicalInput = canonicalConversation(messages);
  const sessionId = input.sessionId ?? (await getAnonymousSessionId());
  const cached = await getCachedResult("conversation", canonicalInput);
  if (cached) {
    const result = materializeCachedResult(cached.resultJson);
    await persistResult({ sessionId, inputType: "conversation", canonicalInput, result, analysisMode: "cached_hybrid", aiAvailable: true, cacheHit: true, modelId: cached.modelId });
    return { result, degraded: false, sessionId };
  }

  const deterministic = detectConversationSignals(messages);
  const conversationText = messages.map((message) => `${message.speaker}: ${message.text}`).join("\n");
  const urls = extractUrls(conversationText);
  const urlAnalysis = urls[0] ? analyzeUrl(urls[0]) : null;
  const knowledge = await retrieveKnowledge(`${conversationText}\n${deterministic.progressionSummary}`);
  let aiAnalysis: ConversationAiAnalysis | null = null;

  try {
    aiAnalysis = await getAiClient().analyzeConversation({ messages, deterministicSignals: deterministic.signals, progressionSummary: deterministic.progressionSummary });
  } catch (error) {
    reportServerError("scan.conversation.ai", error);
    aiAnalysis = null;
  }

  const aiSignals = aiSignalsFromConversationResult(aiAnalysis);
  const fusion = fuseRisk({
    inputType: "conversation",
    ruleSignals: deterministic.signals,
    urlSignals: urlAnalysis?.signals,
    urlScore: urlAnalysis?.structuralScore,
    aiSignals,
    semanticRisk: aiAnalysis?.result.semanticRisk,
    aiAvailable: Boolean(aiAnalysis),
    claimedFinanceContext: /\b(?:bank|banking|rekening|kartu|akun|transfer)\b/i.test(conversationText),
  });

  const aiConversationSignals = aiAnalysis?.result.indicators.map((indicator, index) => ({
    id: `ai-conversation-${indicator.category}-${index}`,
    category: indicator.category,
    source: "ai" as const,
    label: indicator.label,
    severity: indicator.severity,
    evidence: redactEvidence(indicator.evidence),
    explanation: indicator.explanation,
    messageIds: indicator.messageIds,
  })) ?? [];
  const timeline = deterministic.timeline.map((item) => ({
    ...item,
    signalIds: [...item.signalIds, ...aiConversationSignals.filter((signal) => signal.messageIds.includes(item.messageId)).map((signal) => signal.id)],
    redactedExcerpt: item.redactedExcerpt ? redactText(item.redactedExcerpt) : undefined,
  }));

  const result = createResult({
    inputType: "conversation",
    score: fusion.finalScore,
    riskLevel: fusion.riskLevel,
    summary: aiAnalysis?.result.summary ?? "Urutan pesan menunjukkan pola yang perlu dihentikan dan diperiksa lewat sumber lain.",
    confidence: aiAnalysis?.result.confidence ?? "low",
    analysisMode: fusion.analysisMode,
    aiAvailable: Boolean(aiAnalysis),
    modelId: aiAnalysis?.meta.modelId,
    indicators: fusion.indicators,
    urlAnalysis,
    actionTags: aiAnalysis?.result.recommendedActionTags ?? ["verify_independently"],
    knowledge: knowledge.matches,
    uncertainty: aiAnalysis?.result.uncertainty ?? "Yang belum bisa dipastikan: konteks lengkap percakapan. Hasil ini hanya memakai pola pada pesan dan urutannya.",
    scoreExplanation: fusion.scoreExplanation,
    conversationAnalysis: { messageCount: messages.length, progressionSummary: aiAnalysis?.result.progressionSummary ?? deterministic.progressionSummary, timeline },
  });

  await persistResult({ sessionId, inputType: "conversation", canonicalInput, result, analysisMode: fusion.analysisMode, aiAvailable: Boolean(aiAnalysis), cacheHit: false, modelId: aiAnalysis?.meta.modelId, providerLatencyMs: aiAnalysis?.meta.latencyMs });
  return { result, degraded: !aiAnalysis, sessionId };
}

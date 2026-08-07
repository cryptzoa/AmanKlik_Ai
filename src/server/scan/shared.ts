import { randomUUID } from "node:crypto";

import { env } from "@/lib/env";
import { redactEvidence, redactText } from "@/lib/redaction";
import { hmacInput } from "@/lib/crypto";
import { createScan, findCacheByHash, upsertCache } from "@/db/repositories/scan-repository";
import type { AnalysisMode, AnalysisResult, InputType, RiskSignal, UrlAnalysis } from "@/types/analysis";
import type { AiAnalysis } from "@/server/ai/client";
import { actionPlanFor } from "@/server/scan/actions";

export const DISCLAIMER = "Penilaian ini menunjukkan indikator risiko dan dapat keliru. Verifikasi melalui kanal resmi sebelum mengambil keputusan.";

export function extractUrls(input: string): string[] {
  return [...input.matchAll(/https?:\/\/[^\s<>]+/gi)]
    .map(([match]) => match.replace(/[),.!?;:]+$/g, ""))
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 10);
}

export function aiSignalsFromResult(analysis: AiAnalysis | null): RiskSignal[] {
  if (!analysis) return [];

  return analysis.result.indicators.map((indicator, index) => ({
    id: `ai-${indicator.category}-${index}`,
    category: indicator.category,
    source: "ai" as const,
    label: indicator.label,
    severity: indicator.severity,
    evidence: redactEvidence(indicator.evidence),
    explanation: indicator.explanation,
  }));
}

export function createResult(input: {
  inputType: InputType;
  score: number;
  riskLevel: AnalysisResult["riskLevel"];
  summary: string;
  confidence?: AnalysisResult["confidence"];
  analysisMode: AnalysisMode;
  aiAvailable: boolean;
  modelId?: string | null;
  cacheHit?: boolean;
  preview?: string | null;
  indicators: RiskSignal[];
  urlAnalysis?: UrlAnalysis | null;
  actionTags?: string[];
  uncertainty: string;
}): AnalysisResult {
  return {
    schemaVersion: 1,
    scanId: randomUUID(),
    inputType: input.inputType,
    finalScore: input.score,
    riskLevel: input.riskLevel,
    summary: input.summary.trim(),
    confidence: input.confidence,
    analysisMode: input.analysisMode,
    aiAvailable: input.aiAvailable,
    modelId: input.modelId ?? null,
    cacheHit: input.cacheHit ?? false,
    previewRedacted: input.preview ? redactText(input.preview) : null,
    indicators: input.indicators.map((signal) => ({
      ...signal,
      evidence: signal.evidence ? redactEvidence(signal.evidence) : undefined,
    })),
    urlAnalysis: input.urlAnalysis ?? null,
    actionPlan: actionPlanFor(input.actionTags),
    uncertainty: input.uncertainty.trim(),
    disclaimer: DISCLAIMER,
    createdAt: new Date().toISOString(),
  };
}

export async function persistResult(input: {
  sessionId: string;
  inputType: InputType;
  canonicalInput: string | Uint8Array;
  result: AnalysisResult;
  analysisMode: AnalysisMode;
  aiAvailable: boolean;
  cacheHit: boolean;
  modelId?: string | null;
  providerLatencyMs?: number | null;
}) {
  const inputHash = hmacInput(input.canonicalInput);
  const expiresAt = new Date(Date.now() + env.ANALYSIS_CACHE_TTL_SECONDS * 1000);

  await createScan({
    sessionId: input.sessionId,
    inputType: input.inputType,
    inputHash,
    previewRedacted: input.result.previewRedacted,
    result: input.result,
    analysisMode: input.analysisMode,
    aiAvailable: input.aiAvailable,
    cacheHit: input.cacheHit,
    modelId: input.modelId,
    providerLatencyMs: input.providerLatencyMs,
    expiresAt,
  });

  if (!input.cacheHit) {
    await upsertCache({
      inputHash,
      inputType: input.inputType,
      result: input.result,
      modelId: input.modelId,
      analysisMode: input.analysisMode,
      expiresAt,
    });
  }

  return { inputHash, expiresAt };
}

export async function getCachedResult(canonicalInput: string | Uint8Array) {
  return findCacheByHash(hmacInput(canonicalInput));
}

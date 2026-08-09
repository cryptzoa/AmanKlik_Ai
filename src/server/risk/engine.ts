import type { InputType, PublicScoreExplanation, RiskSignal } from "@/types/analysis";

import { clampScore, riskLevelForScore } from "@/server/risk/thresholds";

export type RiskFusionInput = {
  inputType: InputType;
  ruleSignals: RiskSignal[];
  urlSignals?: RiskSignal[];
  urlScore?: number;
  aiSignals?: RiskSignal[];
  semanticRisk?: number | null;
  aiAvailable: boolean;
  claimedFinanceContext?: boolean;
};

export type RiskFusionOutput = {
  finalScore: number;
  riskLevel: ReturnType<typeof riskLevelForScore>;
  indicators: RiskSignal[];
  rulesScore: number;
  urlScore: number;
  analysisMode: "hybrid" | "rules_only";
  scoreExplanation: PublicScoreExplanation;
};

const ENGINE_VERSION = "risk-v1";

function contributionBand(score: number): "minor" | "moderate" | "major" {
  if (score >= 60) return "major";
  if (score >= 25) return "moderate";
  return "minor";
}

function uniqueByCategory(signals: RiskSignal[]): RiskSignal[] {
  const byCategory = new Map<string, RiskSignal>();

  for (const current of signals) {
    const existing = byCategory.get(current.category);
    if (!existing || (current.weight ?? 0) > (existing.weight ?? 0)) {
      byCategory.set(current.category, current);
    }
  }

  return [...byCategory.values()];
}

function hasCategory(signals: RiskSignal[], category: string): boolean {
  return signals.some((signal) => signal.category === category);
}

export function fuseRisk(input: RiskFusionInput): RiskFusionOutput {
  const ruleSignals = uniqueByCategory(input.ruleSignals);
  const urlSignals = uniqueByCategory(input.urlSignals ?? []);
  const aiSignals = uniqueByCategory(input.aiSignals ?? []);
  const allSignals = uniqueByCategory([...ruleSignals, ...urlSignals, ...aiSignals]);
  const rulesScore = Math.min(100, ruleSignals.reduce((total, signal) => total + (signal.weight ?? 0), 0));
  const urlScore = Math.min(100, input.urlScore ?? urlSignals.reduce((total, signal) => total + (signal.weight ?? 0), 0));
  const semanticRisk = input.semanticRisk == null ? null : clampScore(input.semanticRisk);
  const hasUrl = urlSignals.length > 0 || input.urlScore != null;

  let score: number;
  let analysisMode: RiskFusionOutput["analysisMode"] = "rules_only";

  if (input.aiAvailable && semanticRisk != null) {
    analysisMode = "hybrid";
    if (input.inputType === "url") {
      score = 0.7 * urlScore + 0.3 * semanticRisk;
    } else if (input.inputType === "image") {
      score = hasUrl
        ? 0.45 * rulesScore + 0.1 * urlScore + 0.45 * semanticRisk
        : 0.5 * rulesScore + 0.5 * semanticRisk;
    } else if (hasUrl) {
      score = 0.45 * rulesScore + 0.15 * urlScore + 0.4 * semanticRisk;
    } else {
      score = 0.55 * rulesScore + 0.45 * semanticRisk;
    }
  } else if (input.inputType === "url") {
    score = urlScore;
  } else if (hasUrl) {
    score = 0.75 * rulesScore + 0.25 * urlScore;
  } else {
    score = rulesScore;
  }

  let finalScore = clampScore(score);
  const hasOtp = hasCategory(allSignals, "otp_request");
  const hasCredentialRequest = hasCategory(allSignals, "credential_request");
  const hasRemoteAccess = hasCategory(allSignals, "remote_access");
  const hasFinance = input.claimedFinanceContext || hasCategory(allSignals, "payment_request");
  const hasBrandMismatch = hasCategory(allSignals, "brand_domain_mismatch");
  const hasThreat = hasCategory(allSignals, "threat");
  const hasUrgency = hasCategory(allSignals, "urgency");

  if (hasOtp && input.claimedFinanceContext) finalScore = Math.max(finalScore, 60);
  if (hasOtp && hasFinance && hasThreat && hasUrgency) finalScore = Math.max(finalScore, 80);
  if (hasRemoteAccess && hasFinance) finalScore = Math.max(finalScore, 70);
  if (hasBrandMismatch && hasCredentialRequest) finalScore = Math.max(finalScore, 70);

  const contributions = [
    rulesScore > 0 ? {
      source: "rule" as const,
      band: contributionBand(rulesScore),
      label: "Pola pesan",
      explanation: "Sinyal deterministik membaca kata, pola permintaan, dan tekanan di dalam input.",
      signalCount: ruleSignals.length,
    } : null,
    urlScore > 0 ? {
      source: "url" as const,
      band: contributionBand(urlScore),
      label: "Struktur tautan",
      explanation: "Alamat diperiksa secara statis, termasuk domain utama, host, dan pola URL.",
      signalCount: urlSignals.length,
    } : null,
    semanticRisk != null ? {
      source: "ai" as const,
      band: contributionBand(semanticRisk),
      label: "Konteks AI",
      explanation: "AI membantu membaca konteks sosial; skor akhir tetap dihitung oleh aplikasi.",
      signalCount: aiSignals.length,
    } : null,
  ].filter((contribution): contribution is NonNullable<typeof contribution> => Boolean(contribution));

  const adjustmentLabels = [
    hasOtp && input.claimedFinanceContext ? "Permintaan OTP dalam konteks finansial" : null,
    hasOtp && hasFinance && hasThreat && hasUrgency ? "OTP, ancaman, dan tekanan waktu muncul bersama" : null,
    hasRemoteAccess && hasFinance ? "Akses jarak jauh disertai permintaan finansial" : null,
    hasBrandMismatch && hasCredentialRequest ? "Ketidakcocokan domain disertai permintaan kredensial" : null,
  ].filter((label): label is string => Boolean(label));

  const strongestSignalIds = [...allSignals]
    .sort((left, right) => (right.weight ?? 0) - (left.weight ?? 0) || left.id.localeCompare(right.id))
    .slice(0, 3)
    .map((signal) => signal.id);

  return {
    finalScore,
    riskLevel: riskLevelForScore(finalScore),
    indicators: allSignals,
    rulesScore,
    urlScore,
    analysisMode,
    scoreExplanation: {
      schemaVersion: 1,
      engineVersion: ENGINE_VERSION,
      contributions,
      strongestSignalIds,
      adjustmentLabels,
      explanation: adjustmentLabels.length
        ? "Beberapa sinyal muncul bersamaan sehingga aplikasi menerapkan kehati-hatian tambahan."
        : "Hasil menggabungkan sinyal yang tersedia; ini bukan kepastian bahwa konten aman atau penipuan.",
    },
  };
}

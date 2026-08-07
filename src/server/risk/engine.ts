import type { InputType, RiskSignal } from "@/types/analysis";

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
};

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

  return {
    finalScore,
    riskLevel: riskLevelForScore(finalScore),
    indicators: allSignals,
    rulesScore,
    urlScore,
    analysisMode,
  };
}

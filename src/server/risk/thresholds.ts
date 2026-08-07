import type { RiskLevel } from "@/types/analysis";

export function riskLevelForScore(score: number): RiskLevel {
  if (score >= 80) return "VERY_HIGH";
  if (score >= 55) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)));
}

import type { InputType, RiskLevel } from "@/types/analysis";

export type IntelligenceTrend = {
  id: string;
  label: string;
  count: number;
  share: number;
};

export type CuratedAdvisory = {
  id: string;
  title: string;
  summary: string;
  signalCategories: string[];
  safeAction: string;
  sourceTitle: string;
  sourceUrl: string;
};

export type IntelligenceSnapshot = {
  generatedAt: string;
  windowDays: number;
  minimumGroupSize: number;
  observedScans: number;
  verifiedOutcomes: number;
  riskDistribution: Array<{ riskLevel: RiskLevel; count: number }>;
  inputDistribution: Array<{ inputType: InputType; count: number }>;
  trends: IntelligenceTrend[];
  advisories: CuratedAdvisory[];
  privacyNote: string;
};

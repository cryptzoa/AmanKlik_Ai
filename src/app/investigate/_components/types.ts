import type { InputType, RiskLevel } from "@/types/analysis";

export type ScanItem = { id: string; inputType: InputType; preview: string | null; finalScore: number; riskLevel: RiskLevel; createdAt: string };
export type CaseItem = { id: string; title: string; status: string; finalScore: number; riskLevel: RiskLevel; summary: string; scanCount: number; updatedAt: string };

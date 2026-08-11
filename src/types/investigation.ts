import type { AnalysisResult, InputType, RiskLevel } from "@/types/analysis";

export type InvestigationStatus = "active" | "resolved" | "archived";

export type InvestigationScan = {
  id: string;
  inputType: InputType;
  finalScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
  result: AnalysisResult;
};

export type EvidenceNodeKind = "case" | "scan" | "signal" | "domain";

export type EvidenceNode = {
  id: string;
  kind: EvidenceNodeKind;
  label: string;
  detail: string;
  riskLevel?: RiskLevel;
  count?: number;
  sourceIds?: string[];
};

export type EvidenceEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type InvestigationGraph = {
  nodes: EvidenceNode[];
  edges: EvidenceEdge[];
};

export type InvestigationCase = {
  id: string;
  title: string;
  status: InvestigationStatus;
  finalScore: number;
  riskLevel: RiskLevel;
  summary: string;
  createdAt: string;
  updatedAt: string;
  scans: InvestigationScan[];
  graph: InvestigationGraph;
};

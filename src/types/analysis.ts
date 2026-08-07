export type InputType = "text" | "image" | "url";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export type AnalysisMode = "hybrid" | "cached_hybrid" | "rules_only";

export type SignalSource = "rule" | "url" | "ai";
export type SignalSeverity = "low" | "medium" | "high";

export interface RiskSignal {
  id: string;
  category: string;
  source: SignalSource;
  label: string;
  severity: SignalSeverity;
  evidence?: string;
  explanation: string;
  weight?: number;
}

export interface UrlAnalysis {
  normalizedUrl: string;
  displayUrl: string;
  protocol: string;
  hostname: string;
  subdomain: string | null;
  domain: string | null;
  publicSuffix: string | null;
  path: string;
  isIpHost: boolean;
  claimedBrand?: string | null;
  signals: RiskSignal[];
  structuralScore: number;
}

export interface ActionItem {
  id: string;
  priority: "now" | "next" | "if_already_acted";
  title: string;
  body: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface AnalysisResult {
  schemaVersion: 1;
  scanId: string;
  inputType: InputType;
  finalScore: number;
  riskLevel: RiskLevel;
  summary: string;
  confidence?: "low" | "medium" | "high";
  analysisMode: AnalysisMode;
  aiAvailable: boolean;
  modelId?: string | null;
  cacheHit: boolean;
  previewRedacted?: string | null;
  indicators: RiskSignal[];
  urlAnalysis?: UrlAnalysis | null;
  actionPlan: ActionItem[];
  uncertainty: string;
  disclaimer: string;
  createdAt: string;
}

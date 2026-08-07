# 29 — Canonical Domain Types

Keep under `src/types/analysis.ts`.

```ts
export type InputType = "text" | "image" | "url";

export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

export type AnalysisMode =
  | "hybrid"
  | "cached_hybrid"
  | "rules_only";

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
```

## Rules
- API DTOs wrap rather than redefine semantics.
- DB JSON = sanitized serializable AnalysisResult.
- provider-specific types remain in `src/server/ai`.
- AI `semanticRisk` is internal.
- public final score always risk-engine output.

## Provider meta

```ts
export interface ProviderMeta {
  provider: "google" | "mock";
  modelId: string;
  latencyMs: number;
  attemptedFallback: boolean;
}
```

Mock must never appear in live deployed demo results.

## Error code union

```ts
export type PublicErrorCode =
  | "INVALID_INPUT"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE"
  | "INVALID_IMAGE"
  | "RATE_LIMITED"
  | "AI_IMAGE_ANALYSIS_UNAVAILABLE"
  | "PROVIDER_UNAVAILABLE"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";
```

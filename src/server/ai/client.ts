import type { AiSemanticResult } from "@/server/ai/schemas";
import type { RiskSignal, UrlAnalysis } from "@/types/analysis";

export type AnalyzeTextInput = {
  normalizedText: string;
  deterministicSignals: RiskSignal[];
  urlAnalysis?: UrlAnalysis | null;
  knowledge?: string[];
};

export type AnalyzeImageInput = {
  bytes: Uint8Array;
  mimeType: "image/png" | "image/jpeg" | "image/webp";
};

export type ProviderMeta = {
  provider: "google" | "mock";
  modelId: string;
  latencyMs: number;
  attemptedFallback: boolean;
};

export type AiAnalysis = {
  result: AiSemanticResult;
  meta: ProviderMeta;
};

export interface AiClient {
  analyzeText(input: AnalyzeTextInput): Promise<AiAnalysis>;
  analyzeImage(input: AnalyzeImageInput): Promise<AiAnalysis>;
}

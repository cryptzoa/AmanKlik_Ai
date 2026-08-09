import type { AiSemanticResult, ConversationAiSemanticResult } from "@/server/ai/schemas";
import type { RiskSignal, UrlAnalysis } from "@/types/analysis";
import type { ConversationMessageInput } from "@/types/conversation";

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

export type AnalyzeConversationInput = {
  messages: ConversationMessageInput[];
  deterministicSignals: RiskSignal[];
  progressionSummary: string;
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

export type ConversationAiAnalysis = {
  result: ConversationAiSemanticResult;
  meta: ProviderMeta;
};

export interface AiClient {
  analyzeText(input: AnalyzeTextInput): Promise<AiAnalysis>;
  analyzeImage(input: AnalyzeImageInput): Promise<AiAnalysis>;
  analyzeConversation(input: AnalyzeConversationInput): Promise<ConversationAiAnalysis>;
}

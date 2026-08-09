import type { RiskSignal } from "@/types/analysis";

export type ConversationSpeaker = "user" | "sender";

export type ConversationMessageInput = {
  id: string;
  speaker: ConversationSpeaker;
  text: string;
  order: number;
};

export type ConversationSignal = RiskSignal & {
  messageIds: string[];
  phase?: "approach" | "trust_building" | "pressure" | "request" | "escalation";
};

export type ConversationAnalysis = {
  messageCount: number;
  progressionSummary: string;
  timeline: Array<{ messageId: string; redactedExcerpt?: string; signalIds: string[] }>;
  signals: ConversationSignal[];
};

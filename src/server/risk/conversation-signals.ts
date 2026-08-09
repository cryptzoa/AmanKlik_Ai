import { redactEvidence, redactText } from "@/lib/redaction";
import { detectMessageSignals, normalizeText } from "@/server/risk/signals";
import type { ConversationAnalysis, ConversationMessageInput, ConversationSignal } from "@/types/conversation";

function signal(id: string, category: string, label: string, explanation: string, messageIds: string[], weight: number, phase: ConversationSignal["phase"]): ConversationSignal {
  return { id, category, source: "rule", label, severity: weight >= 20 ? "high" : weight >= 12 ? "medium" : "low", explanation, messageIds, weight, phase };
}

function firstMessage(messages: ConversationMessageInput[], categories: Set<string>, afterIndex = -1): ConversationMessageInput | undefined {
  return messages.find((message, index) => index > afterIndex && detectMessageSignals(message.text).some((item) => categories.has(item.category)));
}

export function normalizeConversation(messages: ConversationMessageInput[]): ConversationMessageInput[] {
  return messages.map((message, index) => ({
    id: message.id,
    speaker: message.speaker,
    text: normalizeText(message.text),
    order: index + 1,
  }));
}

export function canonicalConversation(messages: ConversationMessageInput[]): string {
  return normalizeConversation(messages).map((message) => `${message.order}|${message.speaker}|${message.text}`).join("\n");
}

export function detectConversationSignals(input: ConversationMessageInput[]): ConversationAnalysis {
  const messages = normalizeConversation(input);
  const perMessageSignals = messages.flatMap((message) => detectMessageSignals(message.text).map((item) => ({
    ...item,
    id: `message-${message.id}-${item.id}`,
    evidence: item.evidence ? redactEvidence(item.evidence) : undefined,
    messageIds: [message.id],
    phase: "request" as const,
  })));
  const progressionSignals: ConversationSignal[] = [];

  const identity = firstMessage(messages, new Set(["impersonation"]));
  const payment = identity ? firstMessage(messages, new Set(["payment_request"]), identity.order - 1) : undefined;
  if (identity && payment) {
    progressionSignals.push(signal("progression-identity-payment", "conversation_progression", "Identitas berganti sebelum permintaan uang", "Urutan perubahan identitas lalu permintaan uang perlu diuji melalui kanal independen.", [identity.id, payment.id], 20, "escalation"));
  }

  const pressure = firstMessage(messages, new Set(["urgency", "threat"]));
  const secret = pressure ? firstMessage(messages, new Set(["otp_request", "credential_request", "payment_request"]), pressure.order - 1) : undefined;
  if (pressure && secret) {
    progressionSignals.push(signal("progression-pressure-request", "conversation_progression", "Tekanan meningkat sebelum permintaan sensitif", "Tekanan waktu atau ancaman yang diikuti permintaan rahasia dapat mempersempit ruang verifikasi.", [pressure.id, secret.id], 18, "escalation"));
  }

  const secrecy = firstMessage(messages, new Set(["secrecy", "unexpected_channel"]));
  const laterRequest = secrecy ? firstMessage(messages, new Set(["payment_request", "otp_request", "credential_request"]), secrecy.order - 1) : undefined;
  if (secrecy && laterRequest) {
    progressionSignals.push(signal("progression-channel-secret", "conversation_progression", "Kanal atau percakapan diisolasi sebelum permintaan", "Perpindahan kanal atau larangan menghubungi pihak lain dapat menghambat verifikasi mandiri.", [secrecy.id, laterRequest.id], 14, "pressure"));
  }

  const allSignals = [...perMessageSignals, ...progressionSignals];
  const timeline = messages.map((message) => ({
    messageId: message.id,
    redactedExcerpt: redactText(message.text).slice(0, 120),
    signalIds: allSignals.filter((item) => item.messageIds.includes(message.id)).map((item) => item.id),
  }));

  return {
    messageCount: messages.length,
    progressionSummary: progressionSignals.length
      ? "Urutan pesan menunjukkan eskalasi yang perlu diputus dengan verifikasi independen."
      : "Belum terlihat pola eskalasi deterministik yang jelas dari urutan pesan ini.",
    timeline,
    signals: allSignals,
  };
}

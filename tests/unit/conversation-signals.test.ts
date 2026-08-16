import { describe, expect, it } from "vitest";

import { canonicalConversation, detectConversationSignals } from "@/server/risk/conversation-signals";

describe("conversation progression signals", () => {
  it("detects escalation across ordered messages", () => {
    const result = detectConversationSignals([
      { id: "m1", speaker: "sender", text: "Ini nomor baru aku, nomor lama rusak.", order: 1 },
      { id: "m2", speaker: "sender", text: "Tolong transfer sekarang, jangan telepon dulu.", order: 2 },
    ]);

    expect(result.signals.map((item) => item.category)).toEqual(expect.arrayContaining(["impersonation", "payment_request", "conversation_progression"]));
    expect(result.progressionSummary).toContain("Desakan");
    expect(result.timeline[0].redactedExcerpt).toContain("nomor");
  });

  it("canonicalizes order and speaker without exposing an HMAC value", () => {
    expect(canonicalConversation([{ id: "a", speaker: "user", text: "  Halo   ya ", order: 99 }])).toBe("1|user|Halo ya");
  });
});

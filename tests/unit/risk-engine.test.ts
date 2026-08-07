import { describe, expect, it } from "vitest";

import { fuseRisk } from "@/server/risk/engine";
import { detectMessageSignals } from "@/server/risk/signals";

describe("message rules and deterministic fusion", () => {
  it("detects the OTP demo fixture", () => {
    const signals = detectMessageSignals(
      "Akun Anda akan dibatasi hari ini. Balas pesan ini dengan kode OTP yang baru dikirim.",
    );

    expect(signals.map((signal) => signal.category)).toEqual(
      expect.arrayContaining(["otp_request", "urgency", "threat"]),
    );
  });

  it("keeps benign family conversation low without AI", () => {
    const signals = detectMessageSignals(
      "Bu, aku pulang sekitar jam 7 malam. Kalau belanja tolong sekalian beli telur ya.",
    );
    const result = fuseRisk({ inputType: "text", ruleSignals: signals, aiAvailable: false });

    expect(signals).toHaveLength(0);
    expect(result.finalScore).toBe(0);
    expect(result.riskLevel).toBe("LOW");
  });

  it("applies the documented score floor for remote access and finance", () => {
    const signals = detectMessageSignals(
      "Pasang AnyDesk lalu transfer biaya aktivasi rekening sekarang.",
    );
    const result = fuseRisk({ inputType: "text", ruleSignals: signals, aiAvailable: false });

    expect(result.finalScore).toBeGreaterThanOrEqual(70);
  });

  it("uses a normalized 50/50 screenshot fusion when no URL exists", () => {
    const result = fuseRisk({
      inputType: "image",
      ruleSignals: [],
      semanticRisk: 80,
      aiAvailable: true,
    });

    expect(result.finalScore).toBe(40);
    expect(result.analysisMode).toBe("hybrid");
  });
});

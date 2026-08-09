import { describe, expect, it } from "vitest";

import { buildSafeReport, formatSafeReport } from "@/lib/report/safe-report";
import type { AnalysisResult } from "@/types/analysis";

const fixture: AnalysisResult = {
  schemaVersion: 1,
  scanId: "00000000-0000-4000-8000-000000000002",
  inputType: "text",
  finalScore: 80,
  riskLevel: "VERY_HIGH",
  summary: "Jangan ikuti permintaan ini.",
  analysisMode: "rules_only",
  aiAvailable: false,
  cacheHit: false,
  previewRedacted: "OTP •••4 dari 0812•••90",
  indicators: [{ id: "otp", category: "otp_request", source: "rule", label: "Permintaan OTP", severity: "high", evidence: "OTP •••4", explanation: "OTP bersifat rahasia." }],
  actionPlan: [{ id: "safe", priority: "now", title: "Jangan bagikan OTP", body: "Buka aplikasi resmi.", sourceTitle: "OJK", sourceUrl: "https://ojk.go.id/example" }, { id: "bad", priority: "next", title: "Sumber tidak dipercaya", body: "Tidak boleh masuk report.", sourceUrl: "https://evil.example.test/source" }],
  uncertainty: "Ini bukan kepastian.",
  disclaimer: "Verifikasi melalui kanal resmi.",
  createdAt: new Date(0).toISOString(),
};

describe("privacy-safe report", () => {
  it("uses an explicit allowlist and excludes preview/raw identifiers", () => {
    const report = buildSafeReport(fixture, new Date(0).toISOString());
    const text = formatSafeReport(report);

    expect(report.domain).toBeUndefined();
    expect(report.actions[0].sourceUrl).toBe("https://ojk.go.id/example");
    expect(report.actions[1].sourceUrl).toBeUndefined();
    expect(text).not.toContain("0812");
    expect(text).not.toContain("OTP •••4");
    expect(text).not.toContain(fixture.scanId);
  });
});

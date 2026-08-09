import { describe, expect, it } from "vitest";

import { getPersonalizedPractice } from "@/lib/simulator/personalized";
import type { AnalysisResult } from "@/types/analysis";

function result(categories: string[]): AnalysisResult {
  return {
    schemaVersion: 1,
    scanId: "00000000-0000-4000-8000-000000000001",
    inputType: "text",
    finalScore: 70,
    riskLevel: "HIGH",
    summary: "Perlu diperiksa",
    analysisMode: "rules_only",
    aiAvailable: false,
    cacheHit: false,
    indicators: categories.map((category, index) => ({ id: `signal-${index}`, category, source: "rule", label: category, severity: "medium", explanation: "fixture" })),
    actionPlan: [],
    uncertainty: "fixture",
    disclaimer: "fixture",
    createdAt: new Date(0).toISOString(),
  };
}

describe("personalized simulator mapping", () => {
  it("maps credential signals to the OTP practice", () => {
    const practice = getPersonalizedPractice(result(["otp_request"]));
    expect(practice.family).toBe("credential_secrecy");
    expect(practice.templateId).toBe("bank-otp");
    expect(practice.matchedSignalIds).toEqual(["signal-0"]);
  });

  it("falls back to independent identity verification", () => {
    const practice = getPersonalizedPractice(result([]));
    expect(practice.family).toBe("identity_verification");
    expect(practice.scenario.id).toBe("family-new-number");
  });
});

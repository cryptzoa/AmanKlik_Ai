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
  it.each([
    ["remote_access", "remote_access_refusal", "apk-document"],
    ["otp_request", "credential_secrecy", "bank-otp"],
    ["credential_request", "credential_secrecy", "bank-otp"],
    ["identity_document", "identity_data_protection", "part-time-task"],
    ["verification_link", "domain_recognition", "parcel-link"],
    ["brand_domain_mismatch", "domain_recognition", "parcel-link"],
    ["investment", "claim_verification", "investment-deepfake"],
    ["prize", "claim_verification", "investment-deepfake"],
    ["payment_request", "payment_pause", "family-new-number"],
    ["impersonation", "identity_verification", "family-new-number"],
    ["urgency", "urgency_resistance", "bank-otp"],
  ] as const)("maps %s to %s", (category, expectedFamily, expectedTemplate) => {
    const practice = getPersonalizedPractice(result([category]));
    expect(practice.schemaVersion).toBe(2);
    expect(practice.family).toBe(expectedFamily);
    expect(practice.templateId).toBe(expectedTemplate);
    expect(practice.matchedSignalIds).toEqual(["signal-0"]);
  });

  it("uses stable safety priority when several categories match", () => {
    const practice = getPersonalizedPractice(result(["payment_request", "remote_access", "investment"]));
    expect(practice.family).toBe("remote_access_refusal");
    expect(practice.templateId).toBe("apk-document");
    expect(practice.matchedSignalIds).toEqual(["signal-1"]);
  });

  it("falls back without copying scan content into the scenario", () => {
    const practice = getPersonalizedPractice(result([]));
    expect(practice.family).toBe("identity_verification");
    expect(practice.scenario.id).toBe("family-new-number");
    expect(JSON.stringify(practice)).not.toContain("fixture");
  });
});

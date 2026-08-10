import { describe, expect, it } from "vitest";

import { buildIntelligenceSnapshot } from "@/lib/intelligence/build-snapshot";
import type { AnalysisResult } from "@/types/analysis";

function source(index: number) {
  const result: AnalysisResult = {
    schemaVersion: 1, scanId: crypto.randomUUID(), inputType: "text", finalScore: 60, riskLevel: "HIGH", summary: "Synthetic", analysisMode: "rules_only", aiAvailable: false, cacheHit: false,
    indicators: [{ id: `urgency-${index}`, category: "urgency", source: "rule", label: "Tekanan waktu", severity: "medium", explanation: "Synthetic" }],
    actionPlan: [], uncertainty: "Synthetic", disclaimer: "Synthetic", createdAt: new Date(0).toISOString(),
  };
  return { sessionId: `session-${index}`, inputType: "text" as const, riskLevel: "HIGH" as const, result };
}

describe("privacy-safe intelligence snapshot", () => {
  it("suppresses observations below the anonymity threshold", () => {
    const snapshot = buildIntelligenceSnapshot([source(1), source(2)], 2, new Date(0));
    expect(snapshot.observedScans).toBe(0);
    expect(snapshot.verifiedOutcomes).toBe(0);
    expect(snapshot.trends).toHaveLength(0);
  });

  it("publishes aggregate categories at the threshold without raw content", () => {
    const snapshot = buildIntelligenceSnapshot([source(1), source(2), source(3)], 3, new Date(0));
    expect(snapshot.observedScans).toBe(3);
    expect(snapshot.trends[0]).toMatchObject({ id: "urgency", count: 3, share: 100 });
    expect(JSON.stringify(snapshot)).not.toContain("previewRedacted");
  });
});

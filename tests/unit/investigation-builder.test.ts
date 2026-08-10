import { describe, expect, it } from "vitest";

import { buildInvestigationGraph, summarizeInvestigation } from "@/lib/investigation/build-investigation";
import type { AnalysisResult } from "@/types/analysis";

function result(scanId: string, score: number, category: string): AnalysisResult {
  return {
    schemaVersion: 1,
    scanId,
    inputType: "text",
    finalScore: score,
    riskLevel: score >= 55 ? "HIGH" : "MEDIUM",
    summary: `Result ${scanId}`,
    analysisMode: "rules_only",
    aiAvailable: false,
    cacheHit: false,
    indicators: [{ id: `${category}-${scanId}`, category, source: "rule", label: "Tekanan waktu", severity: "medium", explanation: "Meminta tindakan cepat." }],
    actionPlan: [{ id: "verify_independently", priority: "next", title: "Verifikasi", body: "Gunakan kanal resmi." }],
    uncertainty: "Konteks terbatas.",
    disclaimer: "Bukan vonis.",
    createdAt: new Date(0).toISOString(),
  };
}

describe("investigation builder", () => {
  const sources = [
    { id: "s1", inputType: "text" as const, createdAt: new Date(0), result: result("s1", 42, "urgency") },
    { id: "s2", inputType: "conversation" as const, createdAt: new Date(1), result: { ...result("s2", 72, "urgency"), inputType: "conversation" as const } },
  ];

  it("keeps the highest source risk and merges repeated signal families", () => {
    const summary = summarizeInvestigation(sources);
    expect(summary.finalScore).toBe(72);
    expect(summary.riskLevel).toBe("HIGH");
    expect(summary.topCategories[0]).toMatchObject({ category: "urgency", count: 2 });
  });

  it("builds one shared signal and action node without raw input", () => {
    const graph = buildInvestigationGraph("case-1", "Kasus demo", sources);
    expect(graph.nodes.filter((node) => node.kind === "scan")).toHaveLength(2);
    expect(graph.nodes.filter((node) => node.kind === "signal")).toHaveLength(1);
    expect(graph.nodes.filter((node) => node.kind === "action")).toHaveLength(1);
    expect(JSON.stringify(graph)).not.toContain("previewRedacted");
  });
});

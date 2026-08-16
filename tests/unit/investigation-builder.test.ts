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
    { id: "s1", fingerprint: "text-a", inputType: "text" as const, createdAt: new Date(0), result: result("s1", 42, "urgency") },
    { id: "s2", fingerprint: "conversation-b", inputType: "conversation" as const, createdAt: new Date(1), result: { ...result("s2", 72, "urgency"), inputType: "conversation" as const } },
  ];

  it("keeps the highest source risk and merges repeated signal families", () => {
    const summary = summarizeInvestigation(sources);
    expect(summary.finalScore).toBe(72);
    expect(summary.riskLevel).toBe("HIGH");
    expect(summary.topCategories[0]).toMatchObject({ category: "urgency", count: 2 });
  });

  it("only includes evidence shared by unique artefacts and never adds action nodes", () => {
    const graph = buildInvestigationGraph("case-1", "Kasus demo", sources);
    expect(graph.nodes.filter((node) => node.kind === "scan")).toHaveLength(2);
    expect(graph.nodes.filter((node) => node.kind === "signal")).toHaveLength(1);
    expect(graph.nodes.map((node) => node.kind)).not.toContain("action");
    expect(graph.nodes.find((node) => node.kind === "signal")).toMatchObject({ count: 2, sourceIds: ["scan-s1", "scan-s2"] });
    expect(JSON.stringify(graph)).not.toContain("previewRedacted");
  });

  it("collapses an identical re-scan so it cannot manufacture corroboration", () => {
    const duplicate = { ...sources[0], id: "s1-retry", createdAt: new Date(2), result: result("s1-retry", 99, "urgency") };
    const summary = summarizeInvestigation([sources[0], duplicate]);
    const graph = buildInvestigationGraph("case-2", "Duplikat", [sources[0], duplicate]);

    expect(summary.finalScore).toBe(99);
    expect(summary.summary).toContain("1 hasil berbeda");
    expect(summary.topCategories).toEqual([]);
    expect(graph.nodes.filter((node) => node.kind === "scan")).toHaveLength(1);
    expect(graph.nodes.filter((node) => node.kind === "signal")).toHaveLength(0);
  });
});

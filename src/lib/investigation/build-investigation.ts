import type { AnalysisResult, InputType, RiskLevel } from "@/types/analysis";
import type { EvidenceEdge, EvidenceNode, InvestigationGraph } from "@/types/investigation";
import { riskLevelForScore } from "@/server/risk/thresholds";

export type InvestigationSource = {
  id: string;
  inputType: InputType;
  createdAt: Date | string;
  result: AnalysisResult;
};

type InvestigationSummary = {
  finalScore: number;
  riskLevel: RiskLevel;
  summary: string;
  topCategories: Array<{ category: string; label: string; count: number }>;
};

function safeNodeId(value: string): string {
  return value.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "unknown";
}

export function summarizeInvestigation(sources: InvestigationSource[]): InvestigationSummary {
  const uniqueSources = [...new Map(sources.map((source) => [source.id, source])).values()];
  const finalScore = uniqueSources.reduce((highest, source) => Math.max(highest, source.result.finalScore), 0);
  const categories = new Map<string, { category: string; label: string; count: number }>();

  for (const source of uniqueSources) {
    for (const signal of source.result.indicators) {
      const current = categories.get(signal.category);
      categories.set(signal.category, {
        category: signal.category,
        label: current?.label ?? signal.label,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const topCategories = [...categories.values()]
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "id-ID"))
    .slice(0, 4);
  const patternText = topCategories.length
    ? topCategories.slice(0, 3).map((item) => item.label.toLocaleLowerCase("id-ID")).join(", ")
    : "belum ada pola kuat yang berulang";

  return {
    finalScore,
    riskLevel: riskLevelForScore(finalScore),
    summary: `Kasus menggabungkan ${uniqueSources.length} sumber. Pola utama: ${patternText}.`,
    topCategories,
  };
}

export function buildInvestigationGraph(caseId: string, title: string, sources: InvestigationSource[]): InvestigationGraph {
  const summary = summarizeInvestigation(sources);
  const nodes: EvidenceNode[] = [{
    id: `case-${caseId}`,
    kind: "case",
    label: title,
    detail: summary.summary,
    riskLevel: summary.riskLevel,
  }];
  const edges: EvidenceEdge[] = [];
  const categoryNodes = new Map<string, EvidenceNode>();
  const domainNodes = new Map<string, EvidenceNode>();
  const actionNodes = new Map<string, EvidenceNode>();

  for (const [index, source] of sources.entries()) {
    const scanNodeId = `scan-${source.id}`;
    nodes.push({
      id: scanNodeId,
      kind: "scan",
      label: `${source.inputType.toLocaleUpperCase("id-ID")} ${String(index + 1).padStart(2, "0")}`,
      detail: source.result.summary,
      riskLevel: source.result.riskLevel,
    });
    edges.push({ id: `edge-case-${source.id}`, source: `case-${caseId}`, target: scanNodeId, label: "sumber" });

    for (const signal of source.result.indicators) {
      const signalNodeId = `signal-${safeNodeId(signal.category)}`;
      const existing = categoryNodes.get(signalNodeId);
      categoryNodes.set(signalNodeId, existing ? { ...existing, count: (existing.count ?? 1) + 1 } : {
        id: signalNodeId,
        kind: "signal",
        label: signal.label,
        detail: signal.explanation,
        count: 1,
      });
      edges.push({ id: `edge-${source.id}-${signalNodeId}`, source: scanNodeId, target: signalNodeId, label: "indikator" });
    }

    const domain = source.result.urlAnalysis?.domain;
    if (domain) {
      const domainNodeId = `domain-${safeNodeId(domain)}`;
      domainNodes.set(domainNodeId, {
        id: domainNodeId,
        kind: "domain",
        label: domain,
        detail: "Domain utama yang muncul pada sumber. AmanKlik tidak menghubungi domain ini.",
      });
      edges.push({ id: `edge-${source.id}-${domainNodeId}`, source: scanNodeId, target: domainNodeId, label: "domain" });
    }

    for (const action of source.result.actionPlan.slice(0, 4)) {
      const actionNodeId = `action-${safeNodeId(action.id)}`;
      actionNodes.set(actionNodeId, {
        id: actionNodeId,
        kind: "action",
        label: action.title,
        detail: action.body,
      });
      edges.push({ id: `edge-${source.id}-${actionNodeId}`, source: scanNodeId, target: actionNodeId, label: "aksi" });
    }
  }

  nodes.push(...categoryNodes.values(), ...domainNodes.values(), ...actionNodes.values());
  const visibleNodes = nodes.slice(0, 32);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  return {
    nodes: visibleNodes,
    edges: edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)).slice(0, 64),
  };
}

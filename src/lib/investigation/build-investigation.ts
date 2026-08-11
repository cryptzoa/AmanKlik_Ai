import type { AnalysisResult, InputType, RiskLevel } from "@/types/analysis";
import type { EvidenceEdge, EvidenceNode, InvestigationGraph } from "@/types/investigation";
import { riskLevelForScore } from "@/server/risk/thresholds";

export type InvestigationSource = {
  id: string;
  fingerprint?: string;
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

function sourceTimestamp(source: InvestigationSource): number {
  const timestamp = new Date(source.createdAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function uniqueInvestigationSources(sources: InvestigationSource[]): InvestigationSource[] {
  const uniqueByFingerprint = new Map<string, InvestigationSource>();
  const newestFirst = [...sources].sort((left, right) => sourceTimestamp(right) - sourceTimestamp(left) || left.id.localeCompare(right.id));

  for (const source of newestFirst) {
    const fingerprint = source.fingerprint ?? source.id;
    if (!uniqueByFingerprint.has(fingerprint)) uniqueByFingerprint.set(fingerprint, source);
  }

  return [...uniqueByFingerprint.values()].sort((left, right) => sourceTimestamp(left) - sourceTimestamp(right) || left.id.localeCompare(right.id));
}

export function summarizeInvestigation(sources: InvestigationSource[]): InvestigationSummary {
  const uniqueSources = uniqueInvestigationSources(sources);
  const finalScore = uniqueSources.reduce((highest, source) => Math.max(highest, source.result.finalScore), 0);
  const categories = new Map<string, { category: string; label: string; count: number }>();

  for (const source of uniqueSources) {
    const categoriesInSource = new Set<string>();
    for (const signal of source.result.indicators) {
      if (categoriesInSource.has(signal.category)) continue;
      categoriesInSource.add(signal.category);
      const current = categories.get(signal.category);
      categories.set(signal.category, {
        category: signal.category,
        label: current?.label ?? signal.label,
        count: (current?.count ?? 0) + 1,
      });
    }
  }

  const topCategories = [...categories.values()]
    .filter((item) => item.count >= 2)
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, "id-ID"))
    .slice(0, 4);
  const patternText = topCategories.length
    ? topCategories.slice(0, 3).map((item) => item.label.toLocaleLowerCase("id-ID")).join(", ")
    : "belum ada pola yang berulang lintas artefak";

  return {
    finalScore,
    riskLevel: riskLevelForScore(finalScore),
    summary: `Kasus menggabungkan ${uniqueSources.length} artefak unik. Pola lintas sumber: ${patternText}.`,
    topCategories,
  };
}

type SharedEvidenceNode = Omit<EvidenceNode, "sourceIds"> & { sourceIds: Set<string> };

export function buildInvestigationGraph(caseId: string, title: string, sources: InvestigationSource[]): InvestigationGraph {
  const uniqueSources = uniqueInvestigationSources(sources);
  const summary = summarizeInvestigation(uniqueSources);
  const nodes: EvidenceNode[] = [{
    id: `case-${caseId}`,
    kind: "case",
    label: title,
    detail: summary.summary,
    riskLevel: summary.riskLevel,
  }];
  const edges: EvidenceEdge[] = [];
  const categoryNodes = new Map<string, SharedEvidenceNode>();
  const domainNodes = new Map<string, SharedEvidenceNode>();

  for (const [index, source] of uniqueSources.entries()) {
    const scanNodeId = `scan-${source.id}`;
    nodes.push({
      id: scanNodeId,
      kind: "scan",
      label: `${source.inputType.toLocaleUpperCase("id-ID")} ${String(index + 1).padStart(2, "0")}`,
      detail: source.result.summary,
      riskLevel: source.result.riskLevel,
    });
    edges.push({ id: `edge-case-${source.id}`, source: `case-${caseId}`, target: scanNodeId, label: "sumber" });

    const categoriesInSource = new Set<string>();
    for (const signal of source.result.indicators) {
      if (categoriesInSource.has(signal.category)) continue;
      categoriesInSource.add(signal.category);
      const signalNodeId = `signal-${safeNodeId(signal.category)}`;
      const existing = categoryNodes.get(signalNodeId);
      categoryNodes.set(signalNodeId, existing
        ? { ...existing, sourceIds: new Set([...existing.sourceIds, scanNodeId]) }
        : { id: signalNodeId, kind: "signal", label: signal.label, detail: signal.explanation, sourceIds: new Set([scanNodeId]) });
    }

    const domain = source.result.urlAnalysis?.domain;
    if (domain) {
      const domainNodeId = `domain-${safeNodeId(domain)}`;
      const existing = domainNodes.get(domainNodeId);
      domainNodes.set(domainNodeId, existing
        ? { ...existing, sourceIds: new Set([...existing.sourceIds, scanNodeId]) }
        : {
            id: domainNodeId,
            kind: "domain",
            label: domain,
            detail: "Domain utama yang muncul pada sumber. AmanKlik tidak menghubungi domain ini.",
            sourceIds: new Set([scanNodeId]),
          });
    }
  }

  const sharedNodes = [...categoryNodes.values(), ...domainNodes.values()]
    .filter((node) => node.sourceIds.size >= 2)
    .map(({ sourceIds, ...node }) => ({ ...node, count: sourceIds.size, sourceIds: [...sourceIds] }));
  for (const node of sharedNodes) {
    nodes.push(node);
    for (const sourceId of node.sourceIds ?? []) {
      edges.push({ id: `edge-${sourceId}-${node.id}`, source: sourceId, target: node.id, label: node.kind === "domain" ? "domain" : "indikator" });
    }
  }

  const visibleNodes = nodes.slice(0, 24);
  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
  return {
    nodes: visibleNodes,
    edges: edges.filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)).slice(0, 48),
  };
}

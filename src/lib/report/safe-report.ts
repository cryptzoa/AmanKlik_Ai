import type { ActionItem, AnalysisResult, InputType, RiskLevel, SignalSource } from "@/types/analysis";

export type SafeReport = {
  schemaVersion: 1;
  generatedAt: string;
  scanCreatedAt: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  finalScore: number;
  summary: string;
  evidence: Array<{ source: SignalSource; label: string; explanation: string }>;
  domain?: string;
  actions: Array<{ priority: ActionItem["priority"]; title: string; body: string; sourceTitle?: string; sourceUrl?: string }>;
  uncertainty: string;
  disclaimer: string;
};

const ALLOWED_SOURCE_HOSTS = new Set(["iasc.ojk.go.id", "ojk.go.id", "sikapiuangmu.ojk.go.id"]);

function officialSource(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_SOURCE_HOSTS.has(parsed.hostname) ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function buildSafeReport(result: AnalysisResult, generatedAt = new Date().toISOString()): SafeReport {
  return {
    schemaVersion: 1,
    generatedAt,
    scanCreatedAt: result.createdAt,
    inputType: result.inputType,
    riskLevel: result.riskLevel,
    finalScore: result.finalScore,
    summary: result.summary,
    evidence: result.indicators.map((signal) => ({ source: signal.source, label: signal.label, explanation: signal.explanation })),
    domain: result.urlAnalysis?.domain ?? undefined,
    actions: result.actionPlan.map((action) => ({
      priority: action.priority,
      title: action.title,
      body: action.body,
      sourceTitle: action.sourceTitle,
      sourceUrl: officialSource(action.sourceUrl),
    })),
    uncertainty: result.uncertainty,
    disclaimer: result.disclaimer,
  };
}

export function formatSafeReport(report: SafeReport): string {
  const lines = [
    "AmanKlik AI — RINGKASAN LANGKAH AMAN",
    "",
    `Tingkat risiko: ${report.riskLevel}`,
    `Skor heuristik: ${report.finalScore}/100`,
    `Dibuat: ${new Date(report.scanCreatedAt).toLocaleString("id-ID")}`,
    "",
    report.summary,
    "",
    "INDIKATOR",
    ...report.evidence.map((item, index) => `${index + 1}. [${item.source}] ${item.label}: ${item.explanation}`),
    "",
    "LANGKAH AMAN",
    ...report.actions.map((item, index) => `${index + 1}. ${item.title}: ${item.body}${item.sourceUrl ? ` Sumber: ${item.sourceUrl}` : ""}`),
    "",
    `Ketidakpastian: ${report.uncertainty}`,
    report.disclaimer,
    "",
    "Ringkasan ini sengaja tidak menyertakan isi pesan, screenshot, URL lengkap, atau data rahasia.",
  ];

  return lines.join("\n");
}

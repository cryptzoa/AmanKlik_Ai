import type { AnalysisResult } from "@/types/analysis";
import { ContextSection } from "@/app/result/[id]/_components/context-section";
import { EvidenceSection } from "@/app/result/[id]/_components/evidence-section";
import { ResultDisclaimer } from "@/app/result/[id]/_components/result-disclaimer";
import { ResultNotices } from "@/app/result/[id]/_components/result-notices";
import { ResultSummarySection } from "@/app/result/[id]/_components/result-summary-section";
import { UrlAnalysisSection } from "@/app/result/[id]/_components/url-analysis-section";
import { InteriorShell } from "@/components/site/interior-shell";
import { ScoreBreakdown } from "@/app/result/[id]/_components/score-breakdown";
import { ReportActions } from "@/app/result/[id]/_components/report-actions";
import { ConversationTimeline } from "@/app/result/[id]/_components/conversation-timeline";
import { ActionChecklist } from "@/app/result/[id]/_components/action-checklist";
import type { ActionProgressState } from "@/types/action-progress";

const modeLabels: Record<AnalysisResult["analysisMode"], string> = {
  hybrid: "AI + pola",
  cached_hybrid: "Analisis tersimpan",
  rules_only: "Pola saja",
};

export function ResultView({
  result,
  initialActionProgress = {},
  intelligenceMatchCount = 0,
}: {
  result: AnalysisResult;
  initialActionProgress?: Record<string, ActionProgressState>;
  intelligenceMatchCount?: number;
}) {
  const isElevated = result.riskLevel === "HIGH" ||
    result.riskLevel === "VERY_HIGH";

  return (
    <InteriorShell
      eyebrow="05 / Result"
      title={isElevated
        ? "Jeda sebelum bertindak."
        : "Tetap periksa konteksnya."}
      description="Skor bukan vonis. Baca indikator, ketidakpastian, dan tindakan aman sebelum mengambil keputusan berikutnya."
      marker="SKOR / ALASAN / AKSI"
      fragments={[
        result.riskLevel.replace("_", " "),
        `${result.indicators.length} SINYAL`,
        modeLabels[result.analysisMode],
      ]}
      compact
    >
      <ResultSummarySection result={result} />

      <ResultNotices
        aiAvailable={result.aiAvailable}
        intelligenceMatchCount={intelligenceMatchCount}
      />

      <ScoreBreakdown
        explanation={result.scoreExplanation}
        signals={result.indicators}
      />

      <ConversationTimeline analysis={result.conversationAnalysis} />

      <EvidenceSection signals={result.indicators} />

      {result.urlAnalysis
        ? <UrlAnalysisSection analysis={result.urlAnalysis} />
        : null}

      {result.previewRedacted
        ? <ContextSection preview={result.previewRedacted} />
        : null}

      <ActionChecklist
        scanId={result.scanId}
        actions={result.actionPlan}
        initialProgress={initialActionProgress}
      />

      <ReportActions result={result} />

      <ResultDisclaimer>{result.disclaimer}</ResultDisclaimer>
    </InteriorShell>
  );
}

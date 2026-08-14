import type { AnalysisResult } from "@/types/analysis";
import { ContextSection } from "@/app/result/[id]/_components/context-section";
import { EvidenceSection } from "@/app/result/[id]/_components/evidence-section";
import { ResultDisclaimer } from "@/app/result/[id]/_components/result-disclaimer";
import { ResultNotices } from "@/app/result/[id]/_components/result-notices";
import { ResultSummarySection } from "@/app/result/[id]/_components/result-summary-section";
import { UrlAnalysisSection } from "@/app/result/[id]/_components/url-analysis-section";
import { ScoreBreakdown } from "@/app/result/[id]/_components/score-breakdown";
import { ReportActions } from "@/app/result/[id]/_components/report-actions";
import { ConversationTimeline } from "@/app/result/[id]/_components/conversation-timeline";
import { ActionChecklist } from "@/app/result/[id]/_components/action-checklist";
import type { ActionProgressState } from "@/types/action-progress";
import { PageFrame } from "@/components/product/page-frame";

export function ResultView({
  result,
  initialActionProgress = {},
  intelligenceMatchCount = 0,
}: {
  result: AnalysisResult;
  initialActionProgress?: Record<string, ActionProgressState>;
  intelligenceMatchCount?: number;
}) {
  return (
    <PageFrame>
      <section className="result-opening">
        <div className="product-container">
          <ResultSummarySection result={result} />
          <ResultNotices
            aiAvailable={result.aiAvailable}
            intelligenceMatchCount={intelligenceMatchCount}
          />
        </div>
      </section>

      <EvidenceSection signals={result.indicators} />

      <div className="product-route-body">
        <div className="product-wide-canvas">
          <ScoreBreakdown
            explanation={result.scoreExplanation}
            signals={result.indicators}
          />

          <ConversationTimeline analysis={result.conversationAnalysis} />

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
        </div>
      </div>
    </PageFrame>
  );
}

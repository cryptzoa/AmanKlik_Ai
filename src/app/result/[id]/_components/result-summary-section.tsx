import { RiskScore } from "@/app/result/[id]/_components/risk-score";
import { TransitionLink } from "@/components/site/transition-link";
import type { AnalysisResult, RiskLevel } from "@/types/analysis";

const modeLabels: Record<AnalysisResult["analysisMode"], string> = {
  hybrid: "Diperiksa oleh AI dan aturan keamanan",
  cached_hybrid: "Menggunakan hasil pemeriksaan yang tersimpan",
  rules_only: "Diperiksa dengan aturan keamanan",
};

const riskLabels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export function ResultSummarySection({ result }: { result: AnalysisResult }) {
  const primaryAction = result.actionPlan[0];

  return (
    <div className="result-summary">
      <div className="result-summary__grid">
        <div className="result-summary__copy">
          <p className="product-eyebrow text-ai">05 / Hasil pemeriksaan</p>
          <p className="result-risk-label">{riskLabels[result.riskLevel]}</p>
          <h1 className="result-summary__title text-balanced">
            {result.summary}
          </h1>
          <p className="result-summary__uncertainty">{result.uncertainty}</p>
          <div className="result-summary__provenance">
            <span>{modeLabels[result.analysisMode]}</span>
            {result.cacheHit ? <span>Hasil yang pernah disimpan</span> : null}
            <time dateTime={result.createdAt}>
              {new Date(result.createdAt).toLocaleString("id-ID")}
            </time>
          </div>
        </div>
        <div className="result-summary__score">
          <RiskScore score={result.finalScore} level={result.riskLevel} />
          <p>
            Skor menggabungkan tanda pada pesan, susunan tautan bila ada, dan
            konteks dari AI bila tersedia. Angka ini bukan kepastian atau vonis.
          </p>
        </div>
      </div>

      {primaryAction ? (
        <section
          className="result-first-action"
          aria-labelledby="result-first-action-title"
        >
          <div>
            <p className="product-eyebrow text-ai-soft">Tindakan pertama</p>
            <h2 id="result-first-action-title">{primaryAction.title}</h2>
          </div>
          <div>
            <p>{primaryAction.body}</p>
            {primaryAction.sourceTitle && primaryAction.sourceUrl ? (
              <a
                href={primaryAction.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="result-first-action__source"
              >
                Buka sumber resmi: {primaryAction.sourceTitle}
                <span aria-hidden="true"> ↗</span>
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      <nav
        className="result-next-links product-print-hidden"
        aria-label="Langkah berikutnya"
      >
        <TransitionLink
          className="product-button product-button--primary"
          href="/respond"
        >
          Sudah terlanjur?
        </TransitionLink>
        <TransitionLink
          className="product-button product-button--secondary"
          href="/scan"
        >
          Periksa pesan lain
        </TransitionLink>
        <TransitionLink
          className="product-button product-button--secondary"
          href={`/simulator?from=${result.scanId}`}
        >
          Latihan dari pola ini
        </TransitionLink>
        <TransitionLink
          className="product-button product-button--secondary"
          href={`/investigate?scan=${result.scanId}`}
        >
          Bandingkan bukti
        </TransitionLink>
      </nav>
    </div>
  );
}

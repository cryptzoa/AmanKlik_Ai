import type { AnalysisResult, RiskSignal } from "@/types/analysis";
import { RiskScore } from "@/components/result/risk-score";
import { InteriorShell } from "@/components/site/interior-shell";
import { ScoreBreakdown } from "@/components/result/score-breakdown";
import { ReportActions } from "@/components/result/report-actions";
import { ConversationTimeline } from "@/components/result/conversation-timeline";
import Link from "next/link";

const sourceLabels: Record<RiskSignal["source"], string> = {
  rule: "Pola terdeteksi",
  url: "Struktur tautan",
  ai: "Konteks AI",
};

const modeLabels: Record<AnalysisResult["analysisMode"], string> = {
  hybrid: "AI + pola",
  cached_hybrid: "Analisis tersimpan",
  rules_only: "Pola saja",
};

function SignalRow({ signal, index }: { signal: RiskSignal; index: number }) {
  return (
    <article id={`evidence-${signal.id}`} data-reveal-card className="group grid gap-4 border-t border-line py-7 transition-colors hover:bg-surface sm:grid-cols-[64px_1fr] sm:px-4">
      <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="text-ai">{sourceLabels[signal.source]}</span>
          <span className="text-muted">{signal.severity}</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold">{signal.label}</h3>
        {signal.evidence ? <p className="mt-3 max-w-2xl border-l-2 border-ai bg-canvas px-4 py-3 text-sm text-muted">“{signal.evidence}”</p> : null}
        <p className="mt-3 max-w-2xl leading-7 text-muted">{signal.explanation}</p>
      </div>
    </article>
  );
}

export function ResultView({ result }: { result: AnalysisResult }) {
  const isElevated = result.riskLevel === "HIGH" || result.riskLevel === "VERY_HIGH";

  return (
    <InteriorShell
      eyebrow="05 / Result"
      title={isElevated ? "Jeda sebelum bertindak." : "Tetap periksa konteksnya."}
      description="Skor bukan vonis. Baca indikator, ketidakpastian, dan tindakan aman sebelum mengambil keputusan berikutnya."
      marker="SKOR / ALASAN / AKSI"
      fragments={[result.riskLevel.replace("_", " "), `${result.indicators.length} SINYAL`, modeLabels[result.analysisMode]]}
      compact
    >
        <section data-reveal className="grid gap-12 border-b border-line pb-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <RiskScore score={result.finalScore} level={result.riskLevel} />
          <div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span>{modeLabels[result.analysisMode]}</span>
              {result.cacheHit ? <span>· Cache</span> : null}
              <span>· {new Date(result.createdAt).toLocaleString("id-ID")}</span>
            </div>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">{result.summary}</h2>
            <p className="mt-5 max-w-2xl leading-7 text-muted">{result.uncertainty}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="lift-link inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai" href="/scan">Periksa pesan lain →</Link>
              <Link className="lift-link inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-6 font-semibold hover:border-ai hover:text-ai" href={`/respond?from=${result.scanId}`}>Sudah terlanjur?</Link>
              <Link className="lift-link inline-flex min-h-12 items-center rounded-full border border-line bg-surface px-6 font-semibold hover:border-ai hover:text-ai" href={`/simulator?from=${result.scanId}`}>Latihan dari pola ini</Link>
            </div>
          </div>
        </section>

        {!result.aiAvailable ? (
          <div data-reveal className="border-b border-line bg-warning-soft px-5 py-4 text-sm leading-6">
            <strong>Analisis AI sedang terbatas.</strong> AmanKlik tetap menjalankan pemeriksaan pola dan struktur secara deterministik.
          </div>
        ) : null}

        <ScoreBreakdown explanation={result.scoreExplanation} signals={result.indicators} />

        <ConversationTimeline analysis={result.conversationAnalysis} />

        <section data-reveal className="py-16" aria-labelledby="evidence-heading">
          <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">01 / Evidence</p><h2 id="evidence-heading" className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Kenapa hasilnya seperti ini?</h2></div>
          <div className="mt-6">
            {result.indicators.length ? result.indicators.map((signal, index) => <SignalRow key={`${signal.id}-${index}`} signal={signal} index={index} />) : <p className="border-t border-line py-6 text-muted">Belum ada indikator spesifik yang terdeteksi. Tetap verifikasi melalui kanal resmi.</p>}
          </div>
          </div>
        </section>

        {result.urlAnalysis ? (
          <section data-reveal className="border-t border-line py-16" aria-labelledby="url-heading">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">02 / URL</p>
            <h2 id="url-heading" className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Anatomi tautan</h2>
            <p className="mt-7 break-all border border-line bg-ink p-6 font-mono text-sm leading-7 text-surface sm:text-lg">{result.urlAnalysis.displayUrl}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs uppercase tracking-[0.12em] text-muted">Protocol</dt><dd className="mt-1 font-mono">{result.urlAnalysis.protocol}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.12em] text-muted">Domain utama</dt><dd className="mt-1 font-mono text-lg font-semibold">{result.urlAnalysis.domain ?? "Tidak terbaca"}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.12em] text-muted">Subdomain</dt><dd className="mt-1 break-all font-mono">{result.urlAnalysis.subdomain ?? "—"}</dd></div>
              <div><dt className="text-xs uppercase tracking-[0.12em] text-muted">Path</dt><dd className="mt-1 break-all font-mono">{result.urlAnalysis.path}</dd></div>
            </dl>
            <p className="mt-6 text-sm leading-6 text-muted">AmanKlik hanya menganalisis struktur alamat ini. Sistem tidak membuka atau menghubungi situs tujuan.</p>
          </section>
        ) : null}

        {result.previewRedacted ? (
          <section data-reveal className="border-t border-line py-16" aria-labelledby="preview-heading">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">03 / Context</p>
            <h2 id="preview-heading" className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Konteks yang diperiksa</h2>
            <p className="mt-7 whitespace-pre-wrap break-words border-l-4 border-ai bg-surface p-6 text-sm leading-7 text-muted shadow-[10px_10px_0_var(--ai-soft)]">{result.previewRedacted}</p>
          </section>
        ) : null}

        <section data-reveal className="border-t border-line py-16" aria-labelledby="action-heading">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-risk">04 / Action</p>
          <h2 id="action-heading" className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Yang sebaiknya dilakukan sekarang</h2>
          <ol className="mt-9 grid gap-px border border-line bg-line md:grid-cols-2">
            {result.actionPlan.map((action, index) => (
              <li key={action.id} data-reveal-card className="grid min-h-64 gap-3 bg-surface p-6 sm:grid-cols-[48px_1fr] sm:p-8">
                <span className="font-mono text-sm text-muted">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{action.body}</p>
                  {action.sourceTitle && action.sourceUrl ? (
                    <a className="mt-3 inline-flex text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai" href={action.sourceUrl} rel="noreferrer" target="_blank">
                      Sumber resmi: {action.sourceTitle}
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <ReportActions result={result} />

        <footer data-reveal className="border-t border-line py-10 text-sm leading-6 text-muted">{result.disclaimer}</footer>
    </InteriorShell>
  );
}

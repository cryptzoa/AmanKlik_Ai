import type { AnalysisResult, RiskSignal } from "@/types/analysis";
import { RiskScore } from "@/components/result/risk-score";
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
    <article className="grid gap-4 border-t border-line py-6 sm:grid-cols-[64px_1fr]">
      <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
          <span className="text-ai">{sourceLabels[signal.source]}</span>
          <span className="text-muted">{signal.severity}</span>
        </div>
        <h3 className="mt-2 text-xl font-semibold">{signal.label}</h3>
        {signal.evidence ? <p className="mt-3 max-w-2xl rounded-xl bg-canvas px-4 py-3 text-sm text-muted">“{signal.evidence}”</p> : null}
        <p className="mt-3 max-w-2xl leading-7 text-muted">{signal.explanation}</p>
      </div>
    </article>
  );
}

export function ResultView({ result }: { result: AnalysisResult }) {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">AmanKlik AI</Link>
          <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface" href="/scan">Cek lagi</Link>
        </header>

        <section className="grid gap-10 border-b border-line py-16 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <RiskScore score={result.finalScore} level={result.riskLevel} />
          <div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              <span>{modeLabels[result.analysisMode]}</span>
              {result.cacheHit ? <span>· Cache</span> : null}
              <span>· {new Date(result.createdAt).toLocaleString("id-ID")}</span>
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">{result.summary}</h1>
            <p className="mt-5 max-w-2xl leading-7 text-muted">{result.uncertainty}</p>
          </div>
        </section>

        {!result.aiAvailable ? (
          <div className="border-b border-line bg-warning-soft px-5 py-4 text-sm leading-6">
            <strong>Analisis AI sedang terbatas.</strong> AmanKlik tetap menjalankan pemeriksaan pola dan struktur secara deterministik.
          </div>
        ) : null}

        <section className="py-16" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading" className="text-3xl font-semibold tracking-[-0.04em]">Kenapa hasilnya seperti ini?</h2>
          <div className="mt-6">
            {result.indicators.length ? result.indicators.map((signal, index) => <SignalRow key={`${signal.id}-${index}`} signal={signal} index={index} />) : <p className="border-t border-line py-6 text-muted">Belum ada indikator spesifik yang terdeteksi. Tetap verifikasi melalui kanal resmi.</p>}
          </div>
        </section>

        {result.urlAnalysis ? (
          <section className="border-t border-line py-16" aria-labelledby="url-heading">
            <h2 id="url-heading" className="text-3xl font-semibold tracking-[-0.04em]">Anatomi tautan</h2>
            <p className="mt-5 break-all rounded-2xl bg-canvas p-5 font-mono text-sm leading-7">{result.urlAnalysis.displayUrl}</p>
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
          <section className="border-t border-line py-16" aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="text-3xl font-semibold tracking-[-0.04em]">Konteks yang diperiksa</h2>
            <p className="mt-5 whitespace-pre-wrap break-words rounded-2xl bg-canvas p-5 text-sm leading-7 text-muted">{result.previewRedacted}</p>
          </section>
        ) : null}

        <section className="border-t border-line py-16" aria-labelledby="action-heading">
          <h2 id="action-heading" className="text-3xl font-semibold tracking-[-0.04em]">Yang sebaiknya dilakukan sekarang</h2>
          <ol className="mt-6 divide-y divide-line border-y border-line">
            {result.actionPlan.map((action, index) => (
              <li key={action.id} className="grid gap-3 py-5 sm:grid-cols-[48px_1fr]">
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

        <footer className="border-t border-line py-10 text-sm leading-6 text-muted">{result.disclaimer}</footer>
      </div>
    </main>
  );
}

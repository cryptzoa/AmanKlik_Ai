import type { AdversarialSummary } from "@/lib/evaluation/adversarial-runner";
import type { EvaluationSummary } from "@/lib/evaluation/runner";

function MetricValue({ rate, total }: { rate: number; total: number }) {
  return (
    <p className="mt-5 font-mono text-5xl font-semibold tabular-nums sm:text-6xl">
      {total > 0 ? `${rate}%` : "—"}
    </p>
  );
}

export function BenchmarkSummarySection(
  { regression, adversarial }: {
    regression: EvaluationSummary;
    adversarial: AdversarialSummary;
  },
) {
  const urlNetworkCalls = regression.urlNetworkCalls +
    adversarial.urlNetworkCalls;

  return (
    <section className="product-section" aria-labelledby="benchmark-summary-title">
      <div className="product-wide-canvas">
        <div className="product-section-heading">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
              Snapshot sintetis
            </p>
            <h2 id="benchmark-summary-title" className="product-section-title">
              Denominator ikut terlihat.
            </h2>
          </div>
          <p className="product-section-copy">
            Angka di bawah adalah pass rate fixture yang dikurasi di repository,
            bukan “akurasi AI”, jaminan keamanan, atau estimasi risiko dunia
            nyata.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[28px] border border-[var(--line-strong)] lg:grid-cols-3">
          <article className="border-b border-white/15 bg-ink p-6 text-surface sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Deterministic regression
            </p>
            <MetricValue rate={regression.passRate} total={regression.total} />
            <p className="mt-3 text-sm leading-6 text-white/65">
              {regression.total > 0
                ? `${regression.passed} dari ${regression.total} fixture berada dalam rentang yang diharapkan; ${regression.failed} perlu ditinjau.`
                : "0 dari 0 fixture. Pass rate tidak dihitung karena tidak ada denominator."}
            </p>
          </article>

          <article className="border-b border-white/20 bg-ai p-6 text-white sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              Adversarial robustness
            </p>
            <MetricValue
              rate={adversarial.robustnessRate}
              total={adversarial.total}
            />
            <p className="mt-3 text-sm leading-6 text-white">
              {adversarial.total > 0
                ? `${adversarial.passed} dari ${adversarial.total} skenario sintetis bertahan; ${adversarial.failed} perlu ditinjau.`
                : "0 dari 0 skenario. Robustness rate tidak dihitung karena tidak ada denominator."}
            </p>
          </article>

          <article className="bg-surface p-6 sm:p-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-safe">
              URL interaction
            </p>
            <p className="mt-5 font-mono text-5xl font-semibold tabular-nums sm:text-6xl">
              {urlNetworkCalls}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Panggilan jaringan saat fixture URL dianalisis. Tidak ada fetch,
              ekspansi redirect, DNS probe, atau pembukaan situs tujuan.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

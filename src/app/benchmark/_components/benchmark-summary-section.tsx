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
              Ringkasan pengujian
            </p>
            <h2 id="benchmark-summary-title" className="product-section-title">
              Total pengujian ikut ditampilkan.
            </h2>
          </div>
          <p className="product-section-copy">
            Persentase di bawah hanya menunjukkan hasil contoh pengujian
            internal. Angka ini bukan jaminan bahwa semua penipuan akan
            terdeteksi.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[28px] border border-[var(--line-strong)] lg:grid-cols-3">
          <article className="border-b border-white/15 bg-ink p-6 text-surface sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Pengujian aturan
            </p>
            <MetricValue rate={regression.passRate} total={regression.total} />
            <p className="mt-3 text-sm leading-6 text-white/65">
              {regression.total > 0
                ? `${regression.passed} dari ${regression.total} contoh memberi hasil yang sesuai harapan; ${regression.failed} perlu diperiksa lagi.`
                : "Belum ada contoh yang dapat diuji."}
            </p>
          </article>

          <article className="border-b border-white/20 bg-ai p-6 text-white sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
              Pengujian variasi sulit
            </p>
            <MetricValue
              rate={adversarial.robustnessRate}
              total={adversarial.total}
            />
            <p className="mt-3 text-sm leading-6 text-white">
              {adversarial.total > 0
                ? `${adversarial.passed} dari ${adversarial.total} contoh buatan memberi hasil yang sesuai harapan; ${adversarial.failed} perlu diperiksa lagi.`
                : "Belum ada contoh variasi yang dapat diuji."}
            </p>
          </article>

          <article className="bg-surface p-6 sm:p-8">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-safe">
              Situs tujuan dibuka
            </p>
            <p className="mt-5 font-mono text-5xl font-semibold tabular-nums sm:text-6xl">
              {urlNetworkCalls}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Jumlah situs tujuan yang dibuka selama pengujian. Nilainya harus
              tetap 0 karena AmanKlik hanya membaca bentuk tautan.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

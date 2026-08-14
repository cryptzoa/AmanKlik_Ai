import type { Metadata } from "next";
import { AttackFamiliesSection } from "@/app/benchmark/_components/attack-families-section";
import { BenchmarkSummarySection } from "@/app/benchmark/_components/benchmark-summary-section";
import { CaseMatrixSection } from "@/app/benchmark/_components/case-matrix-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { runAdversarialEvaluation } from "@/lib/evaluation/adversarial-runner";
import { runDeterministicEvaluation } from "@/lib/evaluation/runner";

export const metadata: Metadata = {
  title: "Benchmark transparansi — AmanKlik AI",
  description:
    "Lihat pass rate fixture deterministik dan adversarial, kasus yang gagal, batas klaim, serta provenance pengujiannya.",
};

const benchmarkSnapshot = (() => {
  const regression = runDeterministicEvaluation();
  const adversarial = runAdversarialEvaluation();
  const generatedAt = new Date(Math.max(
    Date.parse(regression.generatedAt),
    Date.parse(adversarial.generatedAt),
  )).toISOString();

  return { regression, adversarial, generatedAt };
})();

const benchmarkDateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeStyle: "long",
  timeZone: "Asia/Jakarta",
});

export default function BenchmarkPage() {
  const { regression, adversarial, generatedAt } = benchmarkSnapshot;
  const urlNetworkCalls = regression.urlNetworkCalls +
    adversarial.urlNetworkCalls;

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="11 / Benchmark"
        title="Buktikan batasnya secara terbuka."
        description="Baca apa yang diuji, berapa denominatornya, keluarga input mana yang bertahan, dan kasus mana yang masih gagal—tanpa mengubah pass rate fixture menjadi klaim akurasi universal."
        annotation={
          <p>
            Seluruh angka berasal dari fixture sintetis lokal. Halaman ini
            tidak menjalankan Gemini atau membuka URL saat dirender.
          </p>
        }
        pattern="analysis"
      >
        {regression.total} regression · {adversarial.total} adversarial · {urlNetworkCalls} URL call
      </RouteIntro>

      <BenchmarkSummarySection
        regression={regression}
        adversarial={adversarial}
      />

      <div className="product-section pt-0">
        <div className="product-wide-canvas">
          <AttackFamiliesSection families={adversarial.byFamily} />
          <CaseMatrixSection cases={adversarial.cases} />
        </div>
      </div>

      <section
        className="border-y border-white/15 bg-ink px-[var(--product-gutter)] py-10 text-surface"
        aria-labelledby="benchmark-provenance-title"
      >
        <div className="product-wide-canvas grid gap-8 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] lg:items-start">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ai-soft">
              Provenance
            </p>
            <h2
              id="benchmark-provenance-title"
              className="mt-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl"
            >
              Snapshot dibuat sekali saat modul server dimuat.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
              Timestamp tetap sama untuk seluruh render dari snapshot ini.
              Perubahan fixture atau engine memerlukan snapshot baru agar angka
              dan provenance bergerak bersama.
            </p>
          </div>

          <dl className="grid gap-px border border-white/15 bg-white/15 text-sm sm:grid-cols-2">
            <div className="bg-ink p-5">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Generated
              </dt>
              <dd className="mt-2 leading-6">
                <time dateTime={generatedAt}>
                  {benchmarkDateFormatter.format(new Date(generatedAt))}
                </time>
              </dd>
            </div>
            <div className="bg-ink p-5">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Deterministic command
              </dt>
              <dd className="mt-2 break-all font-mono text-xs leading-6">
                pnpm eval:deterministic
              </dd>
            </div>
            <div className="bg-ink p-5">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Adversarial command
              </dt>
              <dd className="mt-2 break-all font-mono text-xs leading-6">
                pnpm eval:adversarial
              </dd>
            </div>
            <div className="bg-ink p-5">
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                Live smoke test
              </dt>
              <dd className="mt-2 leading-6 text-white/65">
                <code className="text-white">pnpm eval:live</code> dipisahkan,
                tidak dijalankan oleh page render, dan dapat memakai kuota.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </PageFrame>
  );
}

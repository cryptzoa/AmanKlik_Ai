import type { AnalysisResult } from "@/types/analysis";

export function UrlAnalysisSection(
  { analysis }: { analysis: NonNullable<AnalysisResult["urlAnalysis"]> },
) {
  return (
    <section
      className="border-t border-line py-16"
      aria-labelledby="url-heading"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        Rincian tautan
      </p>
      <h2 id="url-heading" className="section-title mt-4">Anatomi tautan</h2>
      <p className="mt-7 break-all rounded-[20px] border border-line bg-ink p-6 font-mono text-sm leading-7 text-surface sm:text-lg">
        {analysis.displayUrl}
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Cara koneksi
          </dt>
          <dd className="mt-1 font-mono">{analysis.protocol}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Alamat utama
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold">
            {analysis.domain ?? "Tidak terbaca"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Bagian sebelum alamat utama
          </dt>
          <dd className="mt-1 break-all font-mono">
            {analysis.subdomain ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Halaman tujuan
          </dt>
          <dd className="mt-1 break-all font-mono">{analysis.path}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm leading-6 text-muted">
        AmanKlik hanya menganalisis struktur alamat ini. Sistem tidak membuka
        atau menghubungi situs tujuan.
      </p>
    </section>
  );
}

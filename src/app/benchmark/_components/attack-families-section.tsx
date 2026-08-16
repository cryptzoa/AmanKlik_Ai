import type { AdversarialSummary } from "@/lib/evaluation/adversarial-runner";

function formatFamilyName(family: string): string {
  return {
    obfuscation: "Tulisan yang disamarkan",
    prompt_injection: "Perintah untuk mengelabui AI",
    false_positive: "Pesan biasa yang seharusnya tidak dicurigai",
    formatting: "Susunan tulisan yang tidak biasa",
  }[family] ?? family.replaceAll("_", " ");
}

export function AttackFamiliesSection(
  { families }: { families: AdversarialSummary["byFamily"] },
) {
  return (
    <section
      className="border-b border-line py-14 sm:py-20"
      aria-labelledby="attack-families-title"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.35fr)_minmax(0,0.65fr)] lg:gap-16">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
            Jenis variasi
          </p>
          <h2
            id="attack-families-title"
            className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
          >
            Setiap jenis diperiksa satu per satu.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">
            Setiap batang menunjukkan jumlah contoh yang memberi hasil sesuai
            harapan. Nilai ini tidak menggambarkan peluang kejadian di dunia
            nyata.
          </p>
        </div>

        {families.length > 0 ? (
          <ol className="grid gap-3">
            {families.map((family, index) => {
              const rate = family.total > 0
                ? Math.round((family.passed / family.total) * 100)
                : 0;

              return (
                <li
                  key={family.family}
                  className="grid gap-4 rounded-[18px] border border-[var(--line-strong)] bg-surface p-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="font-mono text-[10px] font-semibold tabular-nums text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2">
                      <span className="break-words text-sm font-semibold capitalize [overflow-wrap:anywhere]">
                        {formatFamilyName(family.family)}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums text-muted">
                        {family.passed}/{family.total} contoh
                        {family.total > 0 ? ` · ${rate}%` : " · belum ada nilai"}
                      </span>
                    </div>
                    <div
                      className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"
                      aria-hidden="true"
                    >
                      <span
                        className="block h-full bg-ai transition-[width] duration-500 motion-reduce:transition-none"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={`w-fit font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      family.total === 0
                        ? "text-muted"
                        : family.passed === family.total
                        ? "text-safe"
                        : "text-risk"
                    }`}
                  >
                    {family.total === 0
                      ? "Belum diuji"
                      : family.passed === family.total
                      ? "Semua lolos"
                      : `${family.total - family.passed} perlu ditinjau`}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <div className="product-empty-state" role="status">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              0 jenis
            </p>
            <h2>Belum ada jenis variasi</h2>
            <p className="product-empty-state__copy">
              Belum ada contoh variasi sulit yang dapat dibandingkan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

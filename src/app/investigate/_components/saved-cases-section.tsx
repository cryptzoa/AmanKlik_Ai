import { TransitionLink } from "@/components/site/transition-link";
import type { CaseItem } from "@/app/investigate/_components/types";

const riskLabels: Record<CaseItem["riskLevel"], string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export function SavedCasesSection({ cases }: { cases: CaseItem[] }) {
  return (
    <section className="saved-cases" aria-labelledby="case-list-heading">
      <div className="saved-cases__heading">
        <div>
          <p className="product-eyebrow text-ai">02 / Temukan kembali</p>
          <h2 id="case-list-heading">Perbandingan dalam sesi ini.</h2>
        </div>
        <p>
          Jumlah hasil tidak sama dengan jumlah pola. Buka perbandingan untuk
          melihat tanda yang benar-benar muncul berulang.
        </p>
      </div>
      <div className="saved-case-list">
        {cases.length ? (
          cases.map((item) => (
            <TransitionLink
              key={item.id}
              prefetch={false}
              className="saved-case-row"
              href={`/investigate/${item.id}`}
            >
              <span className="saved-case-row__score">
                {item.finalScore}<small>/100</small>
              </span>
              <span className="min-w-0">
                <span className="saved-case-row__meta">
                  {riskLabels[item.riskLevel]} · {item.scanCount} hasil
                </span>
                <strong>{item.title}</strong>
                <span className="saved-case-row__summary">{item.summary}</span>
                <time dateTime={item.updatedAt}>
                  Diperbarui {new Date(item.updatedAt).toLocaleString("id-ID")}
                </time>
              </span>
              <span aria-hidden="true">→</span>
            </TransitionLink>
          ))
        ) : (
          <div className="saved-case-empty">
            <h3>Belum ada perbandingan tersimpan.</h3>
            <p>
              Pilih dua hasil berbeda di atas untuk membuat perbandingan pertama.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

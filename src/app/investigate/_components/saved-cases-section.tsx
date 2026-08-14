import { TransitionLink } from "@/components/site/transition-link";
import type { CaseItem } from "@/app/investigate/_components/types";

export function SavedCasesSection({ cases }: { cases: CaseItem[] }) {
  return (
    <section className="saved-cases" aria-labelledby="case-list-heading">
      <div className="saved-cases__heading">
        <div>
          <p className="product-eyebrow text-ai">02 / Temukan kembali</p>
          <h2 id="case-list-heading">Kasus dalam sesi ini.</h2>
        </div>
        <p>
          Jumlah artefak bukan jumlah pola bersama. Buka kasus untuk melihat
          relasi yang benar-benar ditemukan.
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
                  {item.riskLevel.replace("_", " ")} · {item.status} · {item.scanCount} artefak
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
            <h3>Belum ada kasus tersimpan.</h3>
            <p>
              Pilih dua artefak unik di atas untuk membuat perbandingan pertama.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

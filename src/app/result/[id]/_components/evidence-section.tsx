import type { RiskSignal } from "@/types/analysis";

const sourceLabels: Record<RiskSignal["source"], string> = {
  rule: "Pola terdeteksi",
  url: "Struktur tautan",
  ai: "Konteks dari AI",
};

const severityLabels: Record<RiskSignal["severity"], string> = {
  low: "Perlu perhatian ringan",
  medium: "Perlu perhatian",
  high: "Perlu segera diperiksa",
};

export function EvidenceSection({ signals }: { signals: RiskSignal[] }) {
  return (
    <section
      className="product-dark-chapter result-evidence"
      aria-labelledby="evidence-heading"
    >
      <div className="product-container result-evidence__grid">
        <div>
          <p className="product-eyebrow text-ai-soft">01 / Bukti</p>
          <h2 id="evidence-heading" className="result-evidence__title">
            Kenapa hasilnya seperti ini?
          </h2>
          <p className="result-evidence__intro">
            Periksa setiap alasan. Tidak adanya tanda tertentu bukan berarti
            pesan pasti aman.
          </p>
        </div>
        <div className="result-evidence__rows">
          {signals.length ? (
            signals.map((signal, index) => (
              <article
                key={`${signal.id}-${index}`}
                id={`evidence-${signal.id}`}
                className="result-evidence__row"
              >
                <span className="result-evidence__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="result-evidence__meta">
                    <span>{sourceLabels[signal.source]}</span>
                    <span>{severityLabels[signal.severity]}</span>
                  </p>
                  <h3>{signal.label}</h3>
                  {signal.evidence ? (
                    <blockquote>“{signal.evidence}”</blockquote>
                  ) : null}
                  <p className="result-evidence__explanation">
                    {signal.explanation}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="result-evidence__empty">
              <h3>Belum ada tanda khusus yang ditemukan.</h3>
              <p>
                Tetap periksa pengirim, alamat, dan permintaan melalui aplikasi,
                nomor, atau situs resmi yang kamu buka sendiri.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

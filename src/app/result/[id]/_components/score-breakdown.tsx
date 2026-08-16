import type { PublicScoreExplanation, RiskSignal } from "@/types/analysis";

const sourceLabels = {
  rule: "Pola pesan",
  url: "Struktur tautan",
  ai: "Konteks AI",
} as const;

const bandLabels = {
  minor: "pengaruh kecil",
  moderate: "pengaruh sedang",
  major: "pengaruh besar",
} as const;

export function ScoreBreakdown(
  { explanation, signals = [] }: {
    explanation?: PublicScoreExplanation;
    signals?: RiskSignal[];
  },
) {
  if (!explanation) return null;

  return (
    <section
      className="border-b border-line py-16"
      aria-labelledby="score-breakdown-heading"
    >
      <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
            02 / Cara skor dihitung
          </p>
          <h2
            id="score-breakdown-heading"
            className="mt-4 text-4xl font-semibold tracking-[-0.05em]"
          >
            Bagaimana skor ini terbentuk?
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted">
            Skor ini adalah perkiraan berdasarkan tanda yang ditemukan, bukan
            peluang pasti dan bukan vonis. AI membantu membaca konteks, lalu
            AmanKlik menghitung skor akhirnya.
          </p>
        </div>
        <div>
          <ul className="grid gap-3">
            {explanation.contributions.map((contribution) => (
              <li
                key={contribution.source}
                className="grid gap-2 rounded-[16px] border border-line bg-surface p-5 sm:grid-cols-[160px_1fr_auto] sm:items-start sm:gap-5"
              >
                <span className="text-sm font-semibold">
                  {sourceLabels[contribution.source]}
                </span>
                <p className="text-sm leading-6 text-muted">
                  {contribution.explanation}{" "}
                  <span className="text-ink">
                    ({contribution.signalCount} tanda)
                  </span>
                </p>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ai">
                  {bandLabels[contribution.band]}
                </span>
              </li>
            ))}
          </ul>
          {explanation.adjustmentLabels.length
            ? (
              <div className="mt-5 rounded-[18px] border-l-4 border-ai bg-ai-soft p-5 text-sm leading-6">
                <strong>Perhatian tambahan:</strong>
                <ul className="mt-2 list-disc pl-5">
                  {explanation.adjustmentLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </div>
            )
            : null}
          {explanation.strongestSignalIds.length
            ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="w-full text-xs uppercase tracking-[0.12em] text-muted">
                  Tanda yang paling berpengaruh
                </span>
                {explanation.strongestSignalIds.map((signalId) => {
                  const signal = signals.find((item) => item.id === signalId);
                  return signal
                    ? (
                      <a
                        key={signalId}
                        className="rounded-full border border-line bg-surface px-3 py-2 text-xs font-semibold hover:border-ai hover:text-ai"
                        href={`#evidence-${signalId}`}
                      >
                        {signal.label} ↗
                      </a>
                    )
                    : null;
                })}
              </div>
            )
            : null}
          <p className="mt-5 text-sm leading-6 text-muted">
            {explanation.explanation}
          </p>
        </div>
      </div>
    </section>
  );
}

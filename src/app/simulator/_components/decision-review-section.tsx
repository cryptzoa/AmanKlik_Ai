import type {
  SimulatorChoiceQuality,
  SimulatorEvaluation,
} from "@/lib/simulator/scenarios";

const QUALITY_COPY: Record<
  SimulatorChoiceQuality,
  { label: string; className: string }
> = {
  safe: {
    label: "Langkah aman",
    className: "border-safe bg-safe-soft text-ink",
  },
  partial: {
    label: "Belum cukup",
    className: "border-warning bg-warning-soft text-ink",
  },
  unsafe: {
    label: "Berisiko",
    className: "border-risk bg-risk-soft text-ink",
  },
};

export function DecisionReviewSection(
  { result }: { result: SimulatorEvaluation },
) {
  return (
    <section
      className="py-8"
      aria-labelledby="decision-review-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            Review keputusan
          </p>
          <h3 id="decision-review-title" className="mt-2 text-xl font-semibold">
            Lihat momen yang masih bisa diperkuat.
          </h3>
        </div>
        <p className="text-xs text-muted">
          {result.safeCount} aman · {result.partialCount} belum cukup ·{" "}
          {result.unsafeCount} berisiko
        </p>
      </div>
      <ol className="mt-5 grid gap-3">
        {result.decisions.map((decision, index) => {
          const quality = QUALITY_COPY[decision.quality];
          return (
            <li
              key={decision.stepId}
              data-decision-row
              className="product-flat-row bg-surface p-5 sm:grid sm:grid-cols-[42px_1fr] sm:gap-3 sm:p-6"
            >
              <span className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold">{decision.label}</p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase ${quality.className}`}
                >
                  {quality.label}
                </span>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {decision.feedback}
                </p>
                {decision.saferAction
                  ? (
                    <p className="mt-2 text-sm leading-7">
                      <strong>Lebih aman:</strong> {decision.saferAction}
                    </p>
                  )
                  : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

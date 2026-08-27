import type { ResponseStep } from "@/lib/response/types";

export function officialHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "sumber resmi";
  }
}

function SourceLink({ step }: { step: ResponseStep }) {
  if (!step.sourceTitle || !step.sourceUrl) return null;
  return (
    <a
      className="product-source-link mt-4 border"
      href={step.sourceUrl}
      target="_blank"
      rel="noreferrer"
    >
      <span className="product-source-link__label">
        Sumber resmi · {officialHost(step.sourceUrl)}
      </span>
      <span className="product-source-link__arrow" aria-hidden="true">↗</span>
      <span className="sr-only"> ({step.sourceTitle})</span>
    </a>
  );
}

export function ResponseStepCards(
  { steps, startAt = 1 }: { steps: ResponseStep[]; startAt?: number },
) {
  if (!steps.length) return null;
  return (
    <ol className="grid gap-3">
      {steps.map((step, index) => (
        <li
          key={step.id}
          data-response-step
          className="product-flat-row bg-surface p-5 sm:grid sm:grid-cols-[44px_1fr] sm:gap-3 sm:p-7"
        >
          <span className="font-mono text-xs text-muted">
            {String(startAt + index).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              {step.body}
            </p>
            <SourceLink step={step} />
          </div>
        </li>
      ))}
    </ol>
  );
}

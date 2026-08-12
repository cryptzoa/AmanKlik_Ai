"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ResponsePlan, ResponseStep } from "@/lib/response/types";
import { NextPrioritiesSection } from "@/app/respond/_components/next-priorities-section";
import {
  officialHost,
  ResponseStepCards,
} from "@/app/respond/_components/response-step-cards";

gsap.registerPlugin(useGSAP);

function ExpandableSteps(
  { title, hint, steps }: {
    title: string;
    hint: string;
    steps: ResponseStep[];
  },
) {
  if (!steps.length) return null;
  return (
    <details className="border-t border-line py-2">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-3 font-semibold marker:hidden">
        <span>{title}</span>
        <span className="font-mono text-xs font-normal text-muted">
          {steps.length} langkah +
        </span>
      </summary>
      <p className="mb-4 max-w-2xl text-sm leading-6 text-muted">{hint}</p>
      <ResponseStepCards steps={steps} />
    </details>
  );
}

type Props = {
  plan: ResponsePlan;
  copyStatus: string | null;
  onReset: () => void;
  onCopy: () => void;
};

export function ResponsePlanSection(
  { plan, copyStatus, onReset, onCopy }: Props,
) {
  const root = useRef<HTMLElement>(null);
  const primaryStep = plan.immediate[0];
  const nextPrioritySteps = plan.immediate.slice(1, 3);
  const remainingImmediateSteps = plan.immediate.slice(3);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.from("[data-response-step]", {
      autoAlpha: 0,
      y: 22,
      stagger: 0.06,
      duration: 0.45,
      delay: 0.15,
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      className="mt-10 border border-line bg-surface shadow-[10px_10px_0_rgba(17,17,17,0.06)]"
      aria-labelledby="response-priority-title"
    >
      <div className="bg-ink p-6 text-surface sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai-soft">
              Prioritas pertama
            </p>
            <h2
              id="response-priority-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
            >
              {primaryStep.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-surface/75">
              {primaryStep.body}
            </p>
            {primaryStep.sourceTitle && primaryStep.sourceUrl
              ? (
                <a
                  className="mt-5 inline-flex min-h-11 items-center border border-white/30 px-4 py-2 text-xs font-semibold text-surface transition hover:bg-surface hover:text-ink"
                  href={primaryStep.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka sumber resmi ↗ · {officialHost(primaryStep.sourceUrl)}
                  <span className="sr-only">— {primaryStep.sourceTitle}</span>
                </a>
              )
              : null}
          </div>
          <button
            type="button"
            className="min-h-11 text-xs font-semibold text-surface/70 underline underline-offset-4 hover:text-surface print:hidden"
            onClick={onReset}
          >
            Ulangi pilihan
          </button>
        </div>
      </div>
      <div className="p-5 sm:p-8">
        {nextPrioritySteps.length
          ? <NextPrioritiesSection steps={nextPrioritySteps} />
          : null}
        <div className="mt-7">
          <ExpandableSteps
            title="Langkah mendesak lainnya"
            hint="Buka jika kamu memilih lebih dari satu kejadian atau layanan terdampak."
            steps={remainingImmediateSteps}
          />
          <ExpandableSteps
            title="Berikutnya: bukti dan pemulihan"
            hint="Kerjakan setelah akses dan transaksi yang paling berisiko sudah diamankan."
            steps={plan.soon}
          />
          <ExpandableSteps
            title="Pantau setelahnya"
            hint="Waspadai tindak lanjut yang berpura-pura membantu memulihkan akun atau uang."
            steps={plan.monitor}
          />
        </div>
        <div className="mt-6 border-t border-line pt-5 text-sm leading-6 text-muted">
          <strong className="text-ink">Batas panduan:</strong> {plan.disclaimer}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <button
            type="button"
            className="min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai"
            onClick={onCopy}
          >
            Salin semua langkah
          </button>
          <button
            type="button"
            className="min-h-12 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold transition hover:border-ink"
            onClick={() => window.print()}
          >
            Cetak panduan
          </button>
        </div>
        {copyStatus
          ? (
            <p className="mt-3 text-sm text-muted" role="status">
              {copyStatus}
            </p>
          )
          : null}
      </div>
    </section>
  );
}

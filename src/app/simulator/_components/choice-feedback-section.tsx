"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type {
  SimulatorChoice,
  SimulatorChoiceQuality,
} from "@/lib/simulator/scenarios";

gsap.registerPlugin(useGSAP);

const QUALITY_COPY: Record<
  SimulatorChoiceQuality,
  { label: string; className: string }
> = {
  safe: {
    label: "Langkah aman",
    className: "border-safe bg-[var(--safe-soft)] text-ink",
  },
  partial: {
    label: "Belum cukup",
    className: "border-warning bg-[var(--warning-soft)] text-ink",
  },
  unsafe: {
    label: "Berisiko",
    className: "border-risk bg-[var(--risk-soft)] text-ink",
  },
};

export function ChoiceFeedbackSection(
  { choice, onContinue, finalStep }: {
    choice: SimulatorChoice;
    onContinue: () => void;
    finalStep: boolean;
  },
) {
  const root = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quality = QUALITY_COPY[choice.quality];

  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.45,
      ease: "power3.out",
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      className={`mt-5 border-l-4 p-5 sm:p-6 ${quality.className}`}
      aria-labelledby="decision-feedback-title"
      aria-live="polite"
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
        {quality.label} · {choice.points}/100
      </p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        id="decision-feedback-title"
        className="mt-3 text-xl font-semibold outline-none"
      >
        Kenapa keputusan ini dinilai begitu?
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-7">{choice.feedback}</p>
      {choice.saferAction
        ? (
          <p className="mt-4 border-t border-current/20 pt-4 text-sm leading-7">
            <strong>Langkah yang lebih aman:</strong> {choice.saferAction}
          </p>
        )
        : null}
      <button
        type="button"
        className="mt-6 min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-ai"
        onClick={onContinue}
      >
        {finalStep ? "Lihat hasil latihan" : "Lanjut ke keputusan berikutnya"} →
      </button>
    </section>
  );
}

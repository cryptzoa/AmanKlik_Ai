"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AdversarialSummary } from "@/lib/evaluation/adversarial-runner";
import type { EvaluationSummary } from "@/lib/evaluation/runner";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function BenchmarkSummarySection(
  { regression, adversarial }: {
    regression: EvaluationSummary;
    adversarial: AdversarialSummary;
  },
) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from("[data-summary-card]", {
      autoAlpha: 0,
      y: 32,
      stagger: 0.09,
      duration: 0.65,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      className="grid gap-px border border-line bg-line sm:grid-cols-3"
    >
      <div data-summary-card className="bg-ink p-7 text-surface">
        <p className="font-mono text-xs uppercase text-surface/60">
          Deterministic regression
        </p>
        <p className="mt-4 font-mono text-6xl font-semibold">
          {regression.passRate}%
        </p>
        <p className="mt-2 text-xs text-surface/60">
          {regression.passed}/{regression.total} fixture sesuai rentang
        </p>
      </div>
      <div data-summary-card className="bg-ai p-7 text-white">
        <p className="font-mono text-xs uppercase text-white/70">
          Adversarial robustness
        </p>
        <p className="mt-4 font-mono text-6xl font-semibold">
          {adversarial.robustnessRate}%
        </p>
        <p className="mt-2 text-xs text-white/70">
          {adversarial.passed}/{adversarial.total} skenario bertahan
        </p>
      </div>
      <div data-summary-card className="bg-safe-soft p-7">
        <p className="font-mono text-xs uppercase text-safe">URL interaction</p>
        <p className="mt-4 font-mono text-6xl font-semibold">0</p>
        <p className="mt-2 text-xs text-muted">
          Tidak ada fetch, redirect expansion, atau probe
        </p>
      </div>
    </section>
  );
}

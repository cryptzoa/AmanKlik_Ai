"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RiskLevel } from "@/types/analysis";

gsap.registerPlugin(useGSAP);

const labels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

const colors: Record<RiskLevel, string> = {
  LOW: "text-safe",
  MEDIUM: "text-warning",
  HIGH: "text-risk",
  VERY_HIGH: "text-risk",
};

export function RiskScore(
  { score, level }: { score: number; level: RiskLevel },
) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.from("[data-score-value]", {
      autoAlpha: 0,
      scale: .96,
      transformOrigin: "left bottom",
      duration: .55,
    }).from("[data-score-label]", {
      autoAlpha: 0,
      y: 12,
      duration: .35,
    }, "-=.2").fromTo("[data-score-bar]", { scaleX: 0 }, {
      scaleX: score / 100,
      duration: .7,
    }, "-=.25");
  }, { scope: root, dependencies: [score] });

  return (
    <div
      ref={root}
      role="img"
      aria-label={`${score} dari 100, ${labels[level]}`}
    >
      <div data-score-value className="flex items-end gap-2" aria-hidden="true">
        <span
          className={`text-[clamp(6rem,14vw,11rem)] font-semibold leading-[0.72] tracking-[-0.09em] ${
            colors[level]
          }`}
        >
          {score}
        </span>
        <span className="pb-1 font-mono text-sm text-muted">/100</span>
      </div>
      <div className="mt-7 h-2 overflow-hidden bg-line">
        <span
          data-score-bar
          className={`block h-full origin-left ${
            level === "LOW"
              ? "bg-safe"
              : level === "MEDIUM"
              ? "bg-warning"
              : "bg-risk"
          }`}
          style={{ transform: `scaleX(${score / 100})` }}
        />
      </div>
      <div
        data-score-label
        aria-hidden="true"
        className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.18em]"
      >
        {labels[level]}
      </div>
    </div>
  );
}

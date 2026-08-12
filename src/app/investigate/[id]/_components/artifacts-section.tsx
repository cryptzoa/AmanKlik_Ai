"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InputType, RiskLevel } from "@/types/analysis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CaseArtifact = {
  id: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  finalScore: number;
  summary: string;
  indicatorCount: number;
};

export function ArtifactsSection({ artifacts }: { artifacts: CaseArtifact[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
    gsap.from("[data-artifact]", {
      autoAlpha: 0,
      x: 24,
      stagger: 0.07,
      duration: 0.55,
      scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root} className="py-12" aria-labelledby="source-heading">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        Artefak
      </p>
      <h2 id="source-heading" className="mt-3 text-3xl font-semibold">
        Artefak yang dibandingkan
      </h2>
      <div className="mt-7 grid gap-2">
        {artifacts.map((artifact) => (
          <Link
            key={artifact.id}
            data-artifact
            href={`/result/${artifact.id}`}
            className="lift-link grid gap-3 border border-line bg-surface p-5 hover:border-ink sm:grid-cols-[110px_1fr_70px] sm:items-center"
          >
            <span className="font-mono text-xs uppercase text-muted">
              {artifact.inputType}
            </span>
            <span>
              <strong className="block">{artifact.summary}</strong>
              <span className="mt-1 block text-xs text-muted">
                {artifact.indicatorCount} indikator ·{" "}
                {artifact.riskLevel.replace("_", " ")}
              </span>
            </span>
            <span className="font-mono text-3xl font-semibold sm:text-right">
              {artifact.finalScore}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

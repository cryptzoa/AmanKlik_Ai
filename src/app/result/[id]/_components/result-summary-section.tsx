"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiskScore } from "@/app/result/[id]/_components/risk-score";
import type { AnalysisResult } from "@/types/analysis";
import { MotionButton } from "@/components/ui/animated-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const modeLabels: Record<AnalysisResult["analysisMode"], string> = {
  hybrid: "AI + pola",
  cached_hybrid: "Analisis tersimpan",
  rules_only: "Pola saja",
};

export function ResultSummarySection({ result }: { result: AnalysisResult }) {
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
  }, { scope: root });

  return (
    <section
      ref={root}
      className="grid gap-10 border-b-2 border-ink pb-12 lg:grid-cols-[0.62fr_1.38fr] lg:items-end"
    >
      <RiskScore score={result.finalScore} level={result.riskLevel} />
      <div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          <span>{modeLabels[result.analysisMode]}</span>
          {result.cacheHit ? <span>· Cache</span> : null}
          <span>· {new Date(result.createdAt).toLocaleString("id-ID")}</span>
        </div>
        <h2 className="section-title mt-5 max-w-3xl">{result.summary}</h2>
        <p className="mt-5 max-w-2xl leading-7 text-muted">
          {result.uncertainty}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MotionButton
            arrow
            className="editorial-button editorial-button-primary"
            href="/scan"
          >
            Periksa pesan lain
          </MotionButton>
          <MotionButton
            arrow={false}
            className="editorial-button editorial-button-secondary"
            href={`/respond?from=${result.scanId}`}
          >
            Sudah terlanjur?
          </MotionButton>
          <MotionButton
            arrow={false}
            className="editorial-button editorial-button-secondary"
            href={`/simulator?from=${result.scanId}`}
          >
            Latihan dari pola ini
          </MotionButton>
          <MotionButton
            arrow={false}
            className="editorial-button editorial-button-secondary"
            href={`/investigate?scan=${result.scanId}`}
          >
            Bandingkan bukti lain
          </MotionButton>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AnalysisResult } from "@/types/analysis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function UrlAnalysisSection(
  { analysis }: { analysis: NonNullable<AnalysisResult["urlAnalysis"]> },
) {
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
      className="border-t border-line py-16"
      aria-labelledby="url-heading"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        02 / URL
      </p>
      <h2 id="url-heading" className="section-title mt-4">Anatomi tautan</h2>
      <p className="mt-7 break-all border border-line bg-ink p-6 font-mono text-sm leading-7 text-surface sm:text-lg">
        {analysis.displayUrl}
      </p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Protocol
          </dt>
          <dd className="mt-1 font-mono">{analysis.protocol}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Domain utama
          </dt>
          <dd className="mt-1 font-mono text-lg font-semibold">
            {analysis.domain ?? "Tidak terbaca"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Subdomain
          </dt>
          <dd className="mt-1 break-all font-mono">
            {analysis.subdomain ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.12em] text-muted">
            Path
          </dt>
          <dd className="mt-1 break-all font-mono">{analysis.path}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm leading-6 text-muted">
        AmanKlik hanya menganalisis struktur alamat ini. Sistem tidak membuka
        atau menghubungi situs tujuan.
      </p>
    </section>
  );
}

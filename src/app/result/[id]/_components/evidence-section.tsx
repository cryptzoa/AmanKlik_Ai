"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RiskSignal } from "@/types/analysis";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const sourceLabels: Record<RiskSignal["source"], string> = {
  rule: "Pola terdeteksi",
  url: "Struktur tautan",
  ai: "Konteks AI",
};

export function EvidenceSection({ signals }: { signals: RiskSignal[] }) {
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
    gsap.from("[data-signal-row]", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.07,
      duration: 0.58,
      scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root} className="py-16" aria-labelledby="evidence-heading">
      <div className="grid gap-5 lg:grid-cols-[0.35fr_0.65fr]">
        <div>
          <p className="eyebrow-label text-ai">01 / Bukti</p>
          <h2 id="evidence-heading" className="section-title mt-4">
            Kenapa hasilnya seperti ini?
          </h2>
        </div>
        <div className="mt-6">
          {signals.length
            ? signals.map((signal, index) => (
              <article
                key={`${signal.id}-${index}`}
                id={`evidence-${signal.id}`}
                data-signal-row
                className="editorial-row group grid gap-4 py-7 transition-colors sm:grid-cols-[76px_1fr] sm:px-5"
              >
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
                    <span className="text-ai">
                      {sourceLabels[signal.source]}
                    </span>
                    <span className="text-muted">{signal.severity}</span>
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    {signal.label}
                  </h3>
                  {signal.evidence
                    ? (
                      <p className="mt-3 max-w-2xl border-l-2 border-ai bg-canvas px-4 py-3 text-sm text-muted">
                        “{signal.evidence}”
                      </p>
                    )
                    : null}
                  <p className="mt-3 max-w-2xl leading-7 text-muted">
                    {signal.explanation}
                  </p>
                </div>
              </article>
            ))
            : (
              <p className="border-t border-line py-6 text-muted">
                Belum ada indikator spesifik yang terdeteksi. Tetap verifikasi
                melalui kanal resmi.
              </p>
            )}
        </div>
      </div>
    </section>
  );
}

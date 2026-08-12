"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const stages = [
  ["RULES", "Pola pesan"],
  ["URL", "Struktur domain"],
  ["AI", "Konteks bahasa"],
  ["RISK ENGINE", "Logika aplikasi"],
  ["RESULT", "Skor + alasan + aksi"],
];
export function LandingPipelineSection() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from("[data-pipeline-node]", {
      autoAlpha: 0,
      y: 34,
      stagger: 0.12,
      scrollTrigger: { trigger: root.current, start: "top 72%" },
    });
  }, { scope: root });
  return (
    <section
      ref={root}
      data-pipeline
      className="relative z-10 bg-[#f7f5f2] border-b border-line px-5 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1320px]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">
          03 / Hybrid intelligence
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-2 lg:items-end">
          <h2 className="section-title max-w-3xl">
            Bukan keputusan AI mentah.
          </h2>
          <p className="max-w-xl text-lg leading-8 text-muted lg:justify-self-end">
            AI membantu membaca konteks. Rules dan pemeriksaan URL memberi bukti
            deterministik. Risk Engine milik aplikasi menggabungkannya menjadi
            hasil yang bisa dijelaskan.
          </p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-[0.9fr_0.9fr_0.9fr_1.2fr_1.3fr]">
          {stages.map(([label, body], index) => (
            <div
              key={label}
              data-pipeline-node
              className={`${
                index === 3
                  ? "bg-ink text-surface"
                  : index === 4
                  ? "bg-ai-soft"
                  : "bg-surface"
              } relative min-h-48 p-6`}
            >
              <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-60">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-14 font-mono text-sm font-bold tracking-[0.12em]">
                {label}
              </p>
              <p className="mt-2 text-sm opacity-70">{body}</p>
              {index < 4
                ? (
                  <span
                    className="absolute bottom-5 right-5 text-xl"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )
                : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

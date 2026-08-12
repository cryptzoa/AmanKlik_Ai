"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function ResultNotices(
  { aiAvailable, intelligenceMatchCount }: {
    aiAvailable: boolean;
    intelligenceMatchCount: number;
  },
) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from("[data-result-notice]", {
      autoAlpha: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5,
      ease: "power3.out",
    });
  }, { scope: root });
  if (aiAvailable && intelligenceMatchCount < 3) return null;
  return (
    <div ref={root}>
      {!aiAvailable
        ? (
          <div
            data-result-notice
            className="border-b border-line bg-warning-soft px-5 py-4 text-sm leading-6"
          >
            <strong>Analisis AI sedang terbatas.</strong>{" "}
            AmanKlik tetap menjalankan pemeriksaan pola dan struktur secara
            deterministik.
          </div>
        )
        : null}
      {intelligenceMatchCount >= 3
        ? (
          <aside
            data-result-notice
            className="border-b border-line bg-ai-soft px-5 py-5 text-sm leading-7"
          >
            <strong className="text-ai">Sinyal lintas sesi:</strong>{" "}
            fingerprint input yang sama muncul pada {intelligenceMatchCount}
            {" "}
            sesi anonim berbeda dalam 30 hari terakhir. Ini menambah konteks,
            tetapi tidak membuktikan bahwa pengirim atau konten pasti berbahaya.
          </aside>
        )
        : null}
    </div>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CaseScoreSection({ score }: { score: number }) {
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
      className="grid gap-6 border-b border-line pb-10 sm:grid-cols-[140px_1fr] sm:items-end"
    >
      <div>
        <p className="font-mono text-xs uppercase text-muted">Case score</p>
        <p className="mt-2 font-mono text-7xl font-semibold">{score}</p>
      </div>
      <div>
        <p className="max-w-2xl leading-7 text-muted">
          Skor kasus mengikuti risiko tertinggi di antara sumber agar indikator
          penting tidak tertutup oleh rata-rata. Ini bukan probabilitas
          penipuan.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-semibold hover:border-ai hover:text-ai"
          href="/investigate"
        >
          ← Semua kasus
        </Link>
      </div>
    </section>
  );
}

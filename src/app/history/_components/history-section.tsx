"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { InputType, RiskLevel } from "@/types/analysis";
import { MotionButton } from "@/components/ui/animated-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const labels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export type HistoryItem = {
  id: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  previewRedacted: string | null;
  finalScore: number;
};

export function HistorySection(
  { rows, storageUnavailable }: {
    rows: HistoryItem[];
    storageUnavailable: boolean;
  },
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
    gsap.from("[data-history-card]", {
      autoAlpha: 0,
      y: 34,
      stagger: 0.055,
      duration: 0.62,
      ease: "power2.out",
      scrollTrigger: { trigger: root.current, start: "top 84%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root}>
      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="section-title">Pemeriksaan terakhir</h2>
        <MotionButton
          arrow
          className="editorial-button editorial-button-primary"
          href="/scan"
        >
          Periksa pesan baru
        </MotionButton>
      </div>
      {storageUnavailable
        ? (
          <div data-history-card className="motion-surface mt-12 p-8 sm:p-12">
            <h2 className="text-2xl font-semibold">Riwayat belum tersedia</h2>
            <p className="mt-3 max-w-xl text-muted">
              Penyimpanan database belum terhubung. Hasil tidak ditampilkan
              sebagai riwayat sampai penyimpanan siap.
            </p>
          </div>
        )
        : rows.length
        ? (
          <div className="mt-12 border-y border-line">
            {rows.map((row) => (
              <Link
                key={row.id}
                data-history-card
                href={`/result/${row.id}`}
                className="editorial-row group grid gap-4 p-5 first:border-t-0 sm:grid-cols-[110px_1fr_100px] sm:items-center sm:p-6"
              >
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {row.inputType}
                </span>
                <span>
                  <strong className="block text-xl tracking-[-0.02em]">
                    {labels[row.riskLevel]}
                  </strong>
                  <span className="mt-1 block truncate text-sm text-muted">
                    {row.previewRedacted ?? "Tanpa preview teks"}
                  </span>
                </span>
                <span className="flex items-center justify-between font-mono text-3xl font-semibold sm:justify-end">
                  <span>{row.finalScore}</span>
                  <span className="ml-5 text-base text-muted transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )
        : (
          <div
            data-history-card
            className="motion-surface mt-12 grid min-h-72 place-items-center p-8 text-center sm:p-12"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
                0 hasil
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                Belum ada pemeriksaan
              </h2>
              <p className="mt-3 text-muted">
                Hasil yang kamu periksa di sesi ini akan muncul di sini.
              </p>
              <Link
                className="lift-link mt-7 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-surface hover:bg-ai"
                href="/scan"
              >
                Mulai periksa
              </Link>
            </div>
          </div>
        )}
    </section>
  );
}

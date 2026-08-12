"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScanItem } from "@/app/investigate/_components/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  scans: ScanItem[];
  selected: string[];
  title: string;
  loading: boolean;
  error: string | null;
  onTitleChange: (title: string) => void;
  onToggle: (id: string) => void;
  onCreate: () => void;
};

export function ComparisonBuilderSection(
  { scans, selected, title, loading, error, onTitleChange, onToggle, onCreate }:
    Props,
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
      className="grid gap-8 border-b border-line pb-14 xl:grid-cols-[0.38fr_0.62fr]"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
          Bandingkan bukti
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
          Cari kesamaan yang berguna.
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Pilih 2–8 artefak berbeda dari sesi ini. Pemeriksaan ulang atas input
          yang sama tidak dihitung sebagai bukti tambahan.
        </p>
      </div>
      <div>
        <label className="block text-sm font-semibold">
          Nama kasus<input
            className="mt-3 min-h-12 w-full border border-line bg-surface px-4 outline-none focus:border-ai"
            value={title}
            maxLength={80}
            placeholder="Contoh: Pesan kurir dan tautan pembayaran"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </label>
        <div className="mt-6 grid gap-2">
          {scans.length
            ? scans.map((scan) => {
              const active = selected.includes(scan.id);
              return (
                <button
                  key={scan.id}
                  type="button"
                  aria-pressed={active}
                  className={`grid min-h-16 gap-2 border p-4 text-left sm:grid-cols-[100px_1fr_70px] sm:items-center ${
                    active
                      ? "border-ai bg-ai-soft"
                      : "border-line bg-surface hover:border-ink"
                  }`}
                  onClick={() => onToggle(scan.id)}
                >
                  <span className="font-mono text-xs uppercase text-muted">
                    {scan.inputType}
                  </span>
                  <span className="truncate text-sm">
                    <strong className="mr-2">
                      {scan.riskLevel.replace("_", " ")}
                    </strong>
                    {scan.preview ?? "Tanpa preview"}
                  </span>
                  <span className="font-mono text-2xl font-semibold sm:text-right">
                    {scan.finalScore}
                  </span>
                </button>
              );
            })
            : (
              <p className="border border-dashed border-line p-5 text-sm text-muted">
                Belum ada cukup artefak berbeda. Lakukan beberapa pemeriksaan
                terlebih dahulu.
              </p>
            )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={loading || selected.length < 2 || title.trim().length < 3}
            className="min-h-12 rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai disabled:opacity-40"
            onClick={onCreate}
          >
            {loading
              ? "Menyusun perbandingan…"
              : `Bandingkan ${selected.length} artefak`}
          </button>
          <Link
            className="text-sm font-semibold underline underline-offset-4"
            href="/scan"
          >
            Tambah pemeriksaan
          </Link>
        </div>
        {error
          ? (
            <p
              className="mt-4 border border-risk/30 bg-risk-soft p-4 text-sm"
              role="alert"
            >
              {error}
            </p>
          )
          : null}
      </div>
    </section>
  );
}

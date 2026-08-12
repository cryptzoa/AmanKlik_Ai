"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SetupSection(
  { appBaseUrl, onCopy }: {
    appBaseUrl: string;
    onCopy: (value: string) => void;
  },
) {
  const root = useRef<HTMLElement>(null);
  const { isLoaded } = usePreloader();
  const { isTransitioning } = useTransition();
  const isReady = isLoaded && !isTransitioning;
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const tween = gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
      paused: !isReady
    });
    tweenRef.current = tween;
  }, { scope: root });

  useEffect(() => {
    if (isReady && tweenRef.current) {
      tweenRef.current.play();
    }
  }, [isReady]);

  return (
    <section ref={root} className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
          Setup
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Konfigurasi side panel</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-7 text-muted">
          <li>
            Buka <code>chrome://extensions</code> dan aktifkan Developer mode.
          </li>
          <li>
            Pilih Load unpacked, lalu pilih folder <code>extension/</code>{" "}
            di repository.
          </li>
          <li>Buka ikon AmanKlik, isi Base URL dan token di atas.</li>
          <li>
            Blok pesan atau klik kanan tautan, lalu pilih “Periksa dengan
            AmanKlik”.
          </li>
        </ol>
      </div>
      <div className="border border-line bg-ink p-6 text-surface sm:p-8">
        <p className="font-mono text-xs uppercase text-surface/60">Base URL</p>
        <code className="mt-3 block break-all text-ai-soft">{appBaseUrl}</code>
        <button
          type="button"
          className="mt-4 min-h-11 rounded-full border border-white/30 px-4 text-xs font-semibold"
          onClick={() => onCopy(appBaseUrl)}
        >
          Salin Base URL
        </button>
        <div className="mt-8 border-t border-white/20 pt-5 text-sm leading-7 text-surface/70">
          Extension memakai permission{" "}
          <strong className="text-surface">activeTab</strong>: akses halaman
          bersifat sementara setelah tindakan pengguna, bukan membaca semua tab
          terus-menerus.
        </div>
      </div>
    </section>
  );
}

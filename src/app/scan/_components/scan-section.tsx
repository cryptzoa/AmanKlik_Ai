"use client";

import { useRef, useEffect } from "react";
import { TransitionLink as Link } from "@/components/site/transition-link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";
import { ScanClient } from "@/app/scan/_components/scan-client";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScanSection({ initialError }: { initialError: string | null }) {
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
    <section ref={root} className="task-canvas">
      <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
        <h2 className="section-title max-w-3xl">Mulai dari bentuk buktinya.</h2>
        <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">
          Gunakan fixture sintetis untuk demo. Untuk data pribadi, hapus nama,
          nomor rekening, OTP, dan informasi sensitif lainnya.
        </p>
      </div>
      <ScanClient initialError={initialError} />
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="text-sm text-muted">
          Pesannya terdiri dari beberapa tahap?
        </p>
        <Link
          className="text-sm font-semibold text-ai underline underline-offset-4"
          href="/scan/conversation"
        >
          Periksa percakapan berurutan →
        </Link>
      </div>
    </section>
  );
}

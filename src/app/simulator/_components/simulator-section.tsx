"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";
import { SimulatorClient } from "@/app/simulator/_components/simulator-client";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SimulatorSection() {
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
    <section ref={root}>
      <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-2 lg:items-end">
        <h2 className="section-title max-w-3xl">
          Latih keputusan, bukan tebakan.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-muted lg:justify-self-end">
          Tidak ada data, uang, atau konsekuensi nyata. Setiap skenario
          mengajarkan satu aturan yang bisa dipakai kembali ketika modus dan
          tampilannya berubah.
        </p>
      </div>
      <SimulatorClient />
    </section>
  );
}

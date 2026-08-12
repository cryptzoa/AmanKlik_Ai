"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloader } from "@/components/site/preloader-context";
import { useTransition } from "@/components/site/transition-context";

import { MotionButton } from "@/components/ui/animated-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const networkPoints = [
  [50, 145],
  [170, 96],
  [264, 104],
  [338, 228],
  [492, 164],
  [582, 286],
  [730, 240],
  [1100, 70],
  [1216, 150],
  [1302, 112],
  [1418, 244],
  [1540, 218],
  [78, 650],
  [198, 626],
  [270, 716],
  [402, 605],
  [500, 664],
  [1048, 668],
  [1178, 594],
  [1280, 690],
  [1390, 578],
  [1570, 650],
];
export function LandingHeroSection() {
  const root = useRef<HTMLElement>(null);
  const { isLoaded } = usePreloader();
  const { isTransitioning } = useTransition();
  const isReady = isLoaded && !isTransitioning;

  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      paused: !isReady
    });
    timelineRef.current = timeline;

    timeline.from("[data-hero-line] > span", {
      yPercent: 115,
      duration: 0.72,
      stagger: 0.08,
    }).from(
      "[data-hero-support]",
      { autoAlpha: 0, y: 22, duration: 0.45 },
      "-=0.28",
    ).from("[data-network]", { autoAlpha: 0, duration: 0.5 }, "-=0.25");
    gsap.utils.toArray<HTMLElement>("[data-network-node]").forEach(
      (node, index) => {
        gsap.to(node, {
          y: index % 2 ? -10 : 12,
          x: index % 2 ? 5 : -4,
          rotation: index % 2 ? "+=1" : "-=1",
          duration: 3.8 + index * 0.45,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      },
    );
  }, { scope: root });

  useEffect(() => {
    if (isReady && timelineRef.current) {
      timelineRef.current.play();
    }
  }, [isReady]);

  return (
    <section
      ref={root}
      data-hero
      className="reference-hero relative flex min-h-[min(760px,100svh)] items-center overflow-hidden px-5 pt-20 sm:px-10 lg:px-16"
    >
      <svg
        data-network
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 1600 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g className="reference-network-lines">
          <path d="M50 145 L170 96 L264 104 L338 228 L492 164 L582 286 L730 240" />
          <path d="M1100 70 L1216 150 L1302 112 L1418 244 L1540 218" />
          <path d="M78 650 L198 626 L270 716 L402 605 L500 664" />
          <path d="M1048 668 L1178 594 L1280 690 L1390 578 L1570 650" />
        </g>
        {networkPoints.map(([cx, cy], index) => (
          <circle
            data-network-node
            key={`${cx}-${cy}`}
            className="reference-network-node"
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 2 : 1.1}
          />
        ))}
      </svg>
      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        <p className="eyebrow-label text-ai">
          AMAN KLIK AI / DIGITAL SAFETY COMPANION
        </p>
        <h1 className="reference-hero-title mt-7 text-balanced">
          <span data-hero-line className="block overflow-hidden pb-[0.1em]">
            <span className="block">Pesan mencurigakan?</span>
          </span>
          <span data-hero-line className="block overflow-hidden pb-[0.1em]">
            <span className="block">Jangan langsung percaya.</span>
          </span>
        </h1>
        <div data-hero-support className="mx-auto mt-6 max-w-3xl">
          <p className="text-lg leading-8 text-ink-soft sm:text-xl">
            AmanKlik membantu kamu membaca pola manipulasi, struktur tautan, dan
            konteks pesan sebelum kamu mengeklik, membalas, atau mengirim uang.
          </p>
          <MotionButton
            dataHeroCta
            arrow
            className="reference-hero-cta editorial-button mt-9"
            href="/scan"
          >
            Periksa pesan
          </MotionButton>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Tidak membuka tautan tujuan · Skor dijelaskan dengan bukti
          </p>
        </div>
      </div>
    </section>
  );
}

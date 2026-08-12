"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import { MotionButton } from "@/components/ui/animated-button";

export function UrlAnatomySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const prevSection = root.current?.previousElementSibling;
    if (prevSection) {
      ScrollTrigger.create({
        trigger: prevSection,
        start: "bottom bottom",
        endTrigger: root.current,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });
    }

    gsap.from("[data-headline-line]", {
      y: 80,
      opacity: 0,
      rotateZ: 2,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: root.current,
        start: "top 70%",
      },
    });

    const urlParts = gsap.utils.toArray("[data-url-part]", root.current);
    gsap.from(urlParts, {
      y: 60,
      opacity: 0,
      scale: 0.95,
      stagger: 0.08,
      duration: 1,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: root.current,
        start: "top 60%",
      },
    });

    gsap.to("[data-url-domain]", {
      boxShadow: "0 0 50px rgba(255,51,51,0.5)",
      yoyo: true,
      repeat: -1,
      duration: 1.5,
      ease: "sine.inOut",
    });

  }, { scope: root });

  return (
    <section
      ref={root}
      data-url-anatomy
      className="relative z-20 overflow-hidden rounded-t-[2.5rem] lg:rounded-t-[4rem] border-t border-white/5 bg-ink px-5 py-24 text-surface shadow-[0_-20px_50px_rgba(0,0,0,0.5)] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-warning">
              02 / Anatomi URL
            </p>
            <h2 className="section-title mt-5 flex flex-col gap-1 overflow-hidden">
              <span data-headline-line className="block">Nama merek bisa ditempel.</span>
              <span data-headline-line className="block">Domain tidak bisa</span>
              <span data-headline-line className="block text-white/50">disamarkan begitu saja.</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#aaa9a2] lg:justify-self-end">
            Baca alamat dari kanan ke kiri. Kata “brand” atau “secure-login” di
            subdomain belum menjadikannya situs resmi.
          </p>
        </div>

        <div className="mt-20 border-y border-white/10 py-16 sm:py-24">
          <div className="flex flex-wrap items-center justify-start lg:justify-center gap-x-1 sm:gap-x-2 gap-y-4 font-mono text-[clamp(1.4rem,4vw,4rem)] tracking-tight leading-[1.2]">
            <span data-url-part="protocol" className="text-[#77776f]">https://</span>
            <span data-url-part="subdomain" className="text-warning">brand.secure-login.</span>
            <span
              data-url-part="domain"
              data-url-domain
              className="relative inline-block rounded-xl bg-risk px-3 py-1 sm:px-4 sm:py-2 font-bold text-white shadow-[0_0_20px_rgba(255,51,51,0.2)]"
            >
              example.net
            </span>
            <span data-url-part="path" className="text-[#77776f]">/account</span>
          </div>

          <div className="mt-12 lg:mt-20 mx-auto flex max-w-4xl flex-wrap justify-between gap-y-6 gap-x-4 font-mono text-[10px] sm:text-xs uppercase tracking-[0.14em] text-[#888880]">
            <span className="text-white/40">Protokol</span>
            <span className="text-warning">Subdomain / Hiasan</span>
            <span className="text-white">Domain Sebenarnya ↑</span>
            <span className="text-white/40">Path</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[#aaa9a2]">
            Contoh memakai domain dokumentasi yang dicadangkan dan tidak pernah
            di-fetch oleh AmanKlik.
          </p>
          <MotionButton
            arrow
            className="bg-surface text-ink hover:bg-white shrink-0"
            href="/scan"
          >
            Coba analisis tautan
          </MotionButton>
        </div>
      </div>
    </section>
  );
}

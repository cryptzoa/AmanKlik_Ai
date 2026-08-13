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

    // 1. Prepare Timelines (Paused)
    // Entrance Animation (play once)
    const entranceTl = gsap.timeline({ paused: true });
    entranceTl.fromTo("[data-headline-line]", 
      { y: 80, opacity: 0, rotateZ: 2 }, 
      { y: 0, opacity: 1, rotateZ: 0, stagger: 0.1, duration: 1, ease: "power4.out" }, 0
    );
    entranceTl.fromTo("[data-url-part]", 
      { y: 60, opacity: 0, scale: 0.95 }, 
      { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 1, ease: "back.out(1.5)" }, 0.2
    );

    // Breakout Scrollytelling Animation (Scrubbed)
    const isMobile = window.innerWidth < 768;
    const targetGap = isMobile ? "1rem" : "3rem";

    const breakoutTl = gsap.timeline({ paused: true });
    breakoutTl.fromTo("[data-url-container]", 
      { columnGap: "0px" }, 
      { columnGap: targetGap, ease: "power2.out" }, 0
    );
    breakoutTl.fromTo("[data-url-label]", 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.1, ease: "back.out(1.5)" }, 0
    );

    // 2. Main Pin & ScrollTrigger
    const prevSection = root.current?.previousElementSibling;
    if (prevSection) {
      ScrollTrigger.create({
        trigger: prevSection,
        start: "bottom bottom",
        endTrigger: root.current,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          // Play entrance when section starts sliding in (10% progress)
          if (self.progress > 0.1) {
            entranceTl.play();
          }
          
          // Scrub breakout animation between 45% and 85% of the slide
          const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(0.45, 0.85, 0, 1, self.progress));
          breakoutTl.progress(p);
        }
      });
    }

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
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">
              02 / Anatomi URL
            </p>
            <h2 className="mt-8 flex flex-col text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-white">
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left">Nama merek bisa ditempel.</span></div>
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left">Domain tidak bisa</span></div>
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left text-white/40">disamarkan begitu saja.</span></div>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="text-lg leading-relaxed text-[#aaa9a2]">
              Baca alamat dari kanan ke kiri. Kata “brand” atau “secure-login” di
              subdomain belum menjadikannya situs resmi.
            </p>
          </div>
        </div>

        <div className="mt-20 border-y border-white/10 py-20 sm:py-32">
          <div 
            data-url-container
            className="flex flex-wrap items-center justify-start lg:justify-center font-mono text-[clamp(1.15rem,3.5vw,4rem)] tracking-tight leading-[1.2]"
            style={{ columnGap: "0px", rowGap: "64px" }}
          >
            {/* Protocol */}
            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-[#77776f]">https://</span>
              <span className="absolute top-[calc(100%+2rem)] whitespace-nowrap text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.14em]" data-url-label>Protokol</span>
            </div>

            {/* Subdomain */}
            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-ai">brand.secure-login.</span>
              <span className="absolute top-[calc(100%+2rem)] whitespace-nowrap text-[10px] sm:text-xs text-ai uppercase tracking-[0.14em]" data-url-label>Subdomain / Hiasan</span>
            </div>

            {/* Mobile/Tablet Break */}
            <div className="w-full lg:hidden" />

            {/* Domain */}
            <div className="relative flex flex-col items-center" data-url-group>
              <span
                data-url-part
                data-url-domain
                className="relative inline-block rounded-xl bg-risk px-2 py-1 sm:px-4 sm:py-2 font-bold text-white shadow-[0_0_20px_rgba(255,51,51,0.2)]"
              >
                example.net
              </span>
              <span className="absolute top-[calc(100%+2rem)] whitespace-nowrap text-[10px] sm:text-xs text-white uppercase tracking-[0.14em]" data-url-label>Domain Sebenarnya ↑</span>
            </div>

            {/* Path */}
            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-[#77776f]">/account</span>
              <span className="absolute top-[calc(100%+2rem)] whitespace-nowrap text-[10px] sm:text-xs text-white/40 uppercase tracking-[0.14em]" data-url-label>Path</span>
            </div>
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

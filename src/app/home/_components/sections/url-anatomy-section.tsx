"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNearViewport } from "@/components/site/use-near-viewport";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import { MotionButton } from "@/components/ui/animated-button";

export function UrlAnatomySection() {
  const root = useRef<HTMLElement>(null);
  const motionReady = useNearViewport(root);

  useGSAP(() => {
    if (!motionReady) return;
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    const buildTimelines = (targetGap: string) => {
      const entrance = gsap.timeline({ paused: true });
      entrance.fromTo("[data-headline-line]",
        { y: 80, opacity: 0, rotateZ: 2 },
        { y: 0, opacity: 1, rotateZ: 0, stagger: 0.1, duration: 1, ease: "power4.out" }, 0,
      ).fromTo("[data-url-part]",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 1, ease: "back.out(1.5)" }, 0.2,
      );

      const breakout = gsap.timeline({ paused: true });
      breakout.fromTo("[data-url-container]",
        { columnGap: "0px" },
        { columnGap: targetGap, ease: "power2.out" }, 0,
      ).fromTo("[data-url-label]",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "back.out(1.5)" }, 0,
      );

      return { entrance, breakout };
    };

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const { entrance, breakout } = buildTimelines("3rem");
      const prevSection = root.current?.previousElementSibling;
      if (!prevSection) return;

      ScrollTrigger.create({
        trigger: prevSection,
        start: "bottom bottom",
        endTrigger: root.current,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
          if (self.progress > 0.1) entrance.play();
          breakout.progress(gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(0.45, 0.85, 0, 1, self.progress),
          ));
        },
      });

      gsap.to("[data-url-domain]", {
        boxShadow: "0 0 50px rgba(255,51,51,0.5)",
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });

    });

    media.add("(max-width: 767px)", () => {
      const { entrance, breakout } = buildTimelines("1rem");
      const prevSection = root.current?.previousElementSibling;
      if (!prevSection) return;

      ScrollTrigger.create({
        trigger: prevSection,
        start: "bottom bottom",
        endTrigger: root.current,
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.02) entrance.play();
          breakout.progress(gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(0.08, 0.42, 0, 1, self.progress),
          ));
        },
      });
    });

    return () => media.revert();
  }, {
    dependencies: [motionReady],
    revertOnUpdate: true,
    scope: root,
  });

  return (
    <section
      ref={root}
      data-url-anatomy
      className="relative z-20 -mt-28 overflow-hidden rounded-t-[2.5rem] border-t border-white/5 bg-ink px-5 py-24 text-surface shadow-[0_-20px_50px_rgba(0,0,0,0.5)] sm:px-10 sm:py-32 md:mt-0 lg:rounded-t-[4rem] lg:px-16"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai-on-dark">
              02 / Bagian-bagian tautan
            </p>
            <h2 className="mt-8 flex flex-col text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-white">
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left">Nama merek bisa ditempel.</span></div>
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left">Domain tidak bisa</span></div>
              <div className="overflow-hidden pb-1"><span data-headline-line className="block origin-bottom-left text-white/40">disamarkan begitu saja.</span></div>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 lg:pb-3">
            <p className="text-lg leading-relaxed text-[#aaa9a2]">
              Cari alamat utamanya. Adanya kata “bri.co.id” di bagian depan
              alamat belum menjadikannya situs resmi bank tersebut.
            </p>
          </div>
        </div>

        <div className="mt-20 border-y border-white/10 py-20 sm:py-32">
          <div 
            data-url-container
            className="flex flex-wrap items-center justify-start lg:justify-center font-mono text-[clamp(1.15rem,3.5vw,4rem)] tracking-tight leading-[1.2]"
            style={{ columnGap: "0px", rowGap: "64px" }}
          >
            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-[#aaa9a2]">https://</span>
              <div className="absolute top-[calc(100%+0.5rem)] flex flex-col items-center z-10" data-url-label>
                <div className="w-[1px] h-3 bg-white/20 mb-1.5"></div>
                <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] leading-none sm:text-[11px] md:backdrop-blur-md">
                  <span className="whitespace-nowrap font-mono text-[#aaa9a2] uppercase tracking-[0.2em] font-semibold">Protokol</span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-ai-on-dark">ib.bri.co.id.</span>
              <div className="absolute top-[calc(100%+0.5rem)] flex flex-col items-center z-10" data-url-label>
                <div className="w-[1px] h-3 bg-ai/40 mb-1.5"></div>
                <div className="flex items-center justify-center rounded-full border border-ai/30 bg-ai/10 px-3 py-1.5 text-[10px] leading-none shadow-[0_0_15px_rgba(99,91,255,0.15)] sm:text-[11px] md:backdrop-blur-md">
                  <span className="whitespace-nowrap font-mono text-ai-on-dark uppercase tracking-[0.2em] font-semibold">Subdomain / Hiasan</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:hidden" />

            <div className="relative flex flex-col items-center" data-url-group>
              <span
                data-url-part
                data-url-domain
                className="relative inline-block rounded-xl bg-risk-text px-2 py-1 sm:px-4 sm:py-2 font-bold text-white shadow-[0_0_20px_rgba(255,51,51,0.2)]"
              >
                layanan-pembaruan.example
              </span>
              <div className="absolute top-[calc(100%+0.5rem)] flex flex-col items-center z-10" data-url-label>
                <div className="w-[1px] h-3 bg-risk/50 mb-1.5"></div>
                <div className="flex items-center justify-center rounded-full border border-risk/40 bg-risk/10 px-3 py-1.5 text-[10px] leading-none shadow-[0_0_15px_rgba(255,51,51,0.2)] sm:text-[11px] md:backdrop-blur-md">
                  <span className="whitespace-nowrap font-mono text-risk-on-dark uppercase tracking-[0.2em] font-bold">Domain Sebenarnya</span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col items-center" data-url-group>
              <span data-url-part className="text-[#aaa9a2]">/login</span>
              <div className="absolute top-[calc(100%+0.5rem)] flex flex-col items-center z-10" data-url-label>
                <div className="w-[1px] h-3 bg-white/20 mb-1.5"></div>
                <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] leading-none sm:text-[11px] md:backdrop-blur-md">
                  <span className="whitespace-nowrap font-mono text-[#aaa9a2] uppercase tracking-[0.2em] font-semibold">Halaman tujuan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-[#aaa9a2]">
            Contoh memakai akhiran <code>.example</code> yang khusus disediakan
            untuk dokumentasi. AmanKlik tidak membuka situs tujuan.
          </p>
          <MotionButton
            arrow
            className="bg-surface text-ink hover:bg-white shrink-0"
            href="/scan"
          >
            Periksa tautan
          </MotionButton>
        </div>
      </div>
    </section>
  );
}

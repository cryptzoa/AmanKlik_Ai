"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionButton } from "@/components/ui/animated-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ClosingCtaSection() {
  const root = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    if (!root.current) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      const pipelineContainer = document.querySelector("[data-pipeline-container]");
      const triggerEl = pipelineContainer || root.current;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: pipelineContainer ? "top 40%" : "top 60%",
          end: pipelineContainer ? "bottom 10%" : "top 10%",
          scrub: 0.5,
        },
      });

      if (pipelineContainer) {
        tl.to({}, { duration: 0.8 }, 0);
      }

      const startTime = pipelineContainer ? 0.7 : 0;
      tl.to(subtitleRef.current, { color: "rgba(255,255,255,0.7)", ease: "power3.inOut", duration: 0.3 }, startTime)
        .to(titleRef.current, { color: "white", ease: "power3.inOut", duration: 0.3 }, startTime)
        .to(descRef.current, { color: "rgba(255,255,255,0.8)", ease: "power3.inOut", duration: 0.3 }, startTime)
        .to(borderRef.current, { borderColor: "rgba(255,255,255,0.3)", ease: "power3.inOut", duration: 0.3 }, startTime)
        .to(".btn-text-anim", { color: "#161b22", backgroundColor: "white", ease: "power3.inOut", duration: 0.3 }, startTime);
    });

    return () => media.revert();
  }, { scope: root });

  return (
    <section ref={root} className="relative overflow-hidden bg-transparent z-10 px-5 py-24 text-ink sm:px-10 sm:py-32 lg:px-16 flex flex-col items-center text-center">
      <div className="relative z-10 mx-auto w-full max-w-[1320px] flex flex-col items-center">
        <p ref={subtitleRef} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Sebelum bertindak
        </p>
        
        <h2 ref={titleRef} className="mt-8 text-[4rem] leading-[0.85] tracking-[-0.07em] font-extrabold sm:text-[7rem] lg:text-[9rem] max-w-[1200px] mx-auto text-balance">
          Jangan <br/> Buru-Buru.
        </h2>
        
        <p ref={descRef} className="mt-10 max-w-xl text-lg leading-relaxed text-muted mx-auto">
          Kalau pesannya bikin ragu, periksa pesanmu tanpa perlu membuka tautan aslinya.
        </p>

        <div ref={borderRef} className="mt-16 sm:mt-24 w-full border-t border-ink/10 pt-12 sm:pt-16 flex justify-center">
          <div 
            className="btn-text-anim inline-flex bg-ink text-white rounded-full transition-transform duration-300 hover:scale-105"
            style={{ "--ai": "var(--ink)" } as React.CSSProperties}
          >
            <MotionButton
              arrow
              className="min-h-16 px-8 text-lg sm:text-xl font-bold bg-transparent text-inherit"
              href="/scan"
            >
              Mulai periksa
            </MotionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

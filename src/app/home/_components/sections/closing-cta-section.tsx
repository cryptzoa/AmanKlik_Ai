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
  const btnRef = useRef<any>(null); // MotionButton wrapper

  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;

    if (!root.current) return;

    const pipelineContainer = document.querySelector("[data-pipeline-container]");
    
    // Fallback trigger if pipeline is not found (though it should be since they render together)
    const triggerEl = pipelineContainer || root.current;
    
    // We synchronize the CTA explosion timeline EXACTLY with the pipeline's dot timeline!
    // This prevents any visual desync during rapid scrolling.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerEl,
        start: pipelineContainer ? "top 40%" : "top 60%", 
        end: pipelineContainer ? "bottom 10%" : "top 10%",
        scrub: 0.5,
      }
    });

    // Phase 1: Wait for the dot to finish traveling (takes first 80% of the timeline)
    if (pipelineContainer) {
      tl.to({}, { duration: 0.8 }, 0);
    }

    // Phase 2: Explode and change text colors (overlaps with the end of the dot's movement)
    const startTime = pipelineContainer ? 0.7 : 0;
    
    tl.to(subtitleRef.current, { color: "rgba(255,255,255,0.7)", ease: "power3.inOut", duration: 0.3 }, startTime)
      .to(titleRef.current, { color: "white", ease: "power3.inOut", duration: 0.3 }, startTime)
      .to(descRef.current, { color: "rgba(255,255,255,0.8)", ease: "power3.inOut", duration: 0.3 }, startTime)
      .to(borderRef.current, { borderColor: "rgba(255,255,255,0.3)", ease: "power3.inOut", duration: 0.3 }, startTime)
      .to(".btn-text-anim", { color: "#161b22", backgroundColor: "white", ease: "power3.inOut", duration: 0.3 }, startTime);
  }, { scope: root });

  return (
    <section ref={root} className="relative overflow-hidden bg-transparent z-10 px-5 py-24 text-ink sm:px-10 sm:py-32 lg:px-16">
      
      <div className="relative z-10 mx-auto max-w-[1320px]">
        <p ref={subtitleRef} className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Sebelum bertindak
        </p>
        <h2 ref={titleRef} className="display-title mt-6 max-w-5xl">
          Kalau pesannya bikin ragu, jangan buru-buru.
        </h2>
        <div ref={borderRef} className="mt-12 flex flex-col gap-6 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p ref={descRef} className="max-w-xl text-lg leading-8 text-muted">
            Gunakan contoh sintetis atau periksa pesanmu tanpa membuka tautan
            tujuan.
          </p>
          <div className="btn-text-anim min-h-14 bg-ink text-white rounded-full inline-flex">
            <MotionButton
              arrow
              className="min-h-14 bg-transparent text-inherit"
              href="/scan"
            >
              Periksa dengan AmanKlik
            </MotionButton>
          </div>
        </div>
      </div>
    </section>
  );
}

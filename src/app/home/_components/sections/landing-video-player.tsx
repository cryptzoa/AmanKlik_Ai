"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PromoStage = dynamic(
  () => import("@/app/promo/_components/promo-stage").then((module) => module.PromoStage),
  { ssr: false },
);

export function LandingVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);
  const visibleRef = useRef(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [masterTl] = useState(() =>
    gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 0.5,
    })
  );

  useEffect(() => {
    const portraitQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsPortrait(portraitQuery.matches);

    handleChange();
    portraitQuery.addEventListener("change", handleChange);
    return () => portraitQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 767px)");
    let hasStarted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.35;
          if (visibleRef.current && !smallScreen.matches) {
            setShouldRender(true);
          }
          if (reducedMotion.matches) {
            masterTl.pause(0);
            continue;
          }
          if (visibleRef.current && readyRef.current) {
            if (!hasStarted) {
              hasStarted = true;
              masterTl.play();
            } else if (masterTl.paused()) {
              masterTl.play();
            }
          } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            masterTl.pause(0).clear();
            readyRef.current = false;
            hasStarted = false;
            setShouldRender(false);
          }
        }
      },
      {
        threshold: [0, 0.35, 0.5],
      }
    );

    const handleMotionChange = () => {
      if (reducedMotion.matches) masterTl.pause(0);
      else if (visibleRef.current && readyRef.current) masterTl.play();
    };

    reducedMotion.addEventListener("change", handleMotionChange);
    observer.observe(target);
    return () => {
      reducedMotion.removeEventListener("change", handleMotionChange);
      observer.disconnect();
    };
  }, [masterTl]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-[#111111] pointer-events-none select-none"
    >
      {shouldRender ? (
        <PromoStage
          timeline={masterTl}
          ratio={isPortrait ? "9x16" : "16x9"}
          cut="master"
          fitMode="cover"
          onReady={() => {
            readyRef.current = true;
            if (
              visibleRef.current &&
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ) {
              masterTl.play();
            }
          }}
        />
      ) : isPortrait ? (
        <div className="pointer-events-auto relative z-10 flex max-w-[15rem] flex-col items-center px-5 text-center text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            Film AmanKlik
          </p>
          <button
            type="button"
            className="mt-4 min-h-12 rounded-full border border-white/25 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ai-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            onClick={() => setShouldRender(true)}
          >
            Putar film
          </button>
          <p className="mt-3 text-xs leading-5 text-white/55">
            Film dimuat hanya saat kamu memilih memutarnya.
          </p>
        </div>
      ) : null}
    </div>
  );
}

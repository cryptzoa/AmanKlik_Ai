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
    let hasStarted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.25;
          if (visibleRef.current) {
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
          } else {
            masterTl.pause();
            if (!entry.isIntersecting && entry.intersectionRatio === 0) {
              masterTl.seek(0).clear();
              readyRef.current = false;
              hasStarted = false;
              setShouldRender(false);
            }
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5],
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
      ) : null}
    </div>
  );
}

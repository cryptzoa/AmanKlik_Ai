"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PromoStage } from "@/app/promo/_components/promo-stage";

gsap.registerPlugin(useGSAP);

export function LandingVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [masterTl] = useState(() =>
    gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 0.5,
    })
  );

  // Responsive ratio detection (Mobile < 768px -> 9:16 portrait, Desktop -> 16:9 landscape)
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Autoplay and loop when scrolled into section via IntersectionObserver
  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    let hasStarted = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            if (!hasStarted) {
              hasStarted = true;
              masterTl.play();
            } else if (masterTl.paused()) {
              masterTl.play();
            }
          } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            // Pause if completely out of view to save CPU
            if (masterTl.isActive()) {
              masterTl.pause();
            }
          }
        }
      },
      {
        threshold: [0, 0.25, 0.5],
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [masterTl]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-[#111111] pointer-events-none select-none"
      aria-label="Area Film Animasi AmanKlik AI"
    >
      <PromoStage
        timeline={masterTl}
        ratio={isPortrait ? "9x16" : "16x9"}
        cut="master"
        fitMode="cover"
        onReady={() => {}}
      />
    </div>
  );
}

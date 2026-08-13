"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useTransition } from "./transition-context";

export function TransitionOverlay() {
  const { registerAnimateOut } = useTransition();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    registerAnimateOut(async () => {
      if (!containerRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layers = containerRef.current.querySelectorAll(".transition-layer");

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(layers, { xPercent: -100 });

      await new Promise<void>((resolve) => {
        gsap.to(layers, {
          xPercent: 0,
          duration: 0.28,
          ease: "expo.inOut",
          stagger: 0.035,
          onComplete: resolve
        });
      });
    });
  }, [registerAnimateOut]);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      containerRef.current.style.opacity = "0";
      return;
    }

    const container = containerRef.current;
    const layers = container.querySelectorAll(".transition-layer");
    gsap.to(layers, {
      xPercent: 100,
      duration: 0.34,
      ease: "expo.inOut",
      stagger: { each: 0.035, from: "end" },
      onComplete: () => gsap.set(container, { opacity: 0 }),
    });
    return () => {
      gsap.killTweensOf(layers);
    };
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] pointer-events-none opacity-0"
    >
      <div className="transition-layer absolute inset-0 border-r border-white/5 bg-ink-soft" style={{ transform: "translate3d(-100%, 0, 0)" }} />

      <div className="transition-layer absolute inset-0 bg-ink" style={{ transform: "translate3d(-100%, 0, 0)" }} />
    </div>
  );
}

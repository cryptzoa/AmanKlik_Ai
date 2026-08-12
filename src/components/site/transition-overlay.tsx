"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransition } from "./transition-context";

export function TransitionOverlay() {
  const { registerAnimateOut } = useTransition();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const isFirstLoad = useRef(true);

  useGSAP(() => {
    if (containerRef.current) {
      const layers = containerRef.current.querySelectorAll(".transition-layer");
      gsap.set(layers, { xPercent: -100 });
    }
  }, { scope: containerRef });

  useEffect(() => {
    registerAnimateOut(async () => {
      if (!containerRef.current) return;

      const layers = containerRef.current.querySelectorAll(".transition-layer");

      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set(layers, { xPercent: -100 });

      await new Promise<void>((resolve) => {
        gsap.to(layers, {
          xPercent: 0,
          duration: 0.65,
          ease: "expo.inOut",
          stagger: 0.08,
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

    const layers = containerRef.current.querySelectorAll(".transition-layer");

    gsap.to(layers, {
      xPercent: 100,
      duration: 0.65,
      ease: "expo.inOut",
      stagger: { each: 0.08, from: "end" },
      delay: 0.1,
      onComplete: () => {
        gsap.set(containerRef.current, { opacity: 0 });
      }
    });
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] pointer-events-none opacity-0"
    >
      <div className="transition-layer absolute inset-0 bg-ink-soft border-r border-white/5" />

      <div className="transition-layer absolute inset-0 bg-ink" />
    </div>
  );
}

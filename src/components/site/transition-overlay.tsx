"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useTransition } from "./transition-context";

export function TransitionOverlay() {
  const { registerAnimator } = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const isActiveRef = useRef(false);

  const cover = useCallback(async () => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const container = containerRef.current;
    const layers = container.querySelectorAll(".transition-layer");
    gsap.killTweensOf(layers);
    isActiveRef.current = true;
    container.dataset.transitionState = "covering";
    container.style.pointerEvents = "auto";
    gsap.set(container, { opacity: 1 });
    gsap.set(layers, { xPercent: -100 });

    await new Promise<void>((resolve) => {
      gsap.to(layers, {
        xPercent: 0,
        duration: 0.42,
        ease: "power3.inOut",
        stagger: 0.045,
        onComplete: () => {
          container.dataset.transitionState = "covered";
          resolve();
        },
      });
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }, []);

  const reveal = useCallback(async () => {
    if (!containerRef.current || !isActiveRef.current) return;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const container = containerRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      isActiveRef.current = false;
      container.dataset.transitionState = "idle";
      container.style.pointerEvents = "none";
      gsap.set(container, { opacity: 0 });
      return;
    }

    const layers = container.querySelectorAll(".transition-layer");
    gsap.killTweensOf(layers);
    container.dataset.transitionState = "revealing";

    await new Promise<void>((resolve) => {
      gsap.to(layers, {
        xPercent: 100,
        duration: 0.52,
        ease: "power3.inOut",
        stagger: { each: 0.045, from: "end" },
        onComplete: () => {
          isActiveRef.current = false;
          container.dataset.transitionState = "idle";
          container.style.pointerEvents = "none";
          gsap.set(container, { opacity: 0 });
          resolve();
        },
      });
    });
  }, []);

  useEffect(() => {
    registerAnimator({ cover, reveal });
    return () => {
      registerAnimator(null);
    };
  }, [cover, registerAnimator, reveal]);

  return (
    <div
      ref={containerRef}
      data-transition-overlay
      data-transition-state="idle"
      className="fixed inset-0 z-[9998] pointer-events-none opacity-0"
    >
      <div className="transition-layer absolute inset-0 border-r border-white/5 bg-ink-soft will-change-transform" style={{ transform: "translate3d(-100%, 0, 0)" }} />

      <div className="transition-layer absolute inset-0 bg-ink will-change-transform" style={{ transform: "translate3d(-100%, 0, 0)" }} />
    </div>
  );
}

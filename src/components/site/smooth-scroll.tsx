"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    if (typeof window.matchMedia !== "function") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([lenisModule, gsapModule, scrollTriggerModule]) => {
      if (cancelled) return;
      const Lenis = lenisModule.default;
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const progress = document.querySelector<HTMLElement>("[data-scroll-progress-bar]");
      const lenis = new Lenis({
        autoRaf: false,
        duration: 1.05,
        easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });
      const update = (time: number) => lenis.raf(time * 1000);
      const syncScroll = ({ progress: scrollProgress }: { progress: number }) => {
        ScrollTrigger.update();
        if (progress) gsap.set(progress, { scaleX: scrollProgress });
      };
      lenis.on("scroll", syncScroll);
      gsap.ticker.add(update);
      const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
      cleanup = () => {
        window.cancelAnimationFrame(refreshFrame);
        gsap.ticker.remove(update);
        lenis.off("scroll", syncScroll);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      aria-hidden="true"
    >
      <span
        data-scroll-progress-bar
        className="block h-full origin-left scale-x-0 bg-ai"
      />
    </div>
  );
}

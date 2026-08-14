"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function SmoothScroll() {
  const pathname = usePathname();
  const scrollTriggerRef = useRef<{ refresh: () => void } | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let starting = false;
    let cleanup: (() => void) | undefined;

    function start() {
      if (reducedMotion.matches || cleanup || starting) return;
      starting = true;

      void Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]).then(([lenisModule, gsapModule, scrollTriggerModule]) => {
        if (cancelled || reducedMotion.matches) {
          starting = false;
          return;
        }

        const Lenis = lenisModule.default;
        const gsap = gsapModule.default;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        scrollTriggerRef.current = ScrollTrigger;

        const lenis = new Lenis({
          autoRaf: false,
          duration: 1.05,
          easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
        });
        const update = (time: number) => lenis.raf(time * 1000);
        const syncScroll = ({ progress }: { progress: number }) => {
          ScrollTrigger.update();
          const bar = document.querySelector<HTMLElement>(
            "[data-scroll-progress-bar]",
          );
          if (bar) gsap.set(bar, { scaleX: progress });
        };

        lenis.on("scroll", syncScroll);
        gsap.ticker.add(update);
        // Lenis receives the same GSAP ticker as every ScrollTrigger timeline.
        // This avoids a competing requestAnimationFrame loop.
        gsap.ticker.lagSmoothing(0);
        const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

        cleanup = () => {
          window.cancelAnimationFrame(refreshFrame);
          gsap.ticker.remove(update);
          lenis.off("scroll", syncScroll);
          lenis.destroy();
          scrollTriggerRef.current = null;
          cleanup = undefined;
        };
        starting = false;
      }).catch(() => {
        starting = false;
      });
    }

    function handleMotionChange() {
      if (reducedMotion.matches) cleanup?.();
      else start();
    }

    reducedMotion.addEventListener("change", handleMotionChange);
    start();

    return () => {
      cancelled = true;
      reducedMotion.removeEventListener("change", handleMotionChange);
      cleanup?.();
    };
  }, []);

  useEffect(() => {
    const refreshFrame = window.requestAnimationFrame(() => {
      scrollTriggerRef.current?.refresh();
    });
    return () => window.cancelAnimationFrame(refreshFrame);
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

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

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

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      gsap.ticker.remove(update);
      lenis.off("scroll", syncScroll);
      lenis.destroy();
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5" aria-hidden="true">
      <span data-scroll-progress-bar className="block h-full origin-left scale-x-0 bg-risk" />
    </div>
  );
}

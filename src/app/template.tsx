"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = containerRef.current;
    let cancelled = false;
    let killTween: (() => void) | undefined;
    void import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      gsap.fromTo(target, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", clearProps: "all" });
      killTween = () => gsap.killTweensOf(target);
    });
    return () => {
      cancelled = true;
      killTween?.();
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

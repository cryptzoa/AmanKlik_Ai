"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ResultDisclaimer({ children }: { children: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.55,
      scrollTrigger: { trigger: root.current, start: "top 92%", once: true },
    });
  }, { scope: root });
  return (
    <footer
      ref={root}
      className="border-t border-line py-10 text-sm leading-6 text-muted"
    >
      {children}
    </footer>
  );
}

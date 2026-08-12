"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ContextSection({ preview }: { preview: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
    });
  }, { scope: root });
  return (
    <section
      ref={root}
      className="border-t border-line py-16"
      aria-labelledby="preview-heading"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        03 / Context
      </p>
      <h2 id="preview-heading" className="section-title mt-4">
        Konteks yang diperiksa
      </h2>
      <p className="mt-7 whitespace-pre-wrap break-words border-l-4 border-ai bg-surface p-6 text-sm leading-7 text-muted shadow-[10px_10px_0_var(--ai-soft)]">
        {preview}
      </p>
    </section>
  );
}

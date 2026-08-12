"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function TransferableRuleSection({ rule }: { rule: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.5,
      delay: 0.12,
      ease: "power3.out",
    });
  }, { scope: root });
  return (
    <section
      ref={root}
      className="border-b border-line py-8"
      aria-labelledby="transferable-rule-title"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
        Aturan yang dibawa pulang
      </p>
      <h3
        id="transferable-rule-title"
        className="mt-3 max-w-3xl text-2xl font-semibold leading-snug"
      >
        {rule}
      </h3>
    </section>
  );
}

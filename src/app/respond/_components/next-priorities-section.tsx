"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ResponseStepCards } from "@/app/respond/_components/response-step-cards";
import type { ResponseStep } from "@/lib/response/types";

gsap.registerPlugin(useGSAP);

export function NextPrioritiesSection({ steps }: { steps: ResponseStep[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    gsap.from(root.current, {
      opacity: 0.82,
      duration: 0.45,
      delay: 0.12,
      ease: "power3.out",
    });
  }, { scope: root });
  return (
    <section ref={root} aria-labelledby="response-next-priorities">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
            Masih sekarang
          </p>
          <h3
            id="response-next-priorities"
            className="mt-2 text-xl font-semibold"
          >
            Selesaikan dua prioritas berikutnya.
          </h3>
        </div>
        <span className="text-xs text-muted">
          Tiga langkah utama tampil tanpa perlu membuka menu.
        </span>
      </div>
      <ResponseStepCards steps={steps} startAt={2} />
    </section>
  );
}

"use client";

import { useRef } from "react";
import { TransitionLink as Link } from "@/components/site/transition-link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseItem } from "@/app/investigate/_components/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SavedCasesSection({ cases }: { cases: CaseItem[] }) {
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
    gsap.from("[data-case-card]", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.58,
      scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
    });
  }, { scope: root });

  return (
    <section ref={root} aria-labelledby="case-list-heading">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
        Kasus tersimpan
      </p>
      <h2
        id="case-list-heading"
        className="mt-4 text-4xl font-semibold tracking-[-0.05em]"
      >
        Perbandingan sebelumnya
      </h2>
      <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
        {cases.length
          ? cases.map((item) => (
            <Link
              key={item.id}
              data-case-card
              prefetch={false}
              className="lift-link bg-surface p-6 hover:bg-ai-soft sm:p-8"
              href={`/investigate/${item.id}`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs uppercase text-muted">
                  {item.scanCount} artefak unik
                </span>
                <span className="font-mono text-3xl font-semibold">
                  {item.finalScore}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {item.summary}
              </p>
            </Link>
          ))
          : (
            <div className="col-span-full bg-surface p-8 text-muted">
              Belum ada perbandingan bukti di sesi ini.
            </div>
          )}
      </div>
    </section>
  );
}

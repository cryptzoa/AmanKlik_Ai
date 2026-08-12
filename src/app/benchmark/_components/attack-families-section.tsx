"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AdversarialSummary } from "@/lib/evaluation/adversarial-runner";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AttackFamiliesSection(
  { families }: { families: AdversarialSummary["byFamily"] },
) {
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
    gsap.from("[data-family-card]", {
      autoAlpha: 0,
      y: 28,
      stagger: 0.07,
      duration: 0.55,
      scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
    });
  }, { scope: root });

  return (
    <section
      ref={root}
      className="grid gap-8 border-b border-line py-14 lg:grid-cols-[0.35fr_0.65fr]"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
          Attack families
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
          Tahan terhadap variasi input
        </h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Angka ini hanya menggambarkan fixture sintetis di repository. Bukan
          klaim akurasi universal atau probabilitas dunia nyata.
        </p>
      </div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
        {families.map((family) => (
          <article
            key={family.family}
            data-family-card
            className="bg-surface p-6"
          >
            <p className="font-mono text-xs uppercase text-muted">
              {family.family.replaceAll("_", " ")}
            </p>
            <p className="mt-5 font-mono text-4xl font-semibold">
              {family.passed}/{family.total}
            </p>
            <div className="mt-4 h-2 bg-line">
              <div
                className="h-full bg-ai"
                style={{
                  width: `${
                    family.total ? (family.passed / family.total) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

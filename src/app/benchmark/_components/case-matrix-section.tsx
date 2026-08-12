"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { AdversarialCaseResult } from "@/lib/evaluation/adversarial-runner";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function CaseMatrixSection(
  { cases }: { cases: AdversarialCaseResult[] },
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
  }, { scope: root });

  return (
    <section ref={root} className="py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
            Case matrix
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">
            Setiap kegagalan terlihat
          </h2>
        </div>
        <code className="text-xs text-muted">pnpm eval:adversarial</code>
      </div>
      <div className="mt-8 overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-ink text-surface">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Family</th>
              <th className="p-4">Expected</th>
              <th className="p-4">Detected</th>
              <th className="p-4 text-right">Score</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="p-4 font-mono">{item.id}</td>
                <td className="p-4">{item.family.replaceAll("_", " ")}</td>
                <td className="p-4 text-muted">{item.expected}</td>
                <td className="p-4 text-muted">
                  {item.detectedCategories.join(", ") || "—"}
                </td>
                <td className="p-4 text-right font-mono">{item.score}</td>
                <td
                  className={`p-4 text-right font-semibold ${
                    item.passed ? "text-safe" : "text-risk"
                  }`}
                >
                  {item.passed ? "PASS" : "REVIEW"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

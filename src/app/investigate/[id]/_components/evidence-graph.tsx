"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
import type { EvidenceNode, InvestigationGraph } from "@/types/investigation";

const kindLabels: Record<EvidenceNode["kind"], string> = {
  case: "Kasus",
  scan: "Artefak",
  signal: "Pola berulang",
  domain: "Domain berulang",
};

function sourceLabels(
  node: EvidenceNode,
  sourceById: Map<string, EvidenceNode>,
): string {
  const labels = (node.sourceIds ?? []).map((sourceId) =>
    sourceById.get(sourceId)?.label
  ).filter((label): label is string => Boolean(label));
  return labels.join(" · ");
}

export function EvidenceGraph({ graph }: { graph: InvestigationGraph }) {
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

  const sourceNodes = graph.nodes.filter((node) => node.kind === "scan");
  const sharedNodes = graph.nodes.filter((node) =>
    node.kind === "signal" || node.kind === "domain"
  );
  const sourceById = new Map(sourceNodes.map((node) => [node.id, node]));

  return (
    <section
      ref={root}
      className="border-y border-line py-10"
      aria-labelledby="evidence-graph-heading"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">
          Bukti bersama
        </p>
        <h2
          id="evidence-graph-heading"
          className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl"
        >
          Apa yang benar-benar berulang?
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          AmanKlik hanya menampilkan pola atau domain yang muncul pada minimal
          dua artefak unik. Kesamaan ini membantu verifikasi, tetapi bukan bukti
          identitas pelaku atau kepastian penipuan.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="border border-line bg-surface p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold">Artefak yang dibandingkan</h3>
            <span className="font-mono text-xs text-muted">
              {sourceNodes.length} unik
            </span>
          </div>
          <ul className="mt-5 grid gap-3" aria-label="Artefak unik dalam kasus">
            {sourceNodes.map((node) => (
              <li
                key={node.id}
                className="border-l-2 border-ai bg-ai-soft px-4 py-3"
              >
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  {kindLabels[node.kind]} · {node.riskLevel?.replace("_", " ")}
                </p>
                <p className="mt-1 text-sm font-semibold">{node.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {node.detail}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="border border-line bg-ink p-5 text-surface sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold">
              Bukti yang saling menguatkan
            </h3>
            <span className="font-mono text-xs text-ai-soft">
              {sharedNodes.length} ditemukan
            </span>
          </div>
          {sharedNodes.length
            ? (
              <ul
                className="mt-5 grid gap-3"
                aria-label="Pola dan domain berulang"
              >
                {sharedNodes.map((node) => (
                  <li key={node.id} className="border border-white/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold">{node.label}</p>
                      <span className="rounded-full bg-ai px-3 py-1 font-mono text-xs text-ink">
                        {node.count}/{sourceNodes.length} artefak
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-surface/70">
                      {node.detail}
                    </p>
                    <p className="mt-4 border-t border-white/15 pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ai-soft">
                      Terlihat pada: {sourceLabels(node, sourceById)}
                    </p>
                  </li>
                ))}
              </ul>
            )
            : (
              <div className="mt-5 border border-dashed border-white/30 p-5">
                <p className="font-semibold">Belum ada bukti yang berulang.</p>
                <p className="mt-2 text-sm leading-6 text-surface/70">
                  Artefak tetap bisa diperiksa satu per satu. Tambahkan sumber
                  yang berbeda bila ingin membandingkan pola, domain, atau
                  permintaan yang sama.
                </p>
              </div>
            )}
        </article>
      </div>
    </section>
  );
}

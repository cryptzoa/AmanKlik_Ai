"use client";

import { useMemo, useState } from "react";

import type { EvidenceNode, InvestigationGraph } from "@/types/investigation";

const kindLabels: Record<EvidenceNode["kind"], string> = {
  case: "Kasus",
  scan: "Sumber",
  signal: "Pola",
  domain: "Domain",
  action: "Aksi",
};

const kindColors: Record<EvidenceNode["kind"], string> = {
  case: "#111111",
  scan: "#635bff",
  signal: "#ff4038",
  domain: "#ffb224",
  action: "#19a974",
};

type Position = { x: number; y: number };

function positionsFor(nodes: EvidenceNode[]): Map<string, Position> {
  const positions = new Map<string, Position>();
  const center = { x: 480, y: 300 };
  const groups: Array<{ kinds: EvidenceNode["kind"][]; radius: number; offset: number }> = [
    { kinds: ["case"], radius: 0, offset: 0 },
    { kinds: ["scan"], radius: 135, offset: -Math.PI / 2 },
    { kinds: ["signal", "domain"], radius: 240, offset: Math.PI / 7 },
    { kinds: ["action"], radius: 335, offset: Math.PI / 2 },
  ];

  for (const group of groups) {
    const groupNodes = nodes.filter((node) => group.kinds.includes(node.kind));
    groupNodes.forEach((node, index) => {
      const angle = groupNodes.length === 1 ? group.offset : group.offset + (Math.PI * 2 * index) / groupNodes.length;
      positions.set(node.id, { x: center.x + Math.cos(angle) * group.radius, y: center.y + Math.sin(angle) * group.radius });
    });
  }
  return positions;
}

export function EvidenceGraph({ graph }: { graph: InvestigationGraph }) {
  const [activeKinds, setActiveKinds] = useState<EvidenceNode["kind"][]>(["case", "scan", "signal", "domain", "action"]);
  const [selectedId, setSelectedId] = useState(graph.nodes[0]?.id ?? "");
  const visibleNodes = useMemo(() => graph.nodes.filter((node) => activeKinds.includes(node.kind)), [activeKinds, graph.nodes]);
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = graph.edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  const positions = useMemo(() => positionsFor(graph.nodes), [graph.nodes]);
  const selected = graph.nodes.find((node) => node.id === selectedId) ?? visibleNodes[0];

  function toggleKind(kind: EvidenceNode["kind"]) {
    if (kind === "case") return;
    setActiveKinds((current) => current.includes(kind) ? current.filter((item) => item !== kind) : [...current, kind]);
  }

  return (
    <section data-reveal className="border-y border-line py-10" aria-labelledby="evidence-graph-heading">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Evidence graph</p>
          <h2 id="evidence-graph-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Hubungan antar bukti</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Pilih node untuk membaca konteks. Garis menunjukkan relasi, bukan bukti identitas atau kepastian pelaku.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter jenis bukti">
          {(Object.keys(kindLabels) as EvidenceNode["kind"][]).filter((kind) => kind !== "case").map((kind) => (
            <button key={kind} type="button" aria-pressed={activeKinds.includes(kind)} className={`min-h-11 rounded-full border px-4 text-xs font-semibold ${activeKinds.includes(kind) ? "border-ink bg-ink text-surface" : "border-line bg-surface text-muted"}`} onClick={() => toggleKind(kind)}>{kindLabels[kind]}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="overflow-hidden border border-line bg-surface">
          <svg className="h-auto min-h-[420px] w-full" viewBox="0 0 960 600" role="img" aria-label="Graf hubungan kasus, sumber, pola, domain, dan tindakan">
            <g aria-hidden="true">
              {visibleEdges.map((edge) => {
                const source = positions.get(edge.source);
                const target = positions.get(edge.target);
                if (!source || !target) return null;
                return <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="rgba(17,17,17,.18)" strokeWidth="2" />;
              })}
            </g>
            {visibleNodes.map((node) => {
              const position = positions.get(node.id);
              if (!position) return null;
              const active = selected?.id === node.id;
              return (
                <g key={node.id} role="button" tabIndex={0} aria-label={`${kindLabels[node.kind]}: ${node.label}`} aria-pressed={active} className="cursor-pointer outline-none" transform={`translate(${position.x} ${position.y})`} onClick={() => setSelectedId(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedId(node.id); } }}>
                  <circle r={active ? 27 : 21} fill={kindColors[node.kind]} stroke={active ? "#111111" : "#fffdf7"} strokeWidth={active ? 5 : 3} />
                  {node.count && node.count > 1 ? <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">{node.count}</text> : null}
                  <text x="0" y={active ? 46 : 40} textAnchor="middle" fill="#111111" fontSize="12" fontWeight="700">{node.label.length > 24 ? `${node.label.slice(0, 23)}…` : node.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="border border-line bg-ink p-6 text-surface" aria-live="polite">
          {selected ? <><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai-soft">{kindLabels[selected.kind]}</p><h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em]">{selected.label}</h3><p className="mt-4 text-sm leading-7 text-surface/70">{selected.detail}</p>{selected.count && selected.count > 1 ? <p className="mt-6 border-t border-white/20 pt-4 text-xs">Muncul pada {selected.count} sinyal.</p> : null}</> : <p>Pilih node untuk melihat detail.</p>}
        </aside>
      </div>
    </section>
  );
}

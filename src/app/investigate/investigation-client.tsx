"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { InputType, RiskLevel } from "@/types/analysis";

type ScanItem = { id: string; inputType: InputType; preview: string | null; finalScore: number; riskLevel: RiskLevel; createdAt: string };
type CaseItem = { id: string; title: string; status: string; finalScore: number; riskLevel: RiskLevel; summary: string; scanCount: number; updatedAt: string };

export function InvestigationClient({ scans, cases, initialScanId }: { scans: ScanItem[]; cases: CaseItem[]; initialScanId?: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialScanId && scans.some((scan) => scan.id === initialScanId) ? [initialScanId] : []);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 8 ? current : [...current, id]);
  }

  async function createCase() {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/cases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, scanIds: selected }) });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error(body.error?.message ?? "Kasus belum dapat dibuat.");
      router.push(`/investigate/${body.data.investigation.id}`);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Kasus belum dapat dibuat.");
      setStatus("idle");
    }
  }

  return (
    <div className="grid gap-16">
      <section data-reveal className="grid gap-8 border-b border-line pb-14 xl:grid-cols-[0.38fr_0.62fr]">
        <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Bandingkan bukti</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Cari kesamaan yang berguna.</h2><p className="mt-4 text-sm leading-7 text-muted">Pilih 2–8 artefak berbeda dari sesi ini. Pemeriksaan ulang atas input yang sama tidak dihitung sebagai bukti tambahan.</p></div>
        <div>
          <label className="block text-sm font-semibold">Nama kasus<input className="mt-3 min-h-12 w-full border border-line bg-surface px-4 outline-none focus:border-ai" value={title} maxLength={80} placeholder="Contoh: Pesan kurir dan tautan pembayaran" onChange={(event) => setTitle(event.target.value)} /></label>
          <div className="mt-6 grid gap-2">
            {scans.length ? scans.map((scan) => {
              const active = selected.includes(scan.id);
              return <button key={scan.id} type="button" aria-pressed={active} className={`grid min-h-16 gap-2 border p-4 text-left sm:grid-cols-[100px_1fr_70px] sm:items-center ${active ? "border-ai bg-ai-soft" : "border-line bg-surface hover:border-ink"}`} onClick={() => toggle(scan.id)}><span className="font-mono text-xs uppercase text-muted">{scan.inputType}</span><span className="truncate text-sm"><strong className="mr-2">{scan.riskLevel.replace("_", " ")}</strong>{scan.preview ?? "Tanpa preview"}</span><span className="font-mono text-2xl font-semibold sm:text-right">{scan.finalScore}</span></button>;
            }) : <p className="border border-dashed border-line p-5 text-sm text-muted">Belum ada cukup artefak berbeda. Lakukan beberapa pemeriksaan terlebih dahulu.</p>}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4"><button type="button" disabled={status === "loading" || selected.length < 2 || title.trim().length < 3} className="min-h-12 rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai disabled:opacity-40" onClick={() => void createCase()}>{status === "loading" ? "Menyusun perbandingan…" : `Bandingkan ${selected.length} artefak`}</button><Link className="text-sm font-semibold underline underline-offset-4" href="/scan">Tambah pemeriksaan</Link></div>
          {error ? <p className="mt-4 border border-risk/30 bg-risk-soft p-4 text-sm" role="alert">{error}</p> : null}
        </div>
      </section>

      <section data-reveal aria-labelledby="case-list-heading">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Kasus tersimpan</p><h2 id="case-list-heading" className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Perbandingan sebelumnya</h2>
        <div className="mt-8 grid gap-px border border-line bg-line md:grid-cols-2">
          {cases.length ? cases.map((item) => <Link key={item.id} className="lift-link bg-surface p-6 hover:bg-ai-soft sm:p-8" href={`/investigate/${item.id}`}><div className="flex items-center justify-between gap-4"><span className="font-mono text-xs uppercase text-muted">{item.scanCount} artefak unik</span><span className="font-mono text-3xl font-semibold">{item.finalScore}</span></div><h3 className="mt-6 text-2xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p></Link>) : <div className="col-span-full bg-surface p-8 text-muted">Belum ada perbandingan bukti di sesi ini.</div>}
        </div>
      </section>
    </div>
  );
}

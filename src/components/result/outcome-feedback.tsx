"use client";

import { useState } from "react";

import type { ScanOutcome, ScanOutcomeImpact, ScanOutcomeVerdict } from "@/types/outcome";

const verdicts: Array<{ id: ScanOutcomeVerdict; label: string; body: string }> = [
  { id: "prevented", label: "Berhasil dicegah", body: "Saya berhenti sebelum melakukan tindakan berisiko." },
  { id: "confirmed_scam", label: "Terbukti bermasalah", body: "Ada konfirmasi dari kanal resmi atau dampak nyata." },
  { id: "legitimate", label: "Ternyata sah", body: "Saya memverifikasinya melalui kanal independen." },
  { id: "uncertain", label: "Belum pasti", body: "Saya belum punya cukup bukti untuk menyimpulkan." },
];

const impacts: Array<{ id: ScanOutcomeImpact; label: string }> = [
  { id: "none", label: "Tidak ada dampak" },
  { id: "data_shared", label: "Data sempat dibagikan" },
  { id: "account_compromised", label: "Akun terdampak" },
  { id: "money_lost", label: "Ada kerugian uang" },
];

export function OutcomeFeedback({ scanId, initialOutcome }: { scanId: string; initialOutcome: ScanOutcome | null }) {
  const [verdict, setVerdict] = useState<ScanOutcomeVerdict>(initialOutcome?.verdict ?? "uncertain");
  const [impact, setImpact] = useState<ScanOutcomeImpact>(initialOutcome?.impact ?? "none");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(initialOutcome ? "saved" : "idle");

  async function save() {
    setStatus("saving");
    try {
      const response = await fetch(`/api/scans/${scanId}/outcome`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ verdict, impact }) });
      const body = await response.json();
      if (!response.ok || !body.ok) throw new Error("Outcome belum tersimpan");
      setStatus("saved");
    } catch { setStatus("error"); }
  }

  return (
    <section data-reveal className="border-t border-line py-12 print:hidden" aria-labelledby="outcome-heading">
      <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr]">
        <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Outcome loop</p><h2 id="outcome-heading" className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Apa yang terjadi setelahnya?</h2><p className="mt-3 text-sm leading-7 text-muted">Feedback outcome membantu mengukur kesalahan sistem melalui kategori anonim, tanpa meminta isi percakapan.</p></div>
        <div><div className="grid gap-2 sm:grid-cols-2">{verdicts.map((item) => <button key={item.id} type="button" aria-pressed={verdict === item.id} className={`min-h-24 border p-4 text-left ${verdict === item.id ? "border-ink bg-ink text-surface" : "border-line bg-surface hover:border-ai"}`} onClick={() => { setVerdict(item.id); setStatus("idle"); }}><strong className="block">{item.label}</strong><span className={`mt-2 block text-xs leading-5 ${verdict === item.id ? "text-surface/70" : "text-muted"}`}>{item.body}</span></button>)}</div><label className="mt-5 block text-sm font-semibold">Dampak<select className="mt-2 min-h-12 w-full border border-line bg-surface px-4" value={impact} onChange={(event) => { setImpact(event.target.value as ScanOutcomeImpact); setStatus("idle"); }}>{impacts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><div className="mt-5 flex items-center gap-4"><button type="button" disabled={status === "saving"} className="min-h-12 rounded-full bg-ink px-6 text-sm font-semibold text-surface hover:bg-ai disabled:opacity-50" onClick={() => void save()}>{status === "saving" ? "Menyimpan…" : initialOutcome || status === "saved" ? "Perbarui outcome" : "Simpan outcome"}</button><p className="text-sm text-muted" role="status">{status === "saved" ? "Outcome tersimpan." : status === "error" ? "Outcome belum tersimpan. Coba lagi." : ""}</p></div></div>
      </div>
    </section>
  );
}

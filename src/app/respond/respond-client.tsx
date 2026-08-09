"use client";

import { useMemo, useState } from "react";
import { buildResponsePlan, labelForIncident } from "@/lib/response/build-response-plan";
import { INCIDENT_LABELS } from "@/lib/response/catalog";
import type { IncidentType, ResponseStep } from "@/lib/response/types";

const INCIDENTS = Object.keys(INCIDENT_LABELS) as IncidentType[];

function StepList({ title, steps }: { title: string; steps: ResponseStep[] }) {
  if (!steps.length) return null;

  return (
    <section className="border-t border-line py-8" aria-labelledby={`response-${title}`}>
      <p id={`response-${title}`} className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ai">{title}</p>
      <ol className="mt-4 grid gap-px border border-line bg-line">
        {steps.map((step, index) => (
          <li key={step.id} className="bg-surface p-5 sm:grid sm:grid-cols-[44px_1fr] sm:gap-3 sm:p-7">
            <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{step.body}</p>
              {step.sourceTitle && step.sourceUrl ? <a className="mt-3 inline-flex text-xs font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai" href={step.sourceUrl} target="_blank" rel="noreferrer">Sumber resmi · {step.sourceTitle}</a> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function RespondClient() {
  const [selected, setSelected] = useState<IncidentType[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const plan = useMemo(() => buildResponsePlan(selected), [selected]);

  function toggle(incident: IncidentType) {
    setSelected((current) => current.includes(incident) ? current.filter((item) => item !== incident) : [...current, incident]);
  }

  async function copyChecklist() {
    const text = [
      "AmanKlik — langkah awal",
      `Situasi: ${selected.map(labelForIncident).join(", ")}`,
      "",
      ...plan.immediate.map((step, index) => `${index + 1}. ${step.title}: ${step.body}`),
      ...plan.soon.map((step, index) => `${index + 1}. ${step.title}: ${step.body}`),
      "",
      plan.disclaimer,
    ].join("\n");

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopyStatus("Langkah aman tersalin.");
    } catch {
      setCopyStatus("Clipboard tidak tersedia. Kamu tetap bisa membaca dan mencatat langkah di halaman ini.");
    }
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[0.7fr_0.3fr]">
      <div>
        <fieldset>
          <legend className="text-xl font-semibold">Apa yang sudah terjadi?</legend>
          <p className="mt-2 text-sm leading-6 text-muted">Pilih semua yang relevan. Jangan masukkan nilai OTP, password, nomor rekening, atau data pribadi.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {INCIDENTS.map((incident) => {
              const active = selected.includes(incident);
              return <button key={incident} type="button" aria-pressed={active} className={`min-h-14 border px-4 py-4 text-left text-sm font-semibold transition ${active ? "border-ink bg-ink text-surface" : "border-line bg-surface hover:border-ai hover:bg-ai-soft"}`} onClick={() => toggle(incident)}><span className="mr-3 font-mono text-xs opacity-60">{active ? "✓" : "○"}</span>{INCIDENT_LABELS[incident]}</button>;
            })}
          </div>
        </fieldset>

        {selected.length ? (
          <div className="mt-10 border border-line bg-surface p-5 shadow-[10px_10px_0_rgba(17,17,17,0.06)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Langkah pertama</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Jaga jeda sebelum bertindak lagi.</h2></div>
              <button type="button" className="text-xs font-semibold text-muted underline underline-offset-4 hover:text-ink" onClick={() => setSelected([])}>Reset</button>
            </div>
            <StepList title="Sekarang" steps={plan.immediate} />
            <StepList title="Berikutnya" steps={plan.soon} />
            <StepList title="Pantau" steps={plan.monitor} />
            <div className="mt-6 border-t border-line pt-5 text-sm leading-6 text-muted"><strong className="text-ink">Catatan:</strong> {plan.disclaimer}</div>
            <button type="button" className="mt-6 min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai" onClick={() => void copyChecklist()}>Salin langkah aman</button>{copyStatus ? <p className="mt-3 text-sm text-muted" role="status">{copyStatus}</p> : null}
          </div>
        ) : <p className="mt-8 border border-dashed border-line p-6 text-sm leading-7 text-muted">Pilih situasi di atas untuk melihat langkah yang diprioritaskan.</p>}
      </div>

      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28"><p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Batas AmanKlik</p><ul className="mt-5 divide-y divide-line border-b border-line text-sm leading-6 text-muted"><li className="py-4">Tidak meminta rahasia autentikasi.</li><li className="py-4">Tidak menjamin uang bisa kembali.</li><li className="py-4">Tidak menghubungi pihak mana pun.</li><li className="py-4">Tidak membuka tautan yang dikirim.</li></ul></aside>
    </div>
  );
}

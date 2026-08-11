"use client";

import { useMemo, useState } from "react";
import {
  buildResponsePlan,
  labelForAsset,
  labelForIncident,
} from "@/lib/response/build-response-plan";
import {
  AFFECTED_ASSET_LABELS,
  affectedAssetsForIncidents,
  INCIDENT_LABELS,
} from "@/lib/response/catalog";
import type { AffectedAsset, IncidentType, ResponseStep } from "@/lib/response/types";

const INCIDENTS = Object.keys(INCIDENT_LABELS) as IncidentType[];

function officialHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "sumber resmi";
  }
}

function SourceLink({ step }: { step: ResponseStep }) {
  if (!step.sourceTitle || !step.sourceUrl) return null;

  return (
    <a
      className="mt-4 inline-flex min-h-11 items-center border border-current px-4 py-2 text-xs font-semibold text-ai transition hover:bg-ai hover:text-white"
      href={step.sourceUrl}
      target="_blank"
      rel="noreferrer"
    >
      Buka sumber resmi ↗ · {officialHost(step.sourceUrl)}
      <span className="sr-only"> — {step.sourceTitle}</span>
    </a>
  );
}

function StepCards({ steps, startAt = 1 }: { steps: ResponseStep[]; startAt?: number }) {
  if (!steps.length) return null;

  return (
    <ol className="grid gap-px border border-line bg-line">
      {steps.map((step, index) => (
        <li key={step.id} className="bg-surface p-5 sm:grid sm:grid-cols-[44px_1fr] sm:gap-3 sm:p-7">
          <span className="font-mono text-xs text-muted">{String(startAt + index).padStart(2, "0")}</span>
          <div>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{step.body}</p>
            <SourceLink step={step} />
          </div>
        </li>
      ))}
    </ol>
  );
}

function ExpandableSteps({ title, hint, steps }: { title: string; hint: string; steps: ResponseStep[] }) {
  if (!steps.length) return null;

  return (
    <details className="border-t border-line py-2">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 py-3 font-semibold marker:hidden">
        <span>{title}</span>
        <span className="font-mono text-xs font-normal text-muted">{steps.length} langkah +</span>
      </summary>
      <p className="mb-4 max-w-2xl text-sm leading-6 text-muted">{hint}</p>
      <StepCards steps={steps} />
    </details>
  );
}

function ChoiceButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-14 border px-4 py-4 text-left text-sm font-semibold transition ${active ? "border-ink bg-ink text-surface" : "border-line bg-surface hover:border-ai hover:bg-ai-soft"}`}
      onClick={onClick}
    >
      <span className="mr-3 font-mono text-xs opacity-60" aria-hidden="true">{active ? "✓" : "○"}</span>
      {children}
    </button>
  );
}

export function RespondClient() {
  const [selectedIncidents, setSelectedIncidents] = useState<IncidentType[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<AffectedAsset[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const availableAssets = useMemo(
    () => affectedAssetsForIncidents(selectedIncidents),
    [selectedIncidents],
  );
  const plan = useMemo(
    () => buildResponsePlan(selectedIncidents, selectedAssets),
    [selectedAssets, selectedIncidents],
  );

  const primaryStep = plan.immediate[0];
  const nextPrioritySteps = plan.immediate.slice(1, 3);
  const remainingImmediateSteps = plan.immediate.slice(3);

  function toggleIncident(incident: IncidentType) {
    setCopyStatus(null);
    let nextIncidents: IncidentType[];

    if (incident === "unsure") {
      nextIncidents = selectedIncidents.includes("unsure") ? [] : ["unsure"];
    } else if (selectedIncidents.includes(incident)) {
      nextIncidents = selectedIncidents.filter((item) => item !== incident);
    } else {
      nextIncidents = [...selectedIncidents.filter((item) => item !== "unsure"), incident];
    }
    const nextAvailableAssets = new Set(affectedAssetsForIncidents(nextIncidents));

    setSelectedIncidents(nextIncidents);
    setSelectedAssets((current) => current.filter((asset) => nextAvailableAssets.has(asset)));
  }

  function toggleAsset(asset: AffectedAsset) {
    setCopyStatus(null);
    setSelectedAssets((current) => current.includes(asset)
      ? current.filter((item) => item !== asset)
      : [...current, asset]);
  }

  function reset() {
    setSelectedIncidents([]);
    setSelectedAssets([]);
    setCopyStatus(null);
  }

  async function copyChecklist() {
    const formatSteps = (title: string, steps: ResponseStep[]) => steps.length
      ? [title, ...steps.map((step, index) => `${index + 1}. ${step.title}\n${step.body}${step.sourceUrl ? `\nSumber: ${step.sourceUrl}` : ""}`), ""]
      : [];
    const text = [
      "AmanKlik — langkah setelah terlanjur",
      `Situasi: ${selectedIncidents.map(labelForIncident).join(", ")}`,
      `Layanan terdampak: ${selectedAssets.length ? selectedAssets.map(labelForAsset).join(", ") : "Belum dipilih"}`,
      "",
      ...formatSteps("SEKARANG", plan.immediate),
      ...formatSteps("BERIKUTNYA", plan.soon),
      ...formatSteps("PANTAU", plan.monitor),
      plan.disclaimer,
    ].join("\n");

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopyStatus("Langkah aman dan tautan resmi tersalin.");
    } catch {
      setCopyStatus("Clipboard tidak tersedia. Kamu tetap bisa mencetak atau mencatat langkah di halaman ini.");
    }
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[0.76fr_0.24fr]">
      <div>
        <fieldset>
          <legend className="text-xl font-semibold">1. Apa yang sudah terjadi?</legend>
          <p className="mt-2 text-sm leading-6 text-muted">Pilih semua yang relevan. Jangan masukkan OTP, password, nomor rekening, nomor kartu, NIK, atau bukti transaksi.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {INCIDENTS.map((incident) => (
              <ChoiceButton
                key={incident}
                active={selectedIncidents.includes(incident)}
                onClick={() => toggleIncident(incident)}
              >
                {INCIDENT_LABELS[incident]}
              </ChoiceButton>
            ))}
          </div>
        </fieldset>

        {availableAssets.length ? (
          <fieldset className="mt-9 border-t border-line pt-8">
            <legend className="text-xl font-semibold">2. Akun atau layanan mana yang terdampak?</legend>
            <p className="mt-2 text-sm leading-6 text-muted">Opsional. AmanKlik hanya menampilkan pilihan yang relevan dengan kejadian di atas agar langkah pemulihan lebih spesifik.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {availableAssets.map((asset) => (
                <ChoiceButton
                  key={asset}
                  active={selectedAssets.includes(asset)}
                  onClick={() => toggleAsset(asset)}
                >
                  {AFFECTED_ASSET_LABELS[asset]}
                </ChoiceButton>
              ))}
            </div>
          </fieldset>
        ) : null}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {selectedIncidents.length ? `Rencana diperbarui. ${plan.immediate.length} langkah perlu dilakukan sekarang.` : "Belum ada situasi yang dipilih."}
        </p>

        {selectedIncidents.length && primaryStep ? (
          <section className="mt-10 border border-line bg-surface shadow-[10px_10px_0_rgba(17,17,17,0.06)]" aria-labelledby="response-priority-title">
            <div className="bg-ink p-6 text-surface sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai-soft">Prioritas pertama</p>
                  <h2 id="response-priority-title" className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{primaryStep.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-surface/75">{primaryStep.body}</p>
                  {primaryStep.sourceTitle && primaryStep.sourceUrl ? (
                    <a className="mt-5 inline-flex min-h-11 items-center border border-white/30 px-4 py-2 text-xs font-semibold text-surface transition hover:bg-surface hover:text-ink" href={primaryStep.sourceUrl} target="_blank" rel="noreferrer">
                      Buka sumber resmi ↗ · {officialHost(primaryStep.sourceUrl)}
                      <span className="sr-only"> — {primaryStep.sourceTitle}</span>
                    </a>
                  ) : null}
                </div>
                <button type="button" className="min-h-11 text-xs font-semibold text-surface/70 underline underline-offset-4 hover:text-surface print:hidden" onClick={reset}>Ulangi pilihan</button>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              {nextPrioritySteps.length ? (
                <section aria-labelledby="response-next-priorities">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Masih sekarang</p>
                      <h3 id="response-next-priorities" className="mt-2 text-xl font-semibold">Selesaikan dua prioritas berikutnya.</h3>
                    </div>
                    <span className="text-xs text-muted">Tiga langkah utama tampil tanpa perlu membuka menu.</span>
                  </div>
                  <StepCards steps={nextPrioritySteps} startAt={2} />
                </section>
              ) : null}

              <div className="mt-7">
                <ExpandableSteps title="Langkah mendesak lainnya" hint="Buka jika kamu memilih lebih dari satu kejadian atau layanan terdampak." steps={remainingImmediateSteps} />
                <ExpandableSteps title="Berikutnya: bukti dan pemulihan" hint="Kerjakan setelah akses dan transaksi yang paling berisiko sudah diamankan." steps={plan.soon} />
                <ExpandableSteps title="Pantau setelahnya" hint="Waspadai tindak lanjut yang berpura-pura membantu memulihkan akun atau uang." steps={plan.monitor} />
              </div>

              <div className="mt-6 border-t border-line pt-5 text-sm leading-6 text-muted"><strong className="text-ink">Batas panduan:</strong> {plan.disclaimer}</div>
              <div className="mt-6 flex flex-wrap gap-3 print:hidden">
                <button type="button" className="min-h-12 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:-translate-y-0.5 hover:bg-ai" onClick={() => void copyChecklist()}>Salin semua langkah</button>
                <button type="button" className="min-h-12 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold transition hover:border-ink" onClick={() => window.print()}>Cetak panduan</button>
              </div>
              {copyStatus ? <p className="mt-3 text-sm text-muted" role="status">{copyStatus}</p> : null}
            </div>
          </section>
        ) : (
          <p className="mt-8 border border-dashed border-line p-6 text-sm leading-7 text-muted">Pilih situasi di atas. AmanKlik akan menyusun tiga tindakan pertama tanpa memakai AI dan tanpa menyimpan pilihanmu.</p>
        )}
      </div>

      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">Yang AmanKlik lakukan</p>
        <p className="mt-4 text-sm leading-7 text-muted">Menyusun urutan tindakan deterministik dari kategori yang kamu pilih. Pilihan tidak dikirim ke Gemini dan tidak disimpan.</p>
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.16em] text-ai">Batas AmanKlik</p>
        <ul className="mt-3 divide-y divide-line border-b border-line text-sm leading-6 text-muted">
          <li className="py-4">Tidak meminta OTP, PIN, password, atau data kartu.</li>
          <li className="py-4">Tidak menjamin pemblokiran atau uang kembali.</li>
          <li className="py-4">Tidak menghubungi bank, polisi, atau platform.</li>
          <li className="py-4">Tidak memakai nomor atau tautan dari pesan pelaku.</li>
        </ul>
      </aside>
    </div>
  );
}

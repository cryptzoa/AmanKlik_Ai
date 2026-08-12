"use client";

import { useMemo, useState } from "react";
import { ResponsePlanSection } from "@/app/respond/_components/response-plan-section";
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
import type {
  AffectedAsset,
  IncidentType,
  ResponseStep,
} from "@/lib/response/types";

const INCIDENTS = Object.keys(INCIDENT_LABELS) as IncidentType[];

function ChoiceButton(
  { active, children, onClick }: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
  },
) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-14 border px-4 py-4 text-left text-sm font-semibold transition ${
        active
          ? "border-ink bg-ink text-surface"
          : "border-line bg-surface hover:border-ai hover:bg-ai-soft"
      }`}
      onClick={onClick}
    >
      <span className="mr-3 font-mono text-xs opacity-60" aria-hidden="true">
        {active ? "✓" : "○"}
      </span>
      {children}
    </button>
  );
}

export function RespondClient() {
  const [selectedIncidents, setSelectedIncidents] = useState<IncidentType[]>(
    [],
  );
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

  function toggleIncident(incident: IncidentType) {
    setCopyStatus(null);
    let nextIncidents: IncidentType[];

    if (incident === "unsure") {
      nextIncidents = selectedIncidents.includes("unsure") ? [] : ["unsure"];
    } else if (selectedIncidents.includes(incident)) {
      nextIncidents = selectedIncidents.filter((item) => item !== incident);
    } else {
      nextIncidents = [
        ...selectedIncidents.filter((item) => item !== "unsure"),
        incident,
      ];
    }
    const nextAvailableAssets = new Set(
      affectedAssetsForIncidents(nextIncidents),
    );

    setSelectedIncidents(nextIncidents);
    setSelectedAssets((current) =>
      current.filter((asset) => nextAvailableAssets.has(asset))
    );
  }

  function toggleAsset(asset: AffectedAsset) {
    setCopyStatus(null);
    setSelectedAssets((current) =>
      current.includes(asset)
        ? current.filter((item) => item !== asset)
        : [...current, asset]
    );
  }

  function reset() {
    setSelectedIncidents([]);
    setSelectedAssets([]);
    setCopyStatus(null);
  }

  async function copyChecklist() {
    const formatSteps = (title: string, steps: ResponseStep[]) =>
      steps.length
        ? [
          title,
          ...steps.map((step, index) =>
            `${index + 1}. ${step.title}\n${step.body}${
              step.sourceUrl ? `\nSumber: ${step.sourceUrl}` : ""
            }`
          ),
          "",
        ]
        : [];
    const text = [
      "AmanKlik — langkah setelah terlanjur",
      `Situasi: ${selectedIncidents.map(labelForIncident).join(", ")}`,
      `Layanan terdampak: ${
        selectedAssets.length
          ? selectedAssets.map(labelForAsset).join(", ")
          : "Belum dipilih"
      }`,
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
      setCopyStatus(
        "Clipboard tidak tersedia. Kamu tetap bisa mencetak atau mencatat langkah di halaman ini.",
      );
    }
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[0.76fr_0.24fr]">
      <div>
        <fieldset>
          <legend className="text-xl font-semibold">
            1. Apa yang sudah terjadi?
          </legend>
          <p className="mt-2 text-sm leading-6 text-muted">
            Pilih semua yang relevan. Jangan masukkan OTP, password, nomor
            rekening, nomor kartu, NIK, atau bukti transaksi.
          </p>
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

        {availableAssets.length
          ? (
            <fieldset className="mt-9 border-t border-line pt-8">
              <legend className="text-xl font-semibold">
                2. Akun atau layanan mana yang terdampak?
              </legend>
              <p className="mt-2 text-sm leading-6 text-muted">
                Opsional. AmanKlik hanya menampilkan pilihan yang relevan dengan
                kejadian di atas agar langkah pemulihan lebih spesifik.
              </p>
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
          )
          : null}

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {selectedIncidents.length
            ? `Rencana diperbarui. ${plan.immediate.length} langkah perlu dilakukan sekarang.`
            : "Belum ada situasi yang dipilih."}
        </p>

        {selectedIncidents.length && plan.immediate[0]
          ? (
            <ResponsePlanSection
              plan={plan}
              copyStatus={copyStatus}
              onReset={reset}
              onCopy={() => void copyChecklist()}
            />
          )
          : (
            <p className="mt-8 border border-dashed border-line p-6 text-sm leading-7 text-muted">
              Pilih situasi di atas. AmanKlik akan menyusun tiga tindakan
              pertama tanpa memakai AI dan tanpa menyimpan pilihanmu.
            </p>
          )}
      </div>

      <aside className="self-start border-t border-line pt-5 lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
          Yang AmanKlik lakukan
        </p>
        <p className="mt-4 text-sm leading-7 text-muted">
          Menyusun urutan tindakan deterministik dari kategori yang kamu pilih.
          Pilihan tidak dikirim ke Gemini dan tidak disimpan.
        </p>
        <p className="mt-7 font-mono text-xs uppercase tracking-[0.16em] text-ai">
          Batas AmanKlik
        </p>
        <ul className="mt-3 divide-y divide-line border-b border-line text-sm leading-6 text-muted">
          <li className="py-4">
            Tidak meminta OTP, PIN, password, atau data kartu.
          </li>
          <li className="py-4">
            Tidak menjamin pemblokiran atau uang kembali.
          </li>
          <li className="py-4">
            Tidak menghubungi bank, polisi, atau platform.
          </li>
          <li className="py-4">
            Tidak memakai nomor atau tautan dari pesan pelaku.
          </li>
        </ul>
      </aside>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { buildSafeReport, formatSafeReport } from "@/lib/report/safe-report";

export function ReportActions({ result }: { result: AnalysisResult }) {
  const [status, setStatus] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(false);

  async function copy() {
    const text = formatSafeReport(buildSafeReport(result));
    try {
      await navigator.clipboard.writeText(text);
      setStatusIsError(false);
      setStatus("Ringkasan aman tersalin.");
    } catch {
      setStatusIsError(true);
      setStatus(
        "Clipboard tidak tersedia. Gunakan tombol simpan atau pilih teks secara manual.",
      );
    }
  }

  function print() {
    setStatusIsError(false);
    setStatus("Dialog simpan atau cetak dibuka.");
    window.print();
  }

  return (
    <section
      className="border-t border-line py-10 print:hidden"
      aria-labelledby="report-actions-heading"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ai">
            05 / Retain safely
          </p>
          <h2
            id="report-actions-heading"
            className="mt-3 text-2xl font-semibold"
          >
            Simpan langkahnya, bukan isi pesannya.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Ringkasan lokal tidak menyertakan pesan, screenshot, URL lengkap,
            atau rahasia.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="product-button product-button--primary"
            onClick={() => void copy()}
          >
            Salin langkah aman
          </button>
          <button
            type="button"
            className="product-button product-button--secondary"
            onClick={print}
          >
            Simpan / cetak
          </button>
        </div>
      </div>
      {status
        ? (
          <p
            className={`mt-4 text-sm ${statusIsError ? "text-risk" : "text-muted"}`}
            role={statusIsError ? "alert" : "status"}
          >
            {status}
          </p>
        )
        : null}
    </section>
  );
}

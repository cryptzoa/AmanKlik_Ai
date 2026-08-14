"use client";

import { ComparisonBuilderSection } from "@/app/investigate/_components/comparison-builder-section";
import { SavedCasesSection } from "@/app/investigate/_components/saved-cases-section";
import { useTransition } from "@/components/site/transition-context";
import { useState } from "react";
import { StatusBand } from "@/components/product/primitives";
import { TransitionLink } from "@/components/site/transition-link";

import type { CaseItem, ScanItem } from "@/app/investigate/_components/types";

type CaseApiEnvelope = {
  ok?: boolean;
  data?: { investigation?: { id?: string } };
  error?: { message?: string };
};

async function readCaseEnvelope(response: Response): Promise<CaseApiEnvelope> {
  try {
    return await response.json() as CaseApiEnvelope;
  } catch {
    return {};
  }
}

export function InvestigationClient(
  { scans, cases, initialScanId, storageUnavailable }: {
    scans: ScanItem[];
    cases: CaseItem[];
    initialScanId?: string;
    storageUnavailable: boolean;
  },
) {
  const { navigate } = useTransition();
  const [selected, setSelected] = useState<string[]>(
    initialScanId && scans.some((scan) => scan.id === initialScanId)
      ? [initialScanId]
      : [],
  );
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setError(null);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= 8
        ? current
        : [...current, id]
    );
  }

  if (storageUnavailable) {
    return (
      <section className="product-task-canvas" aria-labelledby="case-storage-unavailable">
        <StatusBand tone="warning" role="status">
          <h2 id="case-storage-unavailable" className="font-semibold">
            Daftar kasus belum tersedia.
          </h2>
          <p className="mt-1">
            Penyimpanan sedang tidak dapat dijangkau. Kondisi ini berbeda dari
            sesi yang memang belum memiliki pemeriksaan.
          </p>
        </StatusBand>
        <TransitionLink
          href="/scan"
          className="product-button product-button--primary mt-5"
        >
          Lakukan pemeriksaan baru
        </TransitionLink>
      </section>
    );
  }

  async function createCase() {
    setStatus("loading");
    setError(null);
    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scanIds: selected }),
      });
      const body = await readCaseEnvelope(response);
      const caseId = body.data?.investigation?.id;
      if (!response.ok || !body.ok || !caseId) {
        throw new Error(body.error?.message ?? "Kasus belum dapat dibuat.");
      }
      navigate(`/investigate/${caseId}`);
    } catch (submissionError) {
      setError(
        !navigator.onLine || submissionError instanceof TypeError
          ? "Jaringan belum dapat menjangkau AmanKlik. Pilihanmu tetap ada; coba lagi setelah koneksi stabil."
          : submissionError instanceof Error
          ? submissionError.message
          : "Kasus belum dapat dibuat.",
      );
      setStatus("idle");
    }
  }

  return (
    <div className="grid gap-16">
      <ComparisonBuilderSection
        scans={scans}
        selected={selected}
        title={title}
        loading={status === "loading"}
        error={error}
        onTitleChange={(value) => {
          setTitle(value);
          setError(null);
        }}
        onToggle={toggle}
        onCreate={() => void createCase()}
      />
      <SavedCasesSection cases={cases} />
    </div>
  );
}

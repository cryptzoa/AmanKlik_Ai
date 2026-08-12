"use client";

import { ComparisonBuilderSection } from "@/app/investigate/_components/comparison-builder-section";
import { SavedCasesSection } from "@/app/investigate/_components/saved-cases-section";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CaseItem, ScanItem } from "@/app/investigate/_components/types";

export function InvestigationClient(
  { scans, cases, initialScanId }: {
    scans: ScanItem[];
    cases: CaseItem[];
    initialScanId?: string;
  },
) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(
    initialScanId && scans.some((scan) => scan.id === initialScanId)
      ? [initialScanId]
      : [],
  );
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= 8
        ? current
        : [...current, id]
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
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body.error?.message ?? "Kasus belum dapat dibuat.");
      }
      router.push(`/investigate/${body.data.investigation.id}`);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
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
        onTitleChange={setTitle}
        onToggle={toggle}
        onCreate={() => void createCase()}
      />
      <SavedCasesSection cases={cases} />
    </div>
  );
}

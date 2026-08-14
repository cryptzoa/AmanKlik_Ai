import type { Metadata } from "next";
import { ResultView } from "@/app/result/[id]/_components/result-view";
import {
  countDistinctSessionsForInputHash,
  getScanForSession,
} from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { scanIdSchema } from "@/lib/validation";
import { notFound } from "next/navigation";
import { listActionProgress } from "@/db/repositories/action-progress-repository";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hasil pemeriksaan — AmanKlik AI",
  description:
    "Tinjau skor risiko, bukti, keterbatasan analisis, dan langkah aman berikutnya.",
  robots: { index: false, follow: false },
};

export default async function ResultPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!scanIdSchema.safeParse(id).success) notFound();
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId) notFound();

  let scan;
  try {
    scan = await getScanForSession(id, sessionId);
  } catch (error) {
    reportServerError("result.load", error);
    throw error;
  }

  if (!scan) notFound();
  let progress: Awaited<ReturnType<typeof listActionProgress>> = [];
  let intelligenceMatchCount = 0;
  try {
    [progress, intelligenceMatchCount] = await Promise.all([
      listActionProgress(scan.id, sessionId),
      countDistinctSessionsForInputHash(
        scan.inputHash,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000),
      ),
    ]);
  } catch (error) {
    reportServerError("result.enrichment", error);
  }
  return (
    <ResultView
      result={scan.resultJson}
      initialActionProgress={Object.fromEntries(
        progress.map((item) => [item.actionId, item.state]),
      )}
      intelligenceMatchCount={intelligenceMatchCount}
    />
  );
}

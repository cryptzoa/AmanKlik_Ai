import { listInvestigationCases } from "@/db/repositories/investigation-repository";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { InvestigationClient } from "@/app/investigate/investigation-client";
import { InteriorShell } from "@/components/site/interior-shell";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export default async function InvestigatePage({ searchParams }: { searchParams: Promise<{ scan?: string }> }) {
  const { scan: initialScanId } = await searchParams;
  const sessionId = await getAnonymousSessionId({ create: false });
  let scans: Awaited<ReturnType<typeof listScansForSession>> = [];
  let cases: Awaited<ReturnType<typeof listInvestigationCases>> = [];
  if (sessionId) {
    try { [scans, cases] = await Promise.all([listScansForSession(sessionId, 30), listInvestigationCases(sessionId)]); } catch { /* UI remains available with empty state. */ }
  }
  return <InteriorShell eyebrow="06 / Investigate" title="Satu kasus, banyak petunjuk." description="Satukan pesan, URL, screenshot, dan percakapan yang berkaitan untuk melihat pola lintas sumber." marker="CASE / EVIDENCE / ACTION" fragments={["MULTI-SOURCE", "PRIVATE", `${cases.length} CASE`]} compact><InvestigationClient initialScanId={initialScanId} scans={scans.map((scan) => ({ id: scan.id, inputType: scan.inputType, preview: scan.previewRedacted, finalScore: scan.finalScore, riskLevel: scan.riskLevel, createdAt: scan.createdAt.toISOString() }))} cases={cases.map((item) => ({ id: item.id, title: item.title, status: item.status, finalScore: item.finalScore, riskLevel: item.riskLevel, summary: item.summary, scanCount: item.scanCount, updatedAt: item.updatedAt.toISOString() }))} /></InteriorShell>;
}

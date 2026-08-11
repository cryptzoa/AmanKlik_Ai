import { InvestigationClient } from "@/app/investigate/investigation-client";
import { listInvestigationCases } from "@/db/repositories/investigation-repository";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { InteriorShell } from "@/components/site/interior-shell";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export default async function InvestigatePage({ searchParams }: { searchParams: Promise<{ scan?: string }> }) {
  const { scan: requestedScanId } = await searchParams;
  const sessionId = await getAnonymousSessionId({ create: false });
  let scans: Awaited<ReturnType<typeof listScansForSession>> = [];
  let cases: Awaited<ReturnType<typeof listInvestigationCases>> = [];
  if (sessionId) {
    try { [scans, cases] = await Promise.all([listScansForSession(sessionId, 30), listInvestigationCases(sessionId)]); } catch { /* UI remains available with empty state. */ }
  }

  const selectedScan = scans.find((scan) => scan.id === requestedScanId);
  const uniqueByFingerprint = new Map<string, typeof scans[number]>();
  for (const scan of scans) {
    const current = uniqueByFingerprint.get(scan.inputHash);
    if (!current || scan.id === requestedScanId) uniqueByFingerprint.set(scan.inputHash, scan);
  }
  const uniqueScans = [...uniqueByFingerprint.values()];
  const initialScanId = selectedScan ? uniqueByFingerprint.get(selectedScan.inputHash)?.id : undefined;

  return <InteriorShell eyebrow="06 / Kasus" title="Bandingkan bukti yang berbeda." description="Satukan pesan, URL, dan screenshot yang berkaitan untuk menemukan pola yang benar-benar muncul lintas artefak." marker="ARTEFAK / POLA / VERIFIKASI" fragments={["ARTEFAK UNIK", "PRIVAT", `${cases.length} KASUS`]} compact><InvestigationClient initialScanId={initialScanId} scans={uniqueScans.map((scan) => ({ id: scan.id, inputType: scan.inputType, preview: scan.previewRedacted, finalScore: scan.finalScore, riskLevel: scan.riskLevel, createdAt: scan.createdAt.toISOString() }))} cases={cases.map((item) => ({ id: item.id, title: item.title, status: item.status, finalScore: item.finalScore, riskLevel: item.riskLevel, summary: item.summary, scanCount: item.scanCount, updatedAt: item.updatedAt.toISOString() }))} /></InteriorShell>;
}

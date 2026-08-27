import type { Metadata } from "next";
import { InvestigationClient } from "@/app/investigate/_components/investigation-client";
import { listInvestigationCases } from "@/db/repositories/investigation-repository";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Bandingkan hasil pemeriksaan | AmanKlik AI",
  description:
    "Bandingkan hasil pemeriksaan untuk melihat tanda bahaya yang muncul berulang.",
  robots: { index: false, follow: false },
};

export default async function InvestigatePage(
  { searchParams }: { searchParams: Promise<{ scan?: string }> },
) {
  const { scan: requestedScanId } = await searchParams;
  const sessionId = await getAnonymousSessionId({ create: false });
  let scans: Awaited<ReturnType<typeof listScansForSession>> = [];
  let cases: Awaited<ReturnType<typeof listInvestigationCases>> = [];
  let storageUnavailable = false;
  if (sessionId) {
    try {
      [scans, cases] = await Promise.all([
        listScansForSession(sessionId, 30),
        listInvestigationCases(sessionId),
      ]);
    } catch (error) {
      reportServerError("investigation.list", error);
      storageUnavailable = true;
    }
  }

  const selectedScan = scans.find((scan) => scan.id === requestedScanId);
  const uniqueByFingerprint = new Map<string, typeof scans[number]>();
  for (const scan of scans) {
    const current = uniqueByFingerprint.get(scan.inputHash);
    if (!current || scan.id === requestedScanId) {
      uniqueByFingerprint.set(scan.inputHash, scan);
    }
  }
  const uniqueScans = [...uniqueByFingerprint.values()];
  const initialScanId = selectedScan
    ? uniqueByFingerprint.get(selectedScan.inputHash)?.id
    : undefined;

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="Bandingkan hasil"
        title="Temukan pola yang muncul di beberapa hasil."
        description="Gabungkan pesan, tautan, dan tangkapan layar yang berkaitan. AmanKlik hanya menampilkan pola yang muncul pada sedikitnya dua hasil berbeda."
        annotation="Pilih 2 sampai 8 hasil · isi yang sama dihitung sekali · hanya tersedia di sesi browser ini"
        pattern="analysis"
      >
        {cases.length} kasus tersimpan dalam sesi ini.
      </RouteIntro>
      <div className="product-section">
        <div className="product-wide-canvas">
          <InvestigationClient
            initialScanId={initialScanId}
            storageUnavailable={storageUnavailable}
            scans={uniqueScans.map((scan) => ({
              id: scan.id,
              inputType: scan.inputType,
              preview: scan.previewRedacted,
              finalScore: scan.finalScore,
              riskLevel: scan.riskLevel,
              createdAt: scan.createdAt.toISOString(),
            }))}
            cases={cases.map((item) => ({
              id: item.id,
              title: item.title,
              status: item.status,
              finalScore: item.finalScore,
              riskLevel: item.riskLevel,
              summary: item.summary,
              scanCount: item.scanCount,
              updatedAt: item.updatedAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </PageFrame>
  );
}

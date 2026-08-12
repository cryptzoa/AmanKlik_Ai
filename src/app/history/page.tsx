import { HistorySection } from "@/app/history/_components/history-section";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { InteriorShell } from "@/components/site/interior-shell";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";
type HistoryRow = Awaited<ReturnType<typeof listScansForSession>>[number];

export default async function HistoryPage() {
  const sessionId = await getAnonymousSessionId({ create: false });
  let rows: HistoryRow[] = [];
  let storageUnavailable = false;
  if (sessionId) {
    try {
      rows = await listScansForSession(sessionId);
    } catch (error) {
      reportServerError("history.load", error);
      storageUnavailable = true;
    }
  }

  return (
    <InteriorShell
      eyebrow="04 / History"
      title="Jejak pemeriksaanmu."
      description="Riwayat hanya terhubung ke sesi anonim browser ini. Screenshot asli dan teks mentah tidak ditampilkan kembali."
      marker="SESI LOKAL / PRIVAT"
      fragments={["TANPA AKUN", "REDACTED", `${rows.length} HASIL`]}
      compact
    >
      <HistorySection
        rows={rows.map((
          { id, inputType, riskLevel, previewRedacted, finalScore },
        ) => ({ id, inputType, riskLevel, previewRedacted, finalScore }))}
        storageUnavailable={storageUnavailable}
      />
    </InteriorShell>
  );
}

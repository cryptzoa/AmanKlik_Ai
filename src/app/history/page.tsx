import type { Metadata } from "next";
import { HistorySection } from "@/app/history/_components/history-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { reportServerError } from "@/server/observability/report-error";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const metadata: Metadata = {
  title: "Riwayat pemeriksaan — AmanKlik AI",
  description:
    "Temukan kembali hasil pemeriksaan yang terhubung ke sesi anonim browser ini tanpa menampilkan input mentah.",
  robots: {
    index: false,
    follow: false,
  },
};

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
    <PageFrame>
      <RouteIntro
        eyebrow="04 / Riwayat"
        title="Jejak pemeriksaanmu."
        description="Temukan kembali hasil yang masih terhubung ke cookie sesi anonim browser ini. Riwayat disimpan dan dicocokkan di server; AmanKlik tidak membuat akun atau membaca inbox kamu."
        annotation={
          <p>
            Teks mentah dan screenshot tidak ditampilkan kembali. Mengganti
            atau menghapus cookie dapat memutus akses ke hasil sesi sebelumnya.
          </p>
        }
        pattern="reading"
      >
        {storageUnavailable
          ? "Status penyimpanan tidak tersedia"
          : `${rows.length} hasil · preview telah disamarkan`}
      </RouteIntro>

      <div className="product-section">
        <div className="product-task-canvas">
          <HistorySection
            rows={rows.map(({
              id,
              inputType,
              riskLevel,
              previewRedacted,
              finalScore,
              createdAt,
            }) => ({
              id,
              inputType,
              riskLevel,
              previewRedacted,
              finalScore,
              createdAt,
            }))}
            storageUnavailable={storageUnavailable}
          />
        </div>
      </div>
    </PageFrame>
  );
}

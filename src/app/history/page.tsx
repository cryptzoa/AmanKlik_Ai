import type { Metadata } from "next";
import { HistorySection } from "@/app/history/_components/history-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { listScansForSession } from "@/db/repositories/scan-repository";
import { reportServerError } from "@/server/observability/report-error";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const metadata: Metadata = {
  title: "Riwayat pemeriksaan | AmanKlik AI",
  description:
    "Temukan kembali hasil pemeriksaan dari browser ini tanpa menampilkan isi lengkap yang pernah dikirim.",
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
        eyebrow="Riwayat pemeriksaan"
        title="Pemeriksaan sebelumnya."
        description="Buka kembali hasil pemeriksaan dari browser ini. AmanKlik tidak membuat akun dan tidak membaca kotak masuk pesanmu."
        annotation={
          <p>
            Isi lengkap dan tangkapan layar tidak ditampilkan kembali. Jika data
            situs dihapus, hasil sebelumnya mungkin tidak dapat dibuka lagi.
          </p>
        }
        pattern="reading"
      >
        {storageUnavailable
          ? "Status penyimpanan tidak tersedia"
          : `${rows.length} hasil · cuplikan telah disamarkan`}
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

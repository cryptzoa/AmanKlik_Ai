import type { Metadata } from "next";
import { ConnectClient } from "@/app/connect/_components/connect-client";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Hubungkan ekstensi browser — AmanKlik AI",
  description:
    "Hubungkan ekstensi browser AmanKlik dan atur perangkat yang masih boleh menggunakannya.",
  robots: { index: false, follow: false },
};

export default function ConnectPage() {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="Hubungkan ekstensi"
        title="Periksa pesan langsung dari browser."
        description="Hubungkan ekstensi AmanKlik dengan kode akses khusus. Kode hanya ditampilkan sekali dan aksesnya dapat kamu cabut dari halaman ini."
        annotation="Kode akses bukan kunci Gemini · beri nama tiap perangkat · jangan bagikan kode melalui chat"
        pattern="task"
      >
        Ekstensi masih dalam tahap pengembangan dan perlu dipasang secara
        manual.
      </RouteIntro>
      <div className="product-section">
        <div className="product-task-canvas">
          <ConnectClient appBaseUrl={env.APP_BASE_URL.replace(/\/$/, "")} />
        </div>
      </div>
    </PageFrame>
  );
}

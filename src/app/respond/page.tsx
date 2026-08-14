import type { Metadata } from "next";
import { RespondSection } from "@/app/respond/_components/respond-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Sudah terlanjur? — AmanKlik AI",
  description:
    "Susun langkah pemulihan yang paling mendesak tanpa membagikan data sensitif.",
};

export default function RespondPage() {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="04 / Tindakan"
        title="Sudah terlanjur? Kerjakan yang pertama."
        description="Pilih dampaknya, lalu kerjakan tiga tindakan pertama. Panduan ini berjalan tanpa AI dan tidak meminta rahasia, identitas, atau detail transaksi."
        annotation="Hentikan kerugian · amankan akses · simpan bukti · laporkan melalui kanal resmi"
        pattern="task"
      >
        Pilihanmu hanya dipakai di halaman ini dan tidak disimpan.
      </RouteIntro>
      <div className="product-section">
        <div className="product-task-canvas">
          <RespondSection />
        </div>
      </div>
    </PageFrame>
  );
}

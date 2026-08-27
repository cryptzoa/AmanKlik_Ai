import type { Metadata } from "next";
import { SimulatorSection } from "@/app/simulator/_components/simulator-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Latihan Keputusan Aman | AmanKlik AI",
  description:
    "Latih respons aman melalui delapan situasi buatan tanpa data atau akibat nyata.",
};

export default async function SimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="Latihan aman"
        title="Latih refleks amanmu, satu keputusan pada satu waktu."
        description="Hadapi delapan situasi latihan yang dekat dengan keseharian di Indonesia. Pilih tindakan yang benar-benar akan kamu ambil, lalu pelajari dampaknya setelah setiap keputusan."
        annotation="Tanpa timer · tanpa skor kompetitif · tanpa data atau konsekuensi nyata"
        pattern="task"
      >
        Penilaian berjalan di perangkat dengan aturan tetap. Latihan dari hasil
        pemeriksaan tetap memakai situasi buatan, bukan pesan aslimu.
      </RouteIntro>
      <div className="product-section">
        <div className="product-wide-canvas">
          <SimulatorSection sourceScanId={from ?? null} />
        </div>
      </div>
    </PageFrame>
  );
}

import type { Metadata } from "next";
import { SimulatorSection } from "@/app/simulator/_components/simulator-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Latihan Keputusan Aman — AmanKlik AI",
  description:
    "Latih respons aman melalui delapan skenario sintetis tanpa data atau konsekuensi nyata.",
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
        eyebrow="02 / Latihan"
        title="Latih refleks amanmu, satu keputusan pada satu waktu."
        description="Hadapi delapan situasi sintetis yang dekat dengan pengguna Indonesia. Pilih tindakan yang benar-benar akan kamu ambil, lalu pelajari dampaknya setelah setiap keputusan."
        annotation="Tanpa timer · tanpa skor kompetitif · tanpa data atau konsekuensi nyata"
        pattern="task"
      >
        Evaluasi berjalan lokal dan deterministik. Personalisasi opsional dari
        hasil pemeriksaan tetap memakai skenario sintetis.
      </RouteIntro>
      <div className="product-section">
        <div className="product-wide-canvas">
          <SimulatorSection sourceScanId={from ?? null} />
        </div>
      </div>
    </PageFrame>
  );
}

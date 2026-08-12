import { ScanSection } from "@/app/scan/_components/scan-section";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Periksa pesan — AmanKlik AI",
};

export default async function ScanPage(
  { searchParams }: { searchParams: Promise<{ share?: string }> },
) {
  const { share } = await searchParams;
  return (
    <InteriorShell
      eyebrow="01 / Periksa"
      title="Apa yang ingin kamu periksa?"
      description="Tempel pesan, unggah screenshot, atau masukkan tautan. AmanKlik memisahkan tanda risiko tanpa pernah membuka situs tujuan."
      marker="INPUT / ANALISIS / AKSI"
      fragments={["PESAN", "SCREENSHOT", "TAUTAN"]}
      compact
    >
      <ScanSection
        initialError={share === "failed"
          ? "Konten dari menu Share belum dapat diproses. Pastikan teks cukup panjang atau gunakan PNG, JPG, atau WEBP hingga 5 MB."
          : null}
      />
    </InteriorShell>
  );
}

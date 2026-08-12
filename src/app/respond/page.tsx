import { RespondSection } from "@/app/respond/_components/respond-section";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Sudah terlanjur? — AmanKlik AI",
};

export default function RespondPage() {
  return (
    <InteriorShell
      eyebrow="04 / Tindakan"
      title="Sudah terlanjur? Mulai dari yang mendesak."
      description="Pilih dampaknya, lalu kerjakan tiga tindakan pertama. Panduan berjalan tanpa AI dan tidak meminta rahasia, identitas, atau detail transaksi."
      marker="HENTIKAN / AMANKAN / LAPORKAN"
      fragments={["JANGAN PANIK", "SIMPAN BUKTI", "KANAL RESMI"]}
      compact
    >
      <RespondSection />
    </InteriorShell>
  );
}

import { RespondClient } from "@/app/respond/respond-client";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Sudah terlanjur? — AmanKlik AI",
};

export default function RespondPage() {
  return (
    <InteriorShell
      eyebrow="04 / Response"
      title="Sudah terlanjur?"
      description="Pilih dampaknya, lalu kerjakan tiga tindakan pertama. Panduan berjalan tanpa AI dan tidak meminta rahasia, identitas, atau detail transaksi."
      marker="HENTIKAN / AMANKAN / LAPORKAN"
      fragments={["JANGAN PANIK", "SIMPAN BUKTI", "KANAL RESMI"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Pilih yang terjadi. Kerjakan yang pertama.</h2>
          <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">Untuk uang yang sudah terkirim, kecepatan melapor penting. Gunakan hanya kanal resmi yang kamu buka sendiri—bukan nomor atau tautan dari pesan.</p>
        </div>
        <RespondClient />
      </section>
    </InteriorShell>
  );
}

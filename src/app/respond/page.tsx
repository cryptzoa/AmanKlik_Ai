import { InteriorShell } from "@/components/site/interior-shell";
import { RespondClient } from "@/app/respond/respond-client";

export const metadata = {
  title: "Sudah terlanjur? — AmanKlik AI",
};

export default function RespondPage() {
  return (
    <InteriorShell
      eyebrow="04 / Response"
      title="Sudah terlanjur?"
      description="Pilih apa yang terjadi untuk mendapatkan langkah awal yang tenang, terurut, dan bersumber dari panduan resmi. Jangan masukkan rahasia atau detail transaksi."
      marker="HENTIKAN / AMANKAN / PANTAU"
      fragments={["JANGAN PANIK", "SIMPAN BUKTI", "KANAL RESMI"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Mulai dari langkah yang paling mendesak.</h2>
          <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">AmanKlik tidak menghubungi bank, polisi, atau pengirim untukmu. Panduan ini membantu kamu memilih jalur resmi secara mandiri.</p>
        </div>
        <RespondClient />
      </section>
    </InteriorShell>
  );
}

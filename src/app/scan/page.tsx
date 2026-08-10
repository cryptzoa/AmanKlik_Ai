import { ScanClient } from "@/app/scan/scan-client";
import { InteriorShell } from "@/components/site/interior-shell";
import Link from "next/link";

export const metadata = {
  title: "Periksa pesan — AmanKlik AI",
};

export default async function ScanPage({ searchParams }: { searchParams: Promise<{ share?: string }> }) {
  const { share } = await searchParams;
  return (
    <InteriorShell
      eyebrow="01 / Scanner"
      title="Periksa sebelum percaya."
      description="Tempel pesan, unggah screenshot, atau masukkan tautan. AmanKlik memisahkan tanda risiko tanpa pernah membuka situs tujuan."
      marker="INPUT / ANALISIS / AKSI"
      fragments={["OTP", "NOMOR BARU", "CEK DOMAIN"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-8 lg:grid-cols-[0.65fr_0.35fr] lg:items-end">
          <h2 className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Apa yang ingin kamu periksa?</h2>
          <p className="max-w-lg text-sm leading-7 text-muted lg:justify-self-end">Gunakan fixture sintetis untuk demo. Untuk data pribadi, hapus nama, nomor rekening, OTP, dan informasi sensitif lainnya.</p>
        </div>
          <ScanClient initialError={share === "failed" ? "Konten dari menu Share belum dapat diproses. Pastikan teks cukup panjang atau gunakan PNG, JPG, atau WEBP hingga 5 MB." : null} />
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"><p className="text-sm text-muted">Pesannya terdiri dari beberapa tahap?</p><Link className="text-sm font-semibold text-ai underline underline-offset-4" href="/scan/conversation">Periksa percakapan berurutan →</Link></div>
      </section>
    </InteriorShell>
  );
}

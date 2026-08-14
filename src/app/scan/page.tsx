import type { Metadata } from "next";
import { ScanSection } from "@/app/scan/_components/scan-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Periksa pesan — AmanKlik AI",
  description:
    "Periksa pesan, screenshot, atau tautan mencurigakan tanpa membuka situs tujuan dan dengan batas privasi yang jelas.",
};

export default async function ScanPage(
  {
    searchParams,
  }: {
    searchParams: Promise<{ share?: string | string[] }>;
  },
) {
  const { share } = await searchParams;
  const shareFailed = Array.isArray(share)
    ? share.includes("failed")
    : share === "failed";

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="01 / Periksa"
        title="Apa yang ingin kamu periksa?"
        description="Tempel pesan, unggah screenshot, atau masukkan tautan. Tugas utamanya tetap sama: berhenti sebentar, pisahkan sinyalnya, lalu tentukan langkah aman."
        annotation={
          <p>
            Tautan tidak dibuka. Hindari mengirim OTP, password, identitas,
            atau detail transaksi.
          </p>
        }
      >
        Pesan · screenshot · tautan
      </RouteIntro>
      <ScanSection
        initialError={shareFailed
          ? "Konten dari menu Share belum dapat diproses. Pastikan teks cukup panjang atau gunakan PNG, JPG, atau WEBP hingga 5 MB."
          : null}
      />
    </PageFrame>
  );
}

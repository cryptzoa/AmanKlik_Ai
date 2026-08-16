import type { Metadata } from "next";
import { ScanSection } from "@/app/scan/_components/scan-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Periksa pesan atau tautan — AmanKlik AI",
  description:
    "Periksa pesan, tangkapan layar, atau tautan mencurigakan tanpa membuka situs tujuan dan dengan batas privasi yang jelas.",
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
        eyebrow="Periksa pesan atau tautan"
        title="Apa yang ingin kamu periksa?"
        description="Tempel pesan, unggah tangkapan layar, atau masukkan tautan. Berhenti sebentar, lihat tanda bahayanya, lalu tentukan langkah yang aman."
        annotation={
          <p>
            Tautan tidak dibuka. Hindari mengirim OTP, kata sandi, identitas,
            atau detail transaksi.
          </p>
        }
      >
        Pesan · tangkapan layar · tautan
      </RouteIntro>
      <ScanSection
        initialError={shareFailed
          ? "Isi dari menu Bagikan belum dapat diperiksa. Pastikan teksnya cukup panjang atau gunakan gambar PNG, JPG, atau WEBP hingga 5 MB."
          : null}
      />
    </PageFrame>
  );
}

import type { Metadata } from "next";
import { ConversationSection } from "@/app/scan/conversation/_components/conversation-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Periksa percakapan — AmanKlik AI",
  description:
    "Susun pesan sesuai urutan waktu untuk melihat peningkatan tekanan, permintaan data pribadi, dan perubahan pola percakapan.",
};

export default function ConversationPage() {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="Periksa percakapan"
        title="Baca urutannya."
        description="Satu pesan dapat terlihat biasa. Beberapa pesan yang dibaca berurutan dapat menunjukkan perubahan identitas, desakan waktu, atau permintaan data rahasia."
        annotation={
          <p>
            Hapus nama, OTP, kata sandi, nomor rekening, dan identitas sebelum
            mengirim percakapan.
          </p>
        }
      >
        2–12 pesan · maksimum 16.000 karakter
      </RouteIntro>
      <ConversationSection />
    </PageFrame>
  );
}

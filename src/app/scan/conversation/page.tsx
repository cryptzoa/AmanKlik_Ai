import type { Metadata } from "next";
import { ConversationSection } from "@/app/scan/conversation/_components/conversation-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";

export const metadata: Metadata = {
  title: "Periksa percakapan — AmanKlik AI",
  description:
    "Susun pesan secara kronologis untuk memeriksa eskalasi tekanan, permintaan sensitif, dan perubahan pola percakapan.",
};

export default function ConversationPage() {
  return (
    <PageFrame>
      <RouteIntro
        eyebrow="01.2 / Percakapan"
        title="Baca urutannya."
        description="Satu pesan dapat terlihat biasa. Urutannya dapat menunjukkan perubahan identitas, tekanan waktu, atau permintaan sensitif yang baru terlihat ketika dibaca bersama."
        annotation={
          <p>
            Hapus nama, OTP, password, nomor rekening, dan identitas sebelum
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

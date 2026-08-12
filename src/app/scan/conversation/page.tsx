import { ConversationSection } from "@/app/scan/conversation/_components/conversation-section";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Periksa percakapan — AmanKlik AI",
};

export default function ConversationPage() {
  return (
    <InteriorShell
      eyebrow="01 / Conversation"
      title="Baca urutannya."
      description="Masukkan beberapa pesan yang sudah kamu hapus datanya untuk melihat pola eskalasi, tekanan, dan permintaan sensitif dari waktu ke waktu."
      marker="URUTAN / POLA / JEDA"
      compact
      fragments={["PESAN 01", "ESKALASI", "JEDA"]}
    >
      <ConversationSection />
    </InteriorShell>
  );
}

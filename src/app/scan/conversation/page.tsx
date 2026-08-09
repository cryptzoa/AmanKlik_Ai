import Link from "next/link";
import { InteriorShell } from "@/components/site/interior-shell";
import { ConversationClient } from "@/app/scan/conversation/conversation-client";

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
      fragments={["PESAN 01", "ESKALASI", "JEDA"]}
    >
      <section data-reveal>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"><p className="max-w-xl text-sm leading-7 text-muted">Gunakan percakapan sintetis atau konteks minimum. Jangan menempelkan OTP, password, nomor rekening, atau identitas nyata.</p><Link className="text-sm font-semibold text-ai underline underline-offset-4" href="/scan">Kembali ke scanner tunggal</Link></div>
        <ConversationClient />
      </section>
    </InteriorShell>
  );
}

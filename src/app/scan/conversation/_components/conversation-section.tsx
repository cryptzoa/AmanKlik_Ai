import Link from "next/link";
import { ConversationClient } from "@/app/scan/conversation/_components/conversation-client";
import {
  ProductSection,
  SectionHeading,
} from "@/components/product/primitives";

export function ConversationSection() {
  return (
    <ProductSection width="task" className="pt-12 sm:pt-16 lg:pt-20">
      <div className="mb-8 flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="inline-flex min-h-11 items-center text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai"
          href="/scan"
        >
          ← Kembali ke pemeriksaan tunggal
        </Link>
        <p className="max-w-xl text-sm leading-7 text-muted sm:text-right">
          Urutan visual dan urutan yang dianalisis selalu sama. Pesan tidak
          dapat dipindahkan dengan gestur tersembunyi.
        </p>
      </div>
      <SectionHeading
        eyebrow="Timeline tekanan"
        title="Susun dari pesan pertama."
        description="Setiap item memiliki pengirim dan isi sendiri. Tambahkan pesan baru setelah item terakhir agar kronologinya tetap jelas."
      />
      <ConversationClient />
    </ProductSection>
  );
}

import type { Metadata } from "next";
import { LearnSection } from "@/app/learn/_components/learn-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { getKnowledgeIndex } from "@/server/rag/retriever";

export const metadata: Metadata = {
  title: "Pelajari pola penipuan — AmanKlik AI",
  description:
    "Pelajari prinsip keselamatan digital dari sumber resmi dan terapkan model mentalnya pada pesan yang mencurigakan.",
};

export default function LearnPage() {
  const topics = getKnowledgeIndex().chunks;

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="03 / Pelajari"
        title="Kenali polanya sendiri."
        description="Baca prinsip keselamatan digital yang dapat dipakai kembali: kenali tekanan, lindungi rahasia, baca domain, dan verifikasi klaim melalui kanal yang kamu cari sendiri."
        annotation={
          <p>
            Setiap bacaan menyebut penerbit dan domain sumber resmi agar kamu
            dapat memeriksa konteks asalnya.
          </p>
        }
        pattern="reading"
      >
        Indeks terkurasi · {topics.length} bacaan · sumber eksternal bernama
      </RouteIntro>

      <LearnSection
        topics={topics.map(({
          id,
          title,
          documentTitle,
          text,
          sourceUrl,
          publisher,
        }) => ({
          id,
          title,
          documentTitle,
          text,
          sourceUrl,
          publisher,
        }))}
      />
    </PageFrame>
  );
}

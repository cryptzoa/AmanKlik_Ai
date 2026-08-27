import type { Metadata } from "next";
import { LearnSection } from "@/app/learn/_components/learn-section";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { getKnowledgeIndex } from "@/server/rag/retriever";

export const metadata: Metadata = {
  title: "Pelajari pola penipuan | AmanKlik AI",
  description:
    "Pelajari prinsip keselamatan digital dari sumber resmi dan gunakan pada pesan yang mencurigakan.",
};

export default function LearnPage() {
  const topics = getKnowledgeIndex().chunks;

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="Pelajari polanya"
        title="Kenali polanya sendiri."
        description="Pelajari cara mengenali desakan, melindungi data rahasia, membaca alamat situs, dan memeriksa klaim lewat sumber resmi yang kamu cari sendiri."
        annotation={
          <p>
            Setiap bacaan menyebut penerbit dan alamat sumber resmi agar kamu
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

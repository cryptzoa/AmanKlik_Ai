import { LearnSection } from "@/app/learn/_components/learn-section";
import { getKnowledgeIndex } from "@/server/rag/retriever";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Learn — AmanKlik AI",
};

export default function LearnPage() {
  const topics = getKnowledgeIndex().chunks;

  return (
    <InteriorShell
      eyebrow="03 / Pelajari"
      title="Kenali polanya sendiri."
      description="Baca prinsip keselamatan digital yang dipakai AmanKlik saat menyusun konteks dan tindakan aman—langsung dari sumber resmi."
      marker="BACA / INGAT / TERAPKAN"
      fragments={["RAHASIA", "DOMAIN", "VERIFIKASI"]}
    >
      <LearnSection
        topics={topics.map((
          { id, documentTitle, text, sourceUrl, publisher },
        ) => ({ id, documentTitle, text, sourceUrl, publisher }))}
      />
    </InteriorShell>
  );
}

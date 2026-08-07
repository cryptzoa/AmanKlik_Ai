import Link from "next/link";
import { getKnowledgeIndex } from "@/server/rag/retriever";
import { InteriorShell } from "@/components/site/interior-shell";

export const metadata = {
  title: "Learn — AmanKlik AI",
};

export default function LearnPage() {
  const topics = getKnowledgeIndex().chunks;

  return (
    <InteriorShell
      eyebrow="03 / Learn"
      title="Kenali polanya sendiri."
      description="Baca prinsip keselamatan digital yang dipakai AmanKlik saat menyusun konteks dan tindakan aman—langsung dari sumber resmi."
      marker="BACA / INGAT / TERAPKAN"
      fragments={["RAHASIA", "DOMAIN", "VERIFIKASI"]}
    >
      <section data-reveal>
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
          <h2 className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl">Pengetahuan yang tetap berguna setelah hasil scan ditutup.</h2>
          <p className="font-mono text-xs uppercase leading-6 tracking-[0.14em] text-muted lg:justify-self-end">{topics.length.toString().padStart(2, "0")} catatan terkurasi<br />Sumber resmi</p>
        </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {topics.map((topic, index) => (
              <article key={topic.id} data-reveal-card className="group relative flex min-h-96 flex-col overflow-hidden bg-surface p-6 transition-colors hover:bg-ai-soft sm:p-8">
                <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <span className="absolute right-6 top-5 text-2xl text-line transition-transform group-hover:translate-x-1 group-hover:text-ai" aria-hidden="true">↗</span>
                <h3 className="mt-12 max-w-sm text-3xl font-semibold leading-tight tracking-[-0.04em]">{topic.documentTitle}</h3>
                <p className="mt-4 line-clamp-5 leading-7 text-muted">{topic.text}</p>
                <a className="mt-auto pt-6 text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai" href={topic.sourceUrl} rel="noreferrer" target="_blank">
                  Sumber resmi · {topic.publisher}
                </a>
              </article>
            ))}
          </div>
        <div data-reveal className="mt-16 flex flex-col gap-6 bg-ink p-7 text-surface sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <p className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.03em]">Sudah mengenali polanya? Uji satu pesan tanpa membuka tautannya.</p>
          <Link className="lift-link inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-surface px-6 font-semibold text-ink hover:bg-warning" href="/scan">Buka scanner →</Link>
        </div>
      </section>
    </InteriorShell>
  );
}

import Link from "next/link";
import { getKnowledgeIndex } from "@/server/rag/retriever";

export const metadata = {
  title: "Learn — AmanKlik AI",
};

export default function LearnPage() {
  const topics = getKnowledgeIndex().chunks;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">AmanKlik AI</Link>
          <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface" href="/scan">Cek pesan</Link>
        </header>
        <section className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ai">AmanKlik / Learn</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">Pola yang bisa kamu kenali sendiri.</h1>
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {topics.map((topic, index) => (
              <article key={topic.id} className="flex min-h-80 flex-col bg-surface p-6 sm:p-8">
                <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="mt-8 text-2xl font-semibold">{topic.documentTitle}</h2>
                <p className="mt-4 line-clamp-5 leading-7 text-muted">{topic.text}</p>
                <a className="mt-auto pt-6 text-sm font-semibold text-ai underline decoration-ai/30 underline-offset-4 hover:decoration-ai" href={topic.sourceUrl} rel="noreferrer" target="_blank">
                  Sumber resmi · {topic.publisher}
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

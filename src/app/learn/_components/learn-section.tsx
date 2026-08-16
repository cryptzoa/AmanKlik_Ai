import { LearnPrintButton } from "@/app/learn/_components/learn-print-button";
import { TransitionLink as Link } from "@/components/site/transition-link";

export type LearnTopic = {
  id: string;
  title: string;
  documentTitle: string;
  text: string;
  sourceUrl: string;
  publisher: string;
};

function getSourceDomain(sourceUrl: string): string {
  return new URL(sourceUrl).hostname.replace(/^www\./, "");
}

function TopicIndex({ topics }: { topics: LearnTopic[] }) {
  return (
    <ol className="mt-5 divide-y divide-line border-y border-line">
      {topics.map((topic, index) => (
        <li key={topic.id}>
          <a
            href={`#topic-${topic.id}`}
            className="group grid min-h-11 grid-cols-[2rem_minmax(0,1fr)] items-start gap-2 py-3 text-sm leading-5 text-muted transition-colors hover:text-ink focus-visible:text-ink"
          >
            <span className="font-mono text-[10px] font-semibold tabular-nums text-ai">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="break-words [overflow-wrap:anywhere]">
              {topic.documentTitle}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function LearnSection({ topics }: { topics: LearnTopic[] }) {
  const interludeAfter = Math.max(0, Math.min(3, topics.length - 1));

  return (
    <section className="product-section" aria-labelledby="learn-reading-title">
      <div className="product-wide-canvas">
        <div className="flex flex-col gap-6 border-b border-[var(--line-strong)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ai">
              Indeks keselamatan
            </p>
            <h2
              id="learn-reading-title"
              className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
            >
              Prinsip yang tetap berguna setelah hasil ditutup.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {topics.length.toString().padStart(2, "0")} bacaan
            </span>
            <LearnPrintButton />
          </div>
        </div>

        {topics.length === 0 ? (
          <div className="product-empty-state" role="status">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Belum ada bacaan
            </p>
            <h2>Belum ada topik untuk dibaca</h2>
            <p className="product-empty-state__copy">
              Materi berhasil dimuat, tetapi belum ada bacaan yang tersedia.
              Coba lagi nanti.
            </p>
          </div>
        ) : (
          <>
            <details className="product-print-hidden mt-8 border-y border-[var(--line-strong)] lg:hidden">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between py-3 font-semibold">
                Lihat daftar topik
                <span className="font-mono text-xs text-muted" aria-hidden="true">
                  {topics.length.toString().padStart(2, "0")} ↓
                </span>
              </summary>
              <nav aria-label="Daftar topik seluler" className="pb-5">
                <TopicIndex topics={topics} />
              </nav>
            </details>

            <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(14rem,0.32fr)_minmax(0,0.68fr)] lg:gap-20">
              <aside className="product-print-hidden sticky top-28 hidden lg:block">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Daftar topik
                </p>
                <nav aria-label="Daftar topik desktop">
                  <TopicIndex topics={topics} />
                </nav>
              </aside>

              <div className="min-w-0 max-w-[760px]">
                {topics.map((topic, index) => {
                  const domain = getSourceDomain(topic.sourceUrl);

                  return (
                    <div key={topic.id}>
                      <article
                        id={`topic-${topic.id}`}
                        className="scroll-mt-28 border-t border-line py-10"
                        aria-labelledby={`topic-title-${topic.id}`}
                      >
                        <div className="flex items-start justify-between gap-5">
                          <span className="font-mono text-[11px] font-semibold tabular-nums text-ai">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="max-w-[34rem] text-right font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.12em] text-muted">
                            {topic.title}
                          </span>
                        </div>
                        <h3
                          id={`topic-title-${topic.id}`}
                          className="mt-7 break-words text-3xl font-semibold leading-[1.08] tracking-[-0.045em] [overflow-wrap:anywhere] sm:text-4xl"
                        >
                          {topic.documentTitle}
                        </h3>
                        <p className="mt-6 max-w-[70ch] text-base leading-8 text-ink-soft sm:text-[1.0625rem]">
                          {topic.text}
                        </p>
                        <a
                          className="product-source-link mt-7 border transition-colors"
                          href={topic.sourceUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                          aria-label={`Buka sumber resmi ${topic.publisher} di ${domain} pada tab baru`}
                        >
                          <span className="product-source-link__label">
                            Sumber resmi · {topic.publisher}
                          </span>
                          <span className="product-source-link__arrow" aria-hidden="true">↗</span>
                        </a>
                      </article>

                      {index === interludeAfter ? (
                        <aside
                          className="my-8 border-y border-white/15 bg-ink px-6 py-9 text-surface print:border-black print:bg-white print:text-black sm:px-9 sm:py-11"
                          aria-labelledby="learn-model-title"
                        >
                          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ai-soft">
                            Prinsip sederhana
                          </p>
                          <h3
                            id="learn-model-title"
                            className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl"
                          >
                            Periksa klaim lewat sumber yang berbeda.
                          </h3>
                          <p className="mt-4 max-w-[60ch] leading-7 text-white/65 print:text-black">
                            Jangan memakai nomor, tautan, file, atau petunjuk dari
                            pesan sebagai satu-satunya bukti. Buka sendiri aplikasi,
                            situs, atau nomor resmi yang sudah kamu percaya.
                          </p>
                        </aside>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-14 grid gap-6 border-t-2 border-ai bg-surface px-6 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-8">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ai">
                  Terapkan pada satu pesan
                </p>
                <p className="mt-3 max-w-2xl text-xl font-semibold leading-snug tracking-[-0.025em]">
                  Gunakan prinsipnya untuk berhenti, memeriksa tanda bahaya, dan
                  memilih sumber pemeriksaan yang terpisah.
                </p>
              </div>
              <Link
                className="product-button product-button--primary product-print-hidden w-fit"
                href="/scan"
              >
                Periksa pesan
                <span className="ml-3" aria-hidden="true">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

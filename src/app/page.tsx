import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-10 lg:px-16">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">
          AmanKlik AI
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link className="hover:text-ink" href="/scan">Scan</Link>
          <Link className="hover:text-ink" href="/simulator">Simulator</Link>
          <Link className="hover:text-ink" href="/learn">Learn</Link>
          <Link className="hover:text-ink" href="/history">History</Link>
        </nav>
        <Link
          className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-surface transition hover:bg-ai"
          href="/scan"
        >
          Cek pesan
        </Link>
      </header>

      <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.24em] text-muted">
            Digital safety / explainable AI
          </p>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-8xl">
            Jangan percaya pesannya sebelum memahami risikonya.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
            AmanKlik AI membaca pola manipulasi, struktur tautan, dan konteks pesan
            untuk menjelaskan tanda risiko—bukan sekadar memberi label.
          </p>
          <Link
            className="mt-10 inline-flex min-h-11 items-center rounded-full bg-risk px-6 py-3 font-semibold text-white transition hover:translate-y-[-2px]"
            href="/scan"
          >
            Periksa sekarang <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>

        <aside className="border-l border-line pl-6 text-sm text-muted sm:pl-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ai">
            Bootstrap / Phase 0
          </p>
          <p className="mt-5 max-w-xs leading-7">
            Fondasi aplikasi sedang disiapkan: validasi, rules, AI, dan hasil yang
            bisa dijelaskan akan mengikuti kontrak produk.
          </p>
        </aside>
      </section>
    </main>
  );
}

import { ScanClient } from "@/app/scan/scan-client";
import Link from "next/link";

export const metadata = {
  title: "Periksa pesan — AmanKlik AI",
};

export default function ScanPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">
            AmanKlik AI
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted">
            <Link className="hover:text-ink" href="/history" prefetch={false}>History</Link>
            <Link className="rounded-full bg-ink px-4 py-2 font-semibold text-surface" href="/">Beranda</Link>
          </nav>
        </header>
        <section className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ai">AmanKlik / Scan</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
            Apa yang ingin kamu periksa?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Pahami tanda risikonya sebelum mengeklik, membalas, atau mengirim sesuatu.
          </p>
          <ScanClient />
        </section>
      </div>
    </main>
  );
}

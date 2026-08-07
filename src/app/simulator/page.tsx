import Link from "next/link";

import { SimulatorClient } from "@/app/simulator/simulator-client";

export const metadata = {
  title: "Simulator — AmanKlik AI",
};

export default function SimulatorPage() {
  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">AmanKlik AI</Link>
          <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface" href="/scan">Cek pesan</Link>
        </header>
        <section className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ai">AmanKlik / Simulator</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">Latih keputusanmu tanpa risiko nyata.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Kenali pola tekanan, rahasia, identitas, dan tautan lewat skenario sintetis.</p>
          <SimulatorClient />
        </section>
      </div>
    </main>
  );
}

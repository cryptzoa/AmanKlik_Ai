import { listScansForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import type { RiskLevel } from "@/types/analysis";
import Link from "next/link";

const labels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export const dynamic = "force-dynamic";
type HistoryRow = Awaited<ReturnType<typeof listScansForSession>>[number];

export default async function HistoryPage() {
  const sessionId = await getAnonymousSessionId({ create: false });
  let rows: HistoryRow[] = [];
  let storageUnavailable = false;
  if (sessionId) {
    try {
      rows = await listScansForSession(sessionId);
    } catch {
      storageUnavailable = true;
    }
  }

  return (
    <main className="min-h-screen px-5 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-line pb-6">
          <Link className="font-mono text-sm font-semibold uppercase tracking-[0.2em]" href="/">AmanKlik AI</Link>
          <Link className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface" href="/scan">Cek pesan</Link>
        </header>
        <section className="py-16 sm:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-ai">AmanKlik / History</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">Pemeriksaan terakhir</h1>
          <p className="mt-6 max-w-xl leading-7 text-muted">Riwayat ini hanya terkait sesi anonim di browser ini dan tidak menyimpan screenshot asli.</p>

          {storageUnavailable ? (
            <div className="mt-12 border-y border-line py-12">
              <h2 className="text-2xl font-semibold">Riwayat belum tersedia</h2>
              <p className="mt-3 max-w-xl text-muted">Penyimpanan database belum terhubung. Hasil tidak ditampilkan sebagai riwayat sampai penyimpanan siap.</p>
            </div>
          ) : rows.length ? (
            <div className="mt-12 divide-y divide-line border-y border-line">
              {rows.map((row) => (
                <Link key={row.id} href={`/result/${row.id}`} className="grid gap-3 py-5 transition hover:bg-surface sm:grid-cols-[100px_1fr_auto] sm:items-center">
                  <span className="font-mono text-xs uppercase text-muted">{row.inputType}</span>
                  <span><strong className="block">{labels[row.riskLevel]}</strong><span className="mt-1 block truncate text-sm text-muted">{row.previewRedacted ?? "Tanpa preview teks"}</span></span>
                  <span className="font-mono text-sm">{row.finalScore}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-12 border-y border-line py-12">
              <h2 className="text-2xl font-semibold">Belum ada pemeriksaan</h2>
              <p className="mt-3 text-muted">Hasil yang kamu periksa di sesi ini akan muncul di sini.</p>
              <Link className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-surface" href="/scan">Mulai periksa</Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

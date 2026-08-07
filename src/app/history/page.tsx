import { listScansForSession } from "@/db/repositories/scan-repository";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import type { RiskLevel } from "@/types/analysis";
import Link from "next/link";
import { InteriorShell } from "@/components/site/interior-shell";

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
    <InteriorShell
      eyebrow="04 / History"
      title="Jejak pemeriksaanmu."
      description="Riwayat hanya terhubung ke sesi anonim browser ini. Screenshot asli dan teks mentah tidak ditampilkan kembali."
      marker="SESI LOKAL / PRIVAT"
      fragments={["TANPA AKUN", "REDACTED", `${rows.length} HASIL`]}
      compact
    >
      <section data-reveal>
        <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Pemeriksaan terakhir</h2>
          <Link className="lift-link inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 font-semibold text-surface hover:bg-ai" href="/scan">Periksa pesan baru →</Link>
        </div>
          {storageUnavailable ? (
            <div data-reveal-card className="motion-surface mt-12 p-8 sm:p-12">
              <h2 className="text-2xl font-semibold">Riwayat belum tersedia</h2>
              <p className="mt-3 max-w-xl text-muted">Penyimpanan database belum terhubung. Hasil tidak ditampilkan sebagai riwayat sampai penyimpanan siap.</p>
            </div>
          ) : rows.length ? (
            <div className="mt-12 grid gap-3">
              {rows.map((row) => (
                <Link key={row.id} data-reveal-card href={`/result/${row.id}`} className="lift-link group grid gap-4 border border-line bg-surface p-5 hover:border-ink sm:grid-cols-[110px_1fr_100px] sm:items-center sm:p-6">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted">{row.inputType}</span>
                  <span><strong className="block text-xl tracking-[-0.02em]">{labels[row.riskLevel]}</strong><span className="mt-1 block truncate text-sm text-muted">{row.previewRedacted ?? "Tanpa preview teks"}</span></span>
                  <span className="flex items-center justify-between font-mono text-3xl font-semibold sm:justify-end"><span>{row.finalScore}</span><span className="ml-5 text-base text-muted transition-transform group-hover:translate-x-1">→</span></span>
                </Link>
              ))}
            </div>
          ) : (
            <div data-reveal-card className="motion-surface mt-12 grid min-h-72 place-items-center p-8 text-center sm:p-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-ai">0 hasil</span>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Belum ada pemeriksaan</h2>
                <p className="mt-3 text-muted">Hasil yang kamu periksa di sesi ini akan muncul di sini.</p>
                <Link className="lift-link mt-7 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-surface hover:bg-ai" href="/scan">Mulai periksa</Link>
              </div>
            </div>
          )}
      </section>
    </InteriorShell>
  );
}

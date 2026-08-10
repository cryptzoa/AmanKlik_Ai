import Link from "next/link";
import { notFound } from "next/navigation";

import { EvidenceGraph } from "@/components/investigation/evidence-graph";
import { InteriorShell } from "@/components/site/interior-shell";
import { getInvestigationCase } from "@/db/repositories/investigation-repository";
import { scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";

export const dynamic = "force-dynamic";

export default async function InvestigationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!scanIdSchema.safeParse(id).success) notFound();
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId) notFound();
  let investigation;
  try { investigation = await getInvestigationCase(id, sessionId); } catch { notFound(); }
  if (!investigation) notFound();

  return <InteriorShell eyebrow="07 / Case" title={investigation.title} description={investigation.summary} marker="RELATIONSHIP MAP" fragments={[investigation.riskLevel.replace("_", " "), `${investigation.scans.length} SUMBER`, `${investigation.graph.nodes.length} NODE`]} compact>
    <section data-reveal className="grid gap-6 border-b border-line pb-10 sm:grid-cols-[140px_1fr] sm:items-end"><div><p className="font-mono text-xs uppercase text-muted">Case score</p><p className="mt-2 font-mono text-7xl font-semibold">{investigation.finalScore}</p></div><div><p className="max-w-2xl leading-7 text-muted">Skor kasus mengikuti risiko tertinggi di antara sumber agar indikator penting tidak tertutup oleh rata-rata. Ini bukan probabilitas penipuan.</p><Link className="mt-5 inline-flex min-h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-semibold hover:border-ai hover:text-ai" href="/investigate">← Semua kasus</Link></div></section>
    <EvidenceGraph graph={investigation.graph} />
    <section data-reveal className="py-12" aria-labelledby="source-heading"><p className="font-mono text-xs uppercase tracking-[0.18em] text-ai">Sources</p><h2 id="source-heading" className="mt-3 text-3xl font-semibold">Hasil yang terhubung</h2><div className="mt-7 grid gap-2">{investigation.scans.map((scan) => <Link key={scan.id} href={`/result/${scan.id}`} className="lift-link grid gap-3 border border-line bg-surface p-5 hover:border-ink sm:grid-cols-[110px_1fr_70px] sm:items-center"><span className="font-mono text-xs uppercase text-muted">{scan.inputType}</span><span><strong className="block">{scan.result.summary}</strong><span className="mt-1 block text-xs text-muted">{scan.result.indicators.length} indikator · {scan.riskLevel.replace("_", " ")}</span></span><span className="font-mono text-3xl font-semibold sm:text-right">{scan.finalScore}</span></Link>)}</div></section>
  </InteriorShell>;
}

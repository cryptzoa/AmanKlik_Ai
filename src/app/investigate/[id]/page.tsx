import { ArtifactsSection } from "@/app/investigate/[id]/_components/artifacts-section";
import { CaseScoreSection } from "@/app/investigate/[id]/_components/case-score-section";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EvidenceGraph } from "@/app/investigate/[id]/_components/evidence-graph";
import { PageFrame } from "@/components/product/page-frame";
import { RouteIntro } from "@/components/product/route-intro";
import { getInvestigationCase } from "@/db/repositories/investigation-repository";
import { scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail investigasi | AmanKlik",
  description: "Bandingkan artefak dan pola berulang dalam kasus AmanKlik.",
  robots: { index: false, follow: false },
};

export default async function InvestigationDetailPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!scanIdSchema.safeParse(id).success) notFound();
  const sessionId = await getAnonymousSessionId({ create: false });
  if (!sessionId) notFound();
  let investigation;
  try {
    investigation = await getInvestigationCase(id, sessionId);
  } catch (error) {
    reportServerError("investigation.detail", error);
    throw error;
  }
  if (!investigation) notFound();

  const sharedPatternCount = investigation.graph.nodes.filter((node) =>
    node.kind === "signal" || node.kind === "domain"
  ).length;

  return (
    <PageFrame>
      <RouteIntro
        eyebrow="07 / Detail investigasi"
        title={investigation.title}
        description={investigation.summary}
        pattern="analysis"
        annotation={
          <dl className="investigation-case-facts">
            <div>
              <dt>Tingkat kasus</dt>
              <dd>{investigation.riskLevel.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt>Ruang banding</dt>
              <dd>{investigation.scans.length} artefak</dd>
            </div>
            <div>
              <dt>Pola bersama</dt>
              <dd>{sharedPatternCount}</dd>
            </div>
          </dl>
        }
      >
        <p>
          Diperbarui{" "}
          <time dateTime={investigation.updatedAt}>
            {new Intl.DateTimeFormat("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Asia/Jakarta",
            }).format(new Date(investigation.updatedAt))}
          </time>
        </p>
      </RouteIntro>
      <CaseScoreSection score={investigation.finalScore} />
      <EvidenceGraph graph={investigation.graph} />
      <ArtifactsSection
        artifacts={investigation.scans.map((scan) => ({
          id: scan.id,
          inputType: scan.inputType,
          riskLevel: scan.riskLevel,
          finalScore: scan.finalScore,
          summary: scan.result.summary,
          indicatorCount: scan.result.indicators.length,
        }))}
      />
    </PageFrame>
  );
}

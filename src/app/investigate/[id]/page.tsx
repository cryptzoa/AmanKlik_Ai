import { ArtifactsSection } from "@/app/investigate/[id]/_components/artifacts-section";
import { CaseScoreSection } from "@/app/investigate/[id]/_components/case-score-section";
import { notFound } from "next/navigation";

import { EvidenceGraph } from "@/app/investigate/[id]/_components/evidence-graph";
import { InteriorShell } from "@/components/site/interior-shell";
import { getInvestigationCase } from "@/db/repositories/investigation-repository";
import { scanIdSchema } from "@/lib/validation";
import { getAnonymousSessionId } from "@/server/session/anonymous-session";
import { reportServerError } from "@/server/observability/report-error";

export const dynamic = "force-dynamic";

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

  return (
    <InteriorShell
      eyebrow="07 / Case"
      title={investigation.title}
      description={investigation.summary}
      marker="ARTEFAK UNIK / POLA BERSAMA"
      fragments={[
        investigation.riskLevel.replace("_", " "),
        `${investigation.scans.length} ARTEFAK`,
        `${
          investigation.graph.nodes.filter((node) =>
            node.kind === "signal" || node.kind === "domain"
          ).length
        } POLA`,
      ]}
      compact
    >
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
    </InteriorShell>
  );
}

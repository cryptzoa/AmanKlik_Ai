import Link from "next/link";

import { ProductSection, SectionHeading } from "@/components/product/primitives";
import type { InputType, RiskLevel } from "@/types/analysis";

export type CaseArtifact = {
  id: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  finalScore: number;
  summary: string;
  indicatorCount: number;
};

export function ArtifactsSection({ artifacts }: { artifacts: CaseArtifact[] }) {
  return (
    <ProductSection width="wide" className="investigation-source-section">
      <SectionHeading
        eyebrow="Sumber kasus"
        title="Buka artefak satu per satu"
        description="Setiap ringkasan mengarah kembali ke hasil analisis milik sesi browser ini. Detail mentah tidak digabungkan ke dalam peta hubungan."
        id="source-heading"
      />
      <div className="investigation-source-list" aria-labelledby="source-heading">
        {artifacts.map((artifact) => (
          <Link
            key={artifact.id}
            prefetch={false}
            href={`/result/${artifact.id}`}
            className="investigation-source-row"
            aria-label={`Buka hasil ${artifact.inputType}: ${artifact.summary}, skor ${artifact.finalScore} dari 100`}
          >
            <span className="investigation-source-row__kind">
              {artifact.inputType.replaceAll("_", " ")}
            </span>
            <span className="investigation-source-row__body">
              <strong>{artifact.summary}</strong>
              <span>
                {artifact.indicatorCount} indikator ·{" "}
                {artifact.riskLevel.replaceAll("_", " ")}
              </span>
            </span>
            <span className="investigation-source-row__score" aria-hidden="true">
              <strong>{artifact.finalScore}</strong><small>/100</small>
            </span>
            <span className="investigation-source-row__arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
      </div>
    </ProductSection>
  );
}

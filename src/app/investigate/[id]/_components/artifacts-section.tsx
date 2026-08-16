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

const inputLabels: Record<InputType, string> = {
  text: "Pesan",
  image: "Tangkapan layar",
  url: "Tautan",
  conversation: "Percakapan",
};

const riskLabels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

export function ArtifactsSection({ artifacts }: { artifacts: CaseArtifact[] }) {
  return (
    <ProductSection width="wide" className="investigation-source-section">
      <SectionHeading
        eyebrow="Hasil yang dibandingkan"
        title="Buka setiap hasil untuk melihat rinciannya"
        description="Setiap ringkasan mengarah kembali ke hasil pemeriksaan di sesi browser ini. Isi lengkap tidak disalin ke peta hubungan."
        id="source-heading"
      />
      <div className="investigation-source-list" aria-labelledby="source-heading">
        {artifacts.map((artifact) => (
          <Link
            key={artifact.id}
            prefetch={false}
            href={`/result/${artifact.id}`}
            className="investigation-source-row"
            aria-label={`Buka hasil ${inputLabels[artifact.inputType]}: ${artifact.summary}, skor ${artifact.finalScore} dari 100`}
          >
            <span className="investigation-source-row__kind">
              {inputLabels[artifact.inputType]}
            </span>
            <span className="investigation-source-row__body">
              <strong>{artifact.summary}</strong>
              <span>
                {artifact.indicatorCount} tanda ·{" "}
                {riskLabels[artifact.riskLevel]}
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

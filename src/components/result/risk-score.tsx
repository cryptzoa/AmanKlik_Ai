import type { RiskLevel } from "@/types/analysis";

const labels: Record<RiskLevel, string> = {
  LOW: "Risiko rendah",
  MEDIUM: "Risiko sedang",
  HIGH: "Risiko tinggi",
  VERY_HIGH: "Risiko sangat tinggi",
};

const colors: Record<RiskLevel, string> = {
  LOW: "text-safe",
  MEDIUM: "text-warning",
  HIGH: "text-risk",
  VERY_HIGH: "text-risk",
};

export function RiskScore({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <div aria-label={`${score} dari 100, ${labels[level]}`}>
      <div className={`text-8xl font-semibold leading-none tracking-[-0.08em] ${colors[level]}`}>{score}</div>
      <div className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.18em]">{labels[level]}</div>
    </div>
  );
}

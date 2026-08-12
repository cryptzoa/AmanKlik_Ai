import { AttackFamiliesSection } from "@/app/benchmark/_components/attack-families-section";
import { BenchmarkSummarySection } from "@/app/benchmark/_components/benchmark-summary-section";
import { CaseMatrixSection } from "@/app/benchmark/_components/case-matrix-section";
import { InteriorShell } from "@/components/site/interior-shell";
import { runAdversarialEvaluation } from "@/lib/evaluation/adversarial-runner";
import { runDeterministicEvaluation } from "@/lib/evaluation/runner";

export const dynamic = "force-dynamic";

export default function BenchmarkPage() {
  const regression = runDeterministicEvaluation();
  const adversarial = runAdversarialEvaluation();
  return (
    <InteriorShell
      eyebrow="11 / Benchmark"
      title="Buktikan batasnya secara terbuka."
      description="Dashboard pengujian sintetis untuk regresi, obfuscation, prompt injection, formatting, dan false-positive pressure."
      marker="TEST / FAIL / IMPROVE"
      fragments={[
        `${regression.passed}/${regression.total} REGRESSION`,
        `${adversarial.robustnessRate}% ROBUST`,
        "0 URL CALL",
      ]}
      compact
    >
      <BenchmarkSummarySection
        regression={regression}
        adversarial={adversarial}
      />
      <AttackFamiliesSection families={adversarial.byFamily} />
      <CaseMatrixSection cases={adversarial.cases} />
      <footer className="border-t border-line py-8 text-sm leading-7 text-muted">
        Generated{" "}
        {new Date(adversarial.generatedAt).toLocaleString("id-ID")}. Live Gemini
        smoke test tetap dipisahkan dan memerlukan konfirmasi eksplisit agar
        tidak menghabiskan quota secara tidak sengaja.
      </footer>
    </InteriorShell>
  );
}

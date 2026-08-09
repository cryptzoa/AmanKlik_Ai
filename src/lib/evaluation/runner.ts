import { EVALUATION_TEXT_FIXTURES, EVALUATION_URL_FIXTURES } from "@/lib/demo/evaluation-fixtures";
import { analyzeUrl } from "@/server/url/analyzer";
import { fuseRisk } from "@/server/risk/engine";
import { detectMessageSignals } from "@/server/risk/signals";

export type EvaluationCaseResult = {
  id: string;
  inputType: "text" | "url";
  category: string;
  score: number;
  expectedScore: readonly [number, number];
  passed: boolean;
  signalCategories: string[];
};

export type EvaluationSummary = {
  generatedAt: string;
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  urlNetworkCalls: number;
  cases: EvaluationCaseResult[];
};

export function runDeterministicEvaluation(): EvaluationSummary {
  const textResults: EvaluationCaseResult[] = EVALUATION_TEXT_FIXTURES.map((fixture) => {
    const signals = detectMessageSignals(fixture.text);
    const result = fuseRisk({
      inputType: "text",
      ruleSignals: signals,
      aiAvailable: false,
      claimedFinanceContext: /\b(?:bank|banking|rekening|kartu|akun)\b/i.test(fixture.text),
    });
    const [min, max] = fixture.expectedScore;

    return {
      id: fixture.id,
      inputType: "text",
      category: fixture.category,
      score: result.finalScore,
      expectedScore: fixture.expectedScore,
      passed: result.finalScore >= min && result.finalScore <= max,
      signalCategories: result.indicators.map((signal) => signal.category),
    };
  });

  const urlResults: EvaluationCaseResult[] = EVALUATION_URL_FIXTURES.map((fixture) => {
    const result = analyzeUrl(fixture.url);
    const [min, max] = fixture.expectedScore;

    return {
      id: fixture.id,
      inputType: "url",
      category: "url",
      score: result.structuralScore,
      expectedScore: fixture.expectedScore,
      passed: result.structuralScore >= min && result.structuralScore <= max,
      signalCategories: result.signals.map((signal) => signal.category),
    };
  });

  const cases = [...textResults, ...urlResults];
  const passed = cases.filter((item) => item.passed).length;

  return {
    generatedAt: new Date().toISOString(),
    total: cases.length,
    passed,
    failed: cases.length - passed,
    passRate: cases.length ? Math.round((passed / cases.length) * 100) : 0,
    urlNetworkCalls: 0,
    cases,
  };
}

export function formatEvaluationReport(summary: EvaluationSummary): string {
  const failures = summary.cases.filter((item) => !item.passed);
  const lines = [
    "# AmanKlik deterministic evaluation",
    "",
    `Generated: ${summary.generatedAt}`,
    `Cases: ${summary.passed}/${summary.total} passed (${summary.passRate}%)`,
    `URL network calls: ${summary.urlNetworkCalls}`,
    "",
    "## Result",
    "",
    failures.length ? "| ID | Type | Score | Expected | Signals |" : "All curated cases passed.",
    ...(failures.length ? ["|---|---|---:|---|---|", ...failures.map((item) => `| ${item.id} | ${item.inputType} | ${item.score} | ${item.expectedScore[0]}–${item.expectedScore[1]} | ${item.signalCategories.join(", ") || "—"} |`)] : []),
    "",
    "> This synthetic evaluation checks deterministic regression behavior. It is not a universal fraud-detection accuracy claim.",
  ];

  return lines.join("\n");
}

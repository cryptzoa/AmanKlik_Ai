import { ADVERSARIAL_FIXTURES } from "@/lib/demo/adversarial-fixtures";
import { detectMessageSignals } from "@/server/risk/signals";
import { fuseRisk } from "@/server/risk/engine";

export type AdversarialCaseResult = {
  id: string;
  family: string;
  score: number;
  detectedCategories: string[];
  expected: string;
  passed: boolean;
};

export type AdversarialSummary = {
  generatedAt: string;
  total: number;
  passed: number;
  failed: number;
  robustnessRate: number;
  urlNetworkCalls: 0;
  byFamily: Array<{ family: string; passed: number; total: number }>;
  cases: AdversarialCaseResult[];
};

export function runAdversarialEvaluation(): AdversarialSummary {
  const cases = ADVERSARIAL_FIXTURES.map((fixture): AdversarialCaseResult => {
    const signals = detectMessageSignals(fixture.text);
    const fusion = fuseRisk({ inputType: "text", ruleSignals: signals, aiAvailable: false, claimedFinanceContext: /\b(?:bank|rekening|akun)\b/i.test(fixture.text) });
    const categories = [...new Set(fusion.indicators.map((signal) => signal.category))];
    const passed = fixture.requiredCategories
      ? fixture.requiredCategories.every((category) => categories.includes(category))
      : fusion.finalScore <= (fixture.maximumScore ?? 20);
    return {
      id: fixture.id,
      family: fixture.family,
      score: fusion.finalScore,
      detectedCategories: categories,
      expected: fixture.requiredCategories ? `Detect: ${fixture.requiredCategories.join(", ")}` : `Score ≤ ${fixture.maximumScore ?? 20}`,
      passed,
    };
  });
  const families = [...new Set(cases.map((item) => item.family))];
  const passed = cases.filter((item) => item.passed).length;
  return {
    generatedAt: new Date().toISOString(),
    total: cases.length,
    passed,
    failed: cases.length - passed,
    robustnessRate: cases.length ? Math.round((passed / cases.length) * 100) : 0,
    urlNetworkCalls: 0,
    byFamily: families.map((family) => ({ family, passed: cases.filter((item) => item.family === family && item.passed).length, total: cases.filter((item) => item.family === family).length })),
    cases,
  };
}

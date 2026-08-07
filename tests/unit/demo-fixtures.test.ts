import { describe, expect, it } from "vitest";

import { EVALUATION_TEXT_FIXTURES, EVALUATION_URL_FIXTURES } from "@/lib/demo/evaluation-fixtures";
import { DEMO_TEXT_FIXTURES, DEMO_URL_FIXTURES } from "@/lib/demo/scan-fixtures";
import { detectMessageSignals } from "@/server/risk/signals";
import { fuseRisk } from "@/server/risk/engine";
import { analyzeUrl } from "@/server/url/analyzer";

const RESERVED_HOST = /(^|\.)(example\.(?:com|net|org)|example)$|^(?:192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/;

describe("synthetic demo fixtures", () => {
  it("provides the documented primary demos", () => {
    expect(DEMO_TEXT_FIXTURES.map((fixture) => fixture.id)).toEqual(["T1", "T2", "T3", "T4"]);
    expect(DEMO_URL_FIXTURES.map((fixture) => fixture.id)).toEqual(["U1", "U2", "U3"]);
  });

  it("meets the minimum evaluation-set counts", () => {
    expect(EVALUATION_TEXT_FIXTURES.filter((fixture) => fixture.category === "risky")).toHaveLength(10);
    expect(EVALUATION_TEXT_FIXTURES.filter((fixture) => fixture.category === "benign")).toHaveLength(10);
    expect(EVALUATION_TEXT_FIXTURES.filter((fixture) => fixture.category === "ambiguous")).toHaveLength(5);
    expect(EVALUATION_URL_FIXTURES).toHaveLength(8);
  });

  it("uses only reserved documentation hosts for URL fixtures", () => {
    const fixtures = [...DEMO_URL_FIXTURES, ...EVALUATION_URL_FIXTURES];
    expect(fixtures.every((fixture) => RESERVED_HOST.test(new URL(fixture.url).hostname))).toBe(true);
  });

  it("keeps deterministic evaluation scores inside the curated ranges", () => {
    for (const fixture of EVALUATION_TEXT_FIXTURES) {
      const ruleSignals = detectMessageSignals(fixture.text);
      const result = fuseRisk({
        inputType: "text",
        ruleSignals,
        aiAvailable: false,
        claimedFinanceContext: /\b(?:bank|banking|rekening|kartu|akun)\b/i.test(fixture.text),
      });
      expect(result.finalScore, fixture.id).toBeGreaterThanOrEqual(fixture.expectedScore[0]);
      expect(result.finalScore, fixture.id).toBeLessThanOrEqual(fixture.expectedScore[1]);
    }

    for (const fixture of EVALUATION_URL_FIXTURES) {
      const result = analyzeUrl(fixture.url);
      expect(result.structuralScore, fixture.id).toBeGreaterThanOrEqual(fixture.expectedScore[0]);
      expect(result.structuralScore, fixture.id).toBeLessThanOrEqual(fixture.expectedScore[1]);
    }
  });
});

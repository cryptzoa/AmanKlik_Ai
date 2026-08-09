import { describe, expect, it } from "vitest";

import { runDeterministicEvaluation } from "@/lib/evaluation/runner";

describe("deterministic evaluation runner", () => {
  it("passes the curated fixture baseline and never contacts URL targets", () => {
    const summary = runDeterministicEvaluation();

    expect(summary.total).toBe(33);
    expect(summary.failed).toBe(0);
    expect(summary.passRate).toBe(100);
    expect(summary.urlNetworkCalls).toBe(0);
  });

  it("keeps a stable case shape for review artifacts", () => {
    const summary = runDeterministicEvaluation();
    expect(summary.cases[0]).toMatchObject({ id: "R01", inputType: "text", passed: true });
    expect(summary.cases.at(-1)).toMatchObject({ id: "EU08", inputType: "url", passed: true });
  });
});

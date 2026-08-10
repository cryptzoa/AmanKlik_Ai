import { describe, expect, it } from "vitest";

import { runAdversarialEvaluation } from "@/lib/evaluation/adversarial-runner";

describe("adversarial evaluation", () => {
  it("covers obfuscation and false-positive pressure without URL calls", () => {
    const summary = runAdversarialEvaluation();
    expect(summary.total).toBeGreaterThanOrEqual(10);
    expect(summary.failed).toBe(0);
    expect(summary.byFamily.map((item) => item.family)).toEqual(expect.arrayContaining(["obfuscation", "prompt_injection", "false_positive"]));
    expect(summary.urlNetworkCalls).toBe(0);
  });
});

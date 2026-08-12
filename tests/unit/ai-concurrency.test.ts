import { describe, expect, it } from "vitest";

import { withAiConcurrency } from "@/server/ai/concurrency";

describe("AI concurrency guard", () => {
  it("limits simultaneous provider operations", async () => {
    let active = 0;
    let peak = 0;
    let releaseFirstBatch: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => { releaseFirstBatch = resolve; });

    const operations = Array.from({ length: 3 }, () => withAiConcurrency(async () => {
      active += 1;
      peak = Math.max(peak, active);
      await gate;
      active -= 1;
    }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(peak).toBe(2);
    releaseFirstBatch?.();
    await Promise.all(operations);
  });

  it("rejects work when the bounded queue is full", async () => {
    let releaseOperations: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => { releaseOperations = resolve; });
    const accepted = Array.from({ length: 10 }, () => withAiConcurrency(() => gate));

    await new Promise((resolve) => setTimeout(resolve, 0));
    await expect(withAiConcurrency(() => Promise.resolve())).rejects.toMatchObject({ code: "RATE_LIMITED" });
    releaseOperations?.();
    await Promise.all(accepted);
  });
});

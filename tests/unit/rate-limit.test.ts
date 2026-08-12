import { describe, expect, it } from "vitest";

import { consumeRateLimit } from "@/server/rate-limit/limiter";

describe("rate limiter", () => {
  it("rejects a subject after the configured fixed-window budget", async () => {
    const subject = `test-${crypto.randomUUID()}`;
    for (let index = 0; index < 10; index += 1) {
      await consumeRateLimit(subject);
    }

    await expect(consumeRateLimit(subject)).rejects.toMatchObject({ code: "RATE_LIMITED" });
  });

  it("keeps independent subjects isolated", async () => {
    const first = `test-${crypto.randomUUID()}`;
    const second = `test-${crypto.randomUUID()}`;
    await consumeRateLimit(first, 10);

    await expect(consumeRateLimit(second)).resolves.toBeUndefined();
  });
});

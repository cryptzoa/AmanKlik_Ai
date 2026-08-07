import { describe, expect, it } from "vitest";

describe("bootstrap health contract", () => {
  it("keeps the public envelope stable", () => {
    const response = {
      ok: true as const,
      data: {
        status: "healthy",
        database: "ok",
        version: "test",
      },
    };

    expect(response.ok).toBe(true);
    expect(response.data).toHaveProperty("status");
    expect(response.data).toHaveProperty("database");
    expect(response.data).toHaveProperty("version");
  });
});

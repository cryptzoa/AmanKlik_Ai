import { describe, expect, it } from "vitest";

import { hmacInput } from "@/lib/crypto";

describe("cache HMAC", () => {
  it("is stable for the same input and changes for different input", () => {
    expect(hmacInput("same")).toBe(hmacInput("same"));
    expect(hmacInput("same")).not.toBe(hmacInput("changed"));
    expect(hmacInput("same")).not.toBe("same");
  });
});

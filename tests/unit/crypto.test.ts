import { describe, expect, it } from "vitest";

import { hmacInput } from "@/lib/crypto";
import { hashCanonicalInput } from "@/server/scan/shared";

describe("cache HMAC", () => {
  it("is stable for the same input and changes for different input", () => {
    expect(hmacInput("same")).toBe(hmacInput("same"));
    expect(hmacInput("same")).not.toBe(hmacInput("changed"));
    expect(hmacInput("same")).not.toBe("same");
  });

  it("namespaces cache hashes by scan input type", () => {
    const value = "https://example.com/help/account";
    expect(hashCanonicalInput("text", value)).not.toBe(hashCanonicalInput("url", value));
  });
});

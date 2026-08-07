import { describe, expect, it } from "vitest";

import { redactEvidence, redactText } from "@/lib/redaction";

describe("redaction", () => {
  it("masks private contact and account-like values", () => {
    const result = redactText("Hubungi 081234567890 atau test.person@example.com. OTP 123456.");

    expect(result).not.toContain("081234567890");
    expect(result).not.toContain("test.person@example.com");
    expect(result).not.toContain("123456");
  });

  it("caps evidence length after redaction", () => {
    expect(redactEvidence("a".repeat(200))).toHaveLength(120);
  });
});

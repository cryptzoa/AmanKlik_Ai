import { describe, expect, it } from "vitest";

import { redactEvidence, redactText } from "@/lib/redaction";

describe("redaction", () => {
  it("masks private contact and account-like values", () => {
    const result = redactText("Hubungi 081234567890 atau test.person@example.com. OTP 123456.");

    expect(result).not.toContain("081234567890");
    expect(result).not.toContain("test.person@example.com");
    expect(result).not.toContain("123456");
  });

  it("masks separated phone, account, and verification numbers", () => {
    const result = redactText("Telepon 0812-3456-7890, rekening 1234 5678 9012 3456, kode OTP 12 34 56.");

    expect(result).not.toContain("3456-7890");
    expect(result).not.toContain("5678 9012");
    expect(result).not.toContain("12 34 56");
    expect(result).toContain("••");
  });

  it("caps evidence length after redaction", () => {
    expect(redactEvidence("a".repeat(200))).toHaveLength(120);
  });
});

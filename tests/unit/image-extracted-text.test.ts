import { describe, expect, it } from "vitest";

import { sanitizeExtractedImageText, sanitizeStoredImageResult } from "@/server/image/extracted-text";

describe("sanitizeExtractedImageText", () => {
  it("removes synthetic demo chrome before it can enter previews or evidence", () => {
    const extracted = "Akun Anda dibatasi hari ini. Balas dengan kode OTP. Tulis balasan... AMAN KLIK . DEMO Semua nama dan isi pesan bersifat fiktif.";

    expect(sanitizeExtractedImageText(extracted)).toBe("Akun Anda dibatasi hari ini. Balas dengan kode OTP.");
  });

  it("sanitizes old stored image results when they are read again", () => {
    const result = sanitizeStoredImageResult({ inputType: "image", previewRedacted: "Kode OTP. AMAN KLIK . DEMO Semua nama dan isi pesan bersifat fiktif.", indicators: [{ evidence: "OTP. Tulis balasan... AMAN KLIK . DEMO" }] } as never);

    expect(result.previewRedacted).toBe("Kode OTP.");
    expect(result.indicators[0]?.evidence).toBe("OTP.");
  });

  it("keeps the actual message context intact", () => {
    const extracted = "Jangan telepon dulu karena lagi meeting. Tolong transfer sekarang.";

    expect(sanitizeExtractedImageText(extracted)).toBe(extracted);
  });
});

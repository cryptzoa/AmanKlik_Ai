import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AnalysisResult } from "@/types/analysis";

const dbMocks = vi.hoisted(() => ({
  requireDb: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  returning: vi.fn(),
}));

vi.mock("@/db/client", () => ({ requireDb: dbMocks.requireDb }));

import { createScan } from "@/db/repositories/scan-repository";

describe("scan repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.returning.mockResolvedValue([{ id: "bc8ac3cc-a972-464b-8883-e15f5bfc902a" }]);
    dbMocks.values.mockReturnValue({ returning: dbMocks.returning });
    dbMocks.insert.mockReturnValue({ values: dbMocks.values });
    dbMocks.requireDb.mockReturnValue({ insert: dbMocks.insert });
  });

  it("persists the public result scanId as the database primary key", async () => {
    const result: AnalysisResult = {
      schemaVersion: 1,
      scanId: "bc8ac3cc-a972-464b-8883-e15f5bfc902a",
      inputType: "text",
      finalScore: 12,
      riskLevel: "LOW",
      summary: "Tidak ditemukan indikator risiko kuat.",
      analysisMode: "rules_only",
      aiAvailable: false,
      cacheHit: false,
      previewRedacted: "Pesan keluarga biasa.",
      indicators: [],
      urlAnalysis: null,
      actionPlan: [],
      uncertainty: "Konteks pengirim belum diverifikasi.",
      disclaimer: "Tetap verifikasi melalui kanal resmi.",
      createdAt: "2026-08-08T00:00:00.000Z",
    };

    await createScan({
      sessionId: "38ddd831-6835-4621-84d4-8df06a00c3a4",
      inputType: "text",
      inputHash: "a".repeat(64),
      previewRedacted: result.previewRedacted,
      result,
      analysisMode: "rules_only",
      aiAvailable: false,
      cacheHit: false,
    });

    expect(dbMocks.values).toHaveBeenCalledWith(
      expect.objectContaining({
        id: result.scanId,
        resultJson: result,
      }),
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";

import type { AnalysisResult } from "@/types/analysis";

const dbMocks = vi.hoisted(() => ({
  requireDb: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  returning: vi.fn(),
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("@/db/client", () => ({ requireDb: dbMocks.requireDb }));

import { createScan, getScanForSession } from "@/db/repositories/scan-repository";

function analysisResult(scanId = "bc8ac3cc-a972-464b-8883-e15f5bfc902a"): AnalysisResult {
  return {
    schemaVersion: 1,
    scanId,
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
}

describe("scan repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.returning.mockResolvedValue([{ id: "bc8ac3cc-a972-464b-8883-e15f5bfc902a" }]);
    dbMocks.values.mockReturnValue({ returning: dbMocks.returning });
    dbMocks.insert.mockReturnValue({ values: dbMocks.values });
    dbMocks.select.mockReturnValue({ from: dbMocks.from });
    dbMocks.from.mockReturnValue({ where: dbMocks.where });
    dbMocks.where.mockReturnValue({ limit: dbMocks.limit });
    dbMocks.requireDb.mockReturnValue({ insert: dbMocks.insert, select: dbMocks.select });
  });

  it("persists the public result scanId as the database primary key", async () => {
    const result = analysisResult();

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

  it("rejects expired rows in the ownership query and returns the canonical row id", async () => {
    const rowId = "bc8ac3cc-a972-464b-8883-e15f5bfc902a";
    dbMocks.limit.mockResolvedValue([{
      id: rowId,
      sessionId: "38ddd831-6835-4621-84d4-8df06a00c3a4",
      inputType: "text",
      inputHash: "a".repeat(64),
      previewRedacted: "Pesan keluarga biasa.",
      finalScore: 12,
      riskLevel: "LOW",
      analysisMode: "rules_only",
      aiAvailable: false,
      cacheHit: false,
      modelId: null,
      providerLatencyMs: null,
      resultJson: analysisResult("77c679b4-b47f-4034-a15a-1eb9b1f177cc"),
      createdAt: new Date("2026-08-08T00:00:00.000Z"),
      expiresAt: new Date("2026-08-09T00:00:00.000Z"),
    }]);

    const row = await getScanForSession(rowId, "38ddd831-6835-4621-84d4-8df06a00c3a4");
    const condition = dbMocks.where.mock.calls[0]?.[0];
    const query = new PgDialect().sqlToQuery(condition);

    expect(query.sql).toContain('"scans"."expires_at" >');
    expect(row?.resultJson.scanId).toBe(rowId);
  });
});

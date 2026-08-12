import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  requireDb: vi.fn(),
  transaction: vi.fn(),
  execute: vi.fn(),
  select: vi.fn(),
  from: vi.fn(),
  where: vi.fn(),
  insert: vi.fn(),
  values: vi.fn(),
  returning: vi.fn(),
}));

vi.mock("@/db/client", () => ({ requireDb: dbMocks.requireDb }));

import { createIntegrationTokenRecord } from "@/db/repositories/integration-token-repository";

describe("integration token repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue([]);
    dbMocks.select.mockReturnValue({ from: dbMocks.from });
    dbMocks.from.mockReturnValue({ where: dbMocks.where });
    dbMocks.insert.mockReturnValue({ values: dbMocks.values });
    dbMocks.values.mockReturnValue({ returning: dbMocks.returning });
    dbMocks.transaction.mockImplementation(async (callback) => callback({
      execute: dbMocks.execute,
      select: dbMocks.select,
      insert: dbMocks.insert,
    }));
    dbMocks.requireDb.mockReturnValue({ transaction: dbMocks.transaction });
  });

  it("serializes issuance and rejects a session at its active-token cap", async () => {
    dbMocks.where.mockResolvedValue([{ count: 5 }]);

    await expect(createIntegrationTokenRecord({
      sessionId: "38ddd831-6835-4621-84d4-8df06a00c3a4",
      name: "Browser utama",
      tokenHash: "a".repeat(64),
    }, 5)).rejects.toMatchObject({ code: "INVALID_INPUT" });

    expect(dbMocks.execute).toHaveBeenCalledOnce();
    expect(dbMocks.insert).not.toHaveBeenCalled();
  });

  it("creates the token within the same locked transaction when capacity remains", async () => {
    const record = {
      id: "bc8ac3cc-a972-464b-8883-e15f5bfc902a",
      name: "Browser utama",
      createdAt: new Date("2026-08-13T00:00:00.000Z"),
      expiresAt: new Date("2026-11-11T00:00:00.000Z"),
    };
    dbMocks.where.mockResolvedValue([{ count: 4 }]);
    dbMocks.returning.mockResolvedValue([record]);

    await expect(createIntegrationTokenRecord({
      sessionId: "38ddd831-6835-4621-84d4-8df06a00c3a4",
      name: record.name,
      tokenHash: "a".repeat(64),
    }, 5)).resolves.toEqual(record);

    expect(dbMocks.execute).toHaveBeenCalledOnce();
    expect(dbMocks.insert).toHaveBeenCalledOnce();
  });
});

import "server-only";

import { desc, gt } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { scans } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";

export async function listRecentIntelligenceSources(since: Date, limit = 500) {
  try {
    return await requireDb().select({
      id: scans.id,
      sessionId: scans.sessionId,
      inputType: scans.inputType,
      riskLevel: scans.riskLevel,
      result: scans.resultJson,
      createdAt: scans.createdAt,
    }).from(scans).where(gt(scans.createdAt, since)).orderBy(desc(scans.createdAt)).limit(Math.min(limit, 1_000));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to build intelligence snapshot");
  }
}

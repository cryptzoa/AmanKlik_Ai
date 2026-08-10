import "server-only";

import { and, eq, gt, ne } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { scanOutcomes } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";

export type OutcomeVerdict = "prevented" | "confirmed_scam" | "legitimate" | "uncertain";
export type OutcomeImpact = "none" | "data_shared" | "account_compromised" | "money_lost";

export async function getScanOutcome(scanId: string, sessionId: string): Promise<typeof scanOutcomes.$inferSelect | null> {
  try {
    const [row] = await requireDb().select().from(scanOutcomes)
      .where(and(eq(scanOutcomes.scanId, scanId), eq(scanOutcomes.sessionId, sessionId))).limit(1);
    return row ?? null;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to read outcome");
  }
}

export async function upsertScanOutcome(input: { scanId: string; sessionId: string; verdict: OutcomeVerdict; impact: OutcomeImpact }) {
  try {
    const [row] = await requireDb().insert(scanOutcomes).values({ ...input, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: scanOutcomes.scanId,
        set: { verdict: input.verdict, impact: input.impact, updatedAt: new Date() },
      }).returning();
    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to save outcome");
  }
}

export async function countRecentVerifiedOutcomes(since: Date) {
  try {
    return await requireDb().select({ verdict: scanOutcomes.verdict }).from(scanOutcomes)
      .where(and(gt(scanOutcomes.createdAt, since), ne(scanOutcomes.verdict, "uncertain")));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to aggregate outcomes");
  }
}

import "server-only";

import { and, eq } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { scanActionProgress } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";

export type ActionProgressState = "pending" | "completed" | "skipped";

export async function listActionProgress(scanId: string, sessionId: string) {
  try {
    return await requireDb().select({ actionId: scanActionProgress.actionId, state: scanActionProgress.state })
      .from(scanActionProgress)
      .where(and(eq(scanActionProgress.scanId, scanId), eq(scanActionProgress.sessionId, sessionId)));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to read action progress");
  }
}

export async function setActionProgress(input: { scanId: string; sessionId: string; actionId: string; state: ActionProgressState }) {
  try {
    const [row] = await requireDb().insert(scanActionProgress).values({
      scanId: input.scanId,
      sessionId: input.sessionId,
      actionId: input.actionId,
      state: input.state,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: [scanActionProgress.scanId, scanActionProgress.actionId],
      set: { state: input.state, updatedAt: new Date() },
    }).returning({ actionId: scanActionProgress.actionId, state: scanActionProgress.state });
    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to save action progress");
  }
}

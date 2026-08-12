import "server-only";

import { requireDb } from "@/db/client";
import { scanFeedback } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";

export async function createFeedback(input: {
  scanId: string;
  sessionId: string;
  verdict: "helpful" | "not_helpful" | "seems_incorrect";
  comment?: string;
}) {
  try {
    const [row] = await requireDb().insert(scanFeedback).values(input).onConflictDoUpdate({
      target: [scanFeedback.scanId, scanFeedback.sessionId],
      set: {
        verdict: input.verdict,
        comment: input.comment,
        createdAt: new Date(),
      },
    }).returning({ id: scanFeedback.id });
    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to create feedback");
  }
}

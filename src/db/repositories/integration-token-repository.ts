import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { integrationTokens } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";

export async function createIntegrationTokenRecord(input: { sessionId: string; name: string; tokenHash: string }) {
  try {
    const [row] = await requireDb().insert(integrationTokens).values(input).returning({
      id: integrationTokens.id,
      name: integrationTokens.name,
      createdAt: integrationTokens.createdAt,
    });
    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to create integration token");
  }
}

export async function listIntegrationTokens(sessionId: string) {
  try {
    return await requireDb().select({
      id: integrationTokens.id,
      name: integrationTokens.name,
      createdAt: integrationTokens.createdAt,
      lastUsedAt: integrationTokens.lastUsedAt,
    }).from(integrationTokens).where(and(eq(integrationTokens.sessionId, sessionId), isNull(integrationTokens.revokedAt)))
      .orderBy(desc(integrationTokens.createdAt));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to list integration tokens");
  }
}

export async function resolveIntegrationToken(tokenHash: string) {
  try {
    const [row] = await requireDb().select().from(integrationTokens)
      .where(and(eq(integrationTokens.tokenHash, tokenHash), isNull(integrationTokens.revokedAt))).limit(1);
    if (!row) return null;
    await requireDb().update(integrationTokens).set({ lastUsedAt: new Date() }).where(eq(integrationTokens.id, row.id));
    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to resolve integration token");
  }
}

export async function revokeIntegrationToken(id: string, sessionId: string) {
  try {
    const [row] = await requireDb().update(integrationTokens).set({ revokedAt: new Date() })
      .where(and(eq(integrationTokens.id, id), eq(integrationTokens.sessionId, sessionId), isNull(integrationTokens.revokedAt)))
      .returning({ id: integrationTokens.id });
    return row ?? null;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to revoke integration token");
  }
}

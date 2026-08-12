import "server-only";

import { and, count, desc, eq, gt, isNull, sql } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { integrationTokens } from "@/db/schema";
import { DatabaseError, ValidationError } from "@/lib/errors";

export async function createIntegrationTokenRecord(input: { sessionId: string; name: string; tokenHash: string }, maxActive: number) {
  try {
    return await requireDb().transaction(async (transaction) => {
      await transaction.execute(sql`select pg_advisory_xact_lock(hashtext(${input.sessionId}))`);
      const [active] = await transaction.select({ count: count() }).from(integrationTokens)
        .where(and(eq(integrationTokens.sessionId, input.sessionId), isNull(integrationTokens.revokedAt), gt(integrationTokens.expiresAt, new Date())));
      if (Number(active?.count ?? 0) >= maxActive) {
        throw new ValidationError(`Maksimum ${maxActive} token aktif per perangkat.`);
      }
      const [row] = await transaction.insert(integrationTokens).values(input).returning({
        id: integrationTokens.id,
        name: integrationTokens.name,
        createdAt: integrationTokens.createdAt,
        expiresAt: integrationTokens.expiresAt,
      });
      return row;
    });
  } catch (error) {
    if (error instanceof ValidationError) throw error;
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
      expiresAt: integrationTokens.expiresAt,
    }).from(integrationTokens).where(and(eq(integrationTokens.sessionId, sessionId), isNull(integrationTokens.revokedAt), gt(integrationTokens.expiresAt, new Date())))
      .orderBy(desc(integrationTokens.createdAt));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to list integration tokens");
  }
}

export async function resolveIntegrationToken(tokenHash: string) {
  try {
    const [row] = await requireDb().select().from(integrationTokens)
      .where(and(eq(integrationTokens.tokenHash, tokenHash), isNull(integrationTokens.revokedAt), gt(integrationTokens.expiresAt, new Date()))).limit(1);
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

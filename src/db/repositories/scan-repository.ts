import "server-only";

import { and, desc, eq, gt, or, sql } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { analysisCache, scans } from "@/db/schema";
import { DatabaseError } from "@/lib/errors";
import type { AnalysisMode, AnalysisResult, InputType, RiskLevel } from "@/types/analysis";

export async function createScan(input: {
  sessionId: string;
  inputType: InputType;
  inputHash: string;
  previewRedacted?: string | null;
  result: AnalysisResult;
  analysisMode: AnalysisMode;
  aiAvailable: boolean;
  cacheHit: boolean;
  modelId?: string | null;
  providerLatencyMs?: number | null;
  expiresAt?: Date | null;
}) {
  try {
    const [row] = await requireDb()
      .insert(scans)
      .values({
        id: input.result.scanId,
        sessionId: input.sessionId,
        inputType: input.inputType,
        inputHash: input.inputHash,
        previewRedacted: input.previewRedacted,
        finalScore: input.result.finalScore,
        riskLevel: input.result.riskLevel as RiskLevel,
        analysisMode: input.analysisMode,
        aiAvailable: input.aiAvailable,
        cacheHit: input.cacheHit,
        modelId: input.modelId,
        providerLatencyMs: input.providerLatencyMs,
        resultJson: input.result,
        expiresAt: input.expiresAt,
      })
      .returning({ id: scans.id });

    return row;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to create scan");
  }
}

export async function getScanForSession(scanId: string, sessionId: string) {
  try {
    const [row] = await requireDb()
      .select()
      .from(scans)
      .where(
        and(
          eq(scans.sessionId, sessionId),
          or(eq(scans.id, scanId), sql`${scans.resultJson} ->> 'scanId' = ${scanId}`),
        ),
      )
      .limit(1);

    return row ?? null;
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to read scan");
  }
}

export async function listScansForSession(sessionId: string, limit = 20) {
  try {
    return await requireDb()
      .select({
        id: scans.id,
        inputType: scans.inputType,
        previewRedacted: scans.previewRedacted,
        finalScore: scans.finalScore,
        riskLevel: scans.riskLevel,
        createdAt: scans.createdAt,
      })
      .from(scans)
      .where(and(eq(scans.sessionId, sessionId), gt(scans.expiresAt, new Date())))
      .orderBy(desc(scans.createdAt))
      .limit(Math.min(Math.max(limit, 1), 50));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to list scans");
  }
}

export async function findCacheByHash(inputHash: string) {
  const [row] = await requireDb()
    .select()
    .from(analysisCache)
    .where(and(eq(analysisCache.inputHash, inputHash), gt(analysisCache.expiresAt, new Date())))
    .limit(1);

  return row ?? null;
}

export async function upsertCache(input: {
  inputHash: string;
  inputType: InputType;
  result: AnalysisResult;
  modelId?: string | null;
  analysisMode: AnalysisMode;
  expiresAt: Date;
}) {
  const [row] = await requireDb()
    .insert(analysisCache)
    .values({
      inputHash: input.inputHash,
      inputType: input.inputType,
      resultJson: input.result,
      modelId: input.modelId,
      analysisMode: input.analysisMode,
      expiresAt: input.expiresAt,
    })
    .onConflictDoUpdate({
      target: analysisCache.inputHash,
      set: {
        resultJson: input.result,
        modelId: input.modelId,
        analysisMode: input.analysisMode,
        expiresAt: input.expiresAt,
      },
    })
    .returning({ id: analysisCache.id });

  return row;
}

import "server-only";

import { and, desc, eq, gt, inArray } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { investigationCases, investigationCaseScans, scans } from "@/db/schema";
import { DatabaseError, NotFoundError, ValidationError } from "@/lib/errors";
import { buildInvestigationGraph, summarizeInvestigation } from "@/lib/investigation/build-investigation";
import type { InvestigationCase } from "@/types/investigation";

async function ownedScans(scanIds: string[], sessionId: string) {
  if (!scanIds.length) return [];
  return requireDb()
    .select()
    .from(scans)
    .where(and(eq(scans.sessionId, sessionId), inArray(scans.id, scanIds), gt(scans.expiresAt, new Date())));
}

function materializeCase(
  row: typeof investigationCases.$inferSelect,
  sourceRows: Array<typeof scans.$inferSelect>,
): InvestigationCase {
  const sources = sourceRows.map((scan) => ({
    id: scan.id,
    inputType: scan.inputType,
    createdAt: scan.createdAt,
    result: scan.resultJson,
  }));

  return {
    id: row.id,
    title: row.title,
    status: row.status,
    finalScore: row.finalScore,
    riskLevel: row.riskLevel,
    summary: row.summary,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    scans: sourceRows.map((scan) => ({
      id: scan.id,
      inputType: scan.inputType,
      finalScore: scan.finalScore,
      riskLevel: scan.riskLevel,
      createdAt: scan.createdAt.toISOString(),
      result: scan.resultJson,
    })),
    graph: buildInvestigationGraph(row.id, row.title, sources),
  };
}

export async function createInvestigationCase(input: { sessionId: string; title: string; scanIds: string[] }) {
  try {
    const uniqueScanIds = [...new Set(input.scanIds)];
    const sourceRows = await ownedScans(uniqueScanIds, input.sessionId);
    if (sourceRows.length !== uniqueScanIds.length) throw new ValidationError("Satu atau beberapa hasil tidak tersedia untuk sesi ini.");
    const summary = summarizeInvestigation(sourceRows.map((scan) => ({ id: scan.id, inputType: scan.inputType, createdAt: scan.createdAt, result: scan.resultJson })));
    const row = await requireDb().transaction(async (transaction) => {
      const [created] = await transaction.insert(investigationCases).values({
        sessionId: input.sessionId,
        title: input.title,
        finalScore: summary.finalScore,
        riskLevel: summary.riskLevel,
        summary: summary.summary,
      }).returning();
      if (!created) throw new DatabaseError("Failed to create investigation");
      await transaction.insert(investigationCaseScans).values(uniqueScanIds.map((scanId) => ({ caseId: created.id, scanId })));
      return created;
    });
    if (!row) throw new DatabaseError("Failed to create investigation");
    return materializeCase(row, sourceRows);
  } catch (error) {
    if (error instanceof ValidationError || error instanceof DatabaseError) throw error;
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to create investigation");
  }
}

export async function getInvestigationCase(caseId: string, sessionId: string): Promise<InvestigationCase | null> {
  try {
    const [row] = await requireDb().select().from(investigationCases)
      .where(and(eq(investigationCases.id, caseId), eq(investigationCases.sessionId, sessionId))).limit(1);
    if (!row) return null;
    const links = await requireDb().select({ scanId: investigationCaseScans.scanId }).from(investigationCaseScans)
      .where(eq(investigationCaseScans.caseId, caseId));
    const sourceRows = await ownedScans(links.map((link) => link.scanId), sessionId);
    return materializeCase(row, sourceRows);
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to read investigation");
  }
}

export async function listInvestigationCases(sessionId: string, limit = 20) {
  try {
    const rows = await requireDb().select().from(investigationCases)
      .where(eq(investigationCases.sessionId, sessionId))
      .orderBy(desc(investigationCases.updatedAt))
      .limit(Math.min(Math.max(limit, 1), 30));
    if (!rows.length) return [];
    const links = await requireDb().select().from(investigationCaseScans)
      .where(inArray(investigationCaseScans.caseId, rows.map((row) => row.id)));
    const counts = new Map<string, number>();
    for (const link of links) counts.set(link.caseId, (counts.get(link.caseId) ?? 0) + 1);
    return rows.map((row) => ({ ...row, scanCount: counts.get(row.id) ?? 0 }));
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to list investigations");
  }
}

export async function addScanToInvestigation(input: { caseId: string; sessionId: string; scanId: string }) {
  const current = await getInvestigationCase(input.caseId, input.sessionId);
  if (!current) throw new NotFoundError();
  const [newScan] = await ownedScans([input.scanId], input.sessionId);
  if (!newScan) throw new NotFoundError();

  await requireDb().insert(investigationCaseScans).values({ caseId: input.caseId, scanId: input.scanId }).onConflictDoNothing();
  const updated = await getInvestigationCase(input.caseId, input.sessionId);
  if (!updated) throw new NotFoundError();
  const summary = summarizeInvestigation(updated.scans.map((scan) => ({ id: scan.id, inputType: scan.inputType, createdAt: scan.createdAt, result: scan.result })));
  await requireDb().update(investigationCases).set({
    finalScore: summary.finalScore,
    riskLevel: summary.riskLevel,
    summary: summary.summary,
    updatedAt: new Date(),
  }).where(eq(investigationCases.id, input.caseId));
  return getInvestigationCase(input.caseId, input.sessionId);
}

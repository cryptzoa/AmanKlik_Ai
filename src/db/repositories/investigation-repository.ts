import "server-only";

import { and, desc, eq, gt, inArray } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { investigationCases, investigationCaseScans, scans } from "@/db/schema";
import { DatabaseError, NotFoundError, ValidationError } from "@/lib/errors";
import { buildInvestigationGraph, summarizeInvestigation } from "@/lib/investigation/build-investigation";
import type { InvestigationCase } from "@/types/investigation";

type ScanRow = typeof scans.$inferSelect;

async function ownedScans(scanIds: string[], sessionId: string): Promise<ScanRow[]> {
  if (!scanIds.length) return [];
  return requireDb()
    .select()
    .from(scans)
    .where(and(eq(scans.sessionId, sessionId), inArray(scans.id, scanIds), gt(scans.expiresAt, new Date())));
}

function scanTimestamp(scan: ScanRow): number {
  return scan.createdAt.getTime();
}

function uniqueRowsByInput(rows: ScanRow[]): ScanRow[] {
  const newestByFingerprint = new Map<string, ScanRow>();
  const newestFirst = [...rows].sort((left, right) => scanTimestamp(right) - scanTimestamp(left) || left.id.localeCompare(right.id));

  for (const row of newestFirst) {
    if (!newestByFingerprint.has(row.inputHash)) newestByFingerprint.set(row.inputHash, row);
  }

  return [...newestByFingerprint.values()].sort((left, right) => scanTimestamp(left) - scanTimestamp(right) || left.id.localeCompare(right.id));
}

function sourcesFromRows(rows: ScanRow[]) {
  return rows.map((scan) => ({
    id: scan.id,
    fingerprint: scan.inputHash,
    inputType: scan.inputType,
    createdAt: scan.createdAt,
    result: scan.resultJson,
  }));
}

function materializeCase(
  row: typeof investigationCases.$inferSelect,
  sourceRows: ScanRow[],
): InvestigationCase {
  const uniqueRows = uniqueRowsByInput(sourceRows);
  const sources = sourcesFromRows(uniqueRows);
  const summary = summarizeInvestigation(sources);

  return {
    id: row.id,
    title: row.title,
    status: row.status,
    finalScore: summary.finalScore,
    riskLevel: summary.riskLevel,
    summary: summary.summary,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    scans: uniqueRows.map((scan) => ({
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
    const requestedScanIds = [...new Set(input.scanIds)];
    const sourceRows = await ownedScans(requestedScanIds, input.sessionId);
    if (sourceRows.length !== requestedScanIds.length) throw new ValidationError("Satu atau beberapa hasil tidak tersedia untuk sesi ini.");

    const uniqueRows = uniqueRowsByInput(sourceRows);
    if (uniqueRows.length < 2) {
      throw new ValidationError("Pilih setidaknya dua artefak berbeda. Pemeriksaan ulang atas input yang sama tidak menambah bukti.");
    }

    const summary = summarizeInvestigation(sourcesFromRows(uniqueRows));
    const row = await requireDb().transaction(async (transaction) => {
      const [created] = await transaction.insert(investigationCases).values({
        sessionId: input.sessionId,
        title: input.title,
        finalScore: summary.finalScore,
        riskLevel: summary.riskLevel,
        summary: summary.summary,
      }).returning();
      if (!created) throw new DatabaseError("Failed to create investigation");
      await transaction.insert(investigationCaseScans).values(uniqueRows.map((scan) => ({ caseId: created.id, scanId: scan.id })));
      return created;
    });
    if (!row) throw new DatabaseError("Failed to create investigation");
    return materializeCase(row, uniqueRows);
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
    const linkedScanIds = [...new Set(links.map((link) => link.scanId))];
    const linkedRows = await ownedScans(linkedScanIds, sessionId);
    const linkedRowById = new Map(linkedRows.map((scan) => [scan.id, scan]));
    const fingerprintByScanId = new Map(linkedRows.map((scan) => [scan.id, scan.inputHash]));
    const fingerprintsByCase = new Map<string, Set<string>>();
    for (const link of links) {
      const fingerprint = fingerprintByScanId.get(link.scanId);
      if (!fingerprint) continue;
      const fingerprints = fingerprintsByCase.get(link.caseId) ?? new Set<string>();
      fingerprints.add(fingerprint);
      fingerprintsByCase.set(link.caseId, fingerprints);
    }

    return rows.map((row) => {
      const sourceRows = links.map((link) => link.caseId === row.id ? linkedRowById.get(link.scanId) : undefined).filter((scan): scan is ScanRow => Boolean(scan));
      const summary = sourceRows.length ? summarizeInvestigation(sourcesFromRows(sourceRows)) : undefined;
      return {
        ...row,
        finalScore: summary?.finalScore ?? row.finalScore,
        riskLevel: summary?.riskLevel ?? row.riskLevel,
        summary: summary?.summary ?? row.summary,
        scanCount: fingerprintsByCase.get(row.id)?.size ?? 0,
      };
    });
  } catch (error) {
    throw new DatabaseError(error instanceof Error ? error.message : "Failed to list investigations");
  }
}

export async function addScanToInvestigation(input: { caseId: string; sessionId: string; scanId: string }) {
  const current = await getInvestigationCase(input.caseId, input.sessionId);
  if (!current) throw new NotFoundError();
  const [newScan] = await ownedScans([input.scanId], input.sessionId);
  if (!newScan) throw new NotFoundError();

  const links = await requireDb().select({ scanId: investigationCaseScans.scanId }).from(investigationCaseScans)
    .where(eq(investigationCaseScans.caseId, input.caseId));
  const existingRows = await ownedScans(links.map((link) => link.scanId), input.sessionId);
  if (existingRows.some((scan) => scan.inputHash === newScan.inputHash)) {
    throw new ValidationError("Pemeriksaan ini duplikat dari artefak yang sudah ada di kasus.");
  }

  await requireDb().insert(investigationCaseScans).values({ caseId: input.caseId, scanId: input.scanId }).onConflictDoNothing();
  const updatedLinks = await requireDb().select({ scanId: investigationCaseScans.scanId }).from(investigationCaseScans)
    .where(eq(investigationCaseScans.caseId, input.caseId));
  const updatedRows = await ownedScans(updatedLinks.map((link) => link.scanId), input.sessionId);
  const summary = summarizeInvestigation(sourcesFromRows(updatedRows));
  await requireDb().update(investigationCases).set({
    finalScore: summary.finalScore,
    riskLevel: summary.riskLevel,
    summary: summary.summary,
    updatedAt: new Date(),
  }).where(eq(investigationCases.id, input.caseId));
  return getInvestigationCase(input.caseId, input.sessionId);
}

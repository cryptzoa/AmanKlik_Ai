import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { desc } from "drizzle-orm";

import type { AnalysisResult } from "@/types/analysis";

export const inputTypeEnum = pgEnum("input_type", ["text", "image", "url", "conversation"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]);
export const analysisModeEnum = pgEnum("analysis_mode", ["hybrid", "rules_only", "cached_hybrid"]);
export const feedbackVerdictEnum = pgEnum("feedback_verdict", [
  "helpful",
  "not_helpful",
  "seems_incorrect",
]);
export const investigationStatusEnum = pgEnum("investigation_status", [
  "active",
  "resolved",
  "archived",
]);
export const actionStateEnum = pgEnum("action_state", ["pending", "completed", "skipped"]);

export const scans = pgTable(
  "scans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: varchar("session_id", { length: 128 }).notNull(),
    inputType: inputTypeEnum("input_type").notNull(),
    inputHash: varchar("input_hash", { length: 64 }).notNull(),
    previewRedacted: text("preview_redacted"),
    finalScore: smallint("final_score").notNull(),
    riskLevel: riskLevelEnum("risk_level").notNull(),
    analysisMode: analysisModeEnum("analysis_mode").notNull(),
    aiAvailable: boolean("ai_available").notNull().default(false),
    cacheHit: boolean("cache_hit").notNull().default(false),
    modelId: varchar("model_id", { length: 120 }),
    providerLatencyMs: integer("provider_latency_ms"),
    resultJson: jsonb("result_json").$type<AnalysisResult>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (table) => [
    index("scans_session_created_at_idx").on(table.sessionId, desc(table.createdAt)),
    index("scans_input_hash_idx").on(table.inputHash),
    index("scans_expires_at_idx").on(table.expiresAt),
  ],
);

export const analysisCache = pgTable("analysis_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  inputHash: varchar("input_hash", { length: 64 }).notNull().unique(),
  inputType: inputTypeEnum("input_type").notNull(),
  resultJson: jsonb("result_json").$type<AnalysisResult>().notNull(),
  modelId: varchar("model_id", { length: 120 }),
  analysisMode: analysisModeEnum("analysis_mode").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export const scanFeedback = pgTable("scan_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  scanId: uuid("scan_id").notNull().references(() => scans.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 128 }).notNull(),
  verdict: feedbackVerdictEnum("verdict").notNull(),
  comment: varchar("comment", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const investigationCases = pgTable(
  "investigation_cases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: varchar("session_id", { length: 128 }).notNull(),
    title: varchar("title", { length: 80 }).notNull(),
    status: investigationStatusEnum("status").notNull().default("active"),
    finalScore: smallint("final_score").notNull().default(0),
    riskLevel: riskLevelEnum("risk_level").notNull().default("LOW"),
    summary: varchar("summary", { length: 280 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("investigation_cases_session_updated_idx").on(table.sessionId, desc(table.updatedAt))],
);

export const investigationCaseScans = pgTable(
  "investigation_case_scans",
  {
    caseId: uuid("case_id").notNull().references(() => investigationCases.id, { onDelete: "cascade" }),
    scanId: uuid("scan_id").notNull().references(() => scans.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.caseId, table.scanId] }),
    index("investigation_case_scans_scan_idx").on(table.scanId),
  ],
);

export const scanActionProgress = pgTable(
  "scan_action_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scanId: uuid("scan_id").notNull().references(() => scans.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 128 }).notNull(),
    actionId: varchar("action_id", { length: 120 }).notNull(),
    state: actionStateEnum("state").notNull().default("pending"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("scan_action_progress_scan_action_idx").on(table.scanId, table.actionId),
    index("scan_action_progress_session_idx").on(table.sessionId),
  ],
);

export const integrationTokens = pgTable(
  "integration_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: varchar("session_id", { length: 128 }).notNull(),
    name: varchar("name", { length: 60 }).notNull(),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("integration_tokens_hash_idx").on(table.tokenHash),
    index("integration_tokens_session_idx").on(table.sessionId, desc(table.createdAt)),
  ],
);

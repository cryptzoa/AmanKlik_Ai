import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { desc } from "drizzle-orm";

import type { AnalysisResult } from "@/types/analysis";

export const inputTypeEnum = pgEnum("input_type", ["text", "image", "url"]);
export const riskLevelEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"]);
export const analysisModeEnum = pgEnum("analysis_mode", ["hybrid", "rules_only", "cached_hybrid"]);
export const feedbackVerdictEnum = pgEnum("feedback_verdict", [
  "helpful",
  "not_helpful",
  "seems_incorrect",
]);

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

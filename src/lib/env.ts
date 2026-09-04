import "server-only";

import { z } from "zod";

const LOCAL_CACHE_SECRET = "local-development-secret-change-me";

const rawEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default("gemini-3.6-flash"),
  GEMINI_FALLBACK_MODEL: z.string().default("gemini-3.5-flash-lite"),
  GEMINI_EMBEDDING_MODEL: z.string().default("gemini-embedding-2"),
  AI_MODE: z.enum(["live", "mock"]).default("mock"),
  CACHE_HMAC_SECRET: z.string().min(32).default(LOCAL_CACHE_SECRET),
  APP_BASE_URL: z.string().url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "APP_BASE_URL must use HTTP or HTTPS").default(process.env.NODE_ENV === "production" ? "https://amanklik.id" : "http://localhost:3000"),
  SCAN_RATE_LIMIT: z.coerce.number().int().positive().default(10),
  SCAN_RATE_WINDOW_SECONDS: z.coerce.number().int().positive().default(600),
  ANALYSIS_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(86_400),
  MAX_UPLOAD_BYTES: z.coerce.number().int().positive().default(5_242_880),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(25_000),
  AI_MAX_CONCURRENCY: z.coerce.number().int().positive().default(2),
  AI_MAX_QUEUE: z.coerce.number().int().nonnegative().default(8),
  RAG_TOP_K: z.coerce.number().int().positive().default(3),
  RAG_EMBEDDING_DIM: z.coerce.number().int().positive().default(768),
});

const parsedEnv = rawEnvSchema.superRefine((value, context) => {
  const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";

  if (value.NODE_ENV === "production" && !value.DATABASE_URL && !isNextBuild) {
    context.addIssue({
      code: "custom",
      path: ["DATABASE_URL"],
      message: "DATABASE_URL is required in production",
    });
  }

  if (value.NODE_ENV === "production" && value.AI_MODE === "mock" && !isNextBuild) {
    context.addIssue({
      code: "custom",
      path: ["AI_MODE"],
      message: "AI_MODE=mock is not allowed in production",
    });
  }

  if (value.NODE_ENV === "production" && value.CACHE_HMAC_SECRET === LOCAL_CACHE_SECRET && !isNextBuild) {
    context.addIssue({
      code: "custom",
      path: ["CACHE_HMAC_SECRET"],
      message: "CACHE_HMAC_SECRET must be replaced in production",
    });
  }

  if (value.NODE_ENV === "production" && new URL(value.APP_BASE_URL).protocol !== "https:" && !isNextBuild) {
    context.addIssue({
      code: "custom",
      path: ["APP_BASE_URL"],
      message: "APP_BASE_URL must use HTTPS in production",
    });
  }

  if (value.AI_MODE === "live" && !value.GEMINI_API_KEY) {
    context.addIssue({
      code: "custom",
      path: ["GEMINI_API_KEY"],
      message: "GEMINI_API_KEY is required when AI_MODE=live",
    });
  }
});

export const env = parsedEnv.parse(process.env);

export type AppEnv = typeof env;

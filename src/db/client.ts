import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/lib/env";
import * as schema from "@/db/schema";

const client = env.DATABASE_URL
  ? postgres(env.DATABASE_URL, {
      prepare: false,
      max: 2,
    })
  : null;

export const db = client ? drizzle(client, { schema }) : null;

export function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }

  return db;
}

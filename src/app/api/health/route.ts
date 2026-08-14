import { env } from "@/lib/env";
import { db } from "@/db/client";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "ok" | "not_configured" | "error" = "not_configured";

  if (db) {
    try {
      // A plain `select 1` can succeed against a newly-provisioned database
      // whose application migrations have not run yet. These three tables are
      // required before every scan can be rate-limited, read from cache, and
      // persisted safely.
      await db.execute(sql`select 1`);
      await db.execute(sql`select 1 from rate_limit_buckets limit 1`);
      await db.execute(sql`select 1 from analysis_cache limit 1`);
      await db.execute(sql`select 1 from scans limit 1`);
      database = "ok";
    } catch {
      database = "error";
    }
  }

  const degradedLocal = !env.DATABASE_URL && env.NODE_ENV !== "production";
  const healthy = database === "ok" || degradedLocal;

  return Response.json({
    ok: healthy,
    data: {
      status: database === "ok" ? "healthy" : "degraded",
      database,
      version: process.env.RAILWAY_GIT_COMMIT_SHA ?? process.env.BUILD_ID ?? "local",
    },
  }, { status: healthy ? 200 : 503 });
}

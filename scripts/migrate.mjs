import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const databaseUrl = process.env.DATABASE_URL;

function safeError(error) {
  if (!error || typeof error !== "object") {
    return { message: String(error) };
  }

  const source = error;
  return {
    name: typeof source.name === "string" ? source.name : undefined,
    code: typeof source.code === "string" ? source.code : undefined,
    severity: typeof source.severity === "string" ? source.severity : undefined,
    message: typeof source.message === "string" ? source.message : "Migration failed",
    detail: typeof source.detail === "string" ? source.detail : undefined,
    hint: typeof source.hint === "string" ? source.hint : undefined,
    position: typeof source.position === "string" ? source.position : undefined,
  };
}

if (!databaseUrl) {
  console.log("[db:migrate] DATABASE_URL is missing from the runtime environment.");
  process.exit(1);
}

if (databaseUrl.includes("${{")) {
  console.log("[db:migrate] DATABASE_URL is unresolved; Railway reference variables were not rendered.");
  process.exit(1);
}

let client;

try {
  client = postgres(databaseUrl, { max: 1 });
  console.log("[db:migrate] Checking PostgreSQL connectivity...");
  await client`select 1`;
  console.log("[db:migrate] Applying migrations...");

  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[db:migrate] Migrations applied successfully.");
} catch (error) {
  console.log(`[db:migrate] Failed: ${JSON.stringify(safeError(error))}`);
  process.exitCode = 1;
} finally {
  if (client) {
    await client.end({ timeout: 5 });
  }
}

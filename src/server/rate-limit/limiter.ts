import "server-only";

import { lt, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { rateLimitBuckets } from "@/db/schema";
import { hmacInput } from "@/lib/crypto";
import { env } from "@/lib/env";
import { RateLimitError } from "@/lib/errors";
import { reportServerError } from "@/server/observability/report-error";

type Bucket = { startedAt: number; count: number };

const localBuckets = new Map<string, Bucket>();
const MAX_LOCAL_BUCKETS = 10_000;
let lastDatabaseCleanup = 0;

function clientAddress(request: Request): string | null {
  const candidate = request.headers.get("cf-connecting-ip")
    ?? request.headers.get("x-real-ip")
    ?? request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim()
    ?? null;
  return candidate && /^[0-9a-f:.]{3,45}$/i.test(candidate) ? candidate : null;
}

function bucketHash(namespace: string, key: string): string {
  return hmacInput(`rate-limit\0${namespace}\0${key}`);
}

function cleanupLocalBuckets(now: number, windowMs: number): void {
  for (const [key, bucket] of localBuckets) {
    if (now - bucket.startedAt >= windowMs) localBuckets.delete(key);
  }
  while (localBuckets.size >= MAX_LOCAL_BUCKETS) {
    const oldest = localBuckets.keys().next().value as string | undefined;
    if (!oldest) break;
    localBuckets.delete(oldest);
  }
}

function consumeLocalBucket(keyHash: string, cost: number, limit: number, now: number, windowMs: number): void {
  const existing = localBuckets.get(keyHash);
  if (!existing || now - existing.startedAt >= windowMs) {
    cleanupLocalBuckets(now, windowMs);
    localBuckets.set(keyHash, { startedAt: now, count: cost });
    if (cost > limit) throw new RateLimitError();
    return;
  }

  if (existing.count + cost > limit) throw new RateLimitError();
  existing.count += cost;
}

async function consumeDatabaseBucket(keyHash: string, cost: number, limit: number, now: Date, resetBefore: Date): Promise<void> {
  if (!db) return;

  const [bucket] = await db.insert(rateLimitBuckets).values({
    keyHash,
    windowStartedAt: now,
    count: cost,
  }).onConflictDoUpdate({
    target: rateLimitBuckets.keyHash,
    set: {
      count: sql<number>`case when ${rateLimitBuckets.windowStartedAt} <= ${resetBefore} then ${cost} else least(${rateLimitBuckets.count} + ${cost}, ${limit + 1}) end`,
      windowStartedAt: sql<Date>`case when ${rateLimitBuckets.windowStartedAt} <= ${resetBefore} then ${now} else ${rateLimitBuckets.windowStartedAt} end`,
    },
  }).returning({ count: rateLimitBuckets.count });

  if (!bucket || bucket.count > limit) throw new RateLimitError();
}

export async function consumeRateLimit(subject: string, cost = 1, request?: Request): Promise<void> {
  if (!Number.isSafeInteger(cost) || cost < 1) throw new RateLimitError();

  const nowMs = Date.now();
  const windowMs = env.SCAN_RATE_WINDOW_SECONDS * 1_000;
  const buckets = [{ hash: bucketHash("subject", subject), limit: env.SCAN_RATE_LIMIT }];
  const address = request ? clientAddress(request) : null;
  if (address) buckets.push({ hash: bucketHash("address", address), limit: env.SCAN_RATE_LIMIT * 3 });

  if (!db) {
    for (const bucket of buckets) consumeLocalBucket(bucket.hash, cost, bucket.limit, nowMs, windowMs);
    return;
  }

  const now = new Date(nowMs);
  const resetBefore = new Date(nowMs - windowMs);
  for (const bucket of buckets) {
    await consumeDatabaseBucket(bucket.hash, cost, bucket.limit, now, resetBefore);
  }

  if (nowMs - lastDatabaseCleanup >= Math.max(windowMs, 900_000)) {
    lastDatabaseCleanup = nowMs;
    try {
      await db.delete(rateLimitBuckets).where(lt(rateLimitBuckets.windowStartedAt, new Date(nowMs - windowMs * 2)));
    } catch (error) {
      reportServerError("rate-limit.cleanup", error);
    }
  }
}

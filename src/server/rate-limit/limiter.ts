import { env } from "@/lib/env";
import { RateLimitError } from "@/lib/errors";

type Bucket = { startedAt: number; count: number };
const buckets = new Map<string, Bucket>();

export function consumeRateLimit(sessionId: string, cost = 1) {
  const now = Date.now();
  const existing = buckets.get(sessionId);
  const windowMs = env.SCAN_RATE_WINDOW_SECONDS * 1000;

  if (!existing || now - existing.startedAt >= windowMs) {
    buckets.set(sessionId, { startedAt: now, count: cost });
    return;
  }

  if (existing.count + cost > env.SCAN_RATE_LIMIT) {
    throw new RateLimitError();
  }

  existing.count += cost;
}

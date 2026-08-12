import "server-only";

import { env } from "@/lib/env";
import { RateLimitError } from "@/lib/errors";

let activeOperations = 0;
const waiting: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (activeOperations < env.AI_MAX_CONCURRENCY) {
    activeOperations += 1;
    return;
  }

  if (waiting.length >= env.AI_MAX_QUEUE) {
    throw new RateLimitError("AI queue is full");
  }

  await new Promise<void>((resolve) => waiting.push(resolve));
  activeOperations += 1;
}

function release(): void {
  activeOperations = Math.max(0, activeOperations - 1);
  waiting.shift()?.();
}

export async function withAiConcurrency<T>(operation: () => Promise<T>): Promise<T> {
  await acquire();
  try {
    return await operation();
  } finally {
    release();
  }
}

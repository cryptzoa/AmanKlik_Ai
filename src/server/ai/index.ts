import "server-only";

import { env } from "@/lib/env";
import type { AiClient } from "@/server/ai/client";
import { GeminiAiClient } from "@/server/ai/gemini-client";
import { MockAiClient } from "@/server/ai/mock-client";

let client: AiClient | null = null;

export function getAiClient(): AiClient {
  if (client) return client;
  client = env.AI_MODE === "live" ? new GeminiAiClient() : new MockAiClient();
  return client;
}

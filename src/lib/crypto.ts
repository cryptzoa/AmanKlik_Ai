import "server-only";

import { createHmac } from "node:crypto";

import { env } from "@/lib/env";

export function hmacInput(input: string | Uint8Array): string {
  return createHmac("sha256", env.CACHE_HMAC_SECRET).update(input).digest("hex");
}

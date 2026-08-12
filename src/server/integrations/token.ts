import "server-only";

import { randomBytes } from "node:crypto";

import { createIntegrationTokenRecord, resolveIntegrationToken } from "@/db/repositories/integration-token-repository";
import { hmacInput } from "@/lib/crypto";
import { DomainError } from "@/lib/errors";

const TOKEN_PREFIX = "akx_";
const MAX_ACTIVE_TOKENS = 5;

function hashIntegrationToken(token: string): string {
  return hmacInput(`integration\0${token}`);
}

export async function issueIntegrationToken(input: { sessionId: string; name: string }) {
  const token = `${TOKEN_PREFIX}${randomBytes(32).toString("base64url")}`;
  const record = await createIntegrationTokenRecord({
    sessionId: input.sessionId,
    name: input.name,
    tokenHash: hashIntegrationToken(token),
  }, MAX_ACTIVE_TOKENS);
  return { token, record };
}

export async function authenticateIntegrationRequest(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!token.startsWith(TOKEN_PREFIX) || token.length < 32 || token.length > 96) {
    throw new DomainError("Integration token required", "UNAUTHORIZED");
  }
  const record = await resolveIntegrationToken(hashIntegrationToken(token));
  if (!record) throw new DomainError("Integration token invalid", "UNAUTHORIZED");
  return record;
}

export function integrationCorsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  const allowed = origin.startsWith("chrome-extension://") || origin.startsWith("moz-extension://");
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
}

export function assertIntegrationOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  if (!origin.startsWith("chrome-extension://") && !origin.startsWith("moz-extension://")) {
    throw new DomainError("Integration origin rejected", "FORBIDDEN");
  }
}

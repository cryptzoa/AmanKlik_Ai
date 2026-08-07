import "server-only";

import { env } from "@/lib/env";
import { DomainError } from "@/lib/errors";

export function assertSameOrigin(request: Request): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") throw new DomainError("Cross-site request rejected", "FORBIDDEN");

  const origin = request.headers.get("origin");
  if (!origin) return;

  const allowedOrigins = new Set([
    new URL(request.url).origin,
    new URL(env.APP_BASE_URL).origin,
  ]);
  if (!allowedOrigins.has(origin)) throw new DomainError("Origin rejected", "FORBIDDEN");
}

export function assertJsonRequest(request: Request): void {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLocaleLowerCase("en-US");
  if (contentType !== "application/json") {
    throw new DomainError("JSON content type required", "UNSUPPORTED_MEDIA_TYPE");
  }
}

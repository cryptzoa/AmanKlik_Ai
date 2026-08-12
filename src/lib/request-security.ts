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

export async function readJsonBody(request: Request, maxBytes = 65_536): Promise<unknown> {
  if (!request.body) throw new SyntaxError("Missing JSON body");

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytesRead = 0;
  let body = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) {
        await reader.cancel();
        throw new DomainError("Request body too large", "PAYLOAD_TOO_LARGE");
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } catch (error) {
    if (error instanceof DomainError) throw error;
    throw new SyntaxError("Invalid UTF-8 JSON body");
  }

  return JSON.parse(body);
}

export function assertMultipartBodySize(request: Request, maxBytes: number): void {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) throw new DomainError("Content-Length required", "LENGTH_REQUIRED");
  const contentLength = Number(rawLength);
  if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
    throw new DomainError("Invalid Content-Length", "INVALID_INPUT");
  }
  if (contentLength > maxBytes) throw new DomainError("Request body too large", "FILE_TOO_LARGE");
}

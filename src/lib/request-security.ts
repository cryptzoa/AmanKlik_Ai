import "server-only";

import { env } from "@/lib/env";
import { DomainError } from "@/lib/errors";

const KNOWN_PRODUCTION_ORIGINS = [
  "https://amanklik.id",
  "https://www.amanklik.id",
  "http://amanklik.id",
  "http://www.amanklik.id",
];

export function assertSameOrigin(request: Request): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") throw new DomainError("Cross-site request rejected", "FORBIDDEN");

  const origin = request.headers.get("origin");
  if (!origin) return;

  const allowedOrigins = new Set<string>(KNOWN_PRODUCTION_ORIGINS);

  try {
    allowedOrigins.add(new URL(request.url).origin);
  } catch {}

  try {
    const base = new URL(env.APP_BASE_URL);
    allowedOrigins.add(base.origin);
    if (base.hostname.startsWith("www.")) {
      allowedOrigins.add(`${base.protocol}//${base.hostname.slice(4)}${base.port ? `:${base.port}` : ""}`);
    } else if (!["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)) {
      allowedOrigins.add(`${base.protocol}//www.${base.hostname}${base.port ? `:${base.port}` : ""}`);
    }
  } catch {}

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? request.headers.get("host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto
    ?? (request.url.startsWith("https:") ? "https" : (env.NODE_ENV === "production" ? "https" : "http"));

  if (host) {
    allowedOrigins.add(`${proto}://${host}`);
    if (host.startsWith("www.")) {
      allowedOrigins.add(`${proto}://${host.slice(4)}`);
    } else if (!host.includes("localhost") && !host.includes("127.0.0.1") && !host.includes("[::1]")) {
      allowedOrigins.add(`${proto}://www.${host}`);
    }

    const [hostname, port] = host.split(":");
    const portSuffix = port ? `:${port}` : "";
    if (hostname === "localhost") {
      allowedOrigins.add(`${proto}://127.0.0.1${portSuffix}`);
      allowedOrigins.add(`${proto}://[::1]${portSuffix}`);
    } else if (hostname === "127.0.0.1" || hostname === "[::1]") {
      allowedOrigins.add(`${proto}://localhost${portSuffix}`);
    }
  }

  if (env.NODE_ENV === "development") {
    try {
      const parsedOrigin = new URL(origin);
      if (["localhost", "127.0.0.1", "[::1]"].includes(parsedOrigin.hostname)) {
        allowedOrigins.add(parsedOrigin.origin);
      }
    } catch {}
  }

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

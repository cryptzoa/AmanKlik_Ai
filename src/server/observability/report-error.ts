import "server-only";

import { DomainError } from "@/lib/errors";

function safeCauseCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  const code = error.code;
  return typeof code === "string" && /^[A-Z0-9_]{1,32}$/i.test(code)
    ? code
    : undefined;
}

export function reportServerError(context: string, error: unknown): void {
  const domainError = error instanceof DomainError ? error : null;
  const retryable = domainError?.retryable ?? false;
  const record = {
    level: retryable ? "warning" : "error",
    context,
    errorName: error instanceof Error ? error.name : "UnknownError",
    code: domainError?.code ?? "UNEXPECTED_ERROR",
    causeCode: safeCauseCode(error),
    retryable,
    timestamp: new Date().toISOString(),
  };
  const serialized = JSON.stringify(record);
  if (retryable) {
    console.warn(serialized);
    return;
  }
  console.error(serialized);
}

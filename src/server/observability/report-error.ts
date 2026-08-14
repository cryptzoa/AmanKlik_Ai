import "server-only";

import { DomainError } from "@/lib/errors";

export function reportServerError(context: string, error: unknown): void {
  const domainError = error instanceof DomainError ? error : null;
  const retryable = domainError?.retryable ?? false;
  const record = {
    level: retryable ? "warning" : "error",
    context,
    errorName: error instanceof Error ? error.name : "UnknownError",
    code: domainError?.code ?? "UNEXPECTED_ERROR",
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

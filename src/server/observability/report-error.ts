import "server-only";

import { DomainError } from "@/lib/errors";

export function reportServerError(context: string, error: unknown): void {
  const domainError = error instanceof DomainError ? error : null;
  const record = {
    level: "error",
    context,
    errorName: error instanceof Error ? error.name : "UnknownError",
    code: domainError?.code ?? "UNEXPECTED_ERROR",
    retryable: domainError?.retryable ?? false,
    timestamp: new Date().toISOString(),
  };
  console.error(JSON.stringify(record));
}

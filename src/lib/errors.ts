export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_INPUT");
  }
}

export class UnsupportedFileError extends DomainError {
  constructor(message: string) {
    super(message, "UNSUPPORTED_FILE");
  }
}

export class RateLimitError extends DomainError {
  constructor(message = "Too many requests") {
    super(message, "RATE_LIMITED", true);
  }
}

export class AiProviderError extends DomainError {
  constructor(message: string, retryable = true) {
    super(message, "PROVIDER_UNAVAILABLE", retryable);
  }
}

export class AiSchemaError extends DomainError {
  constructor(message: string) {
    super(message, "PROVIDER_UNAVAILABLE", true);
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string, retryable = true) {
    super(message, "INTERNAL_ERROR", retryable);
  }
}

export class NotFoundError extends DomainError {
  constructor() {
    super("Not found", "NOT_FOUND");
  }
}

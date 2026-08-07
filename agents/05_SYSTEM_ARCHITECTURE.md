# 05 — System Architecture

## Runtime topology

```text
Browser
  |
  v
Railway: Next.js service
  |-- Server Components / product UI
  |-- Route Handlers
  |-- anonymous session
  |-- input validation
  |-- Sharp image preprocessing
  |-- static URL analyzer
  |-- deterministic rules engine
  |-- risk fusion engine
  |-- RAG retriever
  |-- Gemini adapter
  |
  +----> Gemini Developer API
  |
  +----> Railway PostgreSQL
```

Only two Railway services:
1. app;
2. PostgreSQL.

## Trust boundaries

Untrusted:
- user text;
- uploaded bytes;
- submitted URL;
- model output;
- cookie values;
- query params.

Trusted only after validation:
- Zod-parsed request;
- magic-byte validated/Sharp-decoded image;
- Zod-parsed model output;
- typed DB rows.

## Text flow

```text
request
 -> validate
 -> normalize
 -> HMAC cache key
 -> cache lookup
 -> deterministic rules
 -> extract URLs + static URL indicators
 -> RAG retrieval
 -> Gemini semantic analysis
 -> Zod validate
 -> deterministic risk fusion
 -> redact persisted payload
 -> save scan/cache
 -> return scan id + result
```

## URL flow

```text
request
 -> validate string
 -> WHATWG URL parse
 -> http/https only
 -> tldts decomposition
 -> structural signals
 -> cache
 -> optional RAG
 -> Gemini analyzes URL STRING/context only
 -> risk fusion
 -> persist
 -> return
```

Critical: never `fetch(userUrl)`.

## Screenshot flow

```text
multipart
 -> size guard
 -> magic bytes
 -> Sharp decode/rotate/resize/strip metadata
 -> processed memory buffer
 -> HMAC cache
 -> Gemini multimodal + extracted text
 -> Zod validate
 -> deterministic rules on extracted text
 -> static URL analysis for extracted URLs
 -> optional RAG guidance
 -> deterministic risk fusion
 -> discard buffer
 -> persist redacted result
 -> return
```

No screenshot binary is stored.

## AI failure behavior

Text/URL:
- bounded retry;
- if still failing, run rules-only;
- `analysisMode="rules_only"`;
- `aiAvailable=false`;
- honest banner;
- no fake AI indicators.

Screenshot:
- if no extraction is available, return recoverable provider error;
- offer retry or text-paste alternative.

## Persist

Allowed:
- scan/session id;
- input type;
- HMAC input hash;
- redacted preview;
- final score/level;
- redacted result JSON;
- model metadata;
- analysis mode;
- timestamps.

Forbidden:
- original screenshot;
- raw unredacted private text by default;
- keys;
- raw provider logs with payload.

## Rendering

Server-first:
- result initial data;
- history data;
- SEO/static content.

Client:
- GSAP;
- scanner tabs/upload;
- animated result;
- simulator;
- feedback.

## Typed domain errors

- `ValidationError`
- `UnsupportedFileError`
- `RateLimitError`
- `AiProviderError`
- `AiSchemaError`
- `DatabaseError`

Route handlers convert these to safe public errors.

## Scale target

Competition/demo scale only: tens of concurrent users at most. Keep provider concurrency bounded. No distributed-systems infrastructure.

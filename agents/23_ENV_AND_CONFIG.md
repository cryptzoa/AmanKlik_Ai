# 23 — Environment and Configuration

Validate server env with Zod.

## Required production

```env
NODE_ENV=production
DATABASE_URL=postgres://...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.6-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
AI_MODE=live
CACHE_HMAC_SECRET=...
```

Optional:
```env
APP_BASE_URL=https://...
SCAN_RATE_LIMIT=10
SCAN_RATE_WINDOW_SECONDS=600
ANALYSIS_CACHE_TTL_SECONDS=86400
MAX_UPLOAD_BYTES=5242880
MAX_TEXT_CHARS=8000
AI_TIMEOUT_MS=25000
AI_MAX_CONCURRENCY=2
RAG_TOP_K=3
RAG_EMBEDDING_DIM=768
```

## Client vars

Prefer none. Optional public build ID only.

No secret under `NEXT_PUBLIC_`.

## AI mode
- `live`
- `mock`

Railway demo = live.  
Tests = mock.

If production + mock, fail startup or loudly block unless explicit test override. Prevent fake demo.

## Central model config

```ts
const aiConfig = {
  model: env.GEMINI_MODEL,
  fallbackModel: env.GEMINI_FALLBACK_MODEL,
  embeddingModel: env.GEMINI_EMBEDDING_MODEL,
};
```

No scattered literals.

## HMAC secret
Strong random secret; never reuse Gemini key.

## Local example

```env
NODE_ENV=development
DATABASE_URL=postgres://localhost:5432/amanklik
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite
GEMINI_EMBEDDING_MODEL=gemini-embedding-2
AI_MODE=mock
CACHE_HMAC_SECRET=replace-local
```

## Railway
`DATABASE_URL=${{Postgres.DATABASE_URL}}`

## Config rule
Text/upload/timeouts/rate/cache values come from central config, not magic numbers in routes.

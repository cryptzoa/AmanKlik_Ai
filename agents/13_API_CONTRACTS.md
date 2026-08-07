# 13 — API Contracts

Envelope:

```ts
type ApiSuccess<T> = { ok: true; data: T };

type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
};
```

Never return stack traces.

## POST `/api/scans/text`

Request:
```json
{"text":"..."}
```

Validation:
- trim;
- 8–8000 chars.

Success:
```json
{
  "ok": true,
  "data": {
    "scanId": "uuid",
    "result": {
      "inputType": "text",
      "finalScore": 82,
      "riskLevel": "VERY_HIGH",
      "summary": "...",
      "analysisMode": "hybrid",
      "aiAvailable": true,
      "cacheHit": false,
      "indicators": [],
      "actionPlan": [],
      "urlAnalysis": null,
      "disclaimer": "..."
    }
  }
}
```

Errors:
- `INVALID_INPUT` 400
- `RATE_LIMITED` 429
- `INTERNAL_ERROR` 500

Provider failure normally returns degraded 200 for text.

## POST `/api/scans/url`

Request:
```json
{"url":"https://..."}
```

Validation:
- <=~2048 chars;
- parseable;
- http/https only.

Never fetch target.

Result adds:

```json
"urlAnalysis": {
  "originalDisplay": "...",
  "protocol": "https:",
  "hostname": "...",
  "subdomain": "...",
  "domain": "...",
  "publicSuffix": "...",
  "path": "...",
  "signals": []
}
```

## POST `/api/scans/image`

Multipart field: `file`

Validation:
- <=5 MB;
- actual PNG/JPEG/WEBP;
- magic bytes;
- Sharp decode.

No base64 image in response.

Errors:
- `FILE_TOO_LARGE` 413
- `UNSUPPORTED_FILE` 415
- `INVALID_IMAGE` 400
- `AI_IMAGE_ANALYSIS_UNAVAILABLE` 503 retryable

## GET `/api/scans/history`

Anonymous session cookie.

Optional `limit` default 20/max 50.

```json
{
  "ok": true,
  "data": {
    "items": [{
      "id":"uuid",
      "inputType":"text",
      "preview":"redacted...",
      "finalScore":72,
      "riskLevel":"HIGH",
      "createdAt":"ISO"
    }]
  }
}
```

Never cross sessions.

## Result page data

Preferred: `/result/[id]` Server Component queries repository after validating session ownership. Extra GET API is optional.

## POST `/api/scans/[id]/feedback`

```json
{
  "verdict":"helpful",
  "comment":"optional"
}
```

Verdict:
- helpful
- not_helpful
- seems_incorrect

Comment <=500. Verify ownership.

## POST `/api/simulator/evaluate`

Optional AI enrichment. Server recomputes/validates deterministic outcome; never trusts arbitrary client score as canonical.

## GET `/api/health`

```json
{
  "ok": true,
  "data": {
    "status":"healthy",
    "database":"ok",
    "version":"build-id"
  }
}
```

No Gemini call.

## Rate limit

Single-instance demo:
- roughly 10 analyses / 10 min / anonymous session;
- no Redis;
- image may be stricter.

## Caching

Scan/result/history should not be public cache. Use `no-store` where appropriate.

## Request ID

Generate server request/trace ID for safe logs. No secrets.

Public copy follows `24_ERROR_STATES_AND_COPY.md`.

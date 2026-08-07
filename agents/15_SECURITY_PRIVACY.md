# 15 — Security and Privacy

## Threat model

Input may contain:
- malicious links;
- prompt injection;
- HTML/script;
- oversized/malformed files;
- personal data;
- quota exhaustion attempts.

## Critical: never fetch suspicious URL

Forbidden:
```ts
await fetch(userSubmittedUrl)
```

Also no:
- HEAD;
- redirect expansion;
- server screenshot;
- preview metadata;
- DNS/network probing.

This prevents SSRF/interaction with malicious infrastructure.

## URL protocol

Accept:
- `http:`
- `https:`

Reject:
- `javascript:`
- `data:`
- `file:`
- `ftp:`
- custom protocols.

## Upload

Max 5 MB. Actual allowed formats:
- PNG;
- JPEG;
- WEBP.

Validate:
1. size;
2. file presence;
3. magic bytes;
4. Sharp decode;
5. sane dimensions;
6. rotate/strip metadata/resize.

Max processed dimension ~1600px. Discard buffer afterward.

## Secrets

Server only:
- `GEMINI_API_KEY`
- `DATABASE_URL`
- `CACHE_HMAC_SECRET`

Never log/commit/expose.

## Session cookie

`amanklik_sid`
- HttpOnly
- Secure production
- SameSite=Lax
- Path=/
- bounded max-age
- random UUID/bytes

Anonymous session, not authentication.

## Retention

No raw screenshots. Prefer no raw text. Store HMAC hash, redacted preview/result.

## HMAC cache key

`HMAC-SHA256(CACHE_HMAC_SECRET, canonicalizedInputBytes)`

Image can HMAC normalized processed bytes.

## Logs

Allowed:
- request ID;
- endpoint/status;
- latency;
- model ID;
- input type;
- char/byte count;
- cache hit;
- error code.

Forbidden:
- full text;
- image;
- sensitive URL query;
- raw provider response.

## Prompt injection

Model content is data. Strict system task, no model-controlled tools, schema validation, final score outside model.

## XSS
- React escaping;
- no unsafe HTML;
- no Markdown needed;
- highlights rendered as text segments.

## SQL
Drizzle parameterization; no user-built SQL strings.

## CORS/CSRF
Same-origin only; no wildcard CORS; SameSite cookie; check content type.

## Rate/quota protection
- in-memory session limiter okay;
- cache;
- concurrency cap;
- timeout/retry bounds.

## Provider free-tier privacy

Demo explicitly warns not to upload real sensitive conversations. Use synthetic data.

## Safe output
No:
- criminal accusations;
- publishing full phones/accounts;
- instructions to scam;
- full sensitive entities.

## Headers
After testing:
- nosniff;
- strict-origin-when-cross-origin;
- frame protection/CSP;
- practical CSP only if it does not break app.

## Dependency hygiene
Use lockfile. Do not panic-upgrade major versions before demo.

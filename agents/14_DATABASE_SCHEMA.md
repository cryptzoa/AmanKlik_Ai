# 14 — Database Schema

PostgreSQL + Drizzle.

## Logical enums

```ts
inputType = "text" | "image" | "url"
riskLevel = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
analysisMode = "hybrid" | "rules_only" | "cached_hybrid"
feedbackVerdict = "helpful" | "not_helpful" | "seems_incorrect"
```

Use pgEnum or constrained text consistently.

## `scans`

- `id` uuid pk
- `session_id` uuid/text indexed
- `input_type`
- `input_hash` varchar indexed
- `preview_redacted` text nullable
- `final_score` smallint 0–100
- `risk_level`
- `analysis_mode`
- `ai_available` boolean
- `cache_hit` boolean
- `model_id` varchar nullable
- `provider_latency_ms` integer nullable
- `result_json` jsonb
- `created_at` timestamptz default now
- `expires_at` timestamptz nullable

Indexes:
- `(session_id, created_at desc)`
- `input_hash`
- optional `expires_at`

No screenshot binary and no raw private message field.

## `analysis_cache`

- `id` uuid pk
- `input_hash` varchar unique
- `input_type`
- `result_json` jsonb
- `model_id` varchar nullable
- `analysis_mode`
- `created_at`
- `expires_at`

Cache key = HMAC, not plain predictable hash.

TTL: 1–7 days.

## `scan_feedback`

- `id` uuid pk
- `scan_id` fk cascade
- `session_id`
- `verdict`
- `comment` varchar(500) nullable
- `created_at`

Application verifies ownership.

## `simulation_sessions` — optional P1
- id
- session_id
- scenario_id
- score
- result_json
- created_at

## Repositories

Create:
- scan repository;
- cache repository;
- feedback repository.

Methods:
- `createScan`;
- `getScanForSession`;
- `listScansForSession`;
- `findCacheByHash`;
- `upsertCache`;
- `createFeedback`.

No ad-hoc SQL in route handlers.

## Ownership

Result only if `row.session_id === currentSessionId`. Otherwise generic not-found.

## Redaction

Before DB write sanitize:
- phone;
- email;
- long account-like numbers;
- OTP-like values;
- IDs.

Preserve context with masking.

## Migrations

Scripts:
```json
{
  "db:generate":"drizzle-kit generate",
  "db:migrate":"drizzle-kit migrate"
}
```

Never reset Railway demo DB destructively.

## Seed

`scripts/seed-demo.ts` only synthetic/idempotent supporting data.

## JSON versioning

`result_json.schemaVersion = 1`.

If shape changes, support old demo rows or clear/migrate intentionally.

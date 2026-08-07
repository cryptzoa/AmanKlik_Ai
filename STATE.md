# AmanKlik AI — Project State

## Current status

- Date: 2026-08-07
- Phase: bootstrap through scanner/result/simulator foundations implemented; deployment configuration and live data-provider verification remain.
- The repository now has the Next.js source tree, tests, package configuration, Drizzle migrations, and a local Git repository. The GitHub remote is configured over SSH, but no push has been performed.
- All 32 Markdown documents in `agents/` have been read end-to-end.
- `AGENTS.md` and `CLAUDE.md` were also discovered at the repository root and read before continuing; the local Next.js 16 guidance is being followed.

## Product contract

AmanKlik AI is an Indonesian digital-safety product that explains the risk indicators in suspicious messages, screenshots, and URLs before a user clicks or transfers money. It must combine deterministic rules, static URL analysis, and Gemini semantic/multimodal analysis. The final public score is always computed by application code, never copied directly from the model.

P0 flows: landing, text scan, screenshot scan, URL scan, explainable result, anonymous history, three-scenario simulator, graceful AI degradation, privacy/security controls, tests, and Railway deployment. P1 includes curated RAG, feedback, cache prewarming, and Learn cards. P2 is visual polish only.

## Non-negotiable safety rules

- Never fetch, resolve, preview, screenshot, expand, or probe a user-submitted URL. Accept only `http`/`https` and inspect the string statically with WHATWG `URL` + `tldts`.
- Treat all user content, image bytes, URLs, cookies, query params, and model output as untrusted until validated.
- Validate AI output with Zod; keep prompts/data separated; ignore prompt injection inside user content; do not expose chain-of-thought.
- Keep Gemini and database secrets server-only. Never log raw text, images, sensitive URL query data, or raw provider payloads.
- Screenshot uploads are max 5 MB, magic-byte validated (PNG/JPEG/WEBP), Sharp-processed in memory, metadata-stripped, and discarded. Never persist screenshot bytes.
- Persist only session-owned, redacted results and HMAC input hashes. Enforce anonymous-session ownership on result/history/feedback access.
- UI must communicate uncertainty. `LOW` means `Risiko rendah`, never `Aman`; no criminal or guaranteed-safe/fraudulent claims.

## Architecture to preserve

Browser → one Next.js App Router service → validation/session → deterministic rules and URL analyzer → optional local RAG → server-side Gemini adapter → Zod validation → deterministic risk fusion → redaction → Railway PostgreSQL.

Use Node 24 LTS, pnpm, strict TypeScript, current stable Next.js App Router, Tailwind v4, GSAP, Zustand, Zod, `@google/genai`, Drizzle/Postgres, `tldts`, `sharp`, `file-type`, Vitest, Testing Library, and Playwright. No Framer Motion, Redis, worker, vector DB, crawler, URL reputation API, or extra Railway service for MVP.

## Canonical scoring

Risk levels: 0–29 LOW, 30–54 MEDIUM, 55–79 HIGH, 80–100 VERY_HIGH.

Initial fusion weights:

- text without URL: rules 0.55 + AI 0.45;
- text with URL: rules 0.45 + URL 0.15 + AI 0.40;
- screenshot with URL: rules 0.45 + URL 0.10 + AI 0.45;
- URL only: URL 0.70 + AI 0.30;
- degraded text: rules only;
- degraded URL: deterministic structural combination.

Initial rules include OTP, password/PIN, remote access, transfer, guaranteed return, identity switch, urgency, threat, prize/payment, channel move, secrecy, verification link, identity document, and URL structural indicators. Deduplicate logical signals before scoring; use documented floors sparingly.

## UI and voice

Direction: Digital Trust × Editorial × Cyber Intelligence—calm, premium, protective; no hacker clichés, Matrix green, generic glassmorphism, dashboard sidebar, stock cyber illustrations, or decorative clutter. Use Manrope plus a technical mono, the documented CSS risk tokens, editorial composition, and restrained GSAP motion. Respect reduced motion, keyboard access, 44px touch targets, and mobile widths 360/390/768/1280.

Result reading order: title → score/level → summary → uncertainty/disclaimer → evidence → URL anatomy → action plan → feedback. Evidence must show whether the source is Rule, URL, or AI and use redacted short excerpts, never unsafe HTML.

## Required implementation sequence

0. Bootstrap/config/scripts/health → 1. design foundation → 2. DB/session → 3. pure URL/rules/risk/redaction engines → 4. Gemini/mock/RAG/image pipeline → 5. services/APIs/cache/rate limit → 6. scanner/results/history → 7. landing/motion → 8. simulator/P1 → 9. hardening/QA → 10. Railway/demo. Do not polish the landing before scan flows are stable. Update this file after every phase with changed files, commands, results, unresolved issues, and deviations.

## Implementation progress

Completed in the current working tree:

- Phase 0/1: Next.js 16 App Router standalone bootstrap, Tailwind v4 tokens, env validation, README, health endpoint, shell pages, ESLint, TypeScript, Vitest, and Playwright.
- Phase 2: PostgreSQL/Drizzle schema, migrations, repositories, anonymous secure cookie, HMAC helper, and session ownership query boundaries.
- Phase 3: static URL analyzer with `tldts`, Indonesian-first message rules, deduplication, risk thresholds/fusion/floors, and redaction.
- Phase 4/5: server-only Gemini adapter with structured Zod output, deterministic mock adapter, prompt-injection-safe prompt framing, Sharp/file-type image preprocessing, action mapper, scan services, API envelopes, rate limiting, and no-URL-fetch boundary.
- Phase 6/8 foundation: text/screenshot/URL scanner UI, result page, history page/API, feedback API boundary, simulator with three deterministic scenarios, Learn page, and responsive accessibility-oriented UI.
- Verification: `pnpm lint`, `pnpm typecheck`, `pnpm test` (17 tests), `pnpm test:e2e` (2 tests), `pnpm build`, and `pnpm db:generate` pass in the current environment.

## Demo contract

Use only synthetic fixtures: new-number impersonation, OTP verification, benign family message, investment pressure, reserved documentation URLs, and synthetic screenshots. The 3–4 minute story is landing hook → screenshot result → static URL anatomy → explainability/architecture → simulator. Claims must stay limited to multimodal context, deterministic rules, static URL inspection, code-controlled score, and no permanent screenshot storage.

## Specification issues to resolve during bootstrap

1. `10_AI_PIPELINE.md` defines AI indicators without a `category`, while `32_AI_PROMPT_SPEC(1).md` requires one. Treat document 32 as the behavioral authority and include the category in the provider schema.
2. Internal `UrlAnalysis` uses `displayUrl`, while the URL API example in document 13 uses `originalDisplay`. Choose one canonical internal name and explicitly map any public DTO.
3. Screenshot fusion weights in document 11 total 0.90 when no URL is present; implement an explicit normalized 0.50 rules / 0.50 AI path (or document the chosen normalization) and test it.
4. Document 02 contains previously extracted competition dates/scoring context from an image-heavy guidebook and explicitly requires human verification against the original PDF before submission.
5. At initial intake the source tree and required `AGENTS.md` were absent; the current bootstrap has now created the source tree while preserving the discovered root instruction files.

## Remaining blockers / next work

- Local runtime is Node 22.23.1; the project correctly requires Node >=24 and every pnpm command reports the engine warning. Switch runtime before Railway/live verification.
- No local PostgreSQL or Gemini key is configured. Valid scan requests correctly fail with a safe save error until `DATABASE_URL` is available; the app does not fake persistence. Health is intentionally degraded-but-200 in local development without a database and must be healthy with DB connectivity in production.
- RAG corpus/index, full cache-hit path, real screenshot fixture assets, stronger P0 E2E for scan flows, security headers/CSP, and Railway deployment/prewarm remain.
- Added [`DEPLOYMENT_RAILWAY.md`](./DEPLOYMENT_RAILWAY.md) with the Railway PostgreSQL, Gemini secret, `AI_MODE=live`, migration, healthcheck, and verification procedure. The current agent shell still reports Node 22.23.1; the user reports Node 26 on the working machine, and the project accepts Node >=24. Verify the runtime in the shell used for the live check.
- Replaced the opaque `drizzle-kit migrate` pre-deploy entry point with `scripts/migrate.mjs`. It checks connectivity first and prints only sanitized PostgreSQL error metadata, never the connection URL, so Railway can expose the real migration failure.
- Railway connectivity is confirmed. The first detailed pre-deploy log identified missing `drizzle/meta/_journal.json`; migration metadata is now versioned because Drizzle requires the journal at runtime.
- Railway runtime sets `HOSTNAME` to the container ID. `scripts/start.mjs` now forces `0.0.0.0` immediately before loading the Next.js standalone server so deployment healthchecks can reach port `PORT`.
- The Vitest config emits a non-blocking Vite native-config warning; clean it up when the test config is hardened.

## Source map

- 01–03: product, competition guardrails, scope/acceptance.
- 04–06: locked stack, topology, repository boundaries.
- 07–09: feature/UI/motion specifications.
- 10–12: AI, risk, and curated retrieval behavior.
- 13–17: API, database, security, testing, Railway deployment.
- 18–19: implementation order and agent task prompts.
- 20–24: synthetic fixtures, demo narrative, DoD, env, error copy.
- 25–30: accessibility/performance, Git, references, components, types, pre-demo checks.
- 31–32: prescriptive page blueprints and Gemini prompt/output contract.

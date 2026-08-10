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
- `scripts/prepare-standalone.mjs` runs post-build and copies Next static/public assets into the standalone tree; this prevents production CSS/JS requests from returning 404.
- Scan persistence now uses `AnalysisResult.scanId` as the database primary key. Result lookup also supports the legacy `result_json.scanId` so scans created before the fix remain session-owned and accessible.
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
- 33–40: post-P0 feature expansion roadmap covering already-acted response, personalized practice, score explainability, privacy-safe reports, conversation analysis, synthetic evaluation, and the combined implementation plan.

## Expansion planning record — 2026-08-09

- Added implementation-ready specifications for six product expansions in `agents/33` through `agents/39`.
- Added `agents/40_EXPANSION_IMPLEMENTATION_PLAN.md` with sequencing, suggested files, cross-feature security review, quality gates, Definition of Done, feature-freeze policy, and an updated competition demo outline.
- Competition recommendation remains deliberately narrow: F1 Already-Acted Response, F3 Explainable Score Breakdown, minimal F2 Personalized Simulator, and F6 evaluation evidence. F4 follows only when complete; F5 Conversation Analysis remains post-competition due to its larger validation, privacy, scoring, cost, and testing surface.
- No product code, database schema, deployment configuration, or production service was changed during this planning step.

## Expansion implementation record — 2026-08-09

- F6 baseline runner implemented in `src/lib/evaluation/runner.ts` and `scripts/evaluate-deterministic.ts`; the 33 curated text/URL cases pass with `0` URL network calls. Commands are available as `pnpm eval:deterministic`, `pnpm eval:mock`, and `pnpm eval:report`.
- F1 Already-Acted Response implemented at `/respond` with seven incident categories, deterministic ordered guidance, curated official sources, safe checklist copying, and no sensitive input fields.
- F3 Explainable Score Breakdown implemented through a versioned public contribution trace on new scan results. It exposes qualitative source bands, not probability, hidden weights, or provider chain-of-thought.
- F2 Personalized Simulator implemented through `/api/scans/[id]/practice` and the result-to-`/simulator?from=<scanId>` path. Scenario selection is deterministic and session-owned; correctness does not depend on Gemini.
- F4 Privacy-Safe Report implemented with an explicit allowlist mapper, clipboard summary, and browser print/save path. Raw/redacted preview, full submitted URL, identifiers, and internal trace are excluded.
- F5 Conversation Analysis implemented as a bounded 2–12-message route at `/scan/conversation` and `/api/scans/conversation`, with ordered deterministic progression signals, optional structured Gemini analysis, redacted timeline output, session ownership, and a new `input_type` migration.
- Verification after the expansion slice: `pnpm typecheck`, `pnpm lint`, `pnpm test` (48 tests), `pnpm build`, `pnpm test:e2e` (7 tests), `pnpm eval:deterministic`, and `pnpm db:generate` all pass. `pnpm eval:live -- --confirm-live` is available for an explicitly authorized synthetic Gemini smoke and was not run without live credentials. The only recurring warning is the agent shell's Node 22 versus the repository's Node >=24 requirement.
- Live follow-up remains: apply migration on Railway, run a live synthetic text/screenshot/conversation smoke with Gemini quota, inspect the result/report UI on the user's Node 26 environment, and rehearse the narrowed competition demo. No deployment or push was performed.

## Protection platform expansion record — 2026-08-09

- The previous expansion slice and generated AmanKlik favicon were committed and pushed as `e26f495` before this new working slice began.
- Added implementation contracts `agents/41_PROTECTION_PLATFORM_EXPANSION.md` and `agents/42_BROWSER_SHARE_EXTENSION.md` for eight connected features.
- Cross-source investigations now compose 2–8 session-owned scans without duplicating raw input, then render an interactive graph of sources, signal families, domains, and recommended actions.
- Intelligence uses a 30-day, first-party aggregate with a minimum of three distinct anonymous sessions per visible pattern; repeated-input context uses the same threshold and all user-submitted URLs remain unfetched.
- Result pages now include persistent Safe Action Center progress and categorical outcome feedback. Uncertain outcomes are excluded from verified-outcome counts.
- Family Mode was deliberately removed before release because its relationship selector and guided script diluted the core product path without adding credible safety value.
- Added a Manifest V3 browser side panel under `extension/`, revocable HMAC-hashed integration tokens, extension-only CORS, explicit-selection capture, and PWA POST share target support for text, URL, and validated screenshots.
- Added adversarial evaluation for obfuscation, formatting, prompt injection, and false-positive pressure. Current synthetic suite is 12/12 with zero URL network calls; deterministic regression remains separate.
- New database migration sequence is normalized to `0002_cloudy_mordo` for the existing conversation enum followed by `0003_regular_ultimates` for investigation, action progress, outcome, and integration-token tables. The original conversation migration timestamp/content remain unchanged for deployed migration compatibility.
- This working slice has not been pushed. Required final gates remain production build, expanded E2E, diff/security audit, and Railway migration/live smoke after explicit deployment authorization.

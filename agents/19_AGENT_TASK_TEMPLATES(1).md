# 19 — Task Prompts for Cheaper Coding Agents

Always prepend: **Read `AGENTS.md` and relevant docs first. Do not re-architect. Update `STATE.md` when done.**

## Bootstrap

> Read `AGENTS.md`, `docs/04_TECH_STACK.md`, `docs/06_REPOSITORY_STRUCTURE.md`, and Phase 0 of `docs/18_IMPLEMENTATION_PLAN.md`. Bootstrap exactly to those docs. Do not implement product features yet. Add scripts for lint, typecheck, test, E2E, build, DB migrations. Run lint/typecheck/build and update `STATE.md`.

## URL analyzer

> Read docs 11, 13, 15, 16. Implement a pure static URL analyzer using WHATWG `URL` + `tldts`. It must never perform network I/O. Add documented signals/types/tests. Reject non-http/https. Run tests/typecheck; update `STATE.md`.

## Rules/risk

> Implement normalization, deterministic signals, dedupe, thresholds, fusion, and floors from `docs/11_RISK_ENGINE.md`. Keep pure and independently testable. Add benign/risky/ambiguous fixtures. No AI/DB inside risk engine. Run tests and update state.

## Gemini adapter

> Read docs 10, 15, 23. Implement `AiClient`, `GeminiAiClient`, `MockAiClient` with `@google/genai`. All live calls server-only, current configured model IDs, structured output + Zod, timeout and one bounded transient retry, prompt-injection-safe framing. No secret exposure. Add schema/mock tests.

## Image pipeline

> Implement max-5MB PNG/JPEG/WEBP validation, magic bytes via `file-type`, Sharp decode/rotate/resize/metadata strip, memory-only processed buffer, and Gemini adapter connection. Never persist screenshot bytes. Add invalid-file tests.

## Text scan API

> Implement `/api/scans/text`: validate -> normalize -> HMAC cache -> deterministic rules -> URL signals -> RAG -> AI -> Zod -> score fusion -> redaction -> persistence -> response. Provider failure returns honest rules-only degraded result where possible. Add mock integration tests.

## URL scan API

> Implement `/api/scans/url`: validate http/https -> static parse only -> deterministic URL score -> optional AI context on string only -> final fusion -> persistence. Add a test/inspection guarantee that target URLs are never fetched.

## Screenshot scan API

> Implement multipart `/api/scans/image`, validation/preprocess, HMAC cache, multimodal AI, extracted-text rules, URL parsing, score fusion, redacted persistence, recoverable provider error. Add tests with `MockAiClient`.

## Scanner UI

> Read docs 7, 8, 9, 24. Implement `/scan` with accessible Pesan/Screenshot/Tautan tabs, validation, image preview, real workflow state labels. Custom award-quality styling, no default template look. Motion does not block input. Add Playwright.

## Result UI

> Implement `/result/[id]`: server-load session-owned result, render score/level/mode/summary/evidence/url anatomy/actions/uncertainty/disclaimer. GSAP only for reveal, reduced motion. No unsafe HTML. Add E2E.

## Landing

> Core product flows are stable. Read design/GSAP docs. Build editorial Digital Trust landing using GSAP, SplitText, ScrollTrigger. CTA immediately usable, reduced motion/mobile/touch, no scroll hijack/WebGL/video. Do not change scanner/business logic.

## Simulator

> Implement three deterministic branching scenarios from demo fixtures. Base simulator functions without AI. AI only enriches final learning feedback. No live scam generation. Add E2E.

## Railway

> Configure standalone Next.js, Node 24, Drizzle migration, health, Railway env assumptions. Do not add Docker unless standard deploy has a documented failure. Production must require `AI_MODE=live`. Run production build.

## Review/fix

> Review repository against `AGENTS.md` and Definition of Done. Do not add features. List P0 gaps with file/severity/smallest fix, then fix only critical/high gaps, run quality gates, update `STATE.md`.

## Context-saving

For low-cost agents provide:
- `AGENTS.md`;
- `STATE.md`;
- task-specific docs;
- relevant source files.

Do not repaste all docs if agent can read repo.

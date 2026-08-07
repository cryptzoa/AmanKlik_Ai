# 18 — Implementation Plan

Execute phases in order. Do not start visual over-polish before scan flows work.

## Phase 0 — Bootstrap
- Next.js App Router TypeScript;
- Tailwind v4;
- Node 24/pnpm;
- locked deps;
- aliases/strict TS;
- scripts: lint/typecheck/test/e2e/build/db;
- documented folders;
- env validator;
- basic `/api/health`.

Exit: dev/lint/typecheck/build work.

## Phase 1 — Design foundation
- CSS variables;
- fonts;
- shell/header/footer;
- buttons/inputs/badges;
- tabs;
- focus;
- risk tokens;
- responsive containers;
- reduced-motion utility.

No complex hero yet.

Exit: tokens/components visible and accessible.

## Phase 2 — Database/session
- Drizzle/schema/migrations;
- DB client/repositories;
- anonymous cookie;
- history/session ownership;
- HMAC cache helper.

Tests: HMAC + ownership/repo where practical.

Exit: local migration + sample row round-trip.

## Phase 3 — Deterministic engines
- URL parser;
- text normalization;
- rules;
- dedupe;
- score fusion;
- redaction.

Tests required.

Exit: deterministic text/URL assessment without AI.

## Phase 4 — AI/RAG
- AI interface;
- Gemini adapter;
- mock adapter;
- structured schema;
- prompts;
- timeout/retry;
- image preprocessing;
- RAG corpus/retriever;
- keyword fallback;
- provider metadata.

Exit:
- live synthetic text smoke;
- live synthetic screenshot smoke;
- deterministic mock tests.

## Phase 5 — Services/APIs
- analyze-text/url/image services;
- cache;
- redaction before persistence;
- route handlers;
- safe errors;
- rate limit.

Tests:
- routes;
- degraded;
- invalid image;
- no URL fetch design.

Exit: HTTP completes 3 scan types.

## Phase 6 — Scanner/results
- `/scan`;
- three modes;
- validation;
- local image preview;
- real loading stages;
- `/result/[id]`;
- score/evidence/url anatomy/actions/disclaimer;
- history;
- restrained result GSAP.

E2E text/url/image mock/history.

Exit: core usable without fancy landing.

## Phase 7 — Landing/motion
- hero;
- SplitText;
- fragment field;
- ScrollTrigger story;
- CTA;
- mobile/reduced motion;
- performance.

Do not modify business logic.

## Phase 8 — Simulator/P1
- scenario model;
- 3 branching scenarios;
- deterministic scoring;
- optional AI feedback;
- result feedback;
- learn cards.

Exit: simulator works offline from AI.

## Phase 9 — Hardening
- headers/log sanitation;
- rate limit;
- accessibility;
- performance/bundle;
- full E2E;
- errors/empty states;
- long-content stress.

Exit: all P0 Definition of Done.

## Phase 10 — Railway/demo
- app + Postgres;
- standalone;
- env;
- pre-deploy migration;
- domain;
- live smoke;
- optional prewarm;
- presentation rehearsal.

Then feature freeze.

## Cheap-agent task size

Give 1 coherent subsystem at a time.

Good:
`Implement deterministic URL analyzer and tests per docs 11, 13, 16.`

Bad:
`Finish AmanKlik.`

## Completion record

After each phase update `STATE.md`:
- changed files;
- commands;
- pass/fail;
- unresolved;
- deviations.

## Time-pressure rule

Drop P2, reduce P1. Do not drop P0 security/tests for animation.

# 40 — Expansion Implementation Plan and Definition of Done

## Goal

Implement documents 33–39 as independently shippable vertical slices while preserving the current P0 security, privacy, scoring, and deployment behavior.

## Priority decision

Recommended order:

1. F6 evaluation foundation;
2. F1 Already-Acted Response;
3. F3 Explainable Score Breakdown;
4. minimal F2 Personalized Simulator;
5. F4 Privacy-Safe Report;
6. full F2 mappings;
7. F5 Conversation Analysis after competition.

The evaluation foundation starts first because score and progression changes need evidence. The user-facing competition story remains F1 → F3 → F2.

## Phase A — Baseline and evaluation foundation

### Work

- freeze current fixture outputs and engine version;
- define `EvaluationCase` schema;
- add 20–30 reviewed synthetic cases;
- implement deterministic/mock runner;
- generate initial Markdown report;
- verify Railway demo fixtures still work;
- update `STATE.md` with the baseline.

### Exit

- deterministic benchmark repeats identically;
- no raw sensitive fixture data;
- current 36-test suite remains green;
- benchmark limitations documented.

## Phase B — Already-Acted Response

### Suggested files

```text
src/app/respond/page.tsx
src/app/respond/respond-client.tsx
src/lib/response/types.ts
src/lib/response/catalog.ts
src/lib/response/build-response-plan.ts
tests/unit/response-plan.test.ts
```

### Work

- implement taxonomy and reviewed action catalog;
- deterministic deduplication and ordering;
- build stress-oriented mobile UX;
- add direct scan/result entry points;
- link only allowlisted official sources;
- add copy support only through F4 safe mapper when available;
- add unit/component/E2E coverage.

### Exit

- all seven incident types work without AI;
- first urgent actions appear immediately;
- no secret or transaction input fields exist;
- Railway smoke passes.

## Phase C — Explainable Score Breakdown

### Suggested files

```text
src/server/risk/trace.ts
src/server/risk/public-explanation.ts
src/types/analysis.ts
src/components/result/score-breakdown.tsx
tests/unit/score-breakdown.test.ts
```

### Work

- version risk engine and explanation schema;
- produce internal trace inside the risk engine;
- map trace to public qualitative contributions;
- add optional backward-compatible result field;
- update cache identity;
- render accessible disclosure and evidence anchors;
- prove API does not expose internal trace.

### Exit

- hybrid/degraded modes explain themselves correctly;
- old rows still render;
- no probability or chain-of-thought copy;
- exact private weights are absent from public DTOs.

## Phase D — Personalized practice and safe report

### Personalized practice work

- create reviewed scenario families;
- deterministic signal-category mapping;
- enforce scan ownership;
- add one-click result entry;
- keep correctness independent of AI;
- test that scan content cannot enter scenario output.

### Safe report work

- create explicit `SafeReport` allowlist mapper;
- implement copy and print UI;
- add print stylesheet;
- test clipboard failure fallback;
- prove previews and full URLs are excluded.

### Exit

- result can lead to relevant practice in one action;
- safe checklist can be retained without server call;
- no public sharing link exists;
- keyboard/mobile/reduced-motion checks pass.

## Phase E — Conversation Analysis research

Start only after the competition release is frozen and stable.

### Suggested files

```text
src/app/api/scans/conversation/route.ts
src/app/scan/conversation-input.tsx
src/server/scan/analyze-conversation.ts
src/server/risk/conversation-signals.ts
src/server/ai/conversation-schema.ts
tests/unit/conversation-signals.test.ts
tests/integration/conversation-pipeline.test.ts
```

### Work

- schema-version migration for `conversation` input type;
- bounded structured input UI;
- per-message and progression rules;
- conversation prompt/schema;
- code-controlled fusion profile selected through benchmark evidence;
- stricter rate limit and timeout;
- redacted persistence and timeline result;
- full security, ownership, and E2E coverage.

### Exit

- deterministic degradation is useful;
- prompt injection and URL no-fetch tests pass;
- benign long-conversation false positives reviewed;
- no raw conversation persistence;
- production cost and latency measured before enabling.

## Database migration policy

Prefer backward-compatible JSON additions for F2–F4. A schema migration is required only when a queryable column or a new persisted relation is justified.

Rules:

- Drizzle migration generated and committed;
- old results remain readable;
- migrations run safely in Railway pre-deploy;
- rollback behavior documented before production;
- no migration silently rewrites historical scores;
- JSON schema and engine versions travel with new results.

## API policy

- reuse the existing public envelope;
- validate request and response schemas;
- enforce anonymous-session ownership;
- return generic not-found for foreign resources;
- never return internal score traces;
- never accept user-provided official-source URLs;
- use explicit rate-limit buckets for expensive conversation analysis;
- preserve safe degraded behavior.

## Security review checklist

- [ ] no submitted URL network access;
- [ ] no raw text/image/conversation logging;
- [ ] no new secret exposed client-side;
- [ ] no chain-of-thought or provider payload returned;
- [ ] no public result/report route created accidentally;
- [ ] source URLs come from allowlisted corpus data;
- [ ] ownership tests cover every scan-derived feature;
- [ ] AI unavailable path remains complete;
- [ ] cache keys include relevant versions;
- [ ] exports use explicit allowlists;
- [ ] retention behavior documented.

## Accessibility and UX checklist

- [ ] complete keyboard flow;
- [ ] visible focus;
- [ ] 44 px minimum touch targets;
- [ ] urgency/risk not communicated by color alone;
- [ ] loading and errors announced appropriately;
- [ ] no forced preloader for urgent guidance;
- [ ] reduced motion shows content immediately;
- [ ] 360/390/768/1280 widths verified;
- [ ] no horizontal overflow;
- [ ] copy/print failure is recoverable;
- [ ] Indonesian copy reviewed for calm, non-accusatory tone.

## Quality gates per vertical slice

Required before a feature is marked complete:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

Additionally:

- feature-specific unit/integration tests;
- one expected-error E2E;
- one mobile E2E;
- reduced-motion check for animated surfaces;
- Railway health and live synthetic smoke when server behavior changes;
- no fatal browser console errors;
- `STATE.md` updated.

## Combined Definition of Done

### F1 Already-Acted Response

- [ ] seven incident types;
- [ ] deterministic urgency/order/deduplication;
- [ ] reviewed official guidance;
- [ ] no sensitive inputs;
- [ ] no AI dependency;
- [ ] direct and result-linked flow;
- [ ] disclaimer and boundaries visible.

### F2 Personalized Simulator

- [ ] reviewed mapping for every supported category;
- [ ] session ownership;
- [ ] no scan-content reuse;
- [ ] deterministic correctness;
- [ ] standard simulator fallback;
- [ ] completion explains transferable principle.

### F3 Score Breakdown

- [ ] internal trace versioned;
- [ ] public explanation sanitized;
- [ ] hybrid and degraded modes covered;
- [ ] no exact private thresholds;
- [ ] no probability claims;
- [ ] old results compatible.

### F4 Privacy-Safe Report

- [ ] explicit allowlist mapping;
- [ ] clipboard and print paths;
- [ ] no preview/full URL/session identifiers;
- [ ] no external PDF service;
- [ ] no public share link;
- [ ] accessible fallback.

### F5 Conversation Analysis

- [ ] bounded 2–12 message input;
- [ ] deterministic progression rules;
- [ ] structured AI validation;
- [ ] code-controlled scoring;
- [ ] raw conversation discarded;
- [ ] stricter rate limit;
- [ ] schema compatibility;
- [ ] benign and adversarial benchmark coverage.

### F6 Evaluation and Benchmarking

- [ ] versioned synthetic dataset;
- [ ] deterministic CI-safe runner;
- [ ] explicit live confirmation;
- [ ] false positives and limitations reported;
- [ ] no real sensitive data;
- [ ] no universal accuracy claim.

## Competition feature-freeze rule

Freeze user-facing features once F1, F3, minimal F2, and the F6 presentation report pass all quality gates on Railway. F4 may enter only if complete; F5 must remain post-competition.

## Updated demo outline

```text
0:00–0:25  problem hook
0:25–1:25  screenshot scan and result
1:25–2:05  score breakdown and explainability
2:05–2:45  Already-Acted immediate response
2:45–3:20  personalized one-step practice
3:20–3:40  benchmark, privacy, tests, deployment proof
```

Do not exceed the original 3–4 minute live-product target. Replace weaker segments instead of adding time.

## Completion record

After every phase, update `STATE.md` with:

- feature and phase;
- files changed;
- database/API changes;
- commands and results;
- Railway smoke result;
- benchmark delta;
- unresolved risks;
- deviations from documents 33–40.

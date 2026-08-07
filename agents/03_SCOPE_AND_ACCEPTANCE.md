# 03 — Scope and Acceptance

P0 = must work.  
P1 = should work after P0 stable.  
P2 = polish only.

## P0

### Landing
- distinctive;
- responsive;
- clear CTA `/scan`;
- GSAP hero/scroll;
- reduced motion;
- no broken links.

### Text scan
- 8–8000 char validation;
- user content never HTML;
- deterministic rules;
- Gemini semantic analysis in live mode;
- final score computed by code;
- redacted persistence;
- result by ID.

### Screenshot scan
- PNG/JPEG/WEBP;
- magic-byte validation;
- reject oversized/invalid;
- strip metadata/resize Sharp;
- server-side Gemini;
- original bytes discarded;
- structured validated result.

### URL scan
- only http/https;
- normalized;
- `tldts` domain decomposition;
- **no network fetch**;
- structural indicators;
- domain anatomy result.

### Explainable result
- 0–100 score;
- low/medium/high/very-high;
- summary;
- evidence;
- source distinguishes deterministic/AI;
- action plan;
- uncertainty/disclaimer;
- degraded banner when AI unavailable.

### Anonymous history
- anonymous cookie;
- recent scans;
- no raw screenshots;
- no unredacted message storage.

### Simulator
- >=3 deterministic branching scenarios;
- 3–5 steps;
- completion feedback;
- AI enrichment optional only.

### Privacy/security
- keys server-side;
- no raw body logging;
- upload constraints;
- redaction;
- no URL fetch;
- session cookie secure prod.

### Quality
- lint;
- typecheck;
- unit;
- P0 E2E;
- production build.

## P1
- curated RAG;
- prewarmed live demo cache;
- result feedback;
- small learn page.

## P2
- custom cursor desktop;
- magnetic interactions;
- page-transition polish;
- shareable/downloadable result;
- theme toggle.

## Out of scope
- accounts/auth;
- admin;
- community reporting;
- URL reputation API;
- extension;
- deepfake;
- crawler;
- Redis/workers/vector DB/storage bucket;
- in-app government reporting.

## Feature freeze

When P0 passes:
- full build;
- P0 E2E;
- Railway verification;
- demo rehearsal.

Then polish existing flows instead of expanding scope.

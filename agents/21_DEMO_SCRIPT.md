# 21 — Competition Demo Script

Target live product: ~3–4 minutes.

## Before presentation
- Railway healthy;
- DB reachable;
- `AI_MODE=live`;
- Gemini quota checked;
- synthetic screenshot ready;
- demo text/URL copied;
- optional live cache prewarmed;
- browser on landing;
- fallback Railway domain noted;
- projector zoom tested.

## 0:00–0:25 — Hook

Landing:
"Pesan penipuan tidak selalu terlihat seperti spam. Pengguna perlu tahu alasan untuk tidak percaya."

Show a short scroll story, then CTA. Do not spend a minute on animation.

## 0:25–1:25 — Screenshot

Upload synthetic new-number screenshot.

While real stages run:
- image validation;
- multimodal AI context;
- deterministic rules;
- code-controlled final risk.

On result show:
- score;
- identity switch;
- urgency;
- payment request;
- actions.

Key line:
**AI memahami konteks, tetapi skor akhir bukan keputusan AI saja.**

## 1:25–2:15 — URL anatomy

Use prepared reserved demo URL.
Show:
- registrable domain;
- subdomain;
- structural warning;
- app never opens target.

Key line:
**Analisis URL kami statis supaya sistem tidak perlu menyentuh situs yang mencurigakan.**

## 2:15–2:50 — Explainability

Show Rule / URL / AI evidence badges and disclaimer.

Architecture:
Next.js → validation/rules → Gemini/RAG → risk engine → Postgres.

## 2:50–3:20 — Simulator

One quick unsafe choice then independent-verification choice. Show learning feedback.

## 3:20–3:40 — Engineering proof

Briefly mention/show:
- tests;
- GitHub;
- deployed URL;
- screenshot privacy.

## Claims to make
- multimodal context;
- deterministic rules;
- static domain anatomy;
- app-controlled final score;
- no permanent screenshot storage;
- risk assessment, not certainty.

## Do not claim
- 100% accuracy;
- every scam;
- criminal confirmation;
- official partnership unless real;
- production-ready bank-grade security;
- AI never hallucinates.

## Gemini slow/failure

Text/URL degraded:
"AI kontekstual sedang terbatas; AmanKlik tetap menampilkan pemeriksaan deterministik."

Screenshot fails:
switch to text fixture and explain provider image path unavailable. Never show mock as live.

## Q&A

### Why not just Gemini?
Rules/domain parsing are independently testable; final score is controlled by code; evidence source is visible.

### Is score correct?
It is a risk heuristic, not legal certainty; tested on curated synthetic cases and uncertainty disclosed.

### Do you open the link?
No, static only.

### Screenshot retention?
Validated, metadata-stripped, processed memory-only, sent to configured AI provider, discarded; redacted result persisted.

### Why free API?
Suitable for competition demo. Real sensitive production deployment would require provider/data-governance review.

## Golden rule
Show one strong story; do not tour every page.

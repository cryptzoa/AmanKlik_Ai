# 31 — Page Blueprints

This document is intentionally prescriptive. Coding agents should not redesign page architecture.

## `/` Landing

### Section 1 — Header
Desktop:
- left: AmanKlik AI wordmark;
- center/right: Scan, Simulator, Learn;
- far right: `Cek Pesan` CTA.

Mobile:
- wordmark;
- menu trigger;
- primary CTA may stay visible if space allows.

Header starts visually light over hero and becomes solid after hero scroll. Do not compromise contrast.

### Section 2 — Hero

Desktop composition:
```text
┌──────────────────────────────────────────────────────────────┐
│ AMANKLIK AI                                  [ Cek Pesan ]  │
│                                                              │
│ JANGAN                                                       │
│ PERCAYA                           floating message fragments │
│ PESANNYA.                         OTP / nomor baru / transfer │
│                                                              │
│ Pahami risikonya sebelum percaya pesannya.                  │
│ [ Periksa sekarang → ]         AI + rules + URL intelligence│
└──────────────────────────────────────────────────────────────┘
```

Rules:
- headline occupies roughly 60–75% viewport width desktop;
- message fragments remain decorative;
- CTA above the fold;
- no intro gate.

### Section 3 — Scam patterns story

Two-column desktop:
- sticky/pinned left narrative;
- right evolving message visualization.

Narrative beats:
1. message looks ordinary;
2. urgency appears;
3. identity changes;
4. money/credential request appears;
5. system labels indicators.

Mobile:
- no pin;
- simple stacked progression.

### Section 4 — URL anatomy

Large stylized safe example:
```text
https://brand.secure-login.example.net/account
        └ subdomain ┘ └ domain ┘
```

Emphasize that the actual registrable domain matters.

CTA:
`Coba analisis tautan`

### Section 5 — Hybrid intelligence

Visual diagram:
```text
Rules ─┐
URL ───┼──> Risk Engine ──> Explainable Result
AI ────┘
```

Copy must explicitly say final score is controlled by app logic, not blindly copied from AI.

### Section 6 — Final CTA

Large simple closing:
`Kalau pesannya bikin ragu, cek dulu.`

Button:
`Buka AmanKlik`

## `/scan`

### Desktop shell

```text
┌────────────────────────────────────────────────────────────┐
│ Header                                                     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Apa yang ingin kamu periksa?                              │
│ [ Pesan ] [ Screenshot ] [ Tautan ]                       │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ active input                                           │ │
│ │                                                        │ │
│ │                                                        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ privacy notice                                             │
│                                      [ Analisis sekarang ] │
└────────────────────────────────────────────────────────────┘
```

Max width approximately 900–1050px.

Do not show a sidebar.

### Text mode
- label;
- textarea minimum visible ~8 lines;
- character count bottom right;
- `Gunakan contoh` secondary action;
- submit.

### Screenshot mode
Dropzone:
- icon or minimal illustration;
- `Tarik screenshot ke sini`;
- file picker button;
- accepted format copy.

Selected:
- image preview;
- filename/size;
- replace/remove.

### URL mode
Large single line input desktop, wrapping mobile.
Below input show static-analysis safety note.

### Loading overlay/state
Do not navigate away immediately if stages are useful.
Disable duplicate submission.
Show event-driven stages.

## `/result/[id]`

### Hero result

Desktop two-column:
```text
┌────────────────────────────┬───────────────────────────────┐
│ 91                         │ Potential impersonation      │
│ RISIKO SANGAT TINGGI       │ Ringkasan singkat...         │
│ Hybrid: AI + pola          │ disclaimer/uncertainty       │
└────────────────────────────┴───────────────────────────────┘
```

Mobile:
score first, summary second.

### Evidence section

Heading:
`Kenapa hasilnya seperti ini?`

Cards are not all identical dashboard tiles. Use editorial rows or alternating layout.

Suggested:
```text
01  [POLA]  Perubahan identitas
    "ini nomor baru..."
    Pengirim meminta pengguna menerima identitas baru...
```

### Source content / highlights
For text/image:
- show redacted preview in a bounded panel;
- highlight relevant evidence segments only.

For URL:
- show URL anatomy component instead.

### Action plan

Heading:
`Yang sebaiknya dilakukan sekarang`

Use ordered steps with priority labels.

### Technical details disclosure

Optional collapsed block:
- model used;
- analysis mode;
- cache;
- deterministic URL details;
- timestamp.

Do not expose system prompt/internal reasoning.

### Footer disclaimer + feedback

## `/history`

Simple editorial list/table.
No complex analytics dashboard.

Desktop:
- date;
- type;
- redacted preview;
- risk badge;
- score;
- arrow.

Mobile:
stacked rows.

## `/simulator`

### Intro
Explain:
`Latih keputusanmu menghadapi modus yang terasa nyata, tanpa risiko nyata.`

### Scenario card
Chat-inspired but not a clone of WhatsApp.

Layout desktop:
- left progress/score;
- right conversation and choices.

Mobile:
conversation then sticky/bottom-safe choice area.

### Completion
- score;
- what user noticed;
- missed indicators;
- correct mental model;
- replay/next scenario.

## `/learn`

P1 only.
Editorial card grid, not a blog CMS.

Topics:
- OTP;
- urgency;
- impersonation;
- URL anatomy;
- after-you-already-acted.

## Shared responsive rules

At <= 767px:
- eliminate decorative pinning;
- no hover-only information;
- buttons full-width when useful;
- maintain 44px touch targets;
- avoid huge viewport-locked headline that hides CTA.

## Visual implementation restrictions

Agents must not:
- use stock cybersecurity illustrations;
- turn every section into a `rounded-2xl border bg-white` card;
- use generic gradient blobs as primary identity;
- use excessive glass blur;
- add a dashboard sidebar;
- add charts that have no product purpose.

Awwwards quality here should come from composition, typography, rhythm, motion, and interaction—not decorative clutter.

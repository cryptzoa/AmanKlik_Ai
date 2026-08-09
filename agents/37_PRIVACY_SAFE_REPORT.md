# 37 — Privacy-Safe Report

## Feature identity

Working UI labels:

- **Salin langkah aman**
- **Simpan ringkasan**

Purpose: let a user retain or share actionable guidance without copying the suspicious message, screenshot, secrets, or sensitive URL data.

## First-release decision

Generate the report locally in the browser from the already authorized result. Use:

- clipboard text for action steps;
- print stylesheet for Save as PDF;
- optional downloadable `.txt` file generated client-side.

Do not create public share links in the competition release.

## Default report contents

Included:

- AmanKlik product name and timestamp;
- input type;
- textual risk level and final heuristic score;
- short summary;
- sanitized evidence labels and explanations;
- URL registrable domain only when relevant;
- prioritized action plan;
- official source titles and allowlisted URLs;
- uncertainty and disclaimer;
- analysis mode and engine version when available.

Excluded by default:

- screenshot or thumbnail;
- raw or redacted message preview;
- full submitted URL, path, query, or fragment;
- names, phone numbers, emails, account numbers, identity numbers;
- anonymous session ID, cache key, provider payload, model prompt;
- internal score trace.

## Canonical type

```ts
export interface SafeReport {
  schemaVersion: 1;
  generatedAt: string;
  scanCreatedAt: string;
  inputType: InputType;
  riskLevel: RiskLevel;
  finalScore: number;
  summary: string;
  evidence: Array<{
    source: SignalSource;
    label: string;
    explanation: string;
  }>;
  domain?: string;
  actions: Array<{
    priority: ActionItem["priority"];
    title: string;
    body: string;
    sourceTitle?: string;
    sourceUrl?: string;
  }>;
  uncertainty: string;
  disclaimer: string;
}
```

Create it with a pure allowlist mapper such as:

`buildSafeReport(result: AnalysisResult): SafeReport`

Do not spread the full result object or use a denylist serializer.

## UX flow

- actions sit near the result action plan, not above the score;
- before first export, explain that message content is excluded;
- `Salin langkah aman` copies a concise plain-text checklist;
- `Simpan ringkasan` opens a print-friendly report;
- success feedback names what was copied/saved;
- failure feedback offers manual selection without losing the result.

Do not use a native share sheet unless its behavior is feature-detected and the same safe payload is used.

## Print design

The print stylesheet must:

- use white background and dark text;
- hide navigation, animation, decorative fields, and interactive controls;
- preserve source URLs in readable form;
- avoid page breaks inside action items where practical;
- state `Ringkasan penilaian risiko, bukan bukti resmi` prominently;
- fit legibly on A4 and mobile browser PDF export.

## Optional explicit inclusion

Do not support including message excerpts in the first release. If introduced later, it requires a separate unchecked-by-default consent control and another redaction pass. Screenshot inclusion remains out of scope.

## Public-link policy

A future public share-link feature requires a separate threat model, explicit expiry, revocation, unguessable tokens, rate limits, and confirmation of exactly what becomes public. It must not reuse private `/result/:id` routes.

Until those controls exist, public share links are prohibited.

## Security and privacy

- build from the authorized in-memory result only;
- use an explicit field allowlist;
- apply URL allowlisting to source links;
- never send report content to a PDF SaaS or telemetry provider;
- never upload clipboard content;
- analytics may record only action name and success/failure;
- filename contains no name, phone, domain, or scan ID.

Recommended filename:

`amanklik-ringkasan-YYYY-MM-DD.txt`

## Acceptance criteria

- [ ] copied text contains score, level, actions, uncertainty, and disclaimer;
- [ ] copied text excludes raw/redacted preview and full submitted URL;
- [ ] print output excludes navigation and controls;
- [ ] only allowlisted official source links are included;
- [ ] feature works without a server call;
- [ ] clipboard denial has a usable fallback;
- [ ] keyboard and screen-reader feedback work;
- [ ] filename contains no sensitive identifier;
- [ ] no public link is generated;
- [ ] snapshot fixtures prove sensitive fields are excluded.

## Required tests

- allowlist-mapper unit tests;
- fixtures containing phone, email, account, query, and OTP-like content;
- clipboard component test for success and denial;
- print CSS visual check;
- E2E verifying no preview text appears in copied report;
- mobile browser fallback test.

## Demo path

From a result, use `Salin langkah aman` and show a short checklist that contains no submitted message. This demonstrates that privacy is a product behavior, not only a backend claim.

# 34 — Already-Acted Response

## Feature identity

Working UI label: **Sudah terlanjur?**

Purpose: give immediate, prioritized, source-backed guidance when the user has already clicked, shared, installed, or transferred something.

This is a response planner, not an emergency service and not an automated reporting system.

## User problem

The existing scanner is strongest before an unsafe action. A user who has already acted needs a different answer:

- what to stop doing now;
- which account or channel to secure first;
- what evidence to retain;
- where to verify or report independently;
- what AmanKlik cannot do for them.

## Entry points

- persistent secondary CTA on the scan page;
- contextual CTA on elevated-risk results;
- contextual CTA on action items marked `if_already_acted`;
- direct route `/respond` for use during the demo.

Do not place this behind login or require a completed scan.

## Supported incident types

Initial deterministic taxonomy:

```ts
export type IncidentType =
  | "money_transferred"
  | "otp_or_pin_shared"
  | "password_shared"
  | "link_opened"
  | "personal_data_shared"
  | "remote_access_installed"
  | "account_access_lost";
```

The UI uses plain Indonesian labels and allows multiple selections. Do not ask for the actual OTP, password, account number, identity number, or transaction receipt.

## Urgency model

```ts
export type ResponseUrgency = "immediate" | "soon" | "monitor";

export interface ResponseStep {
  id: string;
  incidentTypes: IncidentType[];
  urgency: ResponseUrgency;
  order: number;
  title: string;
  body: string;
  channelHint?: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface ResponsePlan {
  schemaVersion: 1;
  selectedIncidents: IncidentType[];
  immediate: ResponseStep[];
  soon: ResponseStep[];
  monitor: ResponseStep[];
  preserveEvidence: ResponseStep[];
  disclaimer: string;
}
```

The plan is produced by deterministic mappings checked into the repository. RAG may attach approved official sources, but AI must not decide urgency or omit mandatory steps.

## Core mappings

### Money transferred

Immediate priorities:

1. stop further transfers and communication;
2. contact the financial institution through a channel found independently;
3. preserve transaction and conversation evidence;
4. use the current official Indonesian anti-scam reporting guidance from the curated corpus.

Never promise reversal, freezing, or recovery.

### OTP, PIN, or password shared

Immediate priorities:

1. stop responding;
2. secure the affected account through the official app/site reached independently;
3. change compromised credentials from a trusted device;
4. revoke active sessions where supported;
5. contact the provider through its official channel.

Never ask the user to type the compromised secret into AmanKlik.

### Link opened

Priorities depend on whether data was entered or software was installed. Opening alone must not be described as guaranteed compromise.

### Personal data shared

Explain likely misuse categories without overclaiming. Recommend account monitoring and official-provider contact based on the kind of data, using category selection rather than collecting the data itself.

### Remote-access application installed

Provide conservative containment steps and advise obtaining qualified device support. Do not claim AmanKlik can detect or remove malware.

### Account access lost

Prioritize official account-recovery channels. Never include user-submitted links as recovery links.

## UX flow

```text
Select what happened
→ optional affected category (bank, messaging, marketplace, email, device)
→ show first three immediate steps
→ expand later steps and evidence checklist
→ offer official-source links
→ optionally start a relevant practice scenario
```

The first screen must be usable in a high-stress state:

- no long introduction;
- no animation before actions appear;
- first actions visible above the fold;
- ordered language: `Sekarang`, `Berikutnya`, `Pantau`;
- one clear back path without losing selections;
- print/copy action checklist supported by F4 when available.

## Data and persistence

Default behavior is client-side plan generation with no persistence.

If analytics are added later, store only aggregate incident categories and completion events. Never store user-entered secrets, transaction details, or copied evidence.

If launched from a scan result, pass only `scanId`; the server must enforce anonymous-session ownership before returning mapped categories.

## API decision

No API is required for the first release. Use a pure module such as:

`src/lib/response/build-response-plan.ts`

An API may be added only if source retrieval or controlled analytics requires it. The response must remain deterministic and available when Gemini is unavailable.

## Security and legal copy

Required disclaimer:

> AmanKlik memberikan panduan awal, bukan layanan darurat, bank, penegak hukum, atau jaminan pemulihan. Hubungi penyedia terkait melalui kanal resmi yang kamu cari sendiri.

Official links must come only from the curated allowlisted corpus. Do not convert a phone number found in user content into a contact action.

## Accessibility

- selections use native checkboxes or buttons with `aria-pressed`;
- urgency is expressed in text, not color alone;
- live updates announce the generated plan once;
- copy feedback is announced without stealing focus;
- no countdown or panic-inducing motion.

## Acceptance criteria

- [ ] direct `/respond` route works without a scan;
- [ ] at least seven incident types are supported;
- [ ] multiple incident selections deduplicate shared actions;
- [ ] ordering is deterministic and tested;
- [ ] required account-security actions cannot be removed by AI;
- [ ] no form asks for secrets or transaction details;
- [ ] all external sources are allowlisted official sources;
- [ ] no Gemini dependency;
- [ ] mobile first actions appear without horizontal overflow;
- [ ] reduced motion produces no delayed content;
- [ ] copy/print output excludes scan content by default;
- [ ] disclaimer is always visible.

## Required tests

- unit tests for every incident mapping;
- unit test for action deduplication and stable ordering;
- unit test that user-provided URLs can never become source links;
- component tests for multi-selection and reset;
- E2E for money transfer and credential-compromise flows;
- mobile and keyboard E2E;
- content snapshot review against the latest curated official guidance.

## Demo path

From an elevated result, select `Saya sudah transfer`. Show the immediate bank-contact and evidence-preservation plan, then state clearly that AmanKlik does not report or guarantee recovery.

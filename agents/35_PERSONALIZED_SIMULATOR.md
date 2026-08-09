# 35 — Personalized Simulator

## Feature identity

Working UI label: **Latihan dari hasil ini**

Purpose: transform patterns found in a session-owned scan into a short, deterministic practice scenario so the user learns a reusable response.

## Product value

The current simulator teaches fixed scenarios. Personalization connects analysis and education:

```text
Result evidence
→ select safe scenario template
→ practice one decision
→ explain the transferable principle
```

It must not reproduce the user's message or generate a more convincing scam.

## Entry points

- CTA after the result action plan;
- optional CTA at the end of Already-Acted Response;
- standard `/simulator` remains available with fixed scenarios.

Recommended route:

`/simulator?from=<scanId>`

The route validates ownership before using result categories. Invalid, expired, or foreign IDs fall back to the standard simulator without revealing whether a scan exists.

## Signal-to-template mapping

Map normalized categories to curated templates:

| Result category | Template family |
|---|---|
| identity switch / new number | independent contact verification |
| OTP / PIN / password request | credential secrecy |
| transfer / payment pressure | payment pause and independent confirmation |
| threat / urgency | deliberate pause and channel switch |
| prize / guaranteed return | claim verification |
| suspicious URL structure | registrable-domain recognition |
| remote-access request | device-control refusal |

When several categories exist, choose the highest-priority mapped family using deterministic ordering. Do not let Gemini choose the safety objective.

## Canonical types

```ts
export type PracticeFamily =
  | "identity_verification"
  | "credential_secrecy"
  | "payment_pause"
  | "urgency_resistance"
  | "claim_verification"
  | "domain_recognition"
  | "remote_access_refusal";

export interface PracticeContext {
  sourceScanId: string;
  family: PracticeFamily;
  matchedSignalIds: string[];
  title: string;
  learningObjective: string;
}

export interface PersonalizedScenario {
  schemaVersion: 1;
  templateId: string;
  family: PracticeFamily;
  syntheticMessage: string;
  choices: SimulatorChoice[];
  explanation: string;
  transferableRule: string;
}
```

`syntheticMessage` must come from reviewed fixtures or constrained templates. Never insert `previewRedacted`, real names, real numbers, or real URLs into the scenario.

## Generation strategy

### Required path

Deterministic mapping and template rendering. This path must cover all supported families and work offline from AI.

### Optional enrichment

Gemini may rephrase educational feedback only when:

- the deterministic correct answer is already fixed;
- output is schema-validated;
- the prompt contains no raw scan content;
- timeout falls back silently to reviewed copy.

Gemini must not generate the choices, determine correctness, or produce live scam tactics.

## Server boundary

Recommended server function:

`getPracticeForSession(scanId, sessionId)`

It loads the sanitized result through the existing ownership repository, maps signal categories, and returns only `PracticeContext` or the final reviewed scenario.

Optional endpoint:

`GET /api/scans/:id/practice`

Response rules:

- `200` with scenario for an owned supported result;
- generic `404` for missing/foreign IDs;
- `200` fixed fallback scenario when no category maps cleanly;
- no raw result payload in the response.

## UX flow

1. Result explains why the practice was selected.
2. User starts a one- or two-step scenario.
3. Every choice receives immediate explanatory feedback.
4. Completion shows one transferable safety rule.
5. User can retry or open the full simulator.

Do not add a long intro, points economy, streaks, leaderboard, or login requirement.

## Privacy

- source scan ownership is mandatory;
- no raw or redacted message is shown in the scenario;
- completion can remain client-side;
- if persisted, store only template ID, selected choice IDs, and completion timestamp tied to the anonymous session;
- no public scenario URL derived from a private scan.

## Accessibility

- choices are native buttons with clear focus;
- correctness is expressed in text and icon, not color alone;
- feedback uses a polite live region;
- user can continue without animation;
- keyboard focus moves to the feedback heading after selection only when helpful and not disruptive.

## Acceptance criteria

- [ ] every supported signal family maps to a reviewed scenario;
- [ ] deterministic mapping chooses the same family for the same result;
- [ ] foreign-session scan IDs reveal no data;
- [ ] no scan excerpt, host, identity, or account detail enters generated practice;
- [ ] simulator works when AI is unavailable;
- [ ] correct answers are controlled by application data;
- [ ] fallback scenario exists;
- [ ] mobile and keyboard completion work;
- [ ] result-to-practice path takes one CTA;
- [ ] transferable rule appears at completion.

## Required tests

- mapping unit tests for every normalized category;
- priority and tie-break tests;
- ownership integration test;
- test proving scan preview never appears in scenario output;
- E2E from synthetic scan result to completion;
- degraded AI path;
- reduced-motion and keyboard E2E.

## Demo path

Use a result with identity-switch and transfer-pressure signals. Start a personalized scenario, choose the unsafe immediate-transfer option, then demonstrate the independent verification choice.

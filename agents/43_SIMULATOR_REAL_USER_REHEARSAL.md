# 43 — Simulator: Real-User Rehearsal Indonesia

Status: implemented locally on 2026-08-12. This document supersedes the fixed three-scenario content and binary scoring described in the initial simulator specifications. Privacy and deterministic-safety constraints from `35_PERSONALIZED_SIMULATOR.md` remain mandatory.

## Product outcome

`/simulator` rehearses decisions that Indonesian users may need to make during scams. It is not a trivia quiz and does not ask users to identify a criminal or memorize visual tells.

The simulator:

- uses only reviewed synthetic fixtures;
- shows feedback immediately after every decision;
- distinguishes `safe`, `partial`, and `unsafe` decisions;
- requires the user to read feedback before moving forward;
- ends with one transferable safety rule and a review of all decisions;
- works without Gemini or any AI endpoint;
- stores completion only in client memory for the current page session.

## Reviewed scenario set

1. family/new-number impersonation with familiar voice or deepfake;
2. fake bank customer service, account threats, and OTP;
3. APK disguised as an invitation, receipt, bill, or document;
4. part-time task scam that escalates from a small reward to a deposit;
5. illegal investment promoted with a public figure, guaranteed returns, and locked withdrawals;
6. fake transfer proof and overpayment refund pressure against merchants;
7. QRIS merchant-name mismatch and refund QR sent through chat;
8. parcel phishing link, brand text in a URL, and card-data collection.

Every scenario contains three decisions and three response options per decision. Exactly one option represents the strongest reviewed action. Partial choices create a pause but still rely on weak verification. Unsafe choices preserve the attacker's channel, disclose secrets, install software, or move money.

## Scoring model

Each reviewed choice has a fixed point value from 0 to 100. Scenario score is the mean of the three selected values.

```text
80–100  → strong
45–79   → developing
0–44    → retry
```

The score is secondary. The primary completion output is:

- the transferable rule;
- count of safe, partial, and unsafe decisions;
- the user's selected action at each stage;
- the reason behind the rating;
- the safer alternative when needed.

No streak, leaderboard, login, public profile, or reward economy is allowed.

## Interaction contract

```text
show synthetic situation
→ user selects one action
→ lock all choices
→ focus and announce immediate feedback
→ user explicitly continues
→ repeat for three decisions
→ show rule, review, official sources, retry, and next scenario
```

Users cannot change an answer after seeing its rating. They can restart the entire scenario after completion.

On mobile, scenario selection uses a native select so the eight-scenario catalog does not push the active exercise far below the fold. Desktop keeps the sticky scenario list.

## Personalized practice mapping

Scanner signals map deterministically in this priority order:

1. remote access → APK/device-control scenario;
2. OTP or credential request → fake bank/OTP scenario;
3. identity-document request → job/deposit scenario;
4. URL and domain signals → parcel phishing scenario;
5. prize or investment → investment/deepfake scenario;
6. payment request → family impersonation scenario;
7. impersonation, secrecy, or unexpected channel → family impersonation scenario;
8. threat or urgency → fake bank/OTP scenario;
9. no match → family identity-verification fallback.

This priority is application data. AI cannot choose the training objective, scenario, answer quality, or score.

## Source policy

The scenario catalog may render only reviewed HTTPS sources from:

- Otoritas Jasa Keuangan;
- Sikapi Uangmu OJK;
- Bank Indonesia;
- Kementerian Komunikasi dan Digital.

Tests enforce the exact source-host allowlist. Synthetic messages cannot contain live URLs, phone numbers, or account numbers.

## Accessibility and motion

- choices are native buttons with `aria-pressed`;
- feedback is expressed in text, not color alone;
- keyboard focus moves to the feedback explanation after a choice;
- progress uses a named `progressbar` with numeric ARIA values;
- mobile selection uses a labeled native select;
- feedback is not delayed by animation;
- the previous choice-stagger GSAP sequence is removed;
- only a short CSS progress transition remains and is disabled by reduced-motion preference.

## Regression coverage

- structural validation for all eight scenarios;
- one and only one strongest action per decision;
- safe path scores 100 for every scenario;
- partial scoring remains distinct from unsafe scoring;
- incomplete and mismatched answer sets are rejected;
- source allowlist enforcement;
- synthetic-content privacy checks;
- all personalized signal mappings and priority tie-break;
- immediate-feedback component behavior;
- mixed-path completion review;
- desktop and mobile keyboard E2E;
- horizontal-overflow E2E.

# 41 — Protection Platform Expansion

## Status

This document defines the implemented MVP contract for the focused expansion requested after documents 33–40. It supersedes the old product-boundary entries that excluded browser extensions, community intelligence, and case workspaces. The original safety and privacy boundaries remain authoritative.

## Product loop

The expanded journey is:

**Capture → Analyze → Connect evidence → Act → Practice → Learn from aggregate patterns → Evaluate robustness**

The expansion must still avoid certainty claims, criminal identification, URL fetching, raw-message persistence, automatic reporting, or autonomous account actions.

## Implemented vertical slices

| Feature | Product surface | Server/data boundary |
|---|---|---|
| Cross-source investigation | `/investigate`, `/investigate/[id]` | `investigation_cases`, `investigation_case_scans`, session-owned scan references |
| Live scam intelligence | `/intelligence`, repeated-input note on results | 30-day aggregate, minimum three distinct anonymous sessions, curated advisory fallback |
| Safe Action Center | persistent checklist inside `/result/[id]` | `scan_action_progress`, action IDs constrained to the result action plan |
| Browser/share extension | `extension/`, `/connect`, `/api/integrations/scan`, PWA share target | revocable HMAC-hashed integration token; explicit selection; no Gemini key in extension |
| Interactive evidence graph | investigation detail | graph built from redacted result metadata; merged signal/action/domain nodes |
| Adversarial benchmark | `/benchmark`, `pnpm eval:adversarial` | synthetic deterministic fixtures, zero URL network calls |

## New persistence

- `investigation_cases`: session-owned case summary and aggregate risk.
- `investigation_case_scans`: many-to-many references to existing session-owned scans.
- `scan_action_progress`: checklist state for an action that already exists on a result.
- `integration_tokens`: token HMAC, device label, last-use timestamp, and revocation timestamp.

No table stores extension selections, raw screenshots, full conversations, or public accusations.

## Deliberately cut from product scope

Family Mode was removed before release. Its guided script and relationship selector added a patronizing, low-frequency flow without strengthening the core scam-response journey. The product should instead prioritize the direct path: **Scan → Investigate → Evidence → Action → Practice**.

## Intelligence privacy model

- A trend counts a signal category at most once per anonymous session.
- A trend is suppressed until it appears across at least three distinct sessions.
- Repeated-input context on a result is shown only at the same three-session threshold.
- Raw URLs, phone numbers, account numbers, names, messages, and screenshots never enter the public snapshot.
- Curated advisories are clearly separated from observed first-party trends.

## Definition of Done

- All new mutations enforce anonymous-session ownership or a revocable integration token.
- Cross-site regular web origins cannot use the extension API or PWA share endpoint.
- Submitted URLs remain string-only static analysis inputs.
- Extension permissions are explicit and temporary where possible.
- Every new page remains usable at 390 px and with reduced motion.
- Deterministic and adversarial evaluations make no universal accuracy claim.
- Lint, typecheck, unit/integration tests, migration generation, production build, and E2E pass.

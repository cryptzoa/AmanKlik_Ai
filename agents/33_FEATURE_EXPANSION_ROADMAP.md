# 33 — Feature Expansion Roadmap

## Status and authority

This document defines the expansion path after the current AmanKlik P0/P1 product is stable. Documents 01–32 remain authoritative for the existing scanner, result, simulator, security, and deployment contracts. If an expansion conflicts with the original safety boundaries, the safer existing rule wins.

The expansion must deepen the core journey:

**Scan → Understand → Act → Learn**

It must not become a collection of unrelated tools.

## Product objective

Move AmanKlik from a risk-analysis demo into a focused digital-safety companion that can:

1. explain a suspicious interaction;
2. help after an unsafe action has already happened;
3. teach the user using the exact patterns they encountered;
4. communicate how the result was formed without presenting false certainty;
5. let the user retain a privacy-safe action summary;
6. evaluate product quality using reproducible synthetic evidence.

## Expansion features

| ID | Feature | Core stage | Competition priority | Specification |
|---|---|---|---|---|
| F1 | Already-Acted Response | Act | Highest | [34_ALREADY_ACTED_RESPONSE.md](./34_ALREADY_ACTED_RESPONSE.md) |
| F2 | Personalized Simulator | Learn | High | [35_PERSONALIZED_SIMULATOR.md](./35_PERSONALIZED_SIMULATOR.md) |
| F3 | Explainable Score Breakdown | Understand | High | [36_SCORE_BREAKDOWN.md](./36_SCORE_BREAKDOWN.md) |
| F4 | Privacy-Safe Report | Act | Medium | [37_PRIVACY_SAFE_REPORT.md](./37_PRIVACY_SAFE_REPORT.md) |
| F5 | Conversation Analysis | Scan | Post-competition/high complexity | [38_CONVERSATION_ANALYSIS.md](./38_CONVERSATION_ANALYSIS.md) |
| F6 | Evaluation and Benchmarking | Proof | High, internal | [39_EVALUATION_BENCHMARKING.md](./39_EVALUATION_BENCHMARKING.md) |

The implementation sequence and combined Definition of Done are in [40_EXPANSION_IMPLEMENTATION_PLAN.md](./40_EXPANSION_IMPLEMENTATION_PLAN.md).

## Recommended release slices

### Competition release

- F1 Already-Acted Response;
- F3 Explainable Score Breakdown;
- a minimal F2 path from result to one personalized practice scenario;
- F6 synthetic evaluation summary for presentation evidence.

This slice creates the strongest story without changing the scanner input model.

### Product-polish release

- full F2 scenario mapping;
- F4 local privacy-safe report;
- deeper action-source coverage;
- accessibility and mobile stress testing.

### Post-competition research release

- F5 multi-message conversation analysis;
- optional image-thread support only after text-thread behavior is stable;
- benchmark expansion based on failure analysis.

## Dependency map

```text
Existing scan result
├── F1 Already-Acted Response
├── F3 Score Breakdown
├── F4 Privacy-Safe Report
└── F2 Personalized Simulator
    └── existing deterministic simulator engine

Existing rules + AI + risk engine
├── F3 sanitized score trace
├── F5 conversation-level signals
└── F6 synthetic benchmark runner

Existing curated RAG corpus
├── F1 official recovery guidance
├── F2 educational feedback
└── F4 cited action summary
```

## Architecture constraints

The existing topology remains:

Browser → Next.js application → validation/session → deterministic engines → optional Gemini/RAG → code-controlled scoring → redaction → PostgreSQL.

Do not introduce Redis, a vector database, background workers, a crawler, or a second production service for these features unless a measured bottleneck proves it necessary after the competition.

## Non-negotiable cross-feature rules

- Never fetch, preview, resolve, expand, or probe user-submitted URLs.
- Never claim that a person, account, message, or URL is certainly fraudulent or safe.
- Never show exact secret rule weights or thresholds that materially enable evasion.
- Never persist raw screenshots or unredacted conversations.
- Never turn official-source links into automatic reports or account actions.
- Never require an account to receive urgent safety guidance.
- Never depend on Gemini for emergency steps or simulator completion.
- Every AI-derived object must be schema-validated before use.
- Every result remains owned by the anonymous session that created it.
- Every new async UI requires loading, expected-error, unexpected-error, and timeout behavior.
- Reduced motion, keyboard navigation, 44 px targets, and mobile layouts remain required.

## Product boundaries

Still out of scope:

- direct bank, police, platform, or government reporting;
- transaction reversal or account freezing;
- malware removal claims;
- criminal identification;
- automatic contact of family members;
- public community reports;
- browser extensions and chat-platform bots;
- accounts, social profiles, and public scan URLs.

## Success signals

The expansion is successful when:

- a user who already acted reaches the correct first safe step in under 30 seconds;
- a result clearly communicates which evidence families mattered without implying statistical certainty;
- a user can start relevant practice from a scan result in one action;
- exported content contains no raw message by default;
- synthetic benchmark regressions fail CI or produce an explicit review artifact;
- the competition demo can show the full value in under four minutes.

## Scope control rule

Finish one vertical slice, including tests and failure states, before starting the next. A partially implemented F5 conversation analyzer must never displace a complete F1 incident-response flow.

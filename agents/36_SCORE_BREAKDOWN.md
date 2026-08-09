# 36 — Explainable Score Breakdown

## Feature identity

Working UI label: **Bagaimana skor ini terbentuk?**

Purpose: show which evidence families materially affected the result while preserving uncertainty and avoiding disclosure that makes the engine easy to evade.

## Product rule

The breakdown explains a heuristic risk assessment. It is not a probability of fraud, confidence percentage, legal verdict, or model chain-of-thought.

Never write:

- `87% kemungkinan penipuan`;
- `AI yakin 92%`;
- `pasti aman`;
- raw Gemini reasoning;
- exact hidden rule weights or trigger thresholds.

## Two-layer trace

### Internal score trace

Used by tests and engineering diagnostics. It may contain numeric component scores and applied floors, but never secrets, raw inputs, or provider payloads.

```ts
export interface InternalScoreTrace {
  schemaVersion: 1;
  rulesScore: number;
  urlScore?: number;
  semanticScore?: number;
  appliedProfile: string;
  appliedFloorIds: string[];
  preClampScore: number;
  finalScore: number;
  engineVersion: string;
}
```

### Public score explanation

Safe for result rendering and persistence.

```ts
export type ContributionBand = "minor" | "moderate" | "major";

export interface ScoreContribution {
  source: "rule" | "url" | "ai";
  band: ContributionBand;
  label: string;
  explanation: string;
  signalCount: number;
}

export interface PublicScoreExplanation {
  schemaVersion: 1;
  engineVersion: string;
  contributions: ScoreContribution[];
  strongestSignalIds: string[];
  adjustmentLabels: string[];
  explanation: string;
}
```

The public object must be derived by application code from the validated internal trace and final signals.

## Display behavior

Recommended order inside the result page:

1. final score and textual risk level;
2. summary and uncertainty;
3. `Bagaimana skor ini terbentuk?` disclosure;
4. source contributions: patterns, URL structure, AI context;
5. strongest evidence links that move focus to existing evidence cards;
6. standard action plan.

For `rules_only`, state that contextual AI was unavailable and show only deterministic contributions. Do not render an empty AI bar.

## Visual rules

- do not use a pie chart that suggests statistical precision;
- prefer labeled bands or a three-row contribution list;
- exact final score remains visible;
- contribution band is always written in text;
- source colors must meet contrast requirements and not be the only distinction;
- motion is optional and never delays explanation.

## Score semantics

`major`, `moderate`, and `minor` are relative explanatory bands, not public thresholds. The mapping is versioned with the risk engine and covered by tests.

When a risk floor changes the final score, use safe language such as:

> Kombinasi permintaan rahasia dan tindakan mendesak meningkatkan tingkat kehati-hatian minimum.

Do not expose the exact floor value or complete evasion recipe.

## Persistence and versioning

Add the optional field to `AnalysisResult` in a schema-versioned migration path:

```ts
scoreExplanation?: PublicScoreExplanation;
```

Existing results without the field must continue rendering. Do not recompute historical explanations using a newer engine unless the UI clearly labels the recomputation.

Recommended cache key input includes `engineVersion` and explanation schema version.

## Security and privacy

- no raw user input in the trace;
- evidence references use existing redacted signal IDs;
- no provider chain-of-thought;
- internal trace is excluded from public API responses and normal production logs;
- debug trace access must not be exposed through query parameters;
- source counts must not reveal hidden corpus documents.

## Acceptance criteria

- [ ] hybrid text results explain Rule and AI contributions;
- [ ] hybrid URL results explain Rule/URL/AI contributions as applicable;
- [ ] degraded results omit AI contribution and explain why;
- [ ] final score still comes from the existing deterministic fusion engine;
- [ ] no probability language appears;
- [ ] no exact hidden weights or thresholds appear publicly;
- [ ] strongest-signal links are keyboard accessible;
- [ ] old persisted results still render;
- [ ] cache invalidates when explanation/engine version changes;
- [ ] reduced motion does not hide content.

## Required tests

- unit tests from representative internal traces to public bands;
- snapshot tests for text, URL, screenshot, and degraded modes;
- regression test for applied risk floors;
- schema compatibility test for old results;
- security test that internal trace fields are absent from API DTOs;
- E2E verifying evidence focus and accessible labels.

## Demo path

Expand the breakdown on a high-risk screenshot result. Show that identity switch and transfer pressure are deterministic evidence, while AI contributes contextual interpretation; reinforce that the final score is application-controlled.

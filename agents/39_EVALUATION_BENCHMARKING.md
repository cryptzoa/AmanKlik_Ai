# 39 — Evaluation and Benchmarking

## Purpose

Create reproducible evidence that AmanKlik behaves consistently across synthetic scam and benign cases. This is an internal quality feature and presentation proof, not a public claim of universal accuracy.

## Evaluation principles

- use synthetic or publicly reusable, non-sensitive fixtures only;
- label expected signals and acceptable risk ranges before running the system;
- separate deterministic-engine tests from optional live-AI evaluation;
- report false positives and failure cases, not only successful examples;
- never market benchmark results as real-world fraud-detection accuracy;
- version dataset, engine, prompts, model, and RAG index.

## Dataset structure

Recommended location:

```text
tests/fixtures/evaluation/
├── manifest.json
├── text/
├── url/
├── image/
├── conversation/
└── expected/
```

Canonical case:

```ts
export interface EvaluationCase {
  id: string;
  version: number;
  inputType: "text" | "url" | "image" | "conversation";
  fixturePath?: string;
  inlineInput?: unknown;
  labels: string[];
  expectedRiskRange: { min: number; max: number };
  expectedSignalCategories: string[];
  forbiddenSignalCategories?: string[];
  expectedDegradedBehavior: string;
  notes: string;
}
```

Fixtures must never include real OTPs, personal identifiers, active suspicious domains, or copyrighted private conversations. URL fixtures use reserved domains such as `.example`, `.test`, and `.invalid`.

## Required cohorts

### Elevated-risk synthetic cases

- new-number family impersonation plus transfer;
- OTP verification request;
- guaranteed investment return;
- account threat plus verification link;
- remote-access installation request;
- suspicious subdomain/path composition;
- gradual conversation pressure when F5 exists.

### Benign controls

- ordinary family scheduling;
- legitimate reminder without credential/payment request;
- neutral documentation URL;
- long but harmless conversation;
- message mentioning security education without asking for action;
- Indonesian slang, spelling variation, and code-switching.

### Robustness cases

- prompt injection inside user content;
- extremely repeated terms;
- Unicode confusables;
- malformed URL strings;
- image at supported size/type boundaries;
- AI timeout and invalid structured output;
- database unavailable and cache behavior.

## Metrics

### Deterministic regression metrics

- expected signal recall by category;
- forbidden-signal rate;
- risk-range pass rate;
- redaction leakage count;
- URL network-call count, always zero;
- deterministic run-to-run equality.

### End-to-end operational metrics

- success/degraded/error outcome counts;
- p50/p95 latency per input type;
- provider timeout/fallback rate;
- cache hit behavior;
- output-schema validation failures;
- image preprocessing duration and output bounds.

### Human-review metrics

- explanation is understandable;
- action plan is relevant and ordered;
- uncertainty is visible;
- benign content is not described as certainly safe;
- high-risk content is not described as proven fraud;
- official sources support the action.

Use a small review rubric with two reviewers when possible. Record disagreement instead of averaging it away silently.

## Runner design

Recommended commands:

```text
pnpm eval:deterministic
pnpm eval:mock
pnpm eval:live -- --confirm-live
pnpm eval:report
```

Rules:

- deterministic/mock evaluation is CI-safe;
- live evaluation is manual, explicit, rate-limited, and never runs on pull requests;
- live runner requires a confirmation flag and synthetic fixture allowlist;
- reports sanitize provider errors and never print secrets or full image payloads;
- non-zero exit on deterministic regressions;
- live provider drift creates a review warning, not an automatic production claim.

## Report artifact

Generate machine-readable JSON plus a concise Markdown summary containing:

- run timestamp;
- Git commit;
- dataset version;
- engine/prompt/RAG versions;
- runtime/model identity;
- case counts and pass/fail;
- latency summary;
- known failures and reviewer notes;
- explicit limitation statement.

Do not commit raw live-provider payloads. Commit only reviewed aggregate summaries when useful for competition evidence.

## Competition presentation

Safe claim:

> AmanKlik diuji pada kumpulan kasus sintetis berlabel untuk memastikan sinyal, redaksi, fallback, dan batas skor tetap konsisten.

Unsafe claim without a representative real-world study:

> AmanKlik akurat 95% mendeteksi semua penipuan.

## Acceptance criteria

- [ ] versioned synthetic manifest exists;
- [ ] elevated-risk, benign, robustness, and degraded cohorts exist;
- [ ] deterministic runner is repeatable;
- [ ] active/suspicious external domains are absent;
- [ ] URL network-call count is asserted as zero;
- [ ] redaction leakage test is included;
- [ ] result records engine/dataset versions;
- [ ] live runner requires explicit confirmation;
- [ ] no secrets or provider payloads enter artifacts;
- [ ] Markdown report states limitations;
- [ ] regression exit behavior is documented.

## Initial target

Start with 20–30 high-quality synthetic cases rather than hundreds of weak variants. Expand cases from discovered failures, not vanity volume.

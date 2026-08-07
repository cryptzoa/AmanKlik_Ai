# 11 — Deterministic Risk Engine

## Purpose

Final risk is controlled by application code, not Gemini.

Inputs:
- deterministic message signals;
- URL structural signals;
- validated AI semantic risk;
- input type.

Outputs:
- score 0–100;
- risk level;
- prioritized merged indicators;
- analysis mode.

## Levels

```text
0–29   LOW
30–54  MEDIUM
55–79  HIGH
80–100 VERY_HIGH
```

UI:
- LOW → Risiko rendah
- MEDIUM → Risiko sedang
- HIGH → Risiko tinggi
- VERY_HIGH → Risiko sangat tinggi

Never map LOW to "Aman".

## Message signals

Initial heuristic weights; later calibratable.

| Signal | Weight |
|---|---:|
| explicit OTP request | 28 |
| password/PIN request | 26 |
| remote-access app request | 30 |
| direct money transfer | 18 |
| guaranteed return | 18 |
| new-number identity switch | 14 |
| severe urgency | 12 |
| account-blocking threat | 12 |
| prize requiring action/payment | 12 |
| unexpected channel move | 8 |
| secrecy request | 10 |
| click link to verify | 10 |
| send identity document | 18 |

## URL signals

| Signal | Weight |
|---|---:|
| claimed brand vs registrable-domain conflict | 30 |
| hostname is IP | 22 |
| punycode `xn--` | 20 |
| username/password URL component | 18 |
| plain HTTP | 8 |
| known local shortener pattern | 8 |
| excessive subdomain depth | 6 |
| many host hyphens | 5 |
| encoded/obfuscated pattern | 8 |
| brand token in subdomain but different registrable domain | 24 |

Do not use a simplistic bad-TLD list as primary evidence.

## Rules score

```ts
const rulesScore = Math.min(
  100,
  uniqueSignals.reduce((sum, s) => sum + (s.weight ?? 0), 0)
);
```

Duplicate regex variants produce one logical signal.

## Fusion

Text no URL:
`0.55 * rules + 0.45 * AI`

Text with URL:
`0.45 * rules + 0.15 * URL + 0.40 * AI`

Screenshot:
`0.45 * rules + 0.10 * URL + 0.45 * AI`
If no URL, redistribute to about 50/50 rules/AI.

URL only:
`0.70 * URL + 0.30 * AI`

Rules-only degraded text:
`final = rulesScore`

Rules-only degraded URL:
use deterministic URL/message structural combination.

Round only final score.

## Floors

Use sparingly:
- OTP + claimed bank context → at least 60;
- remote access + finance → at least 70;
- brand-domain mismatch + credential request → at least 70.

Test floors.

## Confidence

Model confidence is not risk.
Show separately if surfaced.

## Signal type

```ts
type SignalSource = "rule" | "url" | "ai";

interface RiskSignal {
  id: string;
  category: string;
  source: SignalSource;
  label: string;
  severity: "low" | "medium" | "high";
  weight?: number;
  evidence?: string;
  explanation: string;
}
```

## Deduplication

Rule + AI urgency becomes one primary card with possible contextual enrichment.

Canonical categories:
- urgency;
- credential_request;
- otp_request;
- payment_request;
- impersonation;
- threat;
- prize;
- investment;
- remote_access;
- brand_domain_mismatch;
- url_obfuscation;
- secrecy;
- verification_link.

## Normalization

Before rules:
- Unicode normalize;
- lowercase matching copy;
- preserve evidence copy;
- collapse whitespace;
- preserve URL-relevant punctuation.

Indonesian first; common English phrases optional.

## Evaluation

Maintain curated synthetic fixtures with expected score ranges. Never claim scientific accuracy unless actually measured.

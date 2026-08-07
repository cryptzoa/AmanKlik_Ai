# 28 — UI Component Contracts

## `RiskScore`

```ts
type RiskScoreProps = {
  score: number;
  level: RiskLevel;
  animate?: boolean;
  size?: "hero" | "compact";
};
```

Final number always present in DOM. Visual meter decorative. Text level present. Reduced motion supported.

## `EvidenceCard`

```ts
type EvidenceCardProps = { signal: RiskSignal };
```

Shows source, severity, title, redacted evidence, explanation. No raw HTML.

## `UrlAnatomy`

```ts
type UrlAnatomyProps = { analysis: UrlAnalysis };
```

Shows registrable domain prominently. Submitted URL is not clickable.

## `AnalysisModeBadge`

Modes:
- `hybrid` → `AI + pola`
- `cached_hybrid` → `Analisis tersimpan`
- `rules_only` → `Pola saja`

Tooltip explains.

## `ScanTabs`
- text/image/url;
- keyboard accessible;
- preserve mode input where reasonable;
- hidden mode never accidentally submits.

## `ImageDropzone`

States:
- idle;
- drag-active;
- selected;
- invalid;
- disabled/loading.

Always standard file input alternative.

## `AnalysisStages`

```ts
type AnalysisStage =
 | "validating"
 | "preprocessing"
 | "checking_rules"
 | "ai_analysis"
 | "finalizing";
```

Only real transitions complete stages.

## `ActionPlan`

```ts
type ActionItem = {
  id: string;
  priority: "now" | "next" | "if_already_acted";
  title: string;
  body: string;
  sourceTitle?: string;
  sourceUrl?: string;
};
```

User suspicious URL never becomes sourceUrl.

## `PrivacyNotice`
Visible on scan page, not footer-only.

## `ResultDisclaimer`
Required every result.

## Async-state rule
Every async component has:
- idle;
- loading;
- success;
- expected error;
- unexpected error.

No indefinite spinner.

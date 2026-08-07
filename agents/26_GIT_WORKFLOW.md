# 26 — Git and Collaboration

## Branches

`main` stays deployable. Short feature branches:
- `feat/risk-engine`
- `feat/gemini-adapter`
- `feat/scanner-ui`
- `style/landing-motion`

## Commits

```text
feat(scan): add screenshot validation
feat(ai): add structured Gemini output
fix(url): reject javascript protocol
test(risk): cover OTP floor
style(result): animate risk reveal
docs(state): record deployment check
```

## Rules
- no `.env`;
- no real private screenshots;
- commit migrations;
- commit lockfile;
- synthetic fixtures okay;
- knowledge index only if reviewed/non-sensitive;
- avoid history rewriting before submission.

## Review
- matches scope/docs;
- no needless dependency;
- secrets boundaries correct;
- server/client correct;
- tests;
- a11y;
- errors;
- STATE updated.

## AI agent behavior
- logical task per commit;
- no unrelated mass-format;
- do not delete human work blindly;
- inspect diff.

## Conflict resolution
Never blindly choose side for:
- env;
- DB schema;
- risk weights;
- AI prompts;
- design tokens.

Resolve against docs.

## CI

GitHub Actions:
1. checkout;
2. Node 24;
3. pnpm;
4. frozen install;
5. lint;
6. typecheck;
7. unit;
8. build with safe mock/test env.

Normal CI must not require live Gemini key.

## Optional final tag
`competition-final-YYYYMMDD` after deployed commit verified.

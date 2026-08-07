# 16 — Testing and QA

## Commands

Expose:
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

## Unit — mandatory

### URL
- normal;
- deceptive subdomain;
- IP;
- punycode;
- excessive subdomain;
- unsupported protocol;
- credentials in URL;
- localhost-like safely;
- prove no network I/O by design.

### Rules
- OTP;
- PIN/password;
- urgency;
- transfer;
- new number;
- prize;
- investment;
- remote access;
- duplicate suppression;
- benign.

### Risk
- fusion;
- thresholds;
- cap;
- floors;
- degraded;
- URL redistribution;
- dedupe.

### Redaction
- phone;
- email;
- account-like number;
- OTP;
- benign numbers.

### HMAC
- stable same input;
- different changed input;
- not plain hash.

### AI schema
- valid accepted;
- missing rejected;
- score bounds;
- array limits.

## Integration

Mock mode:
- text success;
- validation;
- text degraded;
- URL success;
- unsupported protocol;
- image wrong type;
- image too large;
- session ownership;
- feedback ownership;
- cache hit.

## E2E P0

1. Landing → text result.
2. URL → anatomy and mismatch.
3. Invalid disguised image rejected before AI.
4. Screenshot happy path with mock.
5. History.
6. Simulator.
7. Reduced motion.

## Mock provider
No Gemini quota in E2E. Deterministic fixtures.

## Live smoke
Opt-in/manual:
- one text;
- one screenshot;
- schema valid;
- acceptable latency;
- synthetic only.

## Visual QA
Check:
- 360
- 390
- 768
- 1440
- projector/large laptop

Inspect overflow, focus, long URLs, long evidence, upload errors.

## Accessibility
- keyboard;
- focus;
- labels;
- logical result order;
- no color-only;
- reduced motion;
- semantic headings;
- announced errors.

## Performance goals

Desktop:
- Performance >=90
- Accessibility >=95
- Best Practices >=95
- SEO >=90

Mobile:
- Performance >=80
- Accessibility >=95

## Demo regression
- landing;
- CTA;
- text;
- screenshot;
- URL;
- history;
- simulator;
- no fatal console errors;
- health;
- Gemini;
- DB.

## Severity

P0:
- deployment broken;
- scan broken;
- secret leak;
- cross-session leak;
- URL fetch;
- mobile unusable;
- provider failure crashes app.

P1:
- animation glitch;
- secondary page;
- copy;
- cache nuance.

Fix P0 before polish.

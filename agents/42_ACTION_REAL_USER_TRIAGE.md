# 42 — Action: Real-User Triage Indonesia

Status: implemented locally on 2026-08-12. This document supersedes the initial incident taxonomy in `34_ALREADY_ACTED_RESPONSE.md`; the privacy, determinism, and safety constraints from that document still apply.

## Outcome

The `/respond` page is a deterministic first-response planner for Indonesian users who may already have acted on a scam. It does not call Gemini, persist the selections, contact third parties, or promise recovery.

The first visible output is limited to three prioritized actions. Additional urgent steps, evidence handling, recovery, and monitoring are expandable so the high-stress path remains readable.

## Incident taxonomy

```ts
type IncidentType =
  | "money_transferred"
  | "unauthorized_transaction"
  | "credential_or_card_shared"
  | "suspicious_app_installed"
  | "account_or_number_lost"
  | "identity_data_shared"
  | "link_or_qr_opened"
  | "goods_released_fake_payment"
  | "unsure";
```

This covers common local impact patterns without asking the user to classify the scam technique or disclose secrets.

## Optional affected service

```ts
type AffectedAsset =
  | "bank_or_wallet"
  | "email"
  | "whatsapp"
  | "marketplace"
  | "social_media"
  | "phone_number"
  | "device";
```

The affected service refines recovery steps. No account name, phone number, bank name, transaction detail, or identity data is collected.

## Mandatory first-response paths

### Money already transferred

1. contact the bank or e-wallet through an independently opened official channel;
2. report through `https://iasc.ojk.go.id/`;
3. make a police report, because IASC reporting does not replace the legal process.

Never guarantee blocking, reversal, or recovery.

### Unknown transaction

1. contact the financial provider;
2. block affected access or payment instruments;
3. preserve transaction details without editing the evidence.

IASC is shown as a follow-up when the transaction is related to fraud.

### APK or app installed from chat

1. disconnect the affected device from the internet;
2. remove the app and revoke risky permissions;
3. secure important accounts from another trusted device.

Qualified technical help or a factory reset is a later conditional step. AmanKlik never claims the device is clean.

### Credentials or account takeover

Secure the selected service first. Without a service selection, prioritize the root email, financial services, and communication accounts. Revoke sessions, inspect recovery methods, and warn contacts through another channel when an account or phone number is taken over.

### Identity data shared

Stop further disclosure, preserve evidence without redistributing identity images, and use OJK iDebKu to monitor credit information. Reporting is recommended when misuse or loss is confirmed.

### Link or QR opened

Opening alone is not described as guaranteed compromise. The user is prompted to classify whether credentials were entered, an app was installed, permission was granted, or payment was made so the relevant path can be selected.

### Goods released after fake payment proof

Verify actual balance or mutation rather than screenshots, stop further handover when safe, and contact the marketplace or logistics provider through official channels.

## Source policy

Only HTTPS links from this checked-in host allowlist may reach the rendered plan:

- `iasc.ojk.go.id`
- `www.bi.go.id`
- `www.ojk.go.id`
- `idebku.ojk.go.id`

The builder drops catalog actions with incomplete or non-allowlisted source metadata. User-provided links never become recovery links.

## UX and accessibility contract

- native buttons expose selection through `aria-pressed`;
- plan changes are announced through a polite atomic live region;
- urgency is communicated with text and order, not color alone;
- the first three actions stay expanded;
- later actions use native `details` elements;
- reset clears incidents, affected services, and copy feedback;
- copy output includes official source URLs but excludes scan content and user secrets;
- print is available from the browser;
- no countdown, forced motion, or panic language is used.

## Regression coverage

- unit mapping for all nine incidents;
- affected-service replacement of generic recovery;
- deduplication and deterministic ordering;
- malicious source filtering;
- component multi-selection and reset;
- E2E bank → IASC → police path;
- mobile keyboard credential flow and horizontal-overflow check.

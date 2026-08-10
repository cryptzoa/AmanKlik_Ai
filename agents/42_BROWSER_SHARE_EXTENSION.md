# 42 — Browser and Share Extension

## Objective

Put AmanKlik at the decision point without silently observing browsing or chat activity.

## Browser flow

1. The user opens the AmanKlik side panel or invokes the context menu.
2. Chrome grants temporary `activeTab` access after that user gesture.
3. The extension reads only the explicit selection or active tab URL.
4. The panel shows the captured value and waits for a second explicit **Periksa** action.
5. The extension calls `/api/integrations/scan` with a revocable `akx_` token.
6. The side panel renders a bounded result DTO and can open the session-owned full result.

There is no persistent content script, DOM observer, cookie permission, full browsing-history permission, or Gemini credential in the extension.

## Pairing

- The user creates a device token at `/connect`.
- Only the plaintext token shown once is copied to the extension.
- The database stores `HMAC-SHA256(CACHE_HMAC_SECRET, "integration\\0" + token)`.
- The token maps to the anonymous session that issued it.
- Tokens can be listed and revoked from `/connect`.
- Extension requests are rate-limited independently.

## Cross-origin policy

- `/api/integrations/scan` accepts only `chrome-extension://` or `moz-extension://` origins.
- CORS echoes only a validated extension origin and varies on `Origin`.
- Requests require JSON and `Authorization: Bearer akx_…`.
- Normal website origins are rejected before token lookup.
- The extension requests host access only for the configured AmanKlik origin.

## PWA share target

The web manifest registers `/api/share-target` as a `POST multipart/form-data` target for text, URLs, and PNG/JPEG/WEBP images.

The endpoint:

- rejects ordinary cross-site browser submissions;
- validates text, URL, file type, size, and image bytes through existing pipelines;
- performs analysis immediately;
- returns a `303` redirect to the session-owned result;
- never places shared content in a query string or draft table.

## Installation

1. Generate a token at `/connect`.
2. Open `chrome://extensions` and enable Developer mode.
3. Choose **Load unpacked** and select `extension/`.
4. Open the AmanKlik side panel and save the Railway Base URL and token.
5. Select text or right-click a link to run a check.

## Primary references

- Chrome Side Panel API: https://developer.chrome.com/docs/extensions/reference/api/sidePanel
- Chrome `activeTab`: https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- Chrome extension permissions: https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- Web Share Target API: https://developer.chrome.com/docs/capabilities/web-apis/web-share-target

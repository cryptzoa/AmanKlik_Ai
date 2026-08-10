# AmanKlik browser extension

Manifest V3 side-panel extension for explicit text and URL checks.

## Privacy boundary

- Uses `activeTab`, so page access is temporary and initiated by the user.
- Reads only the current selection or current tab URL after a button/context-menu action.
- Never includes `GEMINI_API_KEY`; it uses a revocable `akx_` integration token.
- Does not auto-read chats, observe page changes, fetch submitted URLs, or run persistent content scripts.

## Local install

1. Generate a token at `/connect` in AmanKlik.
2. Open `chrome://extensions`, enable Developer mode, and choose **Load unpacked**.
3. Select this `extension/` directory.
4. Open the AmanKlik side panel and save the AmanKlik Base URL and token.

Chrome 116+ is required for programmatic side-panel opening from the context menu.

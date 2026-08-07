# AmanKlik AI

Digital-safety analysis for suspicious messages, screenshots, and URLs.

## Local setup

Requirements:

- Node 24 LTS (`.nvmrc`)
- pnpm 10
- PostgreSQL for persistence (optional during the initial bootstrap)

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The health endpoint is available at
`http://localhost:3000/api/health`.

## Quality gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

The local test mode uses `AI_MODE=mock`. A Railway deployment must use
`AI_MODE=live`, a server-side `GEMINI_API_KEY`, PostgreSQL, and migrations.

## Safety boundary

AmanKlik never fetches or probes user-submitted URLs. URL analysis is static and
uses WHATWG `URL` plus `tldts`. Uploaded screenshots are validated and processed
in memory; raw screenshot bytes are not persisted.

See [`STATE.md`](./STATE.md) and the specifications in [`agents/`](./agents/)
before changing architecture or scope.

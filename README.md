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

## Curated RAG and demo fixtures

The safety corpus lives in `src/server/rag/corpus/`. Regenerate its committed
keyword index locally with:

```bash
pnpm rag:index:keyword
```

`railway.json` uses `pnpm rag:index:optional` during the production build. It
creates Gemini embeddings when the server-side key/model is available and
falls back to the deterministic local keyword index if embedding generation is
unavailable.

Generate the two synthetic screenshot fixtures with `pnpm demo:assets`.
Prewarming is opt-in, live-only, and requires explicit fixture IDs:

```bash
pnpm demo:prewarm -- --confirm-live T1 U1 IMG_T2
```

Deployment step-by-step: [`DEPLOYMENT_RAILWAY.md`](./DEPLOYMENT_RAILWAY.md).

## Safety boundary

AmanKlik never fetches or probes user-submitted URLs. URL analysis is static and
uses WHATWG `URL` plus `tldts`. Uploaded screenshots are validated and processed
in memory; raw screenshot bytes are not persisted.

See [`STATE.md`](./STATE.md) and the specifications in [`agents/`](./agents/)
before changing architecture or scope.

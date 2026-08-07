# 17 — Railway Deployment

## Topology

```text
AmanKlik Railway Project
├── amanklik-web
└── Postgres
```

No Redis/worker/bucket.

## Next.js

`next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

Start:
```json
{
  "scripts": {
    "build":"next build",
    "start":"node .next/standalone/server.js"
  }
}
```

Verify exact path with installed Next.js.

## Node

Node 24 LTS.
Recommended `.nvmrc` = `24`.

## Postgres

Railway PostgreSQL reference:
`DATABASE_URL=${{Postgres.DATABASE_URL}}`

Prefer private reference variable, not copied public TCP URL.

## Production env
- `NODE_ENV=production`
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL=gemini-3.6-flash`
- `GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite`
- `GEMINI_EMBEDDING_MODEL=gemini-embedding-2`
- `AI_MODE=live`
- `CACHE_HMAC_SECRET`
- optional base URL/configs.

## Migration

Railway pre-deploy:
```bash
pnpm db:migrate
```

Never reset.

## Health
`GET /api/health` verifies app + DB only.

## Public domain
Generate Railway domain. If custom domain, preserve Railway fallback for demo.

## Build system
Prefer Railway standard build/Railpack. Do not add Docker only for appearance.

## Logs
Check build, migration, start, DB, provider errors; no secret values.

## Prewarm — optional recommended

`pnpm demo:prewarm`

Rules:
- approved synthetic fixtures only;
- live provider only;
- redacted cache;
- never insert mock into live cache;
- log fixture IDs only.

## Failure

Gemini rate-limited:
- cache if live-prewarmed;
- text/URL rules-only;
- image retry/text alternative.

Postgres unavailable:
- P0 failure; repair before stage.

Domain failure:
- Railway fallback.

Deployment failure:
- inspect build/migration; rollback known-good rather than broad upgrade.

## Final checklist
- [ ] GitHub final commit
- [ ] lockfile
- [ ] Node 24
- [ ] standalone
- [ ] DB reference
- [ ] migration
- [ ] Gemini key
- [ ] `AI_MODE=live`
- [ ] mock cannot be accidental
- [ ] health 200
- [ ] live synthetic text/image/url
- [ ] mobile
- [ ] no secret in client

# 06 — Repository Structure

```text
.
├── AGENTS.md
├── STATE.md
├── README.md
├── docs/
├── public/
│   ├── brand/
│   ├── demo/
│   └── textures/
├── scripts/
│   ├── build-knowledge-index.ts
│   ├── seed-demo.ts
│   └── prewarm-demo-cache.ts
├── drizzle/
├── src/
│   ├── app/
│   │   ├── (marketing)/page.tsx
│   │   ├── scan/page.tsx
│   │   ├── result/[id]/page.tsx
│   │   ├── history/page.tsx
│   │   ├── simulator/page.tsx
│   │   ├── learn/page.tsx
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── scans/
│   │   │   │   ├── text/route.ts
│   │   │   │   ├── url/route.ts
│   │   │   │   ├── image/route.ts
│   │   │   │   ├── history/route.ts
│   │   │   │   └── [id]/feedback/route.ts
│   │   │   └── simulator/evaluate/route.ts
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── landing/
│   │   ├── scan/
│   │   ├── result/
│   │   ├── simulator/
│   │   └── motion/
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema.ts
│   │   └── repositories/
│   ├── lib/
│   │   ├── cn.ts
│   │   ├── crypto.ts
│   │   ├── env.ts
│   │   ├── errors.ts
│   │   ├── redaction.ts
│   │   └── validation.ts
│   ├── server/
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── gemini-client.ts
│   │   │   ├── mock-client.ts
│   │   │   ├── prompts.ts
│   │   │   └── schemas.ts
│   │   ├── scan/
│   │   │   ├── analyze-text.ts
│   │   │   ├── analyze-url.ts
│   │   │   └── analyze-image.ts
│   │   ├── risk/
│   │   │   ├── signals.ts
│   │   │   ├── rules.ts
│   │   │   ├── engine.ts
│   │   │   └── thresholds.ts
│   │   ├── url/
│   │   │   ├── analyzer.ts
│   │   │   └── brand-domain.ts
│   │   ├── rag/
│   │   │   ├── retriever.ts
│   │   │   ├── keyword-fallback.ts
│   │   │   ├── corpus/
│   │   │   └── generated/
│   │   ├── cache/analysis-cache.ts
│   │   ├── session/anonymous-session.ts
│   │   └── rate-limit/limiter.ts
│   ├── store/scan-store.ts
│   └── types/
│       ├── analysis.ts
│       └── api.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── next.config.ts
├── drizzle.config.ts
├── playwright.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## Boundaries

`src/server`: server-only business logic; never import into client components.  
`src/db`: DB only.  
`src/lib`: small cross-cutting utilities.  
`src/components/ui`: reusable custom primitives.  
`src/components/motion`: GSAP hooks/components.  
`tests/fixtures`: synthetic only.

## Naming
- files kebab-case;
- components PascalCase;
- functions camelCase;
- schemas PascalCase + `Schema`;
- error codes UPPER_SNAKE_CASE.

## Dependency direction

```text
app/components
  -> types/lib
  -> server domain services
  -> db/provider adapters
```

Risk/URL engines are pure and UI/DB independent.

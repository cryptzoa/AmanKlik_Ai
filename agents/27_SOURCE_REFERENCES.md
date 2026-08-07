# 27 — Source and Decision References

Prepared 2026-08-07.

This records official-source decisions for fast-moving tech. If exact API syntax changes, use current official docs while keeping the architecture locked.

## Gemini

Verified current model IDs:
- `gemini-3.6-flash` — stable/GA, July 2026;
- `gemini-3.5-flash-lite` — stable/GA, July 2026;
- `gemini-embedding-2` — stable embedding model.

Reference families:
- Google AI for Developers model pages;
- Gemini API pricing;
- Gemini release notes;
- structured output/latest-model documentation.

Free-tier decision:
content may be used by provider to improve products; therefore synthetic demo-data and privacy warning are mandatory.

## Railway

Verified current Railway guidance:
- full-stack Next.js + PostgreSQL supported;
- self-hosted Next.js uses standalone output;
- PostgreSQL exposes `DATABASE_URL`;
- Drizzle migration can run pre-deploy.

Reference families:
- Railway Docs: Deploy a Next.js App with Postgres;
- PostgreSQL;
- Variables.

## Node
Node 24 is LTS in 2026.

## Next.js
Use current stable App Router.

## Tailwind
Tailwind CSS v4 Next.js pattern:
- `tailwindcss`;
- `@tailwindcss/postcss`;
- `@import "tailwindcss"`.

## GSAP
Official docs cover `@gsap/react`, ScrollTrigger, SplitText, Flip.

## Competition
Uploaded `Guidebook Lomba Web Diesnat Himtif2026.pdf`.

Known constraints are in doc 02. Because latest machine parsing failed on the image-heavy PDF, a human must verify final administrative rules from the original.

## Agent decision rule

If a library API syntax changed:
- adapt minimally to official current API;
- preserve architecture;
- record in `STATE.md`;
- do not replace stack.

# 04 — Locked Tech Stack

## Runtime
- Node.js 24 LTS.
- pnpm.
- TypeScript strict.

## App
- current stable Next.js App Router;
- Server Components by default;
- client components only when browser state/GSAP requires;
- Route Handlers for API;
- `output: "standalone"` on Railway.

## UI
- Tailwind CSS v4;
- CSS variables;
- Radix primitives;
- custom styling;
- allowed helpers: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`.

## Motion
- `gsap`;
- `@gsap/react`;
- ScrollTrigger;
- SplitText;
- Flip where useful.

Do not add Framer Motion.

## State/forms
- Zustand;
- React Hook Form where useful;
- Zod.

## AI
- `@google/genai`;
- primary `gemini-3.6-flash`;
- fallback `gemini-3.5-flash-lite`;
- embedding `gemini-embedding-2`;
- structured output + Zod;
- server-side only.

## Database
- Railway PostgreSQL;
- `drizzle-orm`;
- `drizzle-kit`;
- `postgres`.

## Security utilities
- WHATWG `URL`;
- `tldts`;
- `sharp`;
- `file-type`;
- Node `crypto`;
- `server-only`;
- optional `p-limit`.

## Tests
- Vitest;
- Testing Library;
- Playwright.

## Install shape

```bash
pnpm add gsap @gsap/react
pnpm add zustand zod react-hook-form @hookform/resolvers
pnpm add @google/genai
pnpm add drizzle-orm postgres
pnpm add tldts sharp file-type server-only
pnpm add clsx tailwind-merge class-variance-authority lucide-react
pnpm add p-limit
pnpm add -D drizzle-kit vitest @testing-library/react @testing-library/jest-dom playwright
```

Install only Radix primitives actually used.

## Version policy
- commit `pnpm-lock.yaml`;
- no CDN deps;
- no major upgrade during demo hardening;
- adapt minor API syntax changes without replacing architecture;
- record changes in `STATE.md`.

## Why
One Next.js service + Postgres minimizes deployment failure/CORS/resource use. Gemini handles multimodal input without a separate OCR service. Small local retrieval avoids a vector database.

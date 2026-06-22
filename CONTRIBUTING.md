# Contributing to HoneyForge

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (optional — Demo Mode works without one)

## Setup

```bash
git clone <repo-url>
cd HoneyForge
npm install
cp .env.example .env.local   # fill in at minimum NEXT_PUBLIC_ENABLE_DEMO_MODE=true
npm run dev
```

## Branch Naming

```
feat/<short-description>      # new feature
fix/<short-description>       # bug fix
refactor/<short-description>  # refactor without behaviour change
docs/<short-description>      # documentation only
chore/<short-description>     # tooling, deps, CI
```

## Commit Style

Plain imperative, present tense. No period at the end.

```
Add DemoBadge to DecoyTable name column
Fix hydration mismatch in DataModeProvider
Refactor IOC enrichment service stub
```

## Pull Requests

1. Branch off `main`.
2. Keep PRs focused — one logical change per PR.
3. Run `npm run build` and `npm run lint` locally before opening.
4. Describe the *why* in the PR body; the code describes the *what*.
5. Screenshots are required for UI changes.

## Code Style

- **No comments by default.** Only add one when the *why* is non-obvious (a hidden constraint, a workaround, a subtle invariant).
- **No docstrings** on straightforward functions. Type signatures are the documentation.
- **No half-finished code.** Don't leave TODO stubs in merged PRs; open an issue instead.
- Prefer editing existing files over creating new ones.
- Tailwind classes only — no inline `style={}` unless a value is dynamic and can't be expressed as a token.

## Adding a New Dashboard Page

1. Create `app/(dashboard)/<page-name>/page.tsx` with `'use client'` (interactive) or as a server component (static).
2. If it shows data that should be empty in Clean Mode, import `useDataMode` from `@/contexts/DataModeContext` and guard accordingly.
3. Add a nav item to `components/layout/Sidebar.tsx` (`NAV_ITEMS` array).
4. Add a mock data file to `services/mock/data/` and a stub entry in `services/api/index.ts`.
5. Export the new types from `types/index.ts`.

## Adding a New AI Service

All AI service files live in `services/ai/`. Rules:

- Return mock data only — no real API calls in the service file itself.
- Real calls happen in a Next.js API route (`app/api/...`) using server-side env vars.
- API keys must never appear in any file that is imported by client components.

## Security Rules

See [`SECURITY.md`](SECURITY.md). The most important rule: **API keys must stay server-side.** Any PR that imports an AI or threat-intel API key in a client-side file will be rejected.

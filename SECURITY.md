# Security Policy

## Supported Versions

This project is currently pre-release. Only the latest commit on `main` receives security fixes.

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities.

Email **rijojoy.rj@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce (proof-of-concept code or screenshots if applicable)
- The affected file(s) and line numbers if known

You will receive an acknowledgement within 48 hours and a resolution timeline within 7 days.

## API Key Handling Rules

These rules are enforced in code review and must not be bypassed:

1. **API keys are server-side only.** No key may be imported into any file that is loaded by the browser — this includes all files under `app/`, `components/`, `contexts/`, `hooks/`, `lib/`, `services/ai/`, and `store/`.

2. **Client-visible env vars are limited to non-secret config.** Only variables prefixed `NEXT_PUBLIC_` appear in the browser bundle, and none of them may carry a credential. The only current `NEXT_PUBLIC_` vars are `NEXT_PUBLIC_ENABLE_DEMO_MODE`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL`.

3. **AI service files (`services/ai/`) are stubs.** They return mock data and make no real network requests. Real API calls must be implemented in Next.js API routes (`app/api/`) which run exclusively on the server.

4. **The Supabase service role key is server-only.** `SUPABASE_SERVICE_ROLE_KEY` must never appear in a `NEXT_PUBLIC_` variable or any client-imported file.

5. **Demo data deletion requires explicit confirmation.** The "Clear Demo Data" button in Settings › Developer shows a confirmation modal before acting. No function in this codebase deletes real database records without an explicit user confirmation step.

## Known Non-Issues (Intentional Design)

- **Mock auth in development**: When Supabase is not configured, the auth store accepts any credentials. This is intentional for local development and is not a vulnerability in a production deployment.
- **Client-side auth guard**: Route protection via `useRequireAuth()` is a UX guard, not a security boundary. The actual security boundary is Supabase Row Level Security (RLS) policies enforced at the database layer.
- **Simulated threat data**: All IOC values, IP addresses, and campaign names in `services/mock/` are fabricated. No real attacker infrastructure is represented.

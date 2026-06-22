# Architecture

## App Router Structure

```
app/
  page.tsx              # Root redirect → /dashboard
  (dashboard)/          # Route group — applies layout.tsx to all children
    layout.tsx          # Sidebar + Header + DataModeProvider wrapper
    dashboard/page.tsx  # Client component (uses DataModeContext)
    decoys/page.tsx
    ...
  login/page.tsx        # Outside (dashboard) group — no sidebar
  api/                  # Server-only API routes (AI calls, webhooks)
```

All dashboard routes are under the `(dashboard)` route group. The group's `layout.tsx` wraps the entire subtree in `DataModeProvider`, mounts `Sidebar` and `Header`, and calls `useRequireAuth()` to enforce login.

## DataModeContext

`contexts/DataModeContext.tsx` provides a `{ isDemoMode, setDemoMode }` context to every client component under the dashboard layout.

**Hydration safety**: The context initialises from `process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE` so the SSR render matches the initial client render. A `useEffect` then applies any `localStorage` override after mount, allowing the runtime toggle in Settings › Developer to take effect without a page reload.

```
SSR render:  isDemoMode = NEXT_PUBLIC_ENABLE_DEMO_MODE !== 'false'
After mount: isDemoMode = localStorage.getItem('hf_demo_mode') ?? env var
```

Pages that show data react to mode changes via a second `useEffect`:
```typescript
useEffect(() => {
  setData(isDemoMode ? MOCK_DATA : [])
}, [isDemoMode])
```

## Service Layer

```
services/
  mock/
    data/           # Static TypeScript objects — all mock data lives here
    index.ts        # Re-exports all MOCK_* constants
  api/
    index.ts        # Thin re-export shim; swap imports here to go live
  ai/
    *Service.ts     # AI service stubs — return mock data, no real calls
```

The `services/api/index.ts` file is the swap point: replace `from '@/services/mock'` with real fetch/RPC calls here, and every page automatically picks up real data without modification.

AI service files (`services/ai/`) are intentionally stubs. Real AI API calls must be implemented in Next.js API routes (`app/api/`) where server-side env vars are accessible and keys never reach the browser.

## Authentication

Auth uses Supabase SSR via `@supabase/ssr`. In the current state:

- `store/authStore.ts` holds session state (Zustand).
- `useRequireAuth()` (called in the dashboard layout) redirects unauthenticated users to `/login`.
- `middleware.ts` is a pass-through placeholder; replace with `updateSession` from `@/lib/supabase/middleware` once Supabase env vars are configured.
- The actual security boundary is **Supabase Row Level Security** — the client-side guard is UX only.

## RBAC

User roles are typed as `UserRole = 'admin' | 'analyst' | 'viewer'`.

- `Sidebar` filters `NAV_ITEMS` by `item.roles` — items with no `roles` field are visible to all.
- Server-side enforcement belongs in Supabase RLS policies and API route middleware.

## State Management

| Store | Contents |
|---|---|
| `authStore` | `user`, `session`, `login()`, `logout()` |
| `uiStore` | `sidebarCollapsed`, `toggleSidebar()`, `theme`, `notificationCount` |

Both stores use Zustand v5 with `persist` middleware for localStorage-backed state.

## AI Intelligence Engine

The AI Intelligence Summary page (`/ai-intelligence-summary`) uses a service-per-concern architecture:

| Service | Responsibility |
|---|---|
| `eventCorrelationService` | Group events into correlation clusters |
| `campaignDetectionService` | Identify and track attacker campaigns |
| `decoyRiskScoringService` | Score decoys by composite risk formula |
| `iocEnrichmentService` | Multi-feed IOC reputation lookup |
| `mitreMappingService` | Map events to ATT&CK techniques |
| `aiSummaryService` | Generate executive summary and config |
| `recommendationEngineService` | Prioritised analyst recommendations |
| `suggestedActionService` | One-click action execution stubs |

All services are currently stubs. When connecting real AI:
1. Keep the service file as a mock/type definition layer.
2. Create a corresponding `app/api/ai/<service>/route.ts`.
3. Call the API route from the service using `fetch`.
4. Store API keys in `.env.local` server-side variables only.

## Key Type Conventions

- `source?: 'demo' | 'local' | 'database'` on `Decoy` — tracks data origin; demo records show the orange **DEMO** badge.
- `ThreatSeverity = 'critical' | 'high' | 'medium' | 'low'` — canonical severity scale used across all types.
- `UserRole = 'admin' | 'analyst' | 'viewer'` — RBAC roles.

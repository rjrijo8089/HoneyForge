# Changelog

All notable changes to HoneyForge are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.1.0] — 2026-06-22

Initial release.

### Added

**Core platform**
- Next.js 16 App Router scaffold with TypeScript strict mode and Tailwind CSS v4
- Custom `hf-*` design token system with glassmorphism (`glass-card`) and dark-mode-first palette
- Zustand auth store with Supabase SSR session management
- Zustand UI store for sidebar collapse, theme, and notification badge state
- Route protection via `useRequireAuth()` hook in the dashboard layout
- Responsive sidebar with collapse toggle and RBAC-based item visibility
- Header with global search, notification bell, and user chip

**Dashboard** (`/dashboard`)
- 8 KPI stat cards with animated deltas and live pulse indicators
- 24-hour attack trend line chart (Recharts)
- Severity donut chart
- Attack-type bar chart, top-decoys table, top-countries panel
- MITRE ATT&CK technique grid
- Recent attacks table, analyst review queue widget, IOC feed widget
- Platform health and integration status widgets
- Live attack ticker strip
- Clean Mode: all metrics show 0, charts flatten, feed clears

**Decoy Manager** (`/decoys`)
- Sortable, filterable decoy table with sparkbar activity column
- Per-row status toggle (active / paused) and delete with confirmation
- Detail drawer with full decoy stats, open alerts, and 7-day activity
- Create Decoy modal (name, type, category, IP, port, env, tags)
- `source` field on `Decoy` type (`demo` | `local` | `database`)
- Demo decoys show **DEMO** badge in the name column
- Clean Mode: demo decoys removed; user-created decoys persist

**Clone Studio** (`/clone-studio`)
- Visual web-asset cloning workflow to build convincing decoy sites
- Preview panel, resource list, and deployment configuration

**Live Attack Feed** (`/live-attack-feed`)
- Auto-streaming event feed with configurable tick interval
- Event detail panel (attack type, source IP, decoy hit, MITRE tags)
- Pause / resume streaming
- Clean Mode: auto-stream disabled; feed initialises empty

**Threat Intelligence** (`/threat-intel`)
- IOC library with type filters (IP, domain, hash, URL, CVE, …)
- IOC detail drawer with full enrichment, TLP badge, and timeline
- Clean Mode: IOC list empties

**AI Intelligence Summary** (`/ai-intelligence-summary`)
- 8-tab sidebar-nav layout (Overview, Campaigns, Correlation, Decoy Risk, IOC Enrichment, MITRE ATT&CK, Recommendations, Actions)
- AI Analyst Overview: animated threat-level banner, 6 metric cards, key findings, telemetry row
- Campaigns: expandable campaign cards with confidence %, TTPs, source IPs
- Cross-Decoy Correlation: 6 correlation groups with risk bars
- Decoy Risk Ranking: sortable table with composite risk score formula
- IOC Enrichment Center: 8-feed reputation matrix per indicator
- MITRE ATT&CK: tactic-grouped technique cards with event counts
- Recommendations: executive summary + prioritised analyst guidance list
- Actions & Config: 8 suggested action buttons with mock execution + AI engine configuration panel
- Privacy notice: confirms no real API calls, keys server-side only
- Clean Mode: full empty state

**Review Queue** (`/review-queue`)
- Analyst triage workflow with severity-based incident queue
- Clean Mode: queue empties

**Detection Rules** (`/detection-rules`)
- YAML-based rule editor with syntax highlighting
- Rule enable/disable toggles and severity classification

**Integrations** (`/integrations`)
- Connector management for SIEM, SOAR, alerting, and ticketing systems
- Per-integration status, latency, and event rate display

**Reports** (`/reports`)
- Scheduled and on-demand report list with download and preview
- Clean Mode: report list empties

**Audit Logs** (`/audit-logs`)
- Filterable, exportable immutable audit trail
- Clean Mode: log list empties

**Settings** (`/settings`)
- Profile, notifications, security (2FA, sessions), appearance, RBAC, API keys, developer tools
- Developer tab: Demo Mode toggle wired to `DataModeContext`; **Seed Demo Data** and **Clear Demo Data** buttons with confirmation modal
- No real database records deleted without explicit confirmation

**Clean Data Mode**
- `NEXT_PUBLIC_ENABLE_DEMO_MODE` env var
- `DataModeContext` — hydration-safe React context (SSR env var → `useEffect` localStorage override)
- `DemoBadge` component — orange **DEMO** chip for demo-origin records
- Runtime toggle: all client pages react immediately; no page reload required

**AI service layer**
- 8 stub service files in `services/ai/` (correlation, campaigns, decoy risk, IOC enrichment, MITRE mapping, summary, recommendations, suggested actions)
- All stubs return mock data; no real external API calls
- API keys remain server-side; never imported by client code

**Documentation**
- `README.md` — quick start, page reference, architecture overview
- `docs/architecture.md` — App Router structure, DataModeContext, service layer, auth, RBAC, state management
- `docs/environment.md` — all env vars with descriptions and defaults
- `docs/pages.md` — per-page feature reference
- `CONTRIBUTING.md` — branch naming, commit style, PR process, adding pages and services
- `SECURITY.md` — responsible disclosure, API key rules, known non-issues
- `.env.example` — annotated env var template

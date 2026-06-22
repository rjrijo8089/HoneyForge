# Page Reference

All pages are under the `(dashboard)` route group and require authentication.

---

## `/dashboard`

**File**: `app/(dashboard)/dashboard/page.tsx` — client component

KPI overview for the current session. Two rows of 4 stat cards (total attacks, active decoys, critical alerts, pending reviews / malware, SSH brute force, web attacks, IOC count). Below: 24-hour trend chart + severity donut, attack-type bar + top decoys + top countries, MITRE ATT&CK technique grid, recent attacks table, review queue widget, IOC feed, integration status, and platform health.

Clean Mode: all stat values zero, charts flatten, ticker stops, attack lists empty.

---

## `/decoys`

**File**: `app/(dashboard)/decoys/page.tsx` — client component

Full decoy lifecycle management. Overview cards (active/total/errors/malware). Filterable sortable table with sparkbar activity. Per-row status toggle and delete. Detail drawer with full stats. Create Decoy modal.

Demo decoys carry `source: 'demo'` and display the orange **DEMO** badge. User-created decoys carry `source: 'local'` and survive Clear Demo Data.

Clean Mode: demo decoys removed; empty state with Deploy prompt when no local decoys exist.

---

## `/clone-studio`

**File**: `app/(dashboard)/clone-studio/page.tsx` — client component

Clone real web pages into convincing decoy sites. Paste a URL, preview the cloned asset, configure hosting (port, environment, tags), and deploy. Created decoys carry `source: 'local'`.

---

## `/live-attack-feed`

**File**: `app/(dashboard)/live-attack-feed/page.tsx` — client component

Real-time event stream from all active decoys. Events auto-append at a configurable interval. Click an event to open the detail panel (source IP, country, attack type, decoy target, MITRE technique, raw payload excerpt). Pause / resume streaming.

Clean Mode: stream paused; feed initialises empty.

---

## `/threat-intel`

**File**: `app/(dashboard)/threat-intel/page.tsx` — client component

IOC library. Filter by type (IP, domain, file hash, URL, CVE, email, payload, user-agent), status, severity, and TLP level. Click an IOC to open the detail drawer: enrichment summary, timeline, related IOCs, payload/CVE detail, analyst notes.

Clean Mode: IOC list empties.

---

## `/ai-intelligence-summary`

**File**: `app/(dashboard)/ai-intelligence-summary/page.tsx` — client component

AI-powered deception intelligence engine. Sidebar navigation across 8 sections:

| Tab | Contents |
|---|---|
| AI Overview | Animated threat level, 6 metric cards, key findings, telemetry |
| Campaigns | Attacker campaign cards with confidence, TTPs, source IPs |
| Correlation | Cross-decoy event clusters with risk scores |
| Decoy Risk | Sortable ranking table with composite risk formula |
| IOC Enrichment | 8-feed reputation matrix per indicator |
| MITRE ATT&CK | Tactic-grouped technique cards |
| Recommendations | Executive summary + prioritised guidance |
| Actions & Config | Suggested action buttons + AI engine configuration panel |

All data is mock/simulated. No real AI API calls are made; API keys remain server-side.

Clean Mode: full empty state.

---

## `/review-queue`

**File**: `app/(dashboard)/review-queue/page.tsx` — client component

Analyst triage queue. Incidents sorted by severity. Assign, escalate, close, or add notes. Tracks first-seen / last-seen / event count per incident.

Clean Mode: queue empties.

---

## `/detection-rules`

**File**: `app/(dashboard)/detection-rules/page.tsx` — client component

YAML-based detection rule management. Browse, filter, enable/disable, and edit rules. Rule detail panel shows match conditions, severity, MITRE tags, and last-triggered timestamp.

---

## `/integrations`

**File**: `app/(dashboard)/integrations/page.tsx` — client component (admin role)

Connector management for external systems. Cards per integration (Splunk, MISP, PagerDuty, Jira, Cortex XSOAR) showing status, events/hour, latency, and last sync. Configure connection settings per connector.

Sidebar role restriction: `roles: ['admin']` — analysts and viewers do not see this nav item.

---

## `/reports`

**File**: `app/(dashboard)/reports/page.tsx` — client component

Report management. Browse generated reports, download PDF/CSV, schedule recurring reports, preview summary. Filter by type, period, and status.

Clean Mode: report list empties.

---

## `/audit-logs`

**File**: `app/(dashboard)/audit-logs/page.tsx` — client component (admin + analyst roles)

Immutable audit trail of all user actions. Filter by actor, action type, and time range. Export to CSV.

Clean Mode: log list empties.

---

## `/settings`

**File**: `app/(dashboard)/settings/page.tsx` — client component

Tabbed settings panel:

| Tab | Contents |
|---|---|
| Profile | Display name, email, avatar, timezone |
| Notifications | Per-channel alert preferences |
| Security | Password change, 2FA setup, active sessions |
| Appearance | Theme, density, sidebar behaviour |
| Team & Roles | RBAC member list (admin only) |
| API Keys | Personal API key management |
| Developer | Demo Mode toggle, Seed/Clear Demo Data, debug info |

# Environment Variables

Copy `.env.example` to `.env.local` to get started. `.env.local` is git-ignored; `.env.example` is committed and must not contain real secrets.

## Variable Reference

### `NEXT_PUBLIC_ENABLE_DEMO_MODE`

| | |
|---|---|
| **Type** | `"true"` \| `"false"` |
| **Default** | `"true"` |
| **Visibility** | Browser (NEXT_PUBLIC) |

Controls the initial data mode at build / SSR time. When `"true"`, all pages load with simulated honeypot telemetry. When `"false"`, all pages show empty states.

This value is the *server-side default*. Users can override it at runtime via the toggle in **Settings › Developer**, which writes to `localStorage` under the key `hf_demo_mode`. The runtime override takes precedence over this env var for the duration of the session.

---

### `NEXT_PUBLIC_SUPABASE_URL`

| | |
|---|---|
| **Type** | URL string |
| **Example** | `https://abcdefghijklmnop.supabase.co` |
| **Visibility** | Browser (NEXT_PUBLIC) |

Your Supabase project URL. Found in **Supabase Dashboard › Settings › API**.

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

| | |
|---|---|
| **Type** | JWT string |
| **Visibility** | Browser (NEXT_PUBLIC) |

The Supabase anonymous (public) key. This key is intentionally public-facing but is scoped by Row Level Security policies. Found in **Supabase Dashboard › Settings › API**.

---

### `SUPABASE_SERVICE_ROLE_KEY`

| | |
|---|---|
| **Type** | JWT string |
| **Visibility** | **Server-side only — never expose to the browser** |

The Supabase service role key bypasses RLS. Only use it in Next.js API routes and Server Actions. Never prefix with `NEXT_PUBLIC_`.

---

### `ANTHROPIC_API_KEY`

| | |
|---|---|
| **Type** | `sk-ant-...` string |
| **Visibility** | **Server-side only** |

API key for the Anthropic Claude AI provider. Used by the AI Intelligence Summary engine. Currently the AI service files are stubs — this key is reserved for when real API calls are wired up in `app/api/ai/`.

---

### `OPENAI_API_KEY`

| | |
|---|---|
| **Type** | `sk-...` string |
| **Visibility** | **Server-side only** |

Optional alternative AI provider. Selectable in the AI Configuration panel under **AI Intelligence Summary › Actions & Config**.

---

### `AZURE_OPENAI_API_KEY` / `AZURE_OPENAI_ENDPOINT`

| | |
|---|---|
| **Visibility** | **Server-side only** |

Azure OpenAI credentials. The endpoint is also configurable at runtime in the AI Configuration panel.

---

### `VIRUSTOTAL_API_KEY` · `ABUSEIPDB_API_KEY` · `SHODAN_API_KEY` · `GREYNOISE_API_KEY`

| | |
|---|---|
| **Visibility** | **Server-side only** |

Threat intelligence feed API keys used by the IOC Enrichment service. When blank, the service runs in stub/mock mode (current default). The IOC Enrichment Center UI (`/ai-intelligence-summary` › IOC Enrichment tab) shows the results of these feeds.

---

### `NEXT_PUBLIC_APP_URL`

| | |
|---|---|
| **Type** | URL string |
| **Default** | `http://localhost:3000` |
| **Visibility** | Browser (NEXT_PUBLIC) |

Base URL for absolute links generated in email notifications and exported reports.

---

### `SLACK_WEBHOOK_URL`

| | |
|---|---|
| **Type** | `https://hooks.slack.com/services/...` |
| **Visibility** | **Server-side only** |

Incoming webhook URL for the **Send Slack Alert** suggested action in the AI Intelligence Summary. Not used until the action stub is replaced with a real implementation.

---

### `PAGERDUTY_INTEGRATION_KEY`

| | |
|---|---|
| **Visibility** | **Server-side only** |

PagerDuty Events API v2 integration key. Used for alert escalation. Not active until wired up in the integrations service.

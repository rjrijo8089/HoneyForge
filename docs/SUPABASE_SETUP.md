# HoneyForge — Supabase Setup Guide

This guide explains how to configure Supabase as the authentication and database backend for HoneyForge.

Supabase is not required for local demo mode. The platform runs fully on mock data without any external services. Follow this guide only when you are ready to connect real authentication and persistent storage.

---

## What Supabase Provides

HoneyForge uses Supabase for:

- **Authentication** — email/password login, session management, and JWT tokens
- **PostgreSQL database** — persistent storage for all platform data
- **User profiles** — analyst accounts, roles, and preferences
- **Decoys** — honeypot asset records, status, and configuration
- **Events** — normalized attack events collected from deception sensors
- **Indicators** — IOC records including IPs, domains, hashes, and URLs
- **Review actions** — incident assignments, status changes, and analyst notes
- **Integrations** — SIEM, MISP, and webhook connection configuration
- **Audit logs** — platform action trail for compliance and forensics

---

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign in or create a free account.
2. Click **New project**.
3. Choose an organization (or create one).
4. Enter a project name, for example `honeyforge-prod`.
5. Set a strong database password and store it securely.
6. Select a region close to your users or deployment location.
7. Click **Create new project**.

Wait for the project to finish provisioning. This typically takes 30–60 seconds.

---

## 2. Get the Project URL

1. In the Supabase dashboard, open your project.
2. Go to **Project Settings** → **API**.
3. Copy the value under **Project URL**.

This is the value for `NEXT_PUBLIC_SUPABASE_URL`.

Example format:

```
https://xyzabcdefg.supabase.co
```

---

## 3. Get the Anon Key

On the same **API** settings page, find the section labelled **Project API keys**.

Copy the value under **anon** (public).

This is the value for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

The anon key is safe for frontend use. It respects Row Level Security policies.

---

## 4. Get the Service Role Key

On the same **API** settings page, copy the value under **service_role**.

This is the value for `SUPABASE_SERVICE_ROLE_KEY`.

> **Warning:** The service role key bypasses Row Level Security and has full database access. Never expose it to the browser or commit it to version control. Use it only in server-side API routes.

---

## 5. Configure Environment Variables

Open `.env.local` in the HoneyForge project root.

Add or update the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
AUTH_MODE=supabase
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

Fill in each value using the keys collected in steps 2–4.

For `DATABASE_URL`, find the connection string in **Project Settings** → **Database** → **Connection string** → **URI** mode. Use the **Transaction** pooler URL for serverless deployments.

Example `DATABASE_URL` format:

```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

> **Warning:** Never commit `.env.local` or any file containing real Supabase keys to GitHub. The `.gitignore` in this project excludes `.env.local` by default. Verify this before pushing.

---

## 6. Database Tables

HoneyForge requires the following tables in PostgreSQL:

| Table | Purpose |
|---|---|
| `profiles` | Analyst user accounts and roles |
| `decoys` | Honeypot asset configuration and status |
| `events` | Normalized attack event records |
| `indicators` | IOC records (IP, domain, hash, URL, etc.) |
| `incidents` | Review queue incident records |
| `incident_comments` | Analyst notes and activity history |
| `campaigns` | Correlated attacker campaign records |
| `detection_rules` | Sigma and Suricata rule definitions |
| `integrations` | SIEM and external service configuration |
| `audit_logs` | Platform action audit trail |
| `reports` | Generated report metadata |

---

## 7. Run the SQL Schema

The database schema migrations will be located in:

```
supabase/migrations/
```

When migrations are added to this project, apply them using the Supabase CLI:

```
npx supabase db push
```

Or run them manually by opening the **SQL Editor** in the Supabase dashboard and pasting the migration content.

To install the Supabase CLI locally:

```
npm install -g supabase
```

Log in and link the project:

```
supabase login
supabase link --project-ref your-project-ref
```

---

## 8. Enable Authentication

1. In the Supabase dashboard, go to **Authentication** → **Providers**.
2. Ensure **Email** is enabled.
3. Under **Authentication** → **Settings**, configure:
   - **Site URL** — set to your deployment URL, for example `https://your-app.vercel.app`
   - **Redirect URLs** — add `http://localhost:3000/**` for local development
4. Optionally disable email confirmation for internal/demo deployments to simplify testing.

---

## 9. Create Demo Users

To create test analyst accounts:

1. Go to **Authentication** → **Users** in the Supabase dashboard.
2. Click **Add user** → **Create new user**.
3. Enter a test email and password.
4. Repeat for additional analyst roles.

Alternatively, use the Supabase service role key from a server-side script to programmatically create seeded users.

---

## 10. Configure Row Level Security

Row Level Security (RLS) ensures users can only access data they are authorized to see.

For each table created in step 6:

1. Open the table in the **Table Editor**.
2. Click **RLS disabled** to open the policy panel.
3. Enable RLS for the table.
4. Add policies appropriate for each role.

Example policy for `decoys` (analysts can read all decoys):

```sql
CREATE POLICY "Analysts can view decoys"
ON decoys FOR SELECT
TO authenticated
USING (true);
```

Example policy for `audit_logs` (admins only):

```sql
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

Define policies before connecting the frontend to production data.

---

## 11. Local vs Cloud Database Mode

HoneyForge supports two data modes, controlled by environment variables.

### Demo Mode (default)

```
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

All data is served from in-memory mock datasets. No database connection is required. Supabase keys are not needed.

### Supabase Mode

```
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
AUTH_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

All reads and writes go to the Supabase PostgreSQL database. Authentication uses Supabase Auth.

---

## 12. Troubleshooting

### Invalid API key error

The anon key or service role key is incorrect or was pasted with extra whitespace. Copy the key directly from the Supabase dashboard API settings page. Do not add quotes in the `.env.local` file.

### Supabase URL returns 404

Verify the project URL format: `https://[project-ref].supabase.co`. Ensure the project is active and not paused. Free tier Supabase projects pause after 7 days of inactivity.

### Authentication redirect loop

The **Site URL** in Supabase Auth settings does not match the application URL. Update it in **Authentication** → **Settings** → **Site URL** to match the exact deployment URL including the protocol.

### Row Level Security blocks all reads

RLS is enabled but no policies have been created. Add at least a basic SELECT policy for authenticated users on each table, or temporarily disable RLS during initial schema testing.

### Environment variables not loading

Ensure the file is named `.env.local` (not `.env` or `.env.local.example`). In Next.js, only `.env.local` is loaded in the development server. Restart `npm run dev` after editing any `.env.local` value.

### Database connection string rejected

The `DATABASE_URL` must use the **Transaction pooler** format for serverless environments. Session pooler and direct connection formats may fail under Vercel's serverless function concurrency model.

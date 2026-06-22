# HoneyForge — Vercel Deployment Guide

This guide covers how to deploy HoneyForge to Vercel for cloud hosting.

Vercel hosts the Next.js frontend and serverless API routes. It handles builds, preview deployments, and production releases with zero server configuration. For a database backend, pair Vercel with Supabase following the [Supabase Setup Guide](SUPABASE_SETUP.md).

---

## What Vercel Provides

- **Hosting** — serves the Next.js application globally via CDN
- **Serverless API routes** — runs Next.js API handlers as serverless functions
- **Preview deployments** — every pull request gets a unique preview URL automatically
- **Production deployment** — promotes builds to a stable production URL on merge to `main`
- **Environment variable management** — stores secrets securely outside the codebase
- **Custom domains** — attach any domain to the production deployment

---

## Recommended Deployment Modes

Choose the mode that matches your current stage.

### Mode 1 — Local Demo

Run the application locally with no external dependencies.

```
npm install
npm run dev
```

- Uses mock/demo data only
- No database or API keys needed
- Best for exploring the UI and developing features

### Mode 2 — Local Docker

Run the application with a local database and services using Docker Compose.

```
docker compose up --build
```

- Requires Docker Desktop
- Includes local database and supporting services
- Best for testing real data ingestion locally

### Mode 3 — Cloud Demo

Deploy to Vercel with demo mode enabled. No database required.

```
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

- Zero configuration beyond Vercel deployment
- Full UI accessible from any browser
- Best for sharing demos and collecting feedback

### Mode 4 — Production Cloud

Deploy to Vercel with Supabase connected for real authentication and persistent storage.

```
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
AUTH_MODE=supabase
```

- Full authentication and data persistence
- Requires Supabase project configured per [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
- Best for real SOC use and live integrations

---

## 1. Push HoneyForge to GitHub

Vercel deploys directly from a GitHub repository. Ensure the code is pushed before proceeding.

If you have already cloned the repository and made local changes, push them:

```
git add .
git commit -m "Initial HoneyForge setup"
git push origin main
```

If starting from a fork or a fresh repository, push the project there first.

---

## 2. Create a Vercel Account

Go to https://vercel.com and sign up with a GitHub account.

Using GitHub for signup is recommended — it simplifies repository access during the import step.

Vercel's free Hobby plan is sufficient for personal projects, demos, and development.

---

## 3. Import the GitHub Repository

1. From the Vercel dashboard, click **Add New** → **Project**.
2. Under **Import Git Repository**, click **Continue with GitHub**.
3. Authorize Vercel to access your GitHub account if prompted.
4. A list of your repositories appears.

---

## 4. Select the HoneyForge Repository

Find **HoneyForge** in the repository list and click **Import**.

If the repository does not appear, click **Adjust GitHub App Permissions** and grant Vercel access to the specific repository.

---

## 5. Configure Build Settings

Vercel detects Next.js automatically. Verify or set the following values:

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | `.next` |

Leave the root directory as `/` unless the Next.js project is inside a subdirectory.

---

## 6. Add Environment Variables

Before clicking Deploy, add the required environment variables.

Expand the **Environment Variables** section and add each variable individually.

For a cloud demo deployment with no database:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

For a production deployment with Supabase:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
AUTH_MODE=supabase
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

Leave values blank as shown above — fill in the actual values from your Supabase project.

> **Warning:** `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` must not be prefixed with `NEXT_PUBLIC_`. Only `NEXT_PUBLIC_` variables are exposed to the browser. Server-side secrets must remain server-only.

---

## 7. Deploy

Click **Deploy**.

Vercel clones the repository, runs `npm install`, and then `npm run build`. The build output is deployed to a global CDN.

Deployment typically takes 1–3 minutes. Progress is visible in the deployment log.

A successful deployment shows:

```
Build Completed
Production deployment ready
```

---

## 8. Test the Production URL

After deployment, Vercel provides a production URL in the format:

```
https://honeyforge-[hash].vercel.app
```

Open this URL in a browser. The HoneyForge login page should load.

In demo mode, sign in with the pre-filled credentials to access the dashboard. Verify that pages load correctly and navigation works as expected.

---

## 9. Configure a Custom Domain

To use a domain like `soc.yourcompany.com`:

1. In the Vercel dashboard, open the project.
2. Go to **Settings** → **Domains**.
3. Click **Add** and enter your domain name.
4. Vercel provides DNS records to add at your domain registrar.
5. Add the records (typically a CNAME or A record) according to your registrar's instructions.
6. Vercel automatically provisions an HTTPS certificate once DNS propagates.

DNS propagation typically takes a few minutes to a few hours depending on the registrar.

---

## 10. Connect Supabase Environment Variables

If deploying in production mode (Mode 4), environment variables must be set in the Vercel project settings.

1. In the Vercel dashboard, go to **Settings** → **Environment Variables**.
2. Add each variable from step 6 with the actual values from your Supabase project.
3. Set the environment scope — typically **Production** and **Preview** for all Supabase variables.
4. Click **Save** for each variable.

Refer to [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for instructions on finding Supabase project credentials.

---

## 11. Redeploy After Environment Changes

Vercel does not automatically redeploy when environment variables are changed.

After adding or updating environment variables, trigger a new deployment:

1. Go to **Deployments** in the Vercel dashboard.
2. Find the most recent deployment.
3. Click the three-dot menu → **Redeploy**.
4. Confirm the redeploy.

Alternatively, push a new commit to `main` to trigger a fresh deployment automatically.

---

## 12. Troubleshooting

### Build fails with TypeScript errors

Run `npm run build` locally first to confirm the build passes before deploying. Resolve any type errors locally, then push the fix.

### Build fails with missing environment variables

The build succeeded locally but the Vercel build cannot find a required variable. Add the variable in **Settings** → **Environment Variables** and redeploy. Check that the variable name matches exactly — environment variable names are case-sensitive.

### Application loads but shows no data

Demo mode is off and Supabase credentials are not configured. Either set `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` for a demo deployment, or add the Supabase environment variables for a database-connected deployment.

### Login fails in production

The Supabase **Site URL** in **Authentication** → **Settings** does not include the Vercel production URL. Add the production URL there and also add it to the **Redirect URLs** list. Redeploy after making changes.

### API routes return 500 errors

Server-side API routes may be missing `SUPABASE_SERVICE_ROLE_KEY` or `DATABASE_URL`. Verify these are set in the Vercel environment variables with the **Production** scope and are not prefixed with `NEXT_PUBLIC_`.

### Preview deployments cannot authenticate

Each preview deployment has a unique URL. Add `https://*.vercel.app/**` to the Supabase **Redirect URLs** list under **Authentication** → **Settings** to allow all Vercel preview URLs to authenticate.

### Function execution timeout

Vercel Hobby plan serverless functions time out after 10 seconds. Complex database queries or slow Supabase connection pooling can exceed this. Upgrade to the Pro plan for a 60-second limit, or optimize slow queries.

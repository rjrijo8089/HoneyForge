# HoneyForge — Local Setup Guide

This guide walks through everything needed to clone HoneyForge and run it on a local machine.
Demo mode works without any external services, so no database or API keys are required for initial exploration.

---

## 1. Prerequisites

Install the following tools before proceeding.

### Git

Download from https://git-scm.com/downloads and follow the installer for your operating system.

Verify the installation:

```
git --version
```

### Node.js LTS

Download the LTS release from https://nodejs.org

HoneyForge targets Node.js 20 LTS or later. Avoid odd-numbered releases (21, 23) as they are not LTS.

Verify the installation:

```
node --version
npm --version
```

### npm

npm ships with Node.js. No separate installation is needed.

If npm is outdated, update it:

```
npm install -g npm@latest
```

### VS Code (optional)

VS Code is recommended for working with the TypeScript and Tailwind CSS codebase.

Download from https://code.visualstudio.com

Useful extensions:
- ESLint
- Tailwind CSS IntelliSense
- Prettier

---

## 2. Clone the Repository

```
git clone https://github.com/rjrijo8089/HoneyForge.git
cd HoneyForge
```

Open the project in VS Code if preferred:

```
code .
```

---

## 3. Install Dependencies

From inside the `HoneyForge` directory:

```
npm install
```

This installs all packages listed in `package.json`, including Next.js, React, Tailwind CSS, Zustand, Supabase SSR, and all other dependencies.

Installation typically completes in 30–90 seconds depending on network speed.

---

## 4. Environment Setup

HoneyForge includes a `.env.example` file with all supported environment variables and their default values.

Copy it to create a local environment file:

**Windows PowerShell:**
```
Copy-Item .env.example .env.local
```

**macOS / Linux:**
```
cp .env.example .env.local
```

**Windows Command Prompt:**
```
copy .env.example .env.local
```

### Demo mode

The key variable controlling demo data is:

```
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

When set to `true`, HoneyForge starts with pre-seeded attack events, decoys, IOCs, incidents, campaigns, and reports. No external services, databases, or API keys are needed.

Set it to `false` to start with an empty state and test real ingestion workflows.

All other variables in `.env.example` are optional for local demo use. Supabase, OpenSearch, and SIEM connection strings can be left blank until real integrations are needed.

---

## 5. Run the Development Server

```
npm run dev
```

The server starts on port 3000 by default.

Open in a browser:

```
http://localhost:3000
```

The application loads the login page. In demo mode, credentials are pre-filled. Click **Sign In** to access the dashboard.

The development server includes hot reload — file changes appear in the browser immediately without restarting.

---

## 6. Available Pages

All pages are reachable from the left sidebar navigation after login.

| Page | URL | Description |
|---|---|---|
| Dashboard | `/dashboard` | Attack overview, trends, decoy health |
| Decoys | `/decoys` | Manage honeypot assets |
| Clone Studio | `/clone-studio` | Web decoy creation wizard |
| Threat Intel | `/threat-intel` | IOC explorer, campaigns, MITRE mapping |
| AI Intelligence Summary | `/ai-intelligence-summary` | Correlation, risk ranking, analyst recommendations |
| Review Queue | `/review-queue` | Analyst incident investigation workspace |
| Live Attack Feed | `/live-attack-feed` | Real-time event stream |
| Detection Rules | `/detection-rules` | Sigma and Suricata rule management |
| Integrations | `/integrations` | SIEM, MISP, Slack, and webhook configuration |
| Reports | `/reports` | Executive and analyst report templates |
| Audit Logs | `/audit-logs` | Platform action trail |
| Settings | `/settings` | Platform configuration |

---

## 7. Production Build Test

To verify the application builds without errors, run:

```
npm run build
```

A successful build outputs a route summary:

```
Route (app)
...
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Start the production server locally:

```
npm run start
```

Then open `http://localhost:3000` in a browser.

---

## 8. Troubleshooting

### npm cannot find package.json

This error appears when npm is run from the wrong directory.

Make sure you are inside the `HoneyForge` folder before running any npm commands:

```
cd HoneyForge
npm install
```

Confirm the location with `pwd` (macOS/Linux) or `Get-Location` (PowerShell).

---

### PowerShell script execution is disabled

On Windows, you may see an error like:

```
execution of scripts is disabled on this system
```

Fix by allowing user-scoped scripts:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Alternatively, invoke npm directly:

```
npm.cmd install
npm.cmd run dev
```

---

### Port 3000 is already in use

Another process is occupying port 3000.

Find and stop it:

**Windows PowerShell:**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**macOS / Linux:**
```
lsof -ti:3000 | xargs kill
```

Or run HoneyForge on a different port:

```
npm run dev -- --port 3001
```

---

### npm install reports vulnerabilities

npm often reports moderate or low severity vulnerability warnings after installation. These are common in development dependency chains and are not always blocking for local demo or development use.

Review them with:

```
npm audit
```

For critical vulnerabilities relevant to production deployments, follow the remediation steps npm recommends. For local demo use, moderate warnings can generally be left for now.

---

### Git dubious ownership warning

On Windows, Git may warn:

```
fatal: detected dubious ownership in repository
```

This happens when the repository is in a directory owned by a different user account.

Fix by marking the path as safe:

```
git config --global --add safe.directory C:/path/to/HoneyForge
```

Replace `C:/path/to/HoneyForge` with the actual path shown in the error message.

---

## 9. Contributing — GitHub Workflow

To propose a change:

1. Create a new branch from `main`:

```
git checkout -b feature/my-change
```

2. Make changes and stage them:

```
git add .
```

3. Commit with a descriptive message:

```
git commit -m "Describe what changed and why"
```

4. Push the branch to GitHub:

```
git push origin feature/my-change
```

5. Open a pull request on GitHub from `feature/my-change` into `main`.

Keep branches focused on a single concern. Unrelated changes are easier to review separately.

---

## 10. Current State and Planned Enhancements

HoneyForge currently operates in demo and local mode. The UI, workflows, and data models are complete.

Real-time integrations planned for future releases:

- SNARE web honeypot event ingestion
- TANNER service emulation backend
- Cowrie SSH honeypot log ingestion
- Dionaea malware capture metadata
- Suricata IDS alert forwarding
- OpenSearch index connector
- External threat intelligence feeds
- AI model integration (Claude, OpenAI, Ollama)

For questions or contributions, open an issue or pull request on GitHub.

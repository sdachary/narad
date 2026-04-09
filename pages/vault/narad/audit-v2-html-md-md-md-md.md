---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/audit-v2-html-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 642
size: 36314 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/narad]
---

# audit-v2-html-md-md-md.md

> Authentication / authorization module using **cloudflare-workers, docker** (642 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/audit-v2-html-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 642 |
| **Size** | 36314 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/audit-v2-html-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 604
size: 35465 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/narad]
---

# audit-v2-html-md-md.md

> Authentication / authorization module using **cloudflare-workers, docker** (604 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/audit-v2-html-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 604 |
| **Size** | 35465 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/audit-v2-html-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 566
size: 34625 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/narad]
---

# audit-v2-html-md.md

> Authentication / authorization module using **cloudflare-workers, docker** (566 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/audit-v2-html-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 566 |
| **Size** | 34625 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/audit-v2-html.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 528
size: 33782 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, cloudflare-workers, docker, documentation, markdown, project/narad]
---

# audit-v2-html.md

> Authentication / authorization module using **cloudflare-workers, docker** (528 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/audit-v2-html.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 528 |
| **Size** | 33782 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/audits/audit-v2.html"
project: "vishwakarma"
role: auth
language: html
frameworks: [cloudflare-workers, docker]
lines: 490
size: 32955 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, cloudflare-workers, code, docker, html, project/vishwakarma]
---

# audit-v2.html

> Authentication / authorization module using **cloudflare-workers, docker** (490 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/audits/audit-v2.html` |
| **Role** | auth |
| **Language** | html |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 490 |
| **Size** | 32955 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vishwakarma Platform — Audit v2 + Monetization</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;600;700&display=swap');

  :root {
    --bg: #0a0a0b; --surface: #111113; --border: #1e1e22;
    --gold: #f0c040; --green: #22c55e; --red: #ef4444;
    --yellow: #facc15; --blue: #60a5fa; --purple: #a78bfa;
    --teal: #2dd4bf;
    --text: #e4e4e7; --muted: #71717a;
    --mono: 'IBM Plex Mono', monospace; --sans: 'IBM Plex Sans', sans-serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: var(--sans); font-size: 14px; line-height: 1.7; padding: 32px 16px 80px; }
  .page { max-width: 920px; margin: 0 auto; }

  header { border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 40px; }
  header .label { font-family: var(--mono); font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
  header h1 { font-size: 26px; font-weight: 700; color: var(--gold); letter-spacing: -0.5px; }
  header .meta { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--mono); }

  .section { margin-bottom: 44px; }
  .section-title {
    font-family: var(--mono); font-size: 11px; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted); margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; margin-bottom: 12px; }
  .card-title { font-weight: 600; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .card p { color: #a1a1aa; font-size: 13px; line-height: 1.65; margin-bottom: 6px; }
  .card p:last-child { margin-bottom: 0; }
  .card p strong { color: var(--text); }

  .issue { border-left: 3px solid var(--border); padding-left: 16px; margin-bottom: 18px; }
  .issue.critical { border-left-color: var(--red); }
  .issue.warning  { border-left-color: var(--yellow); }
  .issue.info     { border-left-color: var(--blue); }
  .issue.good     { border-left-color: var(--green); }
  .issue.new      { border-left-color: var(--teal); }

  .issue-header { font-weight: 600; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .issue-body { color: #a1a1aa; font-size: 13px; line-height: 1.65; }
  .issue-body strong { color: var(--text); }

  .badge { font-family: var(--mono); font-size: 10px; padding: 2px 8px; border-radius: 4px; letter-spacing: 1px; font-weight: 600; white-space: nowrap; }
  .badge-red    { background: rgba(239,68,68,0.15);    color: #ef4444; }
  .badge-yellow { background: rgba(250,204,21,0.12);   color: #facc15; }
  .badge-green  { background: rgba(34,197,94,0.12);    color: #22c55e; }
  .badge-blue   { background: rgba(96,165,250,0.12);   color: #60a5fa; }
  .badge-teal   { background: rgba(45,212,191,0.12);   color: #2dd4bf; }
  .badge-gold   { background: rgba(240,192,64,0.12);   color: #f0c040; }
  .badge-purple { background: rgba(167,139,250,0.12);  color: #a78bfa; }

  pre { background: #0d0d0f; border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; font-family: var(--mono); font-size: 11.5px; color: #d4d4d8; overflow-x: auto; margin: 10px 0; line-height: 1.6; }
  code { font-family: var(--mono); font-size: 11.5px; background: #1a1a1d; padding: 1px 5px; border-radius: 3px; color: #e4e4e7; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 8px 12px; font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); }
  td { padding: 10px 12px; border-bottom: 1px solid #16161a; vertical-align: top; color: #a1a1aa; }
  td:first-child { color: var(--text); font-weight: 500; }
  tr:last-child td { border-bottom: none; }

  .score-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 10px; }
  .score-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: center; }
  .score-num { font-family: var(--mono); font-size: 28px; font-weight: 700; line-height: 1.1; margin-bottom: 4px; }
  .score-label { font-size: 11px; color: var(--muted); font-family: var(--mono); letter-spacing: 1px; text-transform: uppercase; }

  /* Money section special styling */
  .money-model { background: linear-gradient(135deg, rgba(240,192,64,0.05), rgba(45,212,191,0.05)); border: 1px solid rgba(240,192,64,0.2); border-radius: 12px; padding: 20px; margin-bottom: 14px; }
  .money-model .title { font-size: 14px; font-weight: 700; color: var(--gold); margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
  .money-model .sub { font-size: 12px; color: var(--muted); font-family: var(--mono); margin-bottom: 12px; }
  .money-model p { font-size: 13px; color: #a1a1aa; line-height: 1.65; margin-bottom: 6px; }
  .money-model p strong { color: var(--text); }
  .money-model .revenue { font-family: var(--mono); font-size: 12px; color: var(--green); background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.15); padding: 8px 12px; border-radius: 6px; margin-top: 10px; }

  .toc a { color: var(--blue); text-decoration: none; font-size: 13px; display: block; padding: 3px 0; }
  .toc a:hover { color: var(--gold); }

  hr { border: none; border-top: 1px solid var(--border); margin: 32px 0; }
  
  .diff-remove { color: #ef4444; background: rgba(239,68,68,0.06); display: block; padding: 0 4px; font-family: var(--mono); font-size: 11.5px; }
  .diff-add    { color: #22c55e; background: rgba(34,197,94,0.06);  display: block; padding: 0 4px; font-family: var(--mono); font-size: 11.5px; }
</style>
</head>
<body>
<div class="page">

<header>
  <div class="label">Vishwakarma Platform · Refined Audit Report v2</div>
  <h1>📡 vishwakarma-main · Updated Repo + Monetization Strategy</h1>
  <div class="meta">March 21, 2026 &nbsp;·&nbsp; v2 (post-refactor) &nbsp;·&nbsp; 4 services: vishwakarma · saas · agi · syncledger</div>
</header>

<div class="section">
  <div class="section-title">Contents</div>
  <div class="card toc">
    <a href="#delta">1. What Changed (v1 → v2)</a>
    <a href="#scores">2. Health Scorecard v2</a>
    <a href="#stillbroken">3. Still Broken (carried over from v1)</a>
    <a href="#new-issues">4. New Issues in v2</a>
    <a href="#passes">5. What's Now Fixed / Good</a>
    <a href="#actions">6. Priority Action List</a>
    <a href="#monetize">7. Monetization — How You & Clients Earn</a>
  </div>
</div>

<!-- DELTA -->
<div class="section" id="delta">
  <div class="section-title">1 · What Changed — v1 → v2</div>

  <table>
    <tr><th>Service</th><th>v1</th><th>v2</th><th>Verdict</th></tr>
    <tr>
      <td>AGI (Bhaina)</td>
      <td>Embedded inside vishwakarma _worker.js</td>
      <td><strong>Extracted to standalone <code>services/agi/</code></strong></td>
      <td><span class="badge badge-green">GOOD MOVE</span></td>
    </tr>
    <tr>
      <td>SyncLedger</td>
      <td>Full TypeScript monorepo (backend/frontend/dist)</td>
      <td><strong>Collapsed to single <code>pages/_worker.js</code></strong> — bcryptjs→PBKDF2, Express→Hono</td>
      <td><span class="badge badge-green">BIG IMPROVEMENT</span></td>
    </tr>
    <tr>
      <td>CloudProvision</td>
      <td>1,253 lines — AGI + provisioning mixed</td>
      <td><strong>1,119 lines — AGI removed, leaner</strong></td>
      <td><span class="badge badge-green">CLEANER</span></td>
    </tr>
    <tr>
      <td>Gold SaaS</td>
      <td>Unchanged</td>
      <td>Unchanged</td>
      <td><span class="badge badge-blue">STABLE</span></td>
    </tr>
    <tr>
      <td>Workflows</td>
      <td>5 workflows, 3 broken/missing</td>
      <td><strong>Same 5 workflows — same 3 problems remain</strong></td>
      <td><span class="badge badge-red">NOT FIXED</span></td>
    </tr>
    <tr>
      <td>AGI wrangler.toml</td>
      <td>N/A</td>
      <td><strong>Missing — no wrangler config for new AGI service</strong></td>
      <td><span class="badge badge-red">NEW GAP</span></td>
    </tr>
    <tr>
      <td>SyncLedger wrangler.toml</td>
      <td>Had one in backend/</td>
      <td><strong>Missing — no wrangler config in pages/</strong></td>
      <td><span class="badge badge-red">NEW GAP</span></td>
    </tr>
  </table>
</div>

<!-- SCORECARD -->
<div class="section" id="scores">
  <div class="section-title">2 · Health Scorecard v2</div>
  <div class="score-grid">
    <div class="score-card">
      <div class="score-num" style="color:#22c55e">8/10</div>
      <div class="score-label">CloudProvision</div>
    </div>
    <div class="score-card">
      <div class="score-num" style="color:#22c55e">9/10</div>
      <div class="score-label">Gold SaaS</div>
    </div>
    <div class="score-card">
      <div class="score-num" style="color:#2dd4bf">8/10</div>
      <div class="score-label">AGI Nexus</div>
    </div>
    <div class="score-card">
      <div class="score-num" style="color:#facc15">7/10</div>
      <div class="score-label">SyncLedger</div>
    </div>
    <div class="score-card">
      <div class="score-num" style="color:#ef4444">4/10</div>
      <div class="score-label">CI/CD Workflows</div>
    </div>
    <div class="score-card">
      <div class="score-num" style="color:#22c55e">9/10</div>
      <div class="score-label">Terraform / OCI</div>
    </div>
  </div>
  <div class="card" style="margin-top:4px">
    <p>Overall platform health improved from last audit. SyncLedger is now deployable. AGI is cleanly isolated. The score ceiling is still capped by unresolved workflow bugs and missing wrangler configs for the two new services.</p>
  </div>
</div>

<!-- STILL BROKEN -->
<div class="section" id="stillbroken">
  <div class="section-title">3 · Still Broken — Carried Over from v1</div>

  <div class="issue critical">
    <div class="issue-header"><span class="badge badge-red">CRITICAL</span> <span class="badge badge-red">UNCHANGED</span> BUG-01 — deploy-vishwakarma-worker.yml watches nonexistent path</div>
    <div class="issue-body">
      <p>Still watches <code>services/vishwakarma/worker/**</code>. That directory does not exist. Worker is at <code>services/vishwakarma/pages/_worker.js</code>. <strong>This workflow has never fired and never will.</strong></p>
      <p><strong>Fix (1 line):</strong> Delete the file. CF Pages auto-deploys on push via Git integration. Or if you want explicit CI control, replace the path + use <code>wrangler pages deploy</code>.</p>
    </div>
  </div>

  <div class="issue critical">
    <div class="issue-header"><span class="badge badge-red">CRITICAL</span> <span class="badge badge-red">UNCHANGED</span> BUG-02 — Workflow callbacks use wrong URL</div>
    <div class="issue-body">
      <p>Both <code>provision-client.yml</code> and <code>destroy-client.yml</code> POST to <code>https://vishwakarma.sdachary-582.workers.dev/...</code>. Your project is a <strong>CF Pages project</strong> — its URL is <code>vishwakarma.pages.dev</code> or a custom domain, not <code>.workers.dev</code>. If provisioning completes but the client status never updates to "deployed" in your dashboard, this is why.</p>
      <p><strong>Fix:</strong> Find your actual worker route in CF Dashboard → Workers & Pages → vishwakarma → Settings. Update both workflows to use the correct URL.</p>
    </div>
  </div>

  <div class="issue warning">
    <div class="issue-header"><span class="badge badge-yellow">WARNING</span> <span class="badge badge-yellow">UNCHANGED</span> BUG-03 — destroy-client.yml has duplicate "Verify Secrets" step</div>
    <div class="issue-body">
      <p>Same identical step block appears twice in <code>destroy-client.yml</code>. Delete the second one. One line of cleanup.</p>
    </div>
  </div>

  <div class="issue warning">
    <div class="issue-header"><span class="badge badge-yellow">WARNING</span> <span class="badge badge-yellow">UNCHANGED</span> BUG-04 — X-Admin-Action header bypass is still forgeable</div>
    <div class="issue-body">
      <p>In <code>vishwakarma/pages/_worker.js</code>, the download credential endpoint still uses <code>request.headers.get('X-Admin-Action') === 'true'</code> as its admin check. Any caller can forge this header. Fix:</p>
      <pre><span class="diff-remove">- const isAdmin = request.headers.get('X-Admin-Action') === 'true';</span>
<span class="diff-add">+ const isAdmin = request.headers.get('X-Admin-Token') === env.ADMIN_SECRET_TOKEN;</span></pre>
      <p>Add <code>ADMIN_SECRET_TOKEN</code> as a wrangler secret.</p>
    </div>
  </div>

  <div class="issue info">
    <div class="issue-header"><span class="badge badge-blue">INFO</span> <span class="badge badge-blue">UNCHANGED</span> SyncLedger DEPLOYMENT.md still says Vercel</div>
    <div class="issue-body">
      <p>The docs in <code>services/syncledger/docs/DEPLOYMENT.md</code> are a complete Vercel deploy guide. The service has been migrated to a CF Worker. The docs are now wrong — update them to reflect the actual CF Pages/Workers deploy process, or they'll confuse anyone who reads them.</p>
    </div>
  </div>
</div>

<!-- NEW ISSUES -->
<div class="section" id="new-issues">
  <div class="section-title">4 · New Issues in v2</div>

  <div class="issue critical">
    <div class="issue-header"><span class="badge badge-red">CRITICAL</span> <span class="badge badge-teal">NEW</span> AGI service has no wrangler.toml — cannot be deployed</div>
    <div class="issue-body">
      <p><code>services/agi/</code> contains only <code>pages/_worker.js</code>. There is no <code>wrangler.toml</code>. Without it, <code>wrangler dev</code> and <code>wrangler pages deploy</code> have no idea what project name, KV bindings, AI bindings, or env vars to use. The service cannot be deployed as-is.</p>
      <p><strong>Create <code>services/agi/wrangler.toml</code>:</strong></p>
      <pre>name = "vishwakarma-agi"
pages_build_output_dir = "pages"
compatibility_date = "2025-01-01"

[ai]
binding = "AI"

[[kv_namespaces]]
binding = "AGENT_MEMORY"
id = "YOUR_KV_NAMESPACE_ID"

[vars]
PRIMARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"

# Secrets (wrangler secret put):
# OPENROUTER_API_KEY
# QDRANT_URL
# QDRANT_API_KEY
# TELEGRAM_BOT_TOKEN</pre>
    </div>
  </div>

  <div class="issue critical">
    <div class="issue-header"><span class="badge badge-red">CRITICAL</span> <span class="badge badge-teal">NEW</span> SyncLedger pages/_worker.js still imports jsonwebtoken</div>
    <div class="issue-body">
      <p>The new consolidated worker file <strong>still imports <code>jsonwebtoken</code></strong> at the top: <code>import jwt from 'jsonwebtoken'</code>. While <code>bcryptjs</code> was correctly replaced with PBKDF2, <code>jsonwebtoken</code> uses Node.js-specific crypto internals that are not fully available in CF Workers even with <code>nodejs_compat</code>. It will fail at runtime when signing/verifying tokens.</p>
      <p><strong>Fix:</strong> Replace with <code>@tsndr/cloudflare-worker-jwt</code>:</p>
      <pre><span class="diff-remove">- import jwt from 'jsonwebtoken';</span>
<span class="diff-add">+ import jwt from '@tsndr/cloudflare-worker-jwt';</span></pre>
      <p>The API is nearly identical: <code>jwt.sign(payload, secret, { expiresIn: '1h' })</code> and <code>jwt.verify(token, secret)</code> — both work async in CF Workers. Install with <code>npm i @tsndr/cloudflare-worker-jwt</code>.</p>
    </div>
  </div>

  <div class="issue critical">
    <div class="issue-header"><span class="badge badge-red">CRITICAL</span> <span class="badge badge-teal">NEW</span> SyncLedger pages/_worker.js has no wrangler.toml either</div>
    <div class="issue-body">
      <p>Same problem as AGI. No <code>wrangler.toml</code> exists in <code>services/syncledger/</code>. The service cannot be deployed.</p>
      <p><strong>Create <code>services/syncledger/wrangler.toml</code>:</strong></p>
      <pre>name = "syncledger-api"
main = "pages/_worker.js"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[vars]
SUPABASE_URL = "https://xotobbvqtnlqgxzgydwh.supabase.co"

# Secrets (wrangler secret put):
# SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# JWT_SECRET
# JWT_REFRESH_SECRET</pre>
      <p>Also needs a <code>package.json</code> with <code>hono</code>, <code>@supabase/supabase-js</code>, <code>zod</code>, and <code>@tsndr/cloudflare-worker-jwt</code> as dependencies.</p>
    </div>
  </div>

  <div class="issue warning">
    <div class="issue-header"><span class="badge badge-yellow">WARNING</span> <span class="badge badge-teal">NEW</span> AGI worker: Date.now() as Qdrant point ID (same issue, new file)</div>
    <div class="issue-body">
      <p>The AGI worker also uses <code>id: Date.now()</code> for Qdrant point IDs (line ~185). Two concurrent requests within the same millisecond will silently overwrite each other's memory. Use <code>crypto.randomUUID()</code> instead — Qdrant supports UUID strings as point IDs natively.</p>
    </div>
  </div>

  <div class="issue warning">
    <div class="issue-header"><span class="badge badge-yellow">WARNING</span> <span class="badge badge-teal">NEW</span> AGI Telegram handler calls handleChat with a fake request object</div>
    <div class="issue-body">
      <p>In <code>handleTelegram()</code>, the code constructs a pseudo-request: <code>const pseudoReq = { json: async () => ({...}) }</code> and passes it to <code>handleChat()</code>. This is fragile — if <code>handleChat</code> ever accesses any other property of <code>request</code> (like <code>request.headers</code> or <code>request.url</code>), this will throw a runtime error silently (it's inside <code>ctx.waitUntil</code>). Refactor to extract a <code>runChat(message, sessionId, env, ctx)</code> function that both the HTTP handler and Telegram handler call.</p>
    </div>
  </div>

  <div class="issue warning">
    <div class="issue-header"><span class="badge badge-yellow">WARNING</span> <span class="badge badge-teal">NEW</span> No workflow for AGI or SyncLedger deployment</div>
    <div class="issue-body">
      <p>There are still only 5 workflows, none of which cover the two new services. AGI and SyncLedger are deploy-manually-only. You need:</p>
      <p><code>.github/workflows/deploy-agi-worker.yml</code> — watches <code>services/agi/**</code>, runs <code>wrangler pages deploy</code><br>
      <code>.github/workflows/deploy-syncledger-worker.yml</code> — watches <code>services/syncledger/**</code>, runs <code>wrangler deploy</code></p>
    </div>
  </div>

  <div class="issue info">
    <div class="issue-header"><span class="badge badge-blue">INFO</span> <span class="badge badge-teal">NEW</span> SyncLedger bcrypt legacy fallback uses require() — will fail in ES modules</div>
    <div class="issue-body">
      <p>In <code>verifyPassword()</code>, the legacy bcrypt path uses <code>const bcrypt = require('bcryptjs')</code>. CF Workers use ES modules (<code>import/export</code>) — <code>require()</code> is not available. This fallback path will throw a ReferenceError at runtime when a legacy-hashed password is encountered. Either remove the fallback entirely, or use a dynamic <code>import()</code>.</p>
    </div>
  </div>

  <div class="issue info">
    <div class="issue-header"><span class="badge badge-blue">INFO</span> <span class="badge badge-teal">NEW</span> AGI service CORS is open (*) — fine for now but note it</div>
    <div class="issue-body">
      <p>The AGI worker sets <code>'Access-Control-Allow-Origin': '*'</code>. This means any website can call your AGI API and burn your Workers AI / OpenRouter quota. Since Bhaina is your private tool, consider locking it to <code>vishwakarma-ops.pages.dev</code> once deployed — or add a simple shared-secret header check.</p>
    </div>
  </div>
</div>

<!-- PASSES -->
<div class="section" id="passes">
  <div class="section-title">5 · What's Now Fixed / Good in v2</div>

  <div class="issue good">
    <div class="issue-header"><span class="badge badge-green">FIXED</span> SyncLedger password hashing — PBKDF2 via Web Crypto API</div>
    <div class="issue-body">
      <p>The new <code>hashPassword()</code> and <code>verifyPassword()</code> in the SyncLedger worker use <code>crypto.subtle.deriveBits(PBKDF2)</code> with 100,000 iterations. This is sub-millisecond on CF Workers, cryptographically strong, and has zero dependencies. The legacy bcrypt detection + graceful error message is a nice touch. ✅</p>
    </div>
  </div>

  <div class="issue good">
    <div class="issue-header"><span class="badge badge-green">FIXED</span> AGI correctly extracted into its own service</div>
    <div class="issue-body">
      <p>Separating Bhaina from the vishwakarma worker is architecturally correct. It can now be deployed independently, scaled independently, and billed separately. The Workers AI binding fallback → OpenRouter is a resilient design. ✅</p>
    </div>
  </div>

  <div class="issue good">
    <div class="issue-header"><span class="badge badge-green">FIXED</span> SyncLedger TypeScript/Express/dist complexity eliminated</div>
    <div class="issue-body">
      <p>The old backend had bcryptjs, jsonwebtoken, Express, a full TypeScript build pipeline, dist/ folder chaos, and an outdated Vercel deployment guide. The new single-file worker eliminates all of that. 261 lines instead of ~500+ across multiple files. ✅</p>
    </div>
  </div>

  <div class="issue good">
    <div class="issue-header"><span class="badge badge-green">GOOD</span> AGI has Workers AI as primary with OpenRouter as fallback</div>
    <div class="issue-body">
      <p>The dual-inference strategy (CF Workers AI binding → OpenRouter on failure) means Bhaina works even if OpenRouter has issues, and vice versa. Workers AI also has free included requests on paid CF plans. ✅</p>
    </div>
  </div>

  <div class="issue good">
    <div class="issue-header"><span class="badge badge-green">GOOD</span> AGI has fetchWithRetry with exponential backoff</div>
    <div class="issue-body">
      <p>All external calls (embeddings, Qdrant, inference) go through <code>fetchWithRetry()</code> with 3 attempts and exponential backoff. Handles 429s gracefully. ✅</p>
    </div>
  </div>
</div>

<!-- PRIORITY ACTIONS -->
<div class="section" id="actions">
  <div class="section-title">6 · Priority Action List</div>

  <div class="card">
    <div class="card-title">🔴 Blockers — Do Before Any Deploy</div>
    <p><strong>1.</strong> Create <code>services/agi/wrangler.toml</code> with AI binding + KV (AGENT_MEMORY) + secrets list.</p>
    <p><strong>2.</strong> Create <code>services/syncledger/wrangler.toml</code> + <code>package.json</code>.</p>
    <p><strong>3.</strong> Replace <code>import jwt from 'jsonwebtoken'</code> in SyncLedger worker with <code>@tsndr/cloudflare-worker-jwt</code>.</p>
    <p><strong>4.</strong> Verify the correct CF Pages callback URL for provision/destroy workflows (BUG-02).</p>
  </div>

  <div class="card">
    <div class="card-title">🟡 High Priority — Do This Week</div>
    <p><strong>5.</strong> Fix or delete <code>deploy-vishwakarma-worker.yml</code> (wrong path, never fires).</p>
    <p><strong>6.</strong> Remove duplicate "Verify Secrets" step from <code>destroy-client.yml</code>.</p>
    <p><strong>7.</strong> Fix <code>X-Admin-Action</code> header bypass → use <code>env.ADMIN_SECRET_TOKEN</code>.</p>
    <p><strong>8.</strong> Add <code>deploy-agi-worker.yml</code> and <code>deploy-syncledger-worker.yml</code> workflows.</p>
    <p><strong>9.</strong> Fix Telegram handler — extract <code>runChat()</code> function, remove fake request object.</p>
    <p><strong>10.</strong> Fix bcrypt legacy fallback — replace <code>require('bcryptjs')</code> with <code>await import('bcryptjs')</code> or remove the path entirely.</p>
  </div>

  <div class="card">
    <div class="card-title">🔵 Clean Up</div>
    <p><strong>11.</strong> Replace <code>Date.now()</code> Qdrant IDs with <code>crypto.randomUUID()</code> in AGI worker.</p>
    <p><strong>12.</strong> Update <code>syncledger/docs/DEPLOYMENT.md</code> from Vercel to CF Workers instructions.</p>
    <p><strong>13.</strong> Lock AGI CORS from <code>*</code> to your own origins once deployed.</p>
    <p><strong>14.</strong> Razorpay integration — Gold SaaS revenue blocker.</p>
  </div>
</div>

<hr>

<!-- MONETIZATION -->
<div class="section" id="monetize">
  <div class="section-title">7 · Monetization — How You & Clients Earn</div>

  <div class="card" style="margin-bottom:20px">
    <div class="card-title">Your current assets</div>
    <p>You have four services that can generate revenue: <strong>CloudProvision</strong> (OCI VM provisioner), <strong>Gold SaaS</strong> (jewellery merchant app), <strong>AGI Nexus / Bhaina</strong> (AI agent with memory + Telegram), and <strong>SyncLedger</strong> (partner ledger). Here are the monetization models for each — plus how ATXP and similar protocols fit in.</p>
  </div>

  <div class="money-model">
    <div class="title">☁️ 1. CloudProvision — Private Cloud as a Service (IaaS)</div>
    <div class="sub">Target: SMBs, SaaS founders, remote teams who want their own Nextcloud + Pi-hole without managing infra</div>
    <p><strong>Your earn:</strong> Charge a one-time setup fee (₹2,000–5,000) per client for provisioning their OCI VM, plus a monthly maintenance/support retainer (₹500–1,500/mo). Since OCI Always Free tier means <strong>zero infrastructure cost</strong> to you per client (they bring their own OCI account), your margin is near 100%.</p>
    <p><strong>Client earns:</strong> They get a private Nextcloud for ₹500–1,500/mo vs ₹4,000–8,000/mo for equivalent commercial cloud storage — plus Pi-hole ad-blocking. They save money.</p>
    <p><strong>Scale path:</strong> Build a simple "subscribe to get provisioned" funnel on <code>vishwakarma-ops.pages.dev</code>. Accept payment via Razorpay. Auto-provision on payment confirmation via your existing GitHub Actions pipeline. Once it's click-to-deploy, each new client takes zero manual effort.</p>
    <div class="revenue">Revenue model: ₹2,000 setup + ₹1,000/mo × 20 clients = ₹20,000/mo recurring, ₹0 infra cost</div>
  </div>

  <div class="money-model">
    <div class="title">🪙 2. Gold SaaS — Vertical SaaS (B2B Subscription)</div>
    <div class="sub">Target: Indian jewellery merchants, gold traders, bullion dealers</div>
    <p><strong>Your earn:</strong> Monthly SaaS subscription after Razorpay integration. Tiered pricing: Basic (inventory + orders, ₹299/mo), Pro (+ ledger + AI chat + reports, ₹799/mo), Enterprise (custom pricing for chains). The AI chat (Kanak) is your moat — no other jewellery SaaS has it.</p>
    <p><strong>Client earns:</strong> Reduced manual bookkeeping, accurate gold/silver pricing, automated daily tally — estimated 2–4 hours saved per day per merchant.</p>
    <p><strong>Scale path:</strong> Launch Razorpay integration → demo video → WhatsApp/Instagram outreach to jewellery associations (GJC, IBJA). Word of mouth in this market is very strong.</p>
    <div class="revenue">Revenue model: ₹799/mo × 100 merchants = ₹79,900/mo. Cloudflare + Supabase costs: &lt;₹2,000/mo</div>
  </div>

  <div class="money-model">
    <div class="title">🤖 3. AGI Nexus / Bhaina — AI Agent as a Service (AaaS)</div>
    <div class="sub">Target: You (personal productivity), then SMB owners who want a private AI with memory + Telegram bot</div>
    <p><strong>Your earn (Phase 1 — personal tool):</strong> Workers AI free tier on CF gives you 10,000 neurons/day free. For Bhaina as your personal AI: zero cost while using free tier.</p>
    <p><strong>Your earn (Phase 2 — sell to others):</strong> Offer "Bhaina for your business" — a white-labeled private AI bot (Telegram + web) with memory, pre-trained on their business context (Gold SaaS data, documents, etc.). Charge ₹1,500–3,000/mo per client. Your cost: ~$2–5/mo Workers AI or OpenRouter per active client.</p>
    <p><strong>ATXP fit:</strong> Once ATXP matures (or now via OpenRouter with usage keys), you can expose Bhaina's <code>/api/chat</code> endpoint as a paid MCP tool. Other agents pay per-call to use Bhaina's domain knowledge (gold pricing, OCI ops). This is the Vishwakarma Cooperative vision — your agent earns micropayments from other agents. Realistic timeline: 12–18 months.</p>
    <p><strong>Near-term alternative (no crypto needed):</strong> Use <strong>OpenRouter's API key sharing</strong> model — give clients a limited-credit OpenRouter key tied to your account. You buy bulk credits, resell at markup. Clean, INR-compatible, works today.</p>
    <div class="revenue">Revenue model: ₹2,000/mo × 15 "private AI" clients = ₹30,000/mo. Infra cost: ~₹3,000/mo</div>
  </div>

  <div class="money-model">
    <div class="title">📒 4. SyncLedger — Partnership Ledger SaaS (B2B Niche)</div>
    <div class="sub">Target: Indian business partners, family businesses, freelancer collectives who share revenue and need transparent settlement</div>
    <p><strong>Your earn:</strong> Free tier (2 partners, basic transactions) + Pro tier (₹299–499/mo) for unlimited partners, settlement automation, and export. This is a strong product for family-run businesses — jewellery shops, restaurants, small manufacturers — where trust and transparency in profit sharing is a chronic pain point.</p>
    <p><strong>Client earns:</strong> Automated profit/loss split calculation, settlement history, partner portal — eliminates the "who owes who" argument between partners.</p>
    <p><strong>SyncLedger + Gold SaaS bundle:</strong> Gold SaaS merchants who have business partners are natural SyncLedger customers. Bundle both for ₹999/mo and upsell to your existing Gold SaaS base.</p>
    <div class="revenue">Revenue model: ₹399/mo × 50 businesses = ₹19,950/mo. Can be cross-sold to Gold SaaS customers.</div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="card-title">🗺️ Recommended Monetization Sequence</div>
    <p><strong>Month 1:</strong> Razorpay on Gold SaaS → first paying customers. This validates your payment infra and gives you real revenue immediately.</p>
    <p><strong>Month 2:</strong> Add CloudProvision self-serve signup + Razorpay. Target 5 pilot clients from your network. Each takes zero ongoing effort once provisioned.</p>
    <p><strong>Month 3:</strong> Launch SyncLedger for Gold SaaS's existing merchants who have partners. Easy upsell to a warm audience.</p>
    <p><strong>Month 6+:</strong> Productize Bhaina — offer "private AI for your shop" to Gold SaaS customers as an add-on. Consider OpenRouter reseller model for the AI costs.</p>
    <p><strong>Year 2:</strong> If ATXP/similar matures and Indian stablecoin/UPI bridges emerge, expose Bhaina + CloudProvision as paid MCP tools in the agent economy. Your infra is already architecturally ready for this.</p>
  </div>

  <div class="card">
    <div class="card-title">💡 Other Protocols to Watch (besides ATXP)</div>
    <p><strong>OpenRouter API Reselling:</strong> You can buy OpenRouter credits in bulk and give clients sub-keys with usage limits. No crypto, works with UPI/card today. This is the practical monetization path for AGI right now.</p>
    <p><strong>Cloudflare Workers AI Billing:</strong> CF's own AI inference has pay-per-use billing built in. Once your Workers are public-facing paid tools, you can pass costs through to clients directly.</p>
    <p><strong>MCP (Model Context Protocol):</strong> Your <code>/api/chat</code> and <code>/api/provision</code> endpoints are already shaped like MCP tools. Adding a simple auth header check + usage counter in KV turns them into billable MCP servers any AI client can call — today, without ATXP.</p>
    <p><strong>Stripe / Razorpay metered billing:</strong> For AGI-as-a-service, Razorpay's subscription API with metered billing lets you charge per API call or per 1,000 messages — the same model as OpenAI. Implementation: log call count to KV, push to Razorpay subscription at month end.</p>
  </div>
</div>

<hr>
<div style="font-family: var(--mono); font-size: 11px; color: var(--muted); text-align: center;">
  Vishwakarma Platform · Audit v2 · March 21, 2026 · sdachary/vishwakarma
</div>

</div>
</body>
</html>

```

```

```

```

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/github-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 131
size: 3292 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service]
---

# github-js-md.md

> Service / API client module (131 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/github-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 131 |
| **Size** | 3292 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/github-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 93
size: 2593 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service]
---

# github-js.md

> Service / API client module (93 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/github-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 93 |
| **Size** | 2593 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/github.js"
project: "narad"
role: service
language: javascript
frameworks: []
lines: 55
size: 1910 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, javascript, project/narad, service]
---

# github.js

> Service / API client module (55 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/github.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 55 |
| **Size** | 1910 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * GitHub Service - Handles cross-repo operations and CI/CD triggers.
 */

export async function triggerGitHubDispatch(env, { repo, eventType, clientPayload }) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN || env.SMRITI_SYNC_TOKEN;
    if (!GITHUB_TOKEN) {
        throw new Error('[GitHub] No GitHub token found in environment');
    }
    
    // Default to sdachary/ if no owner specified
    const fullRepo = repo.includes('/') ? repo : `sdachary/${repo}`;
    const url = `https://api.github.com/repos/${fullRepo}/dispatches`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Narad-Neural-Kernel'
        },
        body: JSON.stringify({
            event_type: eventType,
            client_payload: clientPayload
        })
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`[GitHub] Dispatch failed: ${error}`);
    }
    
    return { success: true, message: `Dispatched ${eventType} to ${fullRepo}` };
}

export async function analyzeGitHubRepo(env, repoUrl) {
    // Basic analysis logic - can be expanded to fetch repo metadata or file list
    const GITHUB_TOKEN = env.GITHUB_TOKEN || env.SMRITI_SYNC_TOKEN;
    const repoMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    if (!repoMatch) throw new Error('Invalid GitHub URL');
    
    const repoPath = repoMatch[1];
    const url = `https://api.github.com/repos/${repoPath}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Narad-Neural-Kernel'
        }
    });
    
    return await response.json();
}

```

```

```

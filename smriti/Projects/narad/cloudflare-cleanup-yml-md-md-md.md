---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cloudflare-cleanup-yml-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [github-actions]
lines: 235
size: 6709 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, github-actions, markdown, project/narad]
---

# cloudflare-cleanup-yml-md-md.md

> Documentation using **github-actions** (235 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cloudflare-cleanup-yml-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 235 |
| **Size** | 6709 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cloudflare-cleanup-yml-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [github-actions]
lines: 197
size: 5916 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, github-actions, markdown, project/narad]
---

# cloudflare-cleanup-yml-md.md

> Documentation using **github-actions** (197 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cloudflare-cleanup-yml-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 197 |
| **Size** | 5916 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/cloudflare-cleanup-yml.md"
project: "narad"
role: docs
language: markdown
frameworks: [github-actions]
lines: 159
size: 5120 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, github-actions, markdown, project/narad]
---

# cloudflare-cleanup-yml.md

> Documentation using **github-actions** (159 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/cloudflare-cleanup-yml.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 159 |
| **Size** | 5120 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/.github/workflows/cloudflare-cleanup.yml"
project: "vishwakarma"
role: config
language: yaml
frameworks: [github-actions]
lines: 121
size: 4319 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, config, github-actions, project/vishwakarma, yaml]
---

# cloudflare-cleanup.yml

> Configuration file for the project using **github-actions** (121 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/.github/workflows/cloudflare-cleanup.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | github-actions |
| **Lines** | 121 |
| **Size** | 4319 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Cloudflare Deployment Cleanup

on:
  schedule:
    - cron: '0 1 * * *' # Daily at 1 AM
  workflow_dispatch: # Allow manual run
 
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'
  NODE_OPTIONS: '--no-deprecation'

# Prevent overlapping runs
concurrency:
  group: cloudflare-cleanup
  cancel-in-progress: true

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Run Cleanup
        env:
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          CLOUDFLARE_API_KEY: ${{ secrets.CLOUDFLARE_API_KEY }}
        run: |
          node <<'EOF'
          const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
          const apiKey = process.env.CLOUDFLARE_API_KEY;

          async function cfRequest(path, method = 'GET') {
            let url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`;
            if (path) {
              if (path.startsWith('?')) {
                url += path;
              } else {
                url += '/' + path;
              }
            }
            
            const response = await fetch(url, {
              method,
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
            });
            return response.json();
          }

          async function fetchAllProjects() {
            // Projects API might not support pagination via query params
            const res = await cfRequest('');
            if (!res.success) throw new Error(`Failed to fetch projects: ${JSON.stringify(res.errors)}`);
            return res.result.map(p => p.name);
          }

          async function fetchAllDeployments(project) {
            let all = [];
            let page = 1;
            const perPage = 25;
            while (true) {
              const res = await cfRequest(`${project}/deployments?page=${page}&per_page=${perPage}`);
              if (!res.success) throw new Error(`Failed to fetch deployments for ${project}: ${JSON.stringify(res.errors)}`);
              all = all.concat(res.result);
              if (!res.result || res.result.length < perPage) break;
              page++;
            }
            return all;
          }

          async function cleanup() {
            try {
              console.log('📡 Discovering all projects...');
              const projects = await fetchAllProjects();
              console.log(`✅ Found ${projects.length} projects: ${projects.join(', ')}`);

              for (const project of projects) {
                console.log(`\n🔍 Checking project: ${project}`);
                const deployments = await fetchAllDeployments(project);
                console.log(`📊 Total deployments found: ${deployments.length}`);

                if (deployments.length <= 5) {
                  console.log(`✅ Only ${deployments.length} deployments found. Skipping cleanup.`);
                  continue;
                }

                // Sort by creation date descending
                const sorted = deployments.sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
                
                // Keep top 5
                const toKeep = sorted.slice(0, 5);
                const toDelete = sorted.slice(5);

                console.log(`✅ Retaining top 5 deployments:`);
                toKeep.forEach(d => console.log(`   - ${d.id} (${d.created_on}) [${d.environment}]`));

                console.log(`♻️ Purging ${toDelete.length} older deployments...`);
                for (const d of toDelete) {
                  console.log(`  🗑️ Deleting ${d.id} (${d.created_on})`);
                  const res = await cfRequest(`${project}/deployments/${d.id}`, 'DELETE');
                  if (!res.success) {
                    console.warn(`  ⚠️ Error deleting ${d.id}:`, res.errors[0]?.message || 'Unknown error');
                  }
                }
              }
            } catch (err) {
              console.error('❌ Cleanup failed:', err.message);
              process.exit(1);
            }
          }

          cleanup();
          EOF

```

```

```

```

---
source: "/home/deepak/Work/vishwakarma/.github/workflows/cloudflare-cleanup.yml"
project: "vishwakarma"
role: config
language: yaml
frameworks: [github-actions]
lines: 104
size: 3543 bytes
last_modified: "2026-04-07 14:46"
scanned: "2026-04-07 14:46"
tags: [code, config, github-actions, project/vishwakarma, yaml]
---

# cloudflare-cleanup.yml

> Configuration file for the project using **github-actions** (104 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/.github/workflows/cloudflare-cleanup.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | github-actions |
| **Lines** | 104 |
| **Size** | 3543 bytes |
| **Modified** | 2026-04-07 14:46 |

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
          PROJECTS: 'vishwakarma,chitragupta'
        run: |
          node <<'EOF'
          const https = require('https');

          const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
          const apiKey = process.env.CLOUDFLARE_API_KEY;
          const projects = process.env.PROJECTS.split(',').map(p => p.trim());

          const cfRequest = (path, method = 'GET') => {
            return new Promise((resolve, reject) => {
              const options = {
                hostname: 'api.cloudflare.com',
                port: 443,
                path: `/client/v4/accounts/${accountId}/pages/projects/${path}`,
                method: method,
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                }
              };

              const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
              });

              req.on('error', (e) => reject(e));
              req.end();
            });
          };

          async function cleanup() {
            for (const project of projects) {
              console.log(`\n🔍 Checking project: ${project}`);
              try {
                const deployments = await cfRequest(`${project}/deployments`);
                if (!deployments.success) {
                  console.error(`❌ Error fetching deployments for ${project}:`, deployments.errors);
                  continue;
                }

                // Keep production and newest 10 previews
                const toKeep = new Set();
                const previews = deployments.result
                  .filter(d => {
                    if (d.environment === 'production' && d.latest_stage.status === 'success') {
                      toKeep.add(d.id);
                      return false;
                    }
                    return d.environment === 'preview';
                  })
                  .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));

                previews.slice(0, 10).forEach(d => toKeep.add(d.id));

                const toDelete = deployments.result.filter(d => !toKeep.has(d.id));
                console.log(`♻️ Found ${toDelete.length} deployments to purge (Keeping top 10 previews + production)`);

                for (const d of toDelete) {
                  console.log(`  🗑️ Deleting ${d.id} (${d.created_on})`);
                  await cfRequest(`${project}/deployments/${d.id}`, 'DELETE');
                }
              } catch (err) {
                console.error(`❌ Failed to process ${project}:`, err.message);
              }
            }
          }

          cleanup();
          EOF

```

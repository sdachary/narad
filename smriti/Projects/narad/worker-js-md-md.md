---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/worker-js-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 163
size: 4586 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad]
---

# worker-js-md.md

> Configuration file for the project (163 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/worker-js-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 163 |
| **Size** | 4586 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/worker-js.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 125
size: 3878 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad]
---

# worker-js.md

> Configuration file for the project (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/worker-js.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 125 |
| **Size** | 3878 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/docker/worker.js"
project: "unnati"
role: config
language: javascript
frameworks: []
lines: 87
size: 3203 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, javascript, project/unnati]
---

# worker.js

> Configuration file for the project (87 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/docker/worker.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 87 |
| **Size** | 3203 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const { createClient } = require('@supabase/supabase-js');
const { chromium } = require('playwright');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function runWorker() {
  console.log("🚀 Unnati Auto-Apply Worker Started...");

  while (true) {
    try {
      // 1. Fetch pending jobs (Found status)
      const { data: job, error } = await supabase
        .from('applications')
        .select('*')
        .eq('status', 'Found')
        .limit(1)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log("💤 No jobs to apply. Sleeping for 1 minute...");
        await new Promise(r => setTimeout(r, 60000));
        continue;
      }

      console.log(`🤖 Processing Job: ${job.job_title} at ${job.company_name}`);

      // 2. Update status to 'Applying'
      await supabase.from('applications').update({ status: 'Applying' }).eq('id', job.id);

      // 3. Launch Browser
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        console.log(`🌐 Navigating to: ${job.job_url}`);
        await page.goto(job.job_url, { waitUntil: 'networkidle' });

        // Simple 'Apply' Automation Logic
        // In reality, this needs to be more complex to handle different job boards
        // For now, it's a template that you can refine for your favorite boards
        console.log("📝 Filling form...");
        
        // Example: Try to find common application fields
        // This is a generic 'Lazy' filler - you can refine per site
        const inputs = await page.$$('input, textarea');
        for (const input of inputs) {
          const placeholder = (await input.getAttribute('placeholder'))?.toLowerCase() || "";
          const name = (await input.getAttribute('name'))?.toLowerCase() || "";
          
          if (name.includes('name') || placeholder.includes('name')) {
            await input.fill("System Applicant");
          } else if (name.includes('email') || placeholder.includes('email')) {
            await input.fill("test@example.com");
          } else if (name.includes('letter') || placeholder.includes('cover')) {
            await input.fill(job.cover_letter || "I am very interested in this role.");
          }
        }

        console.log("✅ Application form filled. (Submit clicked in demo mode)");
        // await page.click('button[type="submit"]'); // Careful with auto-clicking!

        // 4. Update status to 'Applied'
        await supabase.from('applications').update({ 
          status: 'Applied',
          updated_at: new Date().toISOString() 
        }).eq('id', job.id);

      } catch (applyError) {
        console.error("❌ Application failed:", applyError);
        await supabase.from('applications').update({ status: 'Failed', notes: applyError.message }).eq('id', job.id);
      } finally {
        await browser.close();
      }

    } catch (err) {
      console.error("Critical Worker Error:", err);
      await new Promise(r => setTimeout(r, 10000));
    }
  }
}

runWorker();

```

```

```

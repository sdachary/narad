---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/vite-config-ts-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, tailwind, vite]
lines: 97
size: 2272 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad, react, tailwind, vite]
---

# vite-config-ts-md.md

> Configuration file for the project using **react, tailwind, vite** (97 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/vite-config-ts-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, tailwind, vite |
| **Lines** | 97 |
| **Size** | 2272 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/vite-config-ts.md"
project: "narad"
role: config
language: markdown
frameworks: [react, tailwind, vite]
lines: 59
size: 1432 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad, react, tailwind, vite]
---

# vite-config-ts.md

> Configuration file for the project using **react, tailwind, vite** (59 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/vite-config-ts.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, tailwind, vite |
| **Lines** | 59 |
| **Size** | 1432 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/vite.config.ts"
project: "social-blueprint-ai"
role: config
language: typescript
frameworks: [react, tailwind, vite]
lines: 21
size: 612 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, project/social-blueprint-ai, react, tailwind, typescript, vite]
---

# vite.config.ts

> Configuration file for the project using **react, tailwind, vite** (21 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/vite.config.ts` |
| **Role** | config |
| **Language** | typescript |
| **Frameworks** | react, tailwind, vite |
| **Lines** | 21 |
| **Size** | 612 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

```

```

```

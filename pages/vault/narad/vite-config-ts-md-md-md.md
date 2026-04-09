---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/vite-config-ts-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, tailwind, vite]
lines: 135
size: 3093 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad, react, tailwind, vite]
---

# vite-config-ts-md-md.md

> Configuration file for the project using **react, tailwind, vite** (135 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/vite-config-ts-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, tailwind, vite |
| **Lines** | 135 |
| **Size** | 3093 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/vite-config-ts-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, tailwind, vite]
lines: 97
size: 2272 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
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
| **Modified** | 2026-04-09 14:38 |

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
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
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
| **Modified** | 2026-04-09 13:31 |

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
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
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
| **Modified** | 2026-04-08 16:51 |

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

```

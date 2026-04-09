---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/vite.config.ts"
project: "social-blueprint-ai"
role: config
language: typescript
frameworks: [react, tailwind, vite]
lines: 21
size: 612 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
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
| **Modified** | 2026-04-09 14:38 |

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

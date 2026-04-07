---
source: "/home/deepak/Work/chitragupta/vite.config.ts"
project: "chitragupta"
role: config
language: typescript
frameworks: [vite]
lines: 57
size: 1785 bytes
last_modified: "2026-04-07 13:44"
scanned: "2026-04-07 13:44"
tags: [code, config, project/chitragupta, typescript, vite]
---

# vite.config.ts

> Configuration file for the project using **vite** (57 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/vite.config.ts` |
| **Role** | config |
| **Language** | typescript |
| **Frameworks** | vite |
| **Lines** | 57 |
| **Size** | 1785 bytes |
| **Modified** | 2026-04-07 13:44 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Chitragupta - Business Ledger',
        short_name: 'Chitragupta',
        description: 'Professional accounting and partner management',
        theme_color: '#6366f1',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        invite: resolve(__dirname, 'invite-partner.html'),
      },
    },
  },
});

```

---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/main.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, vite]
lines: 18
size: 471 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [code, component, project/social-blueprint-ai, react, tsx, vite]
---

# main.tsx

> UI component using **react, vite** (18 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/main.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, vite |
| **Lines** | 18 |
| **Size** | 471 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

[[App-tsx]], [[ErrorBoundary-tsx]]

## 📄 Content

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Sentry.init({
//   dsn: import.meta.env.VITE_SENTRY_DSN,
//   environment: import.meta.env.VITE_APP_ENV || 'development',
// });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

```

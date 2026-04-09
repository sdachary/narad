---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/components/Layout.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: []
lines: 15
size: 358 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/social-blueprint-ai, tsx]
---

# Layout.tsx

> UI component (15 lines).

**Key exports:** `Layout`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/components/Layout.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | — |
| **Lines** | 15 |
| **Size** | 358 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[Sidebar-tsx]]

## 📄 Content

```tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

```

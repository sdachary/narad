---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Layout-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 93
size: 1807 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# Layout-tsx-md.md

> Documentation (93 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Layout-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 93 |
| **Size** | 1807 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/Layout-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 55
size: 1100 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# Layout-tsx.md

> Documentation (55 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/Layout-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 55 |
| **Size** | 1100 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/components/Layout.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: []
lines: 15
size: 358 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
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
| **Modified** | 2026-04-09 14:38 |

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

```

```

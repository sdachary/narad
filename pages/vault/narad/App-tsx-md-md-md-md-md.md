---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/App-tsx-md-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [react]
lines: 240
size: 5555 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad, react]
---

# App-tsx-md-md-md-md.md

> Authentication / authorization module using **react** (240 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/App-tsx-md-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 240 |
| **Size** | 5555 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/App-tsx-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [react]
lines: 202
size: 4801 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad, react]
---

# App-tsx-md-md-md.md

> Authentication / authorization module using **react** (202 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/App-tsx-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 202 |
| **Size** | 4801 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/App-tsx-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [react]
lines: 164
size: 4056 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad, react]
---

# App-tsx-md-md.md

> Authentication / authorization module using **react** (164 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/App-tsx-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 164 |
| **Size** | 4056 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/App-tsx-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [react]
lines: 126
size: 3320 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad, react]
---

# App-tsx-md.md

> Authentication / authorization module using **react** (126 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/App-tsx-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 126 |
| **Size** | 3320 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/App-tsx.md"
project: "narad"
role: auth
language: markdown
frameworks: [react]
lines: 88
size: 2568 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/narad, react]
---

# App-tsx.md

> Authentication / authorization module using **react** (88 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/App-tsx.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 88 |
| **Size** | 2568 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/App.tsx"
project: "social-blueprint-ai"
role: auth
language: tsx
frameworks: [react]
lines: 48
size: 1649 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, project/social-blueprint-ai, react, tsx]
---

# App.tsx

> Authentication / authorization module using **react** (48 lines).

**Key exports:** `App`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/App.tsx` |
| **Role** | auth |
| **Language** | tsx |
| **Frameworks** | react |
| **Lines** | 48 |
| **Size** | 1649 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[Audit-tsx]], [[BrandKit-tsx]], [[Dashboard-tsx]], [[GridPlanner-tsx]], [[Landing-tsx]], [[Layout-tsx]], [[Login-tsx]], [[Pricing-tsx]], [[Reports-tsx]], [[Strategy-tsx]], [[auth-ts]]

## 📄 Content

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Audit from './pages/Audit';
import Strategy from './pages/Strategy';
import GridPlanner from './pages/GridPlanner';
import BrandKit from './pages/BrandKit';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Reports from './pages/Reports';
import { isAuthenticated } from './lib/auth';

export default function App() {
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  if (isAuth === null) return null;

  return (
    <BrowserRouter>
      <Routes>
        {!isAuth ? (
          <>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="audit" element={<Audit />} />
            <Route path="strategy" element={<Strategy />} />
            <Route path="grid" element={<GridPlanner />} />
            <Route path="brand-kit" element={<BrandKit />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

```

```

```

```

```

```

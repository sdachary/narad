---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/App.tsx"
project: "social-blueprint-ai"
role: auth
language: tsx
frameworks: [react]
lines: 48
size: 1649 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
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
| **Modified** | 2026-04-09 16:07 |

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

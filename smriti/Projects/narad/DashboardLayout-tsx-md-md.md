---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/DashboardLayout-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 239
size: 8781 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# DashboardLayout-tsx-md.md

> Documentation using **react, typescript** (239 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/DashboardLayout-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 239 |
| **Size** | 8781 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/DashboardLayout-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 201
size: 7992 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# DashboardLayout-tsx.md

> Documentation using **react, typescript** (201 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/DashboardLayout-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 201 |
| **Size** | 7992 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/layout/DashboardLayout.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 162
size: 7181 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# DashboardLayout.tsx

> UI component using **react, typescript** (162 lines).

**Key exports:** `DashboardLayout`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/layout/DashboardLayout.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 162 |
| **Size** | 7181 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isHuntActive, setIsHuntActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const json = await res.json();
        if (json.profile) {
          setProfile(json.profile);
          setIsHuntActive(json.profile.is_active ?? false);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleHunt = useCallback(async () => {
    if (!profile?.resume_url) return;
    try {
      const res = await fetch('/api/hunt/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeUrl: profile.resume_url, active: !isHuntActive }),
      });
      const json = await res.json();
      if (json.success) {
        setIsHuntActive(json.active);
      }
    } catch (err) {
      console.error('Failed to toggle hunt:', err);
    }
  }, [profile, isHuntActive]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                UNNATI
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Jobs
              </Link>
              <Link href="/applications" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Applications
              </Link>
              <Link href="/analytics" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleHunt}
                disabled={isLoading || !profile?.resume_url}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isHuntActive
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${!profile?.resume_url ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full ${isHuntActive ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                {isHuntActive ? 'Hunt Active' : 'Start Hunt'}
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                {profile?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/applications"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Applications
          </Link>
          <Link
            href="/jobs"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Jobs
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
        </nav>
      </aside>

      <main className="pt-16 lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

```

```

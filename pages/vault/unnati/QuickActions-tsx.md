---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/dashboard/QuickActions.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react]
lines: 148
size: 6854 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, component, project/unnati, react, tsx]
---

# QuickActions.tsx

> UI component using **react** (148 lines).

**Key exports:** `QuickActions`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/dashboard/QuickActions.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react |
| **Lines** | 148 |
| **Size** | 6854 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();
  const [isHuntActive, setIsHuntActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
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
    if (!profile?.resume_url || isToggling) return;
    setIsToggling(true);
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
    } finally {
      setIsToggling(false);
    }
  }, [profile, isHuntActive, isToggling]);

  const handleScanNow = useCallback(async () => {
    setIsScanning(true);
    router.push('/jobs');
  }, [router]);

  const handleRefreshJobs = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleAddJob = useCallback(() => {
    router.push('/applications/new');
  }, [router]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={handleAddJob}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-indigo-700">Add Job</span>
        </button>

        <button
          onClick={handleRefreshJobs}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-500 flex items-center justify-center text-white shadow-md group-hover:rotate-180 transition-transform duration-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Refresh</span>
        </button>

        <button
          onClick={toggleHunt}
          disabled={isLoading || !profile?.resume_url || isToggling}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors group ${
            isHuntActive 
              ? 'bg-green-50 hover:bg-green-100' 
              : 'bg-amber-50 hover:bg-amber-100'
          } ${!profile?.resume_url ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform ${
            isHuntActive ? 'bg-green-500' : 'bg-amber-500'
          }`}>
            {isToggling ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : isHuntActive ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium ${isHuntActive ? 'text-green-700' : 'text-amber-700'}`}>
            {isHuntActive ? 'Hunt On' : 'Start Hunt'}
          </span>
        </button>

        <button
          onClick={handleScanNow}
          disabled={isScanning}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            {isScanning ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-emerald-700">Scan Now</span>
        </button>
      </div>
    </div>
  );
}
```

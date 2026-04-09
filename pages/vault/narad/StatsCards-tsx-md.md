---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/StatsCards-tsx.md"
project: "narad"
role: utility
language: markdown
frameworks: [react, typescript]
lines: 236
size: 7037 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, react, typescript, utility]
---

# StatsCards-tsx.md

> Utility / helper module using **react, typescript** (236 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/StatsCards-tsx.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 236 |
| **Size** | 7037 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/dashboard/StatsCards.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 197
size: 6231 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# StatsCards.tsx

> UI component using **react, typescript** (197 lines).

**Key exports:** `StatsCards`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/dashboard/StatsCards.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 197 |
| **Size** | 6231 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```tsx
'use client';

import { useEffect, useState } from 'react';
import { ApplicationRow, ApplicationStatus } from '@/lib/types';

interface StatsData {
  totalApplications: number;
  jobsFoundToday: number;
  pendingReview: number;
  interviewsScheduled: number;
  offersReceived: number;
  activeDays: number;
}

const STATUS_ICONS = {
  FOUND: '🔍',
  APPLIED: '📤',
  VIEWED: '👁️',
  INTERVIEW: '📅',
  OFFER: '🎉',
  REJECTED: '❌',
};

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  delay: number;
  color: string;
}

function StatCard({ icon, label, value, delay, color }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [isVisible, value]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-md hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 transform translate-x-8 -translate-y-8 ${color}`} />
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color.replace('bg-', 'bg-opacity-20 bg-')}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 tabular-nums">
          {displayValue}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gray-200" />
      </div>
      <div className="mt-4">
        <div className="h-8 w-16 bg-gray-200 rounded" />
        <div className="mt-2 h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [appsRes, profileRes] = await Promise.all([
          fetch('/api/applications?limit=1000'),
          fetch('/api/profile'),
        ]);

        if (!appsRes.ok || !profileRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const appsJson = await appsRes.json();
        const profileJson = await profileRes.json();

        const applications: ApplicationRow[] = appsJson.data || [];
        const profile = profileJson.profile;

        const today = new Date().toISOString().split('T')[0];
        
        const statsData: StatsData = {
          totalApplications: applications.length,
          jobsFoundToday: applications.filter(
            (app: ApplicationRow) => 
              app.status === ApplicationStatus.FOUND && 
              app.applied_at.startsWith(today)
          ).length,
          pendingReview: applications.filter(
            (app: ApplicationRow) => app.status === ApplicationStatus.FOUND
          ).length,
          interviewsScheduled: applications.filter(
            (app: ApplicationRow) => app.status === ApplicationStatus.INTERVIEW
          ).length,
          offersReceived: applications.filter(
            (app: ApplicationRow) => app.status === ApplicationStatus.OFFER
          ).length,
          activeDays: profile?.created_at 
            ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        };

        setStats(statsData);
      } catch (err) {
        setError('Failed to load stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCard key={i} icon="⚠️" label="Error" value={0} delay={i * 100} color="bg-gray-500" />
        ))}
      </div>
    );
  }

  const cards = [
    { icon: '📋', label: 'Total Applications', value: stats.totalApplications, color: 'bg-blue-500' },
    { icon: '✨', label: 'Jobs Found Today', value: stats.jobsFoundToday, color: 'bg-emerald-500' },
    { icon: '⏳', label: 'Pending Review', value: stats.pendingReview, color: 'bg-amber-500' },
    { icon: '📅', label: 'Interviews Scheduled', value: stats.interviewsScheduled, color: 'bg-purple-500' },
    { icon: '🎁', label: 'Offers Received', value: stats.offersReceived, color: 'bg-rose-500' },
    { icon: '🔥', label: 'Active Days', value: stats.activeDays, color: 'bg-orange-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          delay={index * 100}
          color={card.color}
        />
      ))}
    </div>
  );
}
```

```

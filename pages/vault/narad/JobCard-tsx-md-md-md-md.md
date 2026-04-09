---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/JobCard-tsx-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 397
size: 11613 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# JobCard-tsx-md-md-md.md

> Documentation using **react, typescript** (397 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/JobCard-tsx-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 397 |
| **Size** | 11613 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/JobCard-tsx-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 359
size: 10830 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# JobCard-tsx-md-md.md

> Documentation using **react, typescript** (359 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/JobCard-tsx-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 359 |
| **Size** | 10830 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/JobCard-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 321
size: 10056 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# JobCard-tsx-md.md

> Documentation using **react, typescript** (321 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/JobCard-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 321 |
| **Size** | 10056 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/JobCard-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 283
size: 9291 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# JobCard-tsx.md

> Documentation using **react, typescript** (283 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/JobCard-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 283 |
| **Size** | 9291 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/jobs/JobCard.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 244
size: 8497 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# JobCard.tsx

> UI component using **react, typescript** (244 lines).

**Key exports:** `JobCard`, `JobCardSkeleton`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/jobs/JobCard.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 244 |
| **Size** | 8497 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { MapPin, DollarSign, Eye, Bookmark, Send, Building2, Calendar, ExternalLink } from "lucide-react";

export interface Job {
  id: string;
  job_title: string;
  company_name: string;
  job_url?: string;
  location?: string;
  salary_range?: string;
  source?: string;
  status: string;
  applied_at?: string;
  match_score?: number;
  skills?: string[];
}

interface JobCardProps {
  job: Job;
  onView?: (job: Job) => void;
  onShortlist?: (job: Job) => void;
  onApply?: (job: Job) => void;
}

function getMatchScoreColor(score: number): { bg: string; text: string } {
  if (score >= 80) return { bg: "bg-green-100", text: "text-green-700" };
  if (score >= 60) return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "FOUND":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "APPLIED":
      return { bg: "bg-purple-100", text: "text-purple-700" };
    case "VIEWED":
      return { bg: "bg-gray-100", text: "text-gray-700" };
    case "INTERVIEW":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    case "OFFER":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "REJECTED":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function JobCard({ job, onView, onShortlist, onApply }: JobCardProps) {
  const [isShortlisted, setIsShortlisted] = useState(false);

  const matchScore = job.match_score ?? Math.floor(Math.random() * 40 + 60);
  const matchScoreColors = getMatchScoreColor(matchScore);
  const statusColors = getStatusColor(job.status);
  const initials = getInitials(job.company_name);
  const avatarColor = getColorFromName(job.company_name);

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    onShortlist?.(job);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-semibold flex-shrink-0 ${avatarColor}`}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{job.job_title}</h3>
              <p className="text-gray-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{job.company_name}</span>
              </p>
            </div>

            {job.source && (
              <span className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
                {job.source}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-sm text-gray-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary_range}
              </span>
            )}
            {job.applied_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(job.applied_at)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div
              className={`px-2.5 py-1 rounded-md text-sm font-medium ${matchScoreColors.bg} ${matchScoreColors.text}`}
            >
              {matchScore}% Match
            </div>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
            >
              {job.status}
            </span>
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="px-2.5 py-1 text-xs text-gray-400">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onView?.(job)}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={handleShortlist}
          className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isShortlisted
              ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
              : "text-gray-700 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isShortlisted ? "fill-amber-500" : ""}`} />
          {isShortlisted ? "Shortlisted" : "Shortlist"}
        </button>
        <button
          onClick={() => onApply?.(job)}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          Apply
        </button>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-6 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-14 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
```

```

```

```

```

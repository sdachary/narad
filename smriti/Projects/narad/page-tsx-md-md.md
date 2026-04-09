---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/page-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, react, typescript]
lines: 306
size: 11220 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad, react, typescript]
---

# page-tsx-md.md

> Documentation using **docker, react, typescript** (306 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/page-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, react, typescript |
| **Lines** | 306 |
| **Size** | 11220 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/page-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, react, typescript]
lines: 268
size: 10430 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, docs, documentation, markdown, project/narad, react, typescript]
---

# page-tsx.md

> Documentation using **docker, react, typescript** (268 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/page-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, react, typescript |
| **Lines** | 268 |
| **Size** | 10430 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/app/applications/page.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [docker, react, typescript]
lines: 229
size: 9589 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, component, docker, project/unnati, react, tsx, typescript]
---

# page.tsx

> UI component using **docker, react, typescript** (229 lines).

**Key exports:** `ApplicationsPage`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/applications/page.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | docker, react, typescript |
| **Lines** | 229 |
| **Size** | 9589 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

[[JobCard-tsx]], [[JobFilters-tsx]]

## 📄 Content

```tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Plus, X, Briefcase, MapPin, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { JobFilters, FilterState, JobStatus } from "@/components/jobs/JobFilters";
import { JobCard, JobCardSkeleton, Job } from "@/components/jobs/JobCard";

const STATUS_COLORS: Record<string, string> = {
  FOUND: "bg-amber-100 text-amber-800",
  APPLIED: "bg-blue-100 text-blue-800",
  VIEWED: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-purple-100 text-purple-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  FOUND: <Eye className="w-4 h-4" />,
  APPLIED: <Clock className="w-4 h-4" />,
  VIEWED: <Eye className="w-4 h-4" />,
  INTERVIEW: <Briefcase className="w-4 h-4" />,
  OFFER: <CheckCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

interface Application {
  id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: string;
  applied_at: string;
  location: string | null;
  match_score: number | null;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/applications?limit=100");
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch applications");
      }
      const result = await response.json();
      setApplications(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          app.job_title?.toLowerCase().includes(query) ||
          app.company_name?.toLowerCase().includes(query) ||
          app.location?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [applications, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      found: applications.filter(a => a.status === "FOUND").length,
      applied: applications.filter(a => a.status === "APPLIED").length,
      interview: applications.filter(a => a.status === "INTERVIEW").length,
      offer: applications.filter(a => a.status === "OFFER").length,
      rejected: applications.filter(a => a.status === "REJECTED").length,
    };
  }, [applications]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">Track your job applications and their status</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.found}</div>
            <div className="text-sm text-gray-500">Found</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
            <div className="text-sm text-gray-500">Applied</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.interview}</div>
            <div className="text-sm text-gray-500">Interview</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.offer}</div>
            <div className="text-sm text-gray-500">Offer</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>

        <div className="mb-6">
          <form className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications by title, company, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              Start by adding your first job application from the Jobs page!
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {app.job_title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || STATUS_COLORS.FOUND}`}>
                        {STATUS_ICONS[app.status] || STATUS_ICONS.FOUND}
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-600">{app.company_name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {app.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {app.location}
                        </span>
                      )}
                      <span>
                        Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                      </span>
                      {app.match_score !== null && (
                        <span className="text-indigo-600 font-medium">
                          {app.match_score}% match
                        </span>
                      )}
                    </div>
                  </div>
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Job →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

```

```

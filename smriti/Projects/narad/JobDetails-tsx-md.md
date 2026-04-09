---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/JobDetails-tsx.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 244
size: 9699 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# JobDetails-tsx.md

> Utility / helper module using **typescript** (244 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/JobDetails-tsx.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 244 |
| **Size** | 9699 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/jobs/JobDetails.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [typescript]
lines: 205
size: 8931 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/unnati, tsx, typescript]
---

# JobDetails.tsx

> UI component using **typescript** (205 lines).

**Key exports:** `JobDetails`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/jobs/JobDetails.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | typescript |
| **Lines** | 205 |
| **Size** | 8931 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```tsx
'use client';

import { ApplicationRow, ApplicationStatus } from '@/lib/types';

interface JobDetailsProps {
  application: ApplicationRow;
}

const STATUS_COLORS: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
  [ApplicationStatus.FOUND]: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  [ApplicationStatus.APPLIED]: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  [ApplicationStatus.VIEWED]: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  [ApplicationStatus.INTERVIEW]: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  [ApplicationStatus.OFFER]: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  [ApplicationStatus.REJECTED]: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

function CircularProgress({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getColor(score)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}%</span>
      </div>
    </div>
  );
}

function MatchBreakdown({ score }: { score: number }) {
  const matchedPercentage = Math.round((score / 100) * 10);
  const gapPercentage = 10 - matchedPercentage;
  
  const mockMatchedSkills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'];
  const mockMissingSkills = ['Kubernetes', 'Docker', 'System Design'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <CircularProgress score={score} />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Skills Match</span>
          <span className="font-medium text-gray-900">{matchedPercentage}/10</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
            style={{ width: `${matchedPercentage * 10}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <h4 className="text-sm font-medium text-emerald-700 mb-2">Strengths</h4>
          <div className="flex flex-wrap gap-1.5">
            {mockMatchedSkills.map((skill) => (
              <span 
                key={skill}
                className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-amber-700 mb-2">Gaps</h4>
          <div className="flex flex-wrap gap-1.5">
            {mockMissingSkills.map((skill) => (
              <span 
                key={skill}
                className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function JobDetails({ application }: JobDetailsProps) {
  const statusStyle = STATUS_COLORS[application.status] || STATUS_COLORS.FOUND;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {application.company_name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{application.job_title || 'Job Title'}</h1>
              <p className="text-lg font-medium text-gray-600">{application.company_name}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                {application.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {application.location}
                  </span>
                )}
                {application.salary_range && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {application.salary_range}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted {formatDate(application.applied_at)}
                </span>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
              {application.status}
            </span>
          </div>
          
          {application.job_url && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <a
                href={application.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Original Job Posting
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Analysis</h3>
        <MatchBreakdown score={application.match_score || 0} />
      </div>
    </div>
  );
}
```

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/remotive-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 116
size: 2628 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# remotive-ts.md

> Utility / helper module using **typescript** (116 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/remotive-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 116 |
| **Size** | 2628 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/jobs/remotive.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 79
size: 1905 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, project/unnati, typescript, utility]
---

# remotive.ts

> Utility / helper module using **typescript** (79 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/jobs/remotive.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 79 |
| **Size** | 1905 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  location: string;
  description: string;
  remote: boolean;
  url: string;
  posted_at: string;
  salary?: string;
  category: string;
}

export interface RemotiveSearchParams {
  keyword?: string;
  category?: string;
  limit?: number;
}

interface RemotiveApiJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  pub_date: string;
  candidate_required_location: string;
  salary?: string;
  description: string;
}

interface RemotiveApiResponse {
  "job-count": number;
  jobs: RemotiveApiJob[];
}

export async function searchRemotive(
  params: RemotiveSearchParams = {}
): Promise<RemotiveJob[]> {
  const baseUrl = "https://remotive.com/api/remote-jobs";

  const urlParams = new URLSearchParams();
  if (params.category) urlParams.set("category", params.category);
  if (params.keyword) urlParams.set("search", params.keyword);
  if (params.limit) urlParams.set("limit", String(Math.min(params.limit, 100)));

  const url = urlParams.toString() ? `${baseUrl}?${urlParams.toString()}` : baseUrl;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.status}`);
    }

    const data: RemotiveApiResponse = await response.json();

    return data.jobs.map((job: RemotiveApiJob): RemotiveJob => ({
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      location: job.candidate_required_location || "Remote",
      description: job.description,
      remote: true,
      url: job.url,
      posted_at: job.pub_date,
      salary: job.salary,
      category: job.category,
    }));
  } catch (error) {
    console.error("Remotive API error:", error);
    return [];
  }
}
```

```

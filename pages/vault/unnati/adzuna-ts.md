---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/jobs/adzuna.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 125
size: 2870 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, project/unnati, typescript, utility]
---

# adzuna.ts

> Utility / helper module using **typescript** (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/jobs/adzuna.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 125 |
| **Size** | 2870 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
  posted_at: string;
}

export interface AdzunaSearchParams {
  keywords: string;
  location?: string;
  salary_min?: number;
  contract_type?: string;
  page?: number;
}

interface AdzunaApiJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
  contract_time?: string;
}

interface AdzunaApiResponse {
  results: AdzunaApiJob[];
}

function getAdzunaCredentials(): { appId: string; appKey: string } | null {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  
  if (!appId || !appKey) {
    return null;
  }
  
  return { appId, appKey };
}

export async function searchAdzuna(
  params: AdzunaSearchParams
): Promise<AdzunaJob[]> {
  const credentials = getAdzunaCredentials();
  
  if (!credentials) {
    console.warn("Adzuna API: Missing ADZUNA_APP_ID or ADZUNA_APP_KEY");
    return [];
  }

  const baseUrl = "https://api.adzuna.com/v1/api/jobs";
  const country = "gb";
  const page = params.page || 1;

  const urlParams = new URLSearchParams({
    app_id: credentials.appId,
    app_key: credentials.appKey,
    results_per_page: "20",
    what: params.keywords,
    content_type: "application/json",
  });

  if (params.location) {
    urlParams.set("where", params.location);
  }
  if (params.salary_min) {
    urlParams.set("salary_min", String(params.salary_min));
  }
  if (params.contract_type === "full_time") {
    urlParams.set("full_time", "1");
  } else if (params.contract_type === "part_time") {
    urlParams.set("part_time", "1");
  }
  if (params.contract_type === "contract") {
    urlParams.set("contract", "1");
  }

  const url = `${baseUrl}/${country}/search/${page}?${urlParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 429) {
      console.warn("Adzuna API: Rate limit exceeded");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data: AdzunaApiResponse = await response.json();

    return data.results.map((job: AdzunaApiJob): AdzunaJob => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      url: job.redirect_url,
      posted_at: job.created,
    }));
  } catch (error) {
    console.error("Adzuna API error:", error);
    return [];
  }
}

```

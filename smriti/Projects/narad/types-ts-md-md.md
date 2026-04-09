---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/types-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 302
size: 5861 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# types-ts-md.md

> Utility / helper module using **typescript** (302 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/types-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 302 |
| **Size** | 5861 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/types-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 264
size: 5114 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# types-ts.md

> Utility / helper module using **typescript** (264 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/types-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 264 |
| **Size** | 5114 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/types.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 226
size: 4407 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, project/unnati, typescript, utility]
---

# types.ts

> Utility / helper module using **typescript** (226 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/types.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 226 |
| **Size** | 4407 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export enum ApplicationStatus {
  FOUND = 'FOUND',
  APPLIED = 'APPLIED',
  VIEWED = 'VIEWED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

export enum ActivityType {
  JOB_FOUND = 'job_found',
  MATCH_READY = 'match_ready',
  NEEDS_REVIEW = 'needs_review',
  APPLIED = 'applied',
}

export enum ExperienceLevel {
  FRESHER = 'fresher',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

export interface UserPreferences {
  notifications?: {
    email?: boolean;
    push?: boolean;
    frequency?: 'daily' | 'weekly' | 'instant';
  };
  theme?: 'light' | 'dark' | 'system';
  language?: string;
}

export interface ResumeParsedData {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  experience?: Array<{
    company?: string;
    title?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    is_current?: boolean;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    field?: string;
    start_date?: string;
    end_date?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
  }>;
}

export type UserProfileRow = {
  id: string;
  email: string;
  preferences: Json;
  resume_url: string | null;
  is_active: boolean;
  preferred_roles: string[];
  preferred_location: string;
  company_types: string[];
  sectors: string[];
  experience_level: string;
  current_ctc: string;
  expected_ctc: string;
  resume_parsed_data: Json | null;
  skills: string[];
  last_search_at: string;
  created_at: string;
  updated_at: string;
};

export type UserProfileInsert = Omit<
  UserProfileRow,
  'id' | 'created_at' | 'updated_at' | 'last_search_at'
>;

export type UserProfileUpdate = Partial<
  Omit<
    UserProfileRow,
    'id' | 'created_at'
  >
>;

export type ApplicationRow = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  status: ApplicationStatus;
  match_score: number | null;
  cover_letter: string | null;
  notes: string | null;
  location: string | null;
  salary_range: string | null;
  job_hash: string | null;
  source: string | null;
  applied_at: string;
  updated_at: string;
};

export type ApplicationInsert = Omit<
  ApplicationRow,
  'id' | 'updated_at'
>;

export type ApplicationUpdate = Partial<
  Omit<
    ApplicationRow,
    'id' | 'user_id' | 'created_at'
  >
>;

export type AICacheRow = {
  id: string;
  user_id: string;
  cache_key: string;
  content: Json;
  created_at: string;
  expires_at: string;
};

export type AICacheInsert = Omit<
  AICacheRow,
  'id' | 'created_at'
>;

export type AICacheUpdate = Partial<
  Omit<
    AICacheRow,
    'id' | 'user_id' | 'created_at'
  >
>;

export type ActivityRow = {
  id: string;
  user_id: string;
  type: ActivityType;
  message: string;
  metadata: Json | null;
  read: boolean;
  created_at: string;
};

export type ActivityInsert = Omit<
  ActivityRow,
  'id' | 'created_at'
>;

export type ActivityUpdate = Partial<
  Omit<
    ActivityRow,
    'id' | 'user_id' | 'created_at'
  >
>;

export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type PaginatedResponse<T> = {
  data: T[];
  error: ApiError | null;
  count: number | null;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type MatchResult = {
  applicationId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  experienceMatch: boolean;
};

export type SearchFilters = {
  roles?: string[];
  location?: string;
  companyTypes?: string[];
  sectors?: string[];
  experienceLevel?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  status?: ApplicationStatus[];
};

export type ApplicationWithProfile = ApplicationRow & {
  user_profile?: Pick<UserProfileRow, 'email' | 'skills' | 'experience_level'>;
};

export type ActivityWithProfile = ActivityRow & {
  user_profile?: Pick<UserProfileRow, 'email'>;
};

export type CacheEntry<T = Json> = {
  key: string;
  value: T;
  expiresAt: Date;
  isExpired: () => boolean;
};

```

```

```

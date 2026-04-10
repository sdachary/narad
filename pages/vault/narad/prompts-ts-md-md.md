---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/prompts-ts-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 147
size: 4029 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# prompts-ts-md.md

> Documentation using **docker, typescript** (147 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/prompts-ts-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 147 |
| **Size** | 4029 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/prompts-ts.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 109
size: 3263 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# prompts-ts.md

> Documentation using **docker, typescript** (109 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/prompts-ts.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 109 |
| **Size** | 3263 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/prompts.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [docker, typescript]
lines: 70
size: 2405 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, docker, project/unnati, typescript, utility]
---

# prompts.ts

> Utility / helper module using **docker, typescript** (70 lines).

**Key exports:** `RESUME_PARSE_PROMPT`, `JOB_MATCH_PROMPT`, `COVER_LETTER_PROMPT`, `COMPANY_RESEARCH_PROMPT`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/prompts.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 70 |
| **Size** | 2405 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export const RESUME_PARSE_PROMPT = `You are an expert HR resume parser. Parse the following resume and extract structured information.

Return a JSON object with these fields:
- name: string (full name)
- email: string | null
- phone: string | null
- location: string | null
- summary: string (2-3 sentence professional summary)
- skills: string[] (array of technical and soft skills)
- experience: Array<{company: string, title: string, duration: string, description: string}>
- education: Array<{institution: string, degree: string, year: string}>
- certifications: string[]
- languages: string[]

Resume:
{resumeText}`;

export const JOB_MATCH_PROMPT = `You are an expert job matching algorithm. Given a candidate's resume parsed data and a job description, calculate the match score and provide insights.

Resume data:
{resumeJson}

Job description:
{jobDescription}

Return a JSON object with:
- matchScore: number (0-100)
- matchPercentage: string (e.g., "85%")
- matchedSkills: string[] (skills from resume that match job requirements)
- missingSkills: string[] (job requirements not found in resume)
- insights: string[] (key observations about the match)
- recommendation: string ("strong match", "good match", "partial match", "weak match")`;

export const COVER_LETTER_PROMPT = `You are a professional cover letter writer. Generate a compelling cover letter based on the candidate's resume, job details, and company information.

Candidate resume:
{resumeJson}

Job position:
{jobTitle}
{jobCompany}
{jobDescription}

Company:
{companyName}
{companyDescription}

Guidelines:
- Keep it to 3-4 paragraphs
- Highlight relevant experience and skills
- Show enthusiasm for the role and company
- Use professional but conversational tone
- Include specific achievements where relevant
- No placeholders - write actual content based on the provided info

Generate the cover letter now:`;

export const COMPANY_RESEARCH_PROMPT = `You are a research assistant. Analyze the company and provide key information for a job application.

Company name: {companyName}
Company website/description: {companyInfo}

Provide a JSON object with:
- companyOverview: string (2-3 sentence description)
- industry: string
- keyProducts: string[]
- companyCulture: string (based on available info)
- recentNews: string[] (if available)
- values: string[]
- tipsForApplicants: string[] (specific advice for this company)`;
```

```

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/question-generator-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 233
size: 6156 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# question-generator-ts-md-md.md

> Utility / helper module using **typescript** (233 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/question-generator-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 233 |
| **Size** | 6156 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/question-generator-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 195
size: 5363 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# question-generator-ts-md.md

> Utility / helper module using **typescript** (195 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/question-generator-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 195 |
| **Size** | 5363 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/question-generator-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 157
size: 4577 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# question-generator-ts.md

> Utility / helper module using **typescript** (157 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/question-generator-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 157 |
| **Size** | 4577 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/interview/question-generator.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 119
size: 3795 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# question-generator.ts

> Utility / helper module using **typescript** (119 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/interview/question-generator.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 119 |
| **Size** | 3795 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[orchestrator-ts]]

## 📄 Content

```typescript
import { runAI } from '../ai/orchestrator';

const TECHNICAL_QUESTIONS_PROMPT = `Generate 5 technical interview questions based on the following job description and required skills.

Job Description:
{jobDescription}

Required Skills:
{skills}

Generate exactly 5 questions that assess technical competence. Return as a JSON array of strings.`;

const BEHAVIORAL_QUESTIONS_PROMPT = `Generate 5 behavioral interview questions that assess soft skills and cultural fit.

Generate questions that probe for:
- Leadership and teamwork
- Problem-solving abilities
- Conflict resolution
- Adaptability and learning
- Communication skills

Return as a JSON array of strings.`;

const COMPANY_QUESTIONS_PROMPT = `Generate 5 company-specific interview questions for {companyName}.

These questions should demonstrate the candidate's research and interest in the company. Include questions about:
- Company culture and values
- Recent company news or initiatives
- Role-specific curiosity
- Growth opportunities
- Team dynamics

Return as a JSON array of strings.`;

export async function generateTechnicalQuestions(
  jobDescription: string,
  skills: string[]
): Promise<string[]> {
  const prompt = TECHNICAL_QUESTIONS_PROMPT
    .replace('{jobDescription}', jobDescription)
    .replace('{skills}', skills.join(', '));

  const response = await runAI({
    task: 'resume_parse',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only a JSON array of strings, no explanations.',
    temperature: 0.7,
    maxTokens: 1024,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to generate technical questions');
  }

  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[QuestionGenerator] Technical questions parse error:', parseError);
    throw new Error('Failed to parse technical questions response');
  }
}

export async function generateBehavioralQuestions(): Promise<string[]> {
  const prompt = BEHAVIORAL_QUESTIONS_PROMPT;

  const response = await runAI({
    task: 'resume_parse',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only a JSON array of strings, no explanations.',
    temperature: 0.7,
    maxTokens: 1024,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to generate behavioral questions');
  }

  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[QuestionGenerator] Behavioral questions parse error:', parseError);
    throw new Error('Failed to parse behavioral questions response');
  }
}

export async function generateCompanyQuestions(companyName: string): Promise<string[]> {
  const prompt = COMPANY_QUESTIONS_PROMPT.replace('{companyName}', companyName);

  const response = await runAI({
    task: 'resume_parse',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only a JSON array of strings, no explanations.',
    temperature: 0.7,
    maxTokens: 1024,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to generate company questions');
  }

  try {
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[QuestionGenerator] Company questions parse error:', parseError);
    throw new Error('Failed to parse company questions response');
  }
}

```

```

```

```

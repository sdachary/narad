---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cover-letter-ts-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 226
size: 6037 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# cover-letter-ts-md.md

> Documentation using **docker, typescript** (226 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cover-letter-ts-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 226 |
| **Size** | 6037 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/cover-letter-ts.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 188
size: 5256 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# cover-letter-ts.md

> Documentation using **docker, typescript** (188 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/cover-letter-ts.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 188 |
| **Size** | 5256 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/cover-letter.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [docker, typescript]
lines: 150
size: 4474 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, docker, project/unnati, typescript, utility]
---

# cover-letter.ts

> Utility / helper module using **docker, typescript** (150 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/cover-letter.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 150 |
| **Size** | 4474 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

[[orchestrator-ts]]

## 📄 Content

```typescript
import { runAI } from './orchestrator';

interface CoverLetterOptions {
  tone?: 'professional' | 'casual' | 'enthusiastic';
  length?: 'short' | 'medium' | 'long';
  focusAreas?: string[];
}

interface CoverLetterResult {
  success: boolean;
  content?: string;
  error?: string;
  tokens?: number;
}

interface JobDetails {
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
}

const TONE_PROMPTS = {
  professional: 'Use a formal, polished, and business-appropriate tone.',
  casual: 'Use a friendly, relaxed, and approachable tone.',
  enthusiastic: 'Use an energetic, excited, and positive tone that shows genuine passion.',
};

const LENGTH_GUIDELINES = {
  short: 'Keep the cover letter to 2-3 short paragraphs, approximately 200-250 words.',
  medium: 'Keep the cover letter to 3-4 paragraphs, approximately 300-400 words.',
  long: 'Use 4-5 paragraphs with detailed examples, approximately 450-550 words.',
};

function buildCoverLetterPrompt(
  resumeSummary: string,
  jobDetails: JobDetails,
  userInfo: UserInfo,
  options: CoverLetterOptions
): string {
  const toneGuideline = options.tone ? TONE_PROMPTS[options.tone] : TONE_PROMPTS.professional;
  const lengthGuideline = options.length ? LENGTH_GUIDELINES[options.length] : LENGTH_GUIDELINES.medium;
  
  const focusAreasText = options.focusAreas?.length 
    ? `\nFocus areas to emphasize: ${options.focusAreas.join(', ')}`
    : '';

  return `You are a professional cover letter writer. Generate a compelling, personalized cover letter.

CANDIDATE INFORMATION:
Name: ${userInfo.name}
Email: ${userInfo.email}
${userInfo.phone ? `Phone: ${userInfo.phone}` : ''}

RESUME SUMMARY:
${resumeSummary}

JOB DETAILS:
Position: ${jobDetails.title}
Company: ${jobDetails.company}
Job Description: ${jobDetails.description}
${jobDetails.requirements.length > 0 ? `Requirements: ${jobDetails.requirements.join(', ')}` : ''}

GUIDELINES:
${toneGuideline}
${lengthGuideline}
- Highlight relevant experience and skills that match the job requirements
- Show enthusiasm for the ${jobDetails.company} and the ${jobDetails.title} role
- Use specific examples from the resume where relevant
- No placeholders - write actual content based on the provided information
- Include the candidate's contact information in the opening or closing${focusAreasText}

Generate the cover letter now:`;
}

function getSystemPrompt(options: CoverLetterOptions): string {
  const toneDescriptions = {
    professional: 'professional and formal',
    casual: 'friendly and conversational',
    enthusiastic: 'energetic and passionate',
  };
  
  const tone = options.tone ? toneDescriptions[options.tone] : 'professional';
  const length = options.length || 'medium';
  
  return `You are a ${tone} cover letter writer. Generate only the cover letter content without any preamble or explanation.`;
}

export async function generateCoverLetter(
  resumeSummary: string,
  jobDetails: JobDetails,
  userInfo: UserInfo,
  options: CoverLetterOptions = {}
): Promise<CoverLetterResult> {
  const timeoutMs = 60000;
  
  try {
    const prompt = buildCoverLetterPrompt(resumeSummary, jobDetails, userInfo, options);
    const systemPrompt = getSystemPrompt(options);
    
    const maxTokens = options.length === 'short' ? 1024 : options.length === 'long' ? 2048 : 1536;
    
    const response = await Promise.race([
      runAI({
        task: 'cover_letter',
        prompt,
        systemPrompt,
        temperature: 0.8,
        maxTokens,
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Cover letter generation timed out')), timeoutMs)
      )
    ]);

    if (!response.success || !response.content) {
      return {
        success: false,
        error: response.error || 'Failed to generate cover letter',
      };
    }

    return {
      success: true,
      content: response.content,
      tokens: response.usage?.totalTokens,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[CoverLetter] Generation error:', errorMessage);
    
    if (errorMessage.includes('timed out')) {
      return {
        success: false,
        error: 'Generation timed out after 60 seconds. Please try again.',
      };
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

```

```

```

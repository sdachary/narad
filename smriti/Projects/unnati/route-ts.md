---
source: "/home/deepak/Work/unnati/src/app/api/jobs/refine/route.ts"
project: "unnati"
role: route
language: typescript
frameworks: [typescript]
lines: 72
size: 2548 bytes
last_modified: "2026-04-07 17:41"
scanned: "2026-04-07 17:41"
tags: [code, project/unnati, route, typescript]
---

# route.ts

> Route handler / API endpoint using **typescript** (72 lines).

**Key exports:** `runtime`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/api/jobs/refine/route.ts` |
| **Role** | route |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 72 |
| **Size** | 2548 bytes |
| **Modified** | 2026-04-07 17:41 |

## 🔗 Related Files

[[supabase-ts]]

## 📄 Content

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemini-2.0-flash-lite:free";

export async function POST(request: Request) {
  try {
    const { jobId, resumeUrl } = await request.json();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 });
    }

    // 1. Get Job & Profile Data
    const { data: job } = await supabase.from('applications').select('*').eq('id', jobId).single();
    const { data: profile } = await supabase.from('user_profiles').select('*').eq('resume_url', resumeUrl).single();

    if (!job || !profile) {
      return NextResponse.json({ error: "Job or Profile not found" }, { status: 404 });
    }

    // 2. Generate Tailored Content via AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "You are a top-tier recruitment specialist. Your goal is to write a highly compelling, tailored cover letter based on a user's skills and a specific job description. Always return valid JSON."
          },
          {
            role: "user",
            content: `
            USER SKILLS: ${profile.skills.join(", ")}
            JOB TITLE: ${job.job_title}
            COMPANY: ${job.company_name}
            
            Task:
            1. Generate a professional 200-word cover letter.
            2. Generate a 1-sentence 'Impact Statement' for the application form.
            
            Return ONLY JSON: { "cover_letter": "...", "impact_statement": "..." }`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const aiData = await response.json();
    const result = JSON.parse(aiData.choices[0].message.content);

    // 3. Update the Job with the refined content
    await supabase.from('applications').update({
      cover_letter: result.cover_letter,
      notes: result.impact_statement
    }).eq('id', jobId);

    return NextResponse.json({ success: true, refined: result });

  } catch (error: any) {
    console.error("Refinement error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/route-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 246
size: 5979 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# route-ts-md-md.md

> Utility / helper module using **typescript** (246 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/route-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 246 |
| **Size** | 5979 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/route-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 208
size: 5225 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# route-ts-md.md

> Utility / helper module using **typescript** (208 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/route-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 208 |
| **Size** | 5225 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/route-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 170
size: 4478 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# route-ts.md

> Utility / helper module using **typescript** (170 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/route-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 170 |
| **Size** | 4478 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/app/api/applications/[id]/route.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 130
size: 3687 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# route.ts

> Utility / helper module using **typescript** (130 lines).

**Key exports:** `runtime`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/api/applications/[id]/route.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 130 |
| **Size** | 3687 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[supabase-ts]]

## 📄 Content

```typescript
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = getSupabase();
  if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 });
    }

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ data });

  } catch (error: any) {
    console.error("Application GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, cover_letter, notes, match_score, job_url, location, salary_range, source } = body;

    const supabase = getSupabase();
  if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 });
    }

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) (updateData as any).status = status;
    if (cover_letter !== undefined) (updateData as any).cover_letter = cover_letter;
    if (notes !== undefined) (updateData as any).notes = notes;
    if (match_score !== undefined) (updateData as any).match_score = match_score;
    if (job_url !== undefined) (updateData as any).job_url = job_url;
    if (location !== undefined) (updateData as any).location = location;
    if (salary_range !== undefined) (updateData as any).salary_range = salary_range;
    if (source !== undefined) (updateData as any).source = source;

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Application PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = getSupabase();
  if (!supabase) {
      return NextResponse.json({ error: "Supabase not initialized" }, { status: 500 });
    }

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Application DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

```

```

```

```

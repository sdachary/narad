---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Header-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 65
size: 1495 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# Header-tsx.md

> Documentation (65 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Header-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 65 |
| **Size** | 1495 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/Header.tsx"
project: "unnati"
role: component
language: tsx
frameworks: []
lines: 25
size: 817 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, component, project/unnati, tsx]
---

# Header.tsx

> UI component (25 lines).

**Key exports:** `Header`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/Header.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | — |
| **Lines** | 25 |
| **Size** | 817 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              JobHunt
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
              Jobs
            </Link>
            <Link href="/applications" className="text-sm text-gray-600 hover:text-gray-900">
              Applications
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

```

```

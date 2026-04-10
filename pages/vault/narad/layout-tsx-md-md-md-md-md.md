---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/layout-tsx-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 229
size: 4342 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad]
---

# layout-tsx-md-md-md-md.md

> Documentation (229 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/layout-tsx-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 229 |
| **Size** | 4342 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/layout-tsx-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 191
size: 3633 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# layout-tsx-md-md-md.md

> Documentation (191 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/layout-tsx-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 191 |
| **Size** | 3633 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/layout-tsx-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 153
size: 2933 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# layout-tsx-md-md.md

> Documentation (153 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/layout-tsx-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 153 |
| **Size** | 2933 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/layout-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 115
size: 2242 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# layout-tsx-md.md

> Documentation (115 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/layout-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 115 |
| **Size** | 2242 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/job-hunt-app/layout-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 77
size: 1549 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# layout-tsx.md

> Documentation (77 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/job-hunt-app/layout-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 77 |
| **Size** | 1549 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/job-hunt-app/src/app/layout.tsx"
project: "job-hunt-app"
role: component
language: tsx
frameworks: []
lines: 37
size: 856 bytes
last_modified: "2026-04-06 23:42"
scanned: "2026-04-06 23:42"
tags: [code, component, project/job-hunt-app, tsx]
---

# layout.tsx

> UI component (37 lines).

**Key exports:** `metadata`, `RootLayout`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `job-hunt-app/src/app/layout.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | — |
| **Lines** | 37 |
| **Size** | 856 bytes |
| **Modified** | 2026-04-06 23:42 |

## 🔗 Related Files

[[Header-tsx]]

## 📄 Content

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobHunt - Find Your Dream Job",
  description: "Track and manage your job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

```

```

```

```

```

```

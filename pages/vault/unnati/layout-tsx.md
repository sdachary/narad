---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/app/layout.tsx"
project: "unnati"
role: component
language: tsx
frameworks: []
lines: 37
size: 856 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, component, project/unnati, tsx]
---

# layout.tsx

> UI component (37 lines).

**Key exports:** `metadata`, `RootLayout`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/layout.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | — |
| **Lines** | 37 |
| **Size** | 856 bytes |
| **Modified** | 2026-04-09 15:18 |

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

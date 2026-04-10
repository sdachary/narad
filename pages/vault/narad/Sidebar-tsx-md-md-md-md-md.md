---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Sidebar-tsx-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript, vite]
lines: 413
size: 11581 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad, react, typescript, vite]
---

# Sidebar-tsx-md-md-md-md.md

> Documentation using **react, typescript, vite** (413 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Sidebar-tsx-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript, vite |
| **Lines** | 413 |
| **Size** | 11581 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Sidebar-tsx-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript, vite]
lines: 375
size: 10765 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad, react, typescript, vite]
---

# Sidebar-tsx-md-md-md.md

> Documentation using **react, typescript, vite** (375 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Sidebar-tsx-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript, vite |
| **Lines** | 375 |
| **Size** | 10765 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Sidebar-tsx-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript, vite]
lines: 337
size: 9960 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad, react, typescript, vite]
---

# Sidebar-tsx-md-md.md

> Documentation using **react, typescript, vite** (337 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Sidebar-tsx-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript, vite |
| **Lines** | 337 |
| **Size** | 9960 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Sidebar-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript, vite]
lines: 299
size: 9164 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad, react, typescript, vite]
---

# Sidebar-tsx-md.md

> Documentation using **react, typescript, vite** (299 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Sidebar-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript, vite |
| **Lines** | 299 |
| **Size** | 9164 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Sidebar-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript, vite]
lines: 261
size: 8375 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad, react, typescript, vite]
---

# Sidebar-tsx.md

> Documentation using **react, typescript, vite** (261 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Sidebar-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript, vite |
| **Lines** | 261 |
| **Size** | 8375 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/layout/Sidebar.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript, vite]
lines: 221
size: 7572 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/unnati, react, tsx, typescript, vite]
---

# Sidebar.tsx

> UI component using **react, typescript, vite** (221 lines).

**Key exports:** `Sidebar`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/layout/Sidebar.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript, vite |
| **Lines** | 221 |
| **Size** | 7572 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Send,
  Star,
  GraduationCap,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase, badge: 12 },
  { label: "Applied", href: "/applied", icon: Send },
  { label: "Shortlist", href: "/shortlist", icon: Star, badge: 3 },
  { label: "Interview Prep", href: "/interview", icon: GraduationCap },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const unreadNotifications = 5;

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-full flex-col
          border-r border-gray-200 bg-white
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-0 -translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
              <span className="text-lg font-bold text-white">U</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900">UNNATI</span>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500">
              <span className="text-lg font-semibold text-white">JD</span>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  John Doe
                </p>
                <p className="truncate text-xs text-gray-500">Premium Plan</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications badge */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                {unreadNotifications} new
              </span>
            </div>
            <span className="text-xs text-indigo-600">Notifications</span>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center justify-between rounded-lg px-3 py-2.5
                      transition-all duration-200
                      ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-5 w-5 shrink-0 ${
                          active ? "text-indigo-600" : "text-gray-500"
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 p-4">
          <ul className="space-y-1">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center rounded-lg px-3 py-2.5
                      transition-all duration-200
                      ${
                        active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        active ? "text-indigo-600" : "text-gray-500"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-30 rounded-lg bg-white p-2 shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>
    </>
  );
}

export default Sidebar;

```

```

```

```

```

```

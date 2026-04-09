---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/components/Sidebar.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, vite]
lines: 102
size: 3269 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, component, project/social-blueprint-ai, react, tsx, vite]
---

# Sidebar.tsx

> UI component using **react, vite** (102 lines).

**Key exports:** `Sidebar`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/components/Sidebar.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, vite |
| **Lines** | 102 |
| **Size** | 3269 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[auth-ts]], [[utils-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Target, 
  Grid3X3, 
  Palette, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { logout } from '../lib/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Search, label: 'Profile Audit', path: '/audit' },
  { icon: Target, label: 'Content Strategy', path: '/strategy' },
  { icon: Grid3X3, label: 'Grid Planner', path: '/grid' },
  { icon: Palette, label: 'Brand Kit', path: '/brand-kit' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Target, label: 'Pricing', path: '/pricing' },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-slate-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Target size={20} />
              </div>
              Social Manager AI
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

```

---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/ErrorBoundary-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 99
size: 3089 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# ErrorBoundary-tsx.md

> Documentation using **react, typescript** (99 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/ErrorBoundary-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 99 |
| **Size** | 3089 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/components/ErrorBoundary.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, typescript]
lines: 59
size: 2251 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, component, project/social-blueprint-ai, react, tsx, typescript]
---

# ErrorBoundary.tsx

> UI component using **react, typescript** (59 lines).

**Key exports:** `ErrorBoundary`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/components/ErrorBoundary.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 59 |
| **Size** | 2251 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
              <p className="text-slate-500">We've encountered an unexpected error. Please refresh the page or try again later.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => this.setState({ hasError: false })}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

```

```

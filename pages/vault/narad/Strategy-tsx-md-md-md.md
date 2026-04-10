---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Strategy-tsx-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [react, typescript]
lines: 276
size: 9299 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, react, typescript, utility]
---

# Strategy-tsx-md-md.md

> Utility / helper module using **react, typescript** (276 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Strategy-tsx-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 276 |
| **Size** | 9299 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Strategy-tsx-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [react, typescript]
lines: 238
size: 8505 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, react, typescript, utility]
---

# Strategy-tsx-md.md

> Utility / helper module using **react, typescript** (238 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Strategy-tsx-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 238 |
| **Size** | 8505 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/Strategy-tsx.md"
project: "narad"
role: utility
language: markdown
frameworks: [react, typescript]
lines: 200
size: 7692 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, react, typescript, utility]
---

# Strategy-tsx.md

> Utility / helper module using **react, typescript** (200 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/Strategy-tsx.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 200 |
| **Size** | 7692 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Strategy.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, typescript]
lines: 160
size: 6856 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, component, project/social-blueprint-ai, react, tsx, typescript]
---

# Strategy.tsx

> UI component using **react, typescript** (160 lines).

**Key exports:** `Strategy`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Strategy.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 160 |
| **Size** | 6856 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

[[apiClient-ts]], [[pdf-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  Target, 
  Sparkles, 
  Calendar, 
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/apiClient';
import { generatePDF } from '../lib/pdf';

export default function Strategy() {
  const [loading, setLoading] = React.useState(false);
  const [strategy, setStrategy] = React.useState<any>(null);
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = React.useState('');
  const [exporting, setExporting] = React.useState(false);

  React.useEffect(() => {
    apiFetch('/api/profiles')
      .then(data => {
        setProfiles(data);
        if (data.length > 0) setSelectedProfile(data[0].id.toString());
      });
  }, []);

  React.useEffect(() => {
    if (selectedProfile) {
      setLoading(true);
      apiFetch(`/api/audits/${selectedProfile}`)
        .then(data => {
          if (data && data.data) {
            const audit = JSON.parse(data.data);
            setStrategy(audit.strategy);
          } else {
            setStrategy(null);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedProfile]);

  const handleExport = async () => {
    setExporting(true);
    await generatePDF('strategy-report', 'content-strategy');
    setExporting(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Strategy</h1>
          <p className="text-slate-500 mt-1">Your AI-powered 30-day content plan.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
          >
            <option value="">Select Profile</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>@{p.handle} ({p.platform})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : strategy ? (
        <div id="strategy-report" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="text-indigo-600" size={24} />
                  30-Day Posting Plan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {strategy.calendar30Day.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase">Day {item.day}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded uppercase">{item.type}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{item.topic}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={24} />
                  Viral Hook Templates
                </h3>
                <div className="space-y-3">
                  {strategy.hookTemplates.map((hook: string, i: number) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-amber-900">{hook}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Reel Concepts</h3>
                <div className="space-y-6">
                  {strategy.reelConcepts.map((reel: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-sm font-bold text-slate-700">{reel.title}</h4>
                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-2">
                        <p className="font-bold text-indigo-600">Hook: {reel.hook}</p>
                        <p>{reel.visual}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="text-lg font-bold mb-2">Ready to execute?</h3>
                <p className="text-indigo-100 text-sm mb-6">Download your full 30-day content strategy as a PDF report.</p>
                <button 
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {exporting ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                  {exporting ? 'Generating PDF...' : 'Download PDF'}
                </button>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
          <Target className="mx-auto text-slate-300" size={48} />
          <div>
            <h3 className="text-lg font-bold text-slate-900">No strategy found</h3>
            <p className="text-slate-500 text-sm">Run an audit first to generate your AI-powered content strategy.</p>
          </div>
        </div>
      )}
    </div>
  );
}

```

```

```

```

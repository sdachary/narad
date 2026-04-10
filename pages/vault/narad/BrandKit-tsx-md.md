---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/BrandKit-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 233
size: 9125 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# BrandKit-tsx.md

> Documentation using **react, typescript** (233 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/BrandKit-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 233 |
| **Size** | 9125 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/BrandKit.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, typescript]
lines: 193
size: 8301 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, component, project/social-blueprint-ai, react, tsx, typescript]
---

# BrandKit.tsx

> UI component using **react, typescript** (193 lines).

**Key exports:** `BrandKit`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/BrandKit.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 193 |
| **Size** | 8301 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

[[apiClient-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  Palette, 
  Type, 
  Target, 
  Compass, 
  ShieldCheck,
  Download,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/apiClient';

export default function BrandKit() {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = React.useState('');
  const [brandKit, setBrandKit] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

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
            setBrandKit(audit.brandKit);
          } else {
            setBrandKit(null);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedProfile]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brand Kit Generator</h1>
          <p className="text-slate-500 mt-1">Your core brand identity and visual guidelines.</p>
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
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors">
            <Download size={20} />
            Export Kit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      ) : brandKit ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Brand Positioning</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mission</h3>
                  <p className="text-slate-700 font-medium">{brandKit.mission}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Vision</h3>
                  <p className="text-slate-700 font-medium">{brandKit.vision}</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tone of Voice</h3>
                  <p className="text-slate-700 font-medium">{brandKit.tone}</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Palette size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Visual Identity</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Color Palette</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {brandKit.colors.map((color: string, i: number) => (
                      <div key={i} className="space-y-2">
                        <div 
                          className="aspect-square rounded-2xl shadow-inner border border-black/5"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-xs font-bold text-slate-900 text-center uppercase">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Typography</h3>
                  <div className="space-y-4">
                    {brandKit.fonts.map((font: string, i: number) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-lg font-bold text-slate-900" style={{ fontFamily: font }}>{font}</p>
                          <p className="text-xs text-slate-500">{i === 0 ? 'Primary' : 'Secondary'} Font</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">AaBbCc123</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="text-indigo-600" size={20} />
                Brand Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {brandKit.keywords.map((word: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {word}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Compass className="text-indigo-400" size={24} />
                <h3 className="text-lg font-bold">Moodboard Direction</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {brandKit.moodboard}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/brand${i}/200/200`} 
                      alt="Moodboard" 
                      className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
          <Palette className="mx-auto text-slate-300" size={48} />
          <div>
            <h3 className="text-lg font-bold text-slate-900">No brand kit found</h3>
            <p className="text-slate-500 text-sm">Run an audit first to generate your AI-powered brand kit.</p>
          </div>
        </div>
      )}
    </div>
  );
}

```

```

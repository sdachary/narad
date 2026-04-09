---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/GridPlanner-tsx.md"
project: "narad"
role: utility
language: markdown
frameworks: [react, typescript]
lines: 163
size: 5947 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, react, typescript, utility]
---

# GridPlanner-tsx.md

> Utility / helper module using **react, typescript** (163 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/GridPlanner-tsx.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 163 |
| **Size** | 5947 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/GridPlanner.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react, typescript]
lines: 123
size: 5097 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/social-blueprint-ai, react, tsx, typescript]
---

# GridPlanner.tsx

> UI component using **react, typescript** (123 lines).

**Key exports:** `GridPlanner`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/GridPlanner.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 123 |
| **Size** | 5097 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[apiClient-ts]], [[utils-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  Grid3X3, 
  Type, 
  Image as ImageIcon, 
  Video,
  Layout as LayoutIcon,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/apiClient';
import { cn } from '../lib/utils';

const gridPatterns = [
  { id: 'checkerboard', name: 'Checkerboard', description: 'Alternate between photos and quotes' },
  { id: 'row', name: 'Row Theme', description: 'Each row tells a specific story' },
  { id: 'puzzle', name: 'Puzzle Layout', description: 'Images connect across tiles' },
  { id: 'alternate', name: 'Quote + Reel', description: 'Alternate reels and static quotes' },
];

export default function GridPlanner() {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = React.useState('');
  const [gridPlans, setGridPlans] = React.useState<any[]>([]);
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
            setGridPlans(audit.gridPlans || []);
          } else {
            setGridPlans([]);
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
          <h1 className="text-3xl font-bold text-slate-900">Instagram Grid Planner</h1>
          <p className="text-slate-500 mt-1">Visualize your feed before you post.</p>
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
      ) : gridPlans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {gridPlans.map((plan, pi) => (
            <div key={pi} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">{plan.name}</h3>
              <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-200 max-w-md mx-auto">
                <div className="aspect-square grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl overflow-hidden">
                  {plan.posts.map((post: any, i: number) => (
                    <div 
                      key={i} 
                      className="aspect-square relative group cursor-pointer overflow-hidden"
                      style={{ backgroundColor: post.colorStyle || '#f1f5f9' }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                        {post.type.toLowerCase().includes('reel') ? (
                          <Video className="text-slate-400/50 mb-1" size={16} />
                        ) : (
                          <ImageIcon className="text-slate-400/50 mb-1" size={16} />
                        )}
                        <p className="text-[8px] font-bold text-slate-900 leading-tight uppercase tracking-tighter line-clamp-2">
                          {post.headline}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-white">
                        <p className="text-[8px] font-bold text-indigo-400 mb-1">{post.visualTheme}</p>
                        <p className="text-[8px] text-center leading-tight">{post.layout}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-4">
          <Grid3X3 className="mx-auto text-slate-300" size={48} />
          <div>
            <h3 className="text-lg font-bold text-slate-900">No grid plans found</h3>
            <p className="text-slate-500 text-sm">Run an audit first to generate AI-powered grid plans.</p>
          </div>
        </div>
      )}
    </div>
  );
}

```

```

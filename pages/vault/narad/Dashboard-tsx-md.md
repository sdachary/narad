---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/Dashboard-tsx.md"
project: "narad"
role: utility
language: markdown
frameworks: [react]
lines: 207
size: 7495 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [documentation, markdown, project/narad, react, utility]
---

# Dashboard-tsx.md

> Utility / helper module using **react** (207 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/Dashboard-tsx.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | react |
| **Lines** | 207 |
| **Size** | 7495 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Dashboard.tsx"
project: "social-blueprint-ai"
role: component
language: tsx
frameworks: [react]
lines: 167
size: 6715 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, component, project/social-blueprint-ai, react, tsx]
---

# Dashboard.tsx

> UI component using **react** (167 lines).

**Key exports:** `Dashboard`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Dashboard.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react |
| **Lines** | 167 |
| **Size** | 6715 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

[[apiClient-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Plus,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient';

const platformIcons = {
  Instagram: Instagram,
  LinkedIn: Linkedin,
  X: Twitter,
  YouTube: Youtube,
};

export default function Dashboard() {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    apiFetch('/api/profiles')
      .then(data => {
        setProfiles(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Manage your social media presence with AI.</p>
        </div>
        <Link 
          to="/audit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Profiles</p>
              <h3 className="text-2xl font-bold text-slate-900">{profiles.length}</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg. Engagement</p>
              <h3 className="text-2xl font-bold text-slate-900">4.8%</h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Audits</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Profiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl" />
            ))
          ) : profiles.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No profiles added yet</h3>
              <p className="text-slate-500 mt-1 max-w-xs">Add your first social media profile to start analyzing your brand.</p>
              <Link 
                to="/audit"
                className="mt-6 text-indigo-600 font-medium flex items-center gap-2 hover:gap-3 transition-all"
              >
                Get Started <ArrowRight size={20} />
              </Link>
            </div>
          ) : (
            profiles.map((profile, i) => {
              const Icon = platformIcons[profile.platform as keyof typeof platformIcons] || Instagram;
              return (
                <motion.div 
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{profile.platform}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">@{profile.handle}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Followers</p>
                      <p className="text-sm font-bold text-slate-900">{(profile.followers / 1000).toFixed(1)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Engagement</p>
                      <p className="text-sm font-bold text-slate-900">{profile.engagement_rate}%</p>
                    </div>
                  </div>
                  <Link 
                    to={`/audit?id=${profile.id}`}
                    className="mt-6 w-full py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    View Audit <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

```

```

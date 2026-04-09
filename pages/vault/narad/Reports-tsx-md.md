---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/Reports-tsx.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 173
size: 6871 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Reports-tsx.md

> Configuration file for the project using **react, typescript** (173 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/Reports-tsx.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 173 |
| **Size** | 6871 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Reports.tsx"
project: "social-blueprint-ai"
role: config
language: tsx
frameworks: [react, typescript]
lines: 133
size: 6026 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, config, project/social-blueprint-ai, react, tsx, typescript]
---

# Reports.tsx

> Configuration file for the project using **react, typescript** (133 lines).

**Key exports:** `Reports`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Reports.tsx` |
| **Role** | config |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 133 |
| **Size** | 6026 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[apiClient-ts]], [[pdf-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ExternalLink,
  Search,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiFetch } from '../lib/apiClient';
import { generatePDF } from '../lib/pdf';

export default function Reports() {
  const [reports, setReports] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // In a real app, we'd fetch all audits for the user
    apiFetch('/api/profiles')
      .then(async (profiles) => {
        const audits = await Promise.all(profiles.map(async (p: any) => {
          const audit = await apiFetch(`/api/audits/${p.id}`).catch(() => null);
          return audit ? { ...audit, profile: p } : { profile: p };
        }));
        setReports(audits.filter(a => a.id));
        setLoading(false);
      });
  }, []);

  const handleDownload = async (id: string, handle: string) => {
    // This is a simplified version - in real app we'd render the report off-screen or fetch the data
    alert('Generating report for @' + handle);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analysis Reports</h1>
        <p className="text-slate-500 mt-1">Access and download your previous profile audits and strategies.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={4} className="px-6 py-4 h-16 bg-slate-50/50"></td>
                </tr>
              ))
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={40} className="text-slate-200" />
                    <p>No reports found. Run your first audit to see it here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                        {report.profile.handle[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900">@{report.profile.handle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{report.profile.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleDownload(report.id, report.profile.handle)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      title="View Online"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-600 p-8 rounded-3xl text-white space-y-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Need a custom report?</h3>
            <p className="text-indigo-100 text-sm">Our agency plan allows you to generate white-labeled reports with your own branding.</p>
            <button className="mt-6 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
              Upgrade to Agency
            </button>
          </div>
          <FileText className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Automated Audits</h3>
          <p className="text-slate-500 text-sm">Schedule weekly or monthly audits to track your brand growth automatically.</p>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm cursor-pointer hover:gap-3 transition-all">
            Configure Schedule <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

```

```

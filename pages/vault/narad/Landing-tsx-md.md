---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/Landing-tsx.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 181
size: 7767 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# Landing-tsx.md

> Service / API client module (181 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/Landing-tsx.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 181 |
| **Size** | 7767 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Landing.tsx"
project: "social-blueprint-ai"
role: service
language: tsx
frameworks: []
lines: 141
size: 7029 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, project/social-blueprint-ai, service, tsx]
---

# Landing.tsx

> Service / API client module (141 lines).

**Key exports:** `Landing`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Landing.tsx` |
| **Role** | service |
| **Language** | tsx |
| **Frameworks** | — |
| **Lines** | 141 |
| **Size** | 7029 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```tsx
import { ArrowRight, Zap, Target, Grid3X3, Palette, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Target size={28} />
          Social Media Manager AI
        </div>
        <div className="flex items-center gap-8">
          <Link to="/pricing" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 py-24 text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold"
        >
          <Zap size={16} />
          The Future of Social Strategy is AI
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold text-slate-900 tracking-tight max-w-4xl mx-auto"
        >
          Your AI-Powered <span className="text-indigo-600">Social Media</span> Manager
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 max-w-2xl mx-auto"
        >
          Audit your profiles, generate 30-day strategies, plan your grid, and build your brand kit in seconds.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/login" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all">
            Start Free Audit
          </Link>
          <Link to="/pricing" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            View Pricing
          </Link>
        </motion.div>
      </header>

      {/* Features */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">AI Profile Audit</h3>
              <p className="text-slate-500">Deep-dive analysis of your positioning, engagement, and content pillars detected by Gemini AI.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">30-Day Strategy</h3>
              <p className="text-slate-500">Custom content calendars, viral hooks, and caption templates tailored to your brand goals.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center">
                <Grid3X3 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Grid Planner</h3>
              <p className="text-slate-500">Visualize your Instagram feed with smart patterns like checkerboard, row theme, and puzzle layouts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-3xl font-bold text-slate-900">Trusted by 500+ Digital Marketers</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            <div className="font-bold text-2xl">INSTAFLOW</div>
            <div className="font-bold text-2xl">MARKETLY</div>
            <div className="font-bold text-2xl">CREATORHUB</div>
            <div className="font-bold text-2xl">BRANDWISE</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold relative z-10">Stop Guessing. Start Growing.</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto relative z-10">
            Join hundreds of brands using Social Media Manager AI to scale their social presence with data-driven intelligence.
          </p>
          <div className="relative z-10 pt-4">
            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all">
              Get Started Now <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 text-slate-400 font-bold">
          <Target size={20} />
          Social Media Manager AI
        </div>
        <div className="flex gap-8 text-slate-500 text-sm font-medium">
          <Link to="#" className="hover:text-indigo-600">Privacy Policy</Link>
          <Link to="#" className="hover:text-indigo-600">Terms of Service</Link>
          <Link to="#" className="hover:text-indigo-600">Contact</Link>
        </div>
        <div className="text-slate-400 text-sm">
          © 2026 Social Media Manager AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

```

```

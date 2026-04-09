---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Audit.tsx"
project: "social-blueprint-ai"
role: service
language: tsx
frameworks: [react, typescript]
lines: 713
size: 35632 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, project/social-blueprint-ai, react, service, tsx, typescript]
---

# Audit.tsx

> Service / API client module using **react, typescript** (713 lines).

**Key exports:** `Audit`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Audit.tsx` |
| **Role** | service |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 713 |
| **Size** | 35632 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[apiClient-ts]], [[geminiService-ts]], [[pdf-ts]]

## 📄 Content

```tsx
import React from 'react';
import { 
  Search, 
  Upload, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  ArrowRight,
  Loader2,
  Video,
  Layout,
  Palette,
  ExternalLink,
  Download,
  Link as LinkIcon,
  Globe,
  Calendar,
  MousePointer2,
  FileText,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  MessageSquare,
  Ghost
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeProfile } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useSearchParams } from 'react-router-dom';
import { generatePDF } from '../lib/pdf';
import { apiFetch } from '../lib/apiClient';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PLATFORMS = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { name: 'Pinterest', icon: Globe, color: 'text-red-500' },
  { name: 'Reddit', icon: MessageSquare, color: 'text-orange-600' },
  { name: 'X', icon: Twitter, color: 'text-slate-900' },
  { name: 'Snapchat', icon: Ghost, color: 'text-yellow-500' },
];

export default function Audit() {
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get('id');

  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    platform: 'Instagram',
    profileUrl: '',
    dataMethod: 'manual', // 'manual', 'csv', 'oauth'
    handle: '',
    bio: '',
    followers: '',
    following: '',
    totalPosts: '',
    engagementRate: '',
    lastCaptions: '',
    avgLikes: '',
    avgComments: '',
    reelViews: '',
  });
  const [auditResult, setAuditResult] = React.useState<any>(null);

  React.useEffect(() => {
    if (profileId) {
      setLoading(true);
      apiFetch(`/api/audits/${profileId}`)
        .then(data => {
          if (data && data.data) {
            setAuditResult(JSON.parse(data.data));
            setStep(2);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load audit:', err);
          setLoading(false);
        });
    }
  }, [profileId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert('CSV Uploaded: ' + file.name + '. Data will be parsed and filled.');
      // In a real app, parse CSV here
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await apiFetch('/api/profiles', {
        method: 'POST',
        body: JSON.stringify({
          platform: formData.platform,
          handle: formData.handle,
          profile_url: formData.profileUrl,
          followers: parseInt(formData.followers) || 0,
          following: parseInt(formData.following) || 0,
          total_posts: parseInt(formData.totalPosts) || 0,
          engagement_rate: parseFloat(formData.engagementRate) || 0,
        })
      });
      
      const result = await analyzeProfile(formData.platform, formData.handle, formData);
      if (!result || Object.keys(result).length === 0) {
        throw new Error('AI Analysis failed. Please check your API key and try again.');
      }
      setAuditResult(result);

      await apiFetch('/api/audits', {
        method: 'POST',
        body: JSON.stringify({
          profileId: profileData.id,
          data: result
        })
      });

      setStep(2);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setTimeout(async () => {
      await generatePDF('audit-report', 'social-media-audit');
      setExporting(false);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Social Media Manager AI</h1>
          <p className="text-slate-500">Your AI-powered growth strategist and brand consultant.</p>
        </div>
        {step === 2 && (
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
          >
            {exporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
          >
            <form onSubmit={handleAnalyze} className="space-y-8">
              {/* Platform Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. Select Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, platform: p.name })}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        formData.platform === p.name 
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <p.icon className={p.color} size={24} />
                      <span className="text-xs font-bold text-slate-700">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Profile URL */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. Profile URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="url"
                    required
                    placeholder={`https://www.${formData.platform.toLowerCase()}.com/username`}
                    className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.profileUrl}
                    onChange={(e) => setFormData({...formData, profileUrl: e.target.value})}
                  />
                </div>
              </div>

              {/* Data Method */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">3. Choose Data Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dataMethod: 'oauth' })}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.dataMethod === 'oauth' 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <Zap className="text-amber-500" size={20} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">OAuth Login</p>
                      <p className="text-[10px] text-slate-500">Fast & Secure (API)</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dataMethod: 'csv' })}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.dataMethod === 'csv' 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <Upload className="text-indigo-600" size={20} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Upload CSV</p>
                      <p className="text-[10px] text-slate-500">Insights Export</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, dataMethod: 'manual' })}
                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.dataMethod === 'manual' 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <FileText className="text-emerald-600" size={20} />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-900">Manual Entry</p>
                      <p className="text-[10px] text-slate-500">Fill form fields</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Conditional Forms */}
              <AnimatePresence mode="wait">
                {formData.dataMethod === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Handle / Username</label>
                      <input 
                        type="text"
                        required
                        placeholder="username"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.handle}
                        onChange={(e) => setFormData({...formData, handle: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Followers</label>
                      <input 
                        type="number"
                        required
                        placeholder="e.g. 12500"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.followers}
                        onChange={(e) => setFormData({...formData, followers: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700">Current Bio</label>
                      <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Avg. Likes</label>
                      <input 
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.avgLikes}
                        onChange={(e) => setFormData({...formData, avgLikes: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Avg. Comments</label>
                      <input 
                        type="number"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.avgComments}
                        onChange={(e) => setFormData({...formData, avgComments: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}

                {formData.dataMethod === 'csv' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-slate-100"
                  >
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 bg-slate-50">
                      <Upload className="text-slate-400" size={48} />
                      <div className="text-center">
                        <p className="font-bold text-slate-900">Drop your {formData.platform} Insights CSV here</p>
                        <p className="text-sm text-slate-500">or click to browse files</p>
                      </div>
                      <input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={handleFileUpload} />
                      <label htmlFor="csv-upload" className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold cursor-pointer hover:bg-slate-100 transition-all">
                        Select File
                      </label>
                    </div>
                  </motion.div>
                )}

                {formData.dataMethod === 'oauth' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-slate-100"
                  >
                    <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-6 text-white">
                      <div className="flex items-center gap-4">
                        {React.createElement(PLATFORMS.find(p => p.name === formData.platform)?.icon || Instagram, { size: 40 })}
                        <div className="h-8 w-[1px] bg-white/20" />
                        <Zap className="text-amber-400" size={40} />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold">Connect your {formData.platform} Account</h3>
                        <p className="text-slate-400 text-sm max-w-md">We'll use official APIs to fetch your latest performance data securely. No password required.</p>
                      </div>
                      <button type="button" className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
                        Login with {formData.platform}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6">
                {error && (
                  <div className="mb-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      AI Analyst is working...
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      Run Full AI Analysis
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            id="audit-report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Tabs Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sticky top-0 bg-slate-50 z-10 py-4">
              {['Audit', 'Strategy', 'Grid', 'Brand Kit'].map((tab) => (
                <button
                  key={tab}
                  className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 whitespace-nowrap shadow-sm"
                  onClick={() => {
                    const el = document.getElementById(tab.toLowerCase().replace(' ', '-'));
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SECTION 1: AUDIT */}
            <section id="audit" className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <BarChart3 size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Profile Audit</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Positioning Analysis</h3>
                    <p className="text-slate-700 leading-relaxed">{auditResult.audit.positioning}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Content Pillars</h3>
                      <div className="flex flex-wrap gap-2">
                        {auditResult.audit.contentPillars.map((p: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Best Format</h3>
                      <p className="text-slate-900 font-bold">{auditResult.audit.bestFormat}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Bio Optimization</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">Professional</span>
                      <p className="text-xs text-slate-700 italic p-3 bg-slate-50 rounded-xl border border-slate-100">"{auditResult.bioOptimizations.professional}"</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">Authority</span>
                      <p className="text-xs text-slate-700 italic p-3 bg-slate-50 rounded-xl border border-slate-100">"{auditResult.bioOptimizations.authority}"</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Conversion</span>
                      <p className="text-xs text-slate-700 italic p-3 bg-slate-50 rounded-xl border border-slate-100">"{auditResult.bioOptimizations.conversion}"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-3">
                  <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Strengths
                  </h3>
                  <ul className="space-y-2">
                    {auditResult.audit.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 space-y-3">
                  <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                    <AlertCircle size={18} /> Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {auditResult.audit.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="text-xs text-rose-800 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-3">
                  <h3 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                    <Zap size={18} /> Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {auditResult.audit.opportunities.map((o: string, i: number) => (
                      <li key={i} className="text-xs text-indigo-800 flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* SECTION 2: STRATEGY */}
            <section id="strategy" className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Zap size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Content Strategy</h2>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="text-indigo-600" size={20} />
                  30-Day Posting Calendar
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {auditResult.strategy.calendar30Day.map((day: any) => (
                    <div key={day.day} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">DAY {day.day}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          day.type.toLowerCase().includes('reel') ? 'bg-pink-100 text-pink-600' :
                          day.type.toLowerCase().includes('carousel') ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-200 text-slate-600'
                        }`}>{day.type}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-700 line-clamp-3">{day.topic}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Video className="text-pink-600" size={20} />
                    Reel Concepts
                  </h3>
                  <div className="space-y-4">
                    {auditResult.strategy.reelConcepts.map((reel: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <h4 className="text-sm font-bold text-slate-900">{reel.title}</h4>
                        <p className="text-xs text-indigo-600 font-bold">Hook: {reel.hook}</p>
                        <p className="text-[10px] text-slate-500">{reel.visual}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Layout className="text-blue-600" size={20} />
                    Carousel Frameworks
                  </h3>
                  <div className="space-y-3">
                    {auditResult.strategy.carouselFrameworks.map((cf: string, i: number) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">{i+1}</div>
                        {cf}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: GRID PLAN */}
            <section id="grid" className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                  <Layout size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Instagram Grid Visual Plan</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {auditResult.gridPlans.map((plan: any, pi: number) => (
                  <div key={pi} className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">{plan.name}</h3>
                    <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl aspect-square">
                      {plan.posts.map((post: any, i: number) => (
                        <div 
                          key={i} 
                          className="relative group aspect-square bg-white rounded-sm overflow-hidden cursor-help"
                          style={{ backgroundColor: post.colorStyle }}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                            <span className="text-[8px] font-bold uppercase opacity-30 mb-1">{post.type}</span>
                            <p className="text-[9px] font-bold leading-tight">{post.headline}</p>
                          </div>
                          <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-all p-3 flex flex-col justify-center text-white">
                            <p className="text-[8px] font-bold text-indigo-400 mb-1">{post.visualTheme}</p>
                            <p className="text-[8px] leading-tight">{post.layout}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: BRAND KIT */}
            <section id="brand-kit" className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <Palette size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Brand Kit Generator</h2>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Brand Positioning</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">{auditResult.brandKit.positioning}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mission</h3>
                      <p className="text-xs text-slate-600">{auditResult.brandKit.mission}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Vision</h3>
                      <p className="text-xs text-slate-600">{auditResult.brandKit.vision}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tone of Voice</h3>
                    <p className="text-sm font-bold text-slate-900">{auditResult.brandKit.tone}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Color Palette</h3>
                    <div className="flex gap-4">
                      {auditResult.brandKit.colors.map((color: string, i: number) => (
                        <div key={i} className="space-y-2">
                          <div className="w-16 h-16 rounded-2xl shadow-inner border border-black/5" style={{ backgroundColor: color }} />
                          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter">{color}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Typography</h3>
                    <div className="space-y-2">
                      {auditResult.brandKit.fonts.map((font: string, i: number) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-lg font-bold text-slate-900" style={{ fontFamily: font }}>{font}</p>
                          <p className="text-[10px] text-slate-400">The quick brown fox jumps over the lazy dog</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Visual Direction</h3>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{auditResult.brandKit.visualDirection}"</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hashtag Bank</h3>
                  <div className="flex flex-wrap gap-2">
                    {auditResult.brandKit.hashtags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs text-indigo-600 font-medium">#{tag.replace('#', '')}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Brand Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {auditResult.brandKit.keywords.map((word: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{word}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center pt-12">
              <button 
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                <ArrowRight className="rotate-180" size={20} /> Start New Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

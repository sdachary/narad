---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/page-fa1a24a5040f11a5-js-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, react]
lines: 76
size: 14446 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, docs, documentation, markdown, project/narad, react]
---

# page-fa1a24a5040f11a5-js-md.md

> Documentation using **docker, react** (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/page-fa1a24a5040f11a5-js-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, react |
| **Lines** | 76 |
| **Size** | 14446 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/page-fa1a24a5040f11a5-js.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, react]
lines: 38
size: 13659 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, docs, documentation, markdown, project/narad, react]
---

# page-fa1a24a5040f11a5-js.md

> Documentation using **docker, react** (38 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/page-fa1a24a5040f11a5-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, react |
| **Lines** | 38 |
| **Size** | 13659 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/unnati/.vercel/output/static/_next/static/chunks/app/page-fa1a24a5040f11a5.js"
project: "unnati"
role: other
language: javascript
frameworks: [docker, react]
lines: 1
size: 12847 bytes
last_modified: "2026-04-07 17:52"
scanned: "2026-04-07 17:53"
tags: [code, docker, javascript, other, project/unnati, react]
---

# page-fa1a24a5040f11a5.js

> Project file using **docker, react** (1 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/static/_next/static/chunks/app/page-fa1a24a5040f11a5.js` |
| **Role** | other |
| **Language** | javascript |
| **Frameworks** | docker, react |
| **Lines** | 1 |
| **Size** | 12847 bytes |
| **Modified** | 2026-04-07 17:52 |

## 🔗 Related Files

—

## 📄 Content

```javascript
(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{169:(e,t,s)=>{Promise.resolve().then(s.bind(s,9547))},9547:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>f});var a=s(5155),l=s(2115),r=s(2544),i=s(6942),n=s(4879),o=s(9715),c=s(9633),d=s(2529),m=s(1786),x=s(6983),h=s(7828),p=s(8874);let u=n.Ik({companyName:n.Yj().min(1,"Company name is required"),jobTitle:n.Yj().min(1,"Job title is required"),jobUrl:n.Yj().url().optional().or(n.eu("")),coverLetter:n.Yj().optional(),notes:n.Yj().optional()}),b={FOUND:"bg-amber-100 text-amber-800",APPLIED:"bg-blue-100 text-blue-800",VIEWED:"bg-yellow-100 text-yellow-800",INTERVIEW:"bg-purple-100 text-purple-800",OFFER:"bg-green-100 text-green-800",REJECTED:"bg-red-100 text-red-800"},w={FOUND:(0,a.jsx)(o.A,{className:"w-4 h-4"}),APPLIED:(0,a.jsx)(x.A,{className:"w-4 h-4"}),VIEWED:(0,a.jsx)(h.A,{className:"w-4 h-4"}),INTERVIEW:(0,a.jsx)(c.A,{className:"w-4 h-4"}),OFFER:(0,a.jsx)(d.A,{className:"w-4 h-4"}),REJECTED:(0,a.jsx)(p.A,{className:"w-4 h-4"})};function f(){let[e,t]=(0,l.useState)([]),[s,n]=(0,l.useState)("apply"),[x,h]=(0,l.useState)(null),[p,f]=(0,l.useState)(!1),[j,g]=(0,l.useState)(!1),[N,y]=(0,l.useState)(!1),[v,E]=(0,l.useState)(!1),[A,k]=(0,l.useState)("");(0,l.useEffect)(()=>{(async()=>{try{let e=await fetch("/api/profile"),t=await e.json();t.profile&&(y(t.profile.is_active),k(t.profile.resume_url)),C()}catch(e){console.error("Profile init error:",e)}})()},[]);let S=async()=>{if(A){E(!0);try{await fetch("/api/jobs/search",{method:"POST",body:JSON.stringify({resumeUrl:A})}),C()}catch(e){console.error("Discovery error:",e)}finally{E(!1)}}},{register:T,handleSubmit:P,reset:D,formState:{errors:I}}=(0,r.mN)({resolver:(0,i.u)(u)}),C=async()=>{try{let e=await fetch("/api/applications"),s=await e.json();t(s)}catch(e){console.error("Failed to fetch applications:",e)}},O=async e=>{g(!0);try{let t=null;if(x){f(!0);let e=new FormData;e.append("file",x);let s=await fetch("/api/resume/upload",{method:"POST",body:e});t=(await s.json()).url,f(!1)}await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...e,resumeUrl:t,status:"APPLIED"})}),D(),h(null),n("track"),C()}catch(e){console.error("Failed to submit application:",e)}finally{g(!1)}};return(0,a.jsxs)("div",{className:"min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",children:[(0,a.jsx)("header",{className:"border-b border-white/10 bg-white/5 backdrop-blur-xl",children:(0,a.jsxs)("div",{className:"max-w-6xl mx-auto px-6 py-4 flex items-center justify-between",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsx)("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center",children:(0,a.jsx)("span",{className:"text-white font-bold text-lg",children:"उ"})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h1",{className:"text-xl font-bold text-white",children:"Unnati"}),(0,a.jsx)("p",{className:"text-xs text-white/60",children:"Career Acceleration Platform"})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10",children:[(0,a.jsx)("span",{className:"text-xs font-medium text-white/70",children:"Automatic Hunt"}),(0,a.jsx)("button",{onClick:async()=>{let e=!N;y(e),await fetch("/api/hunt/toggle",{method:"POST",body:JSON.stringify({resumeUrl:A,active:e})})},className:"relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ".concat(N?"bg-green-500":"bg-slate-600"),children:(0,a.jsx)("span",{className:"inline-block h-3 w-3 transform rounded-full bg-white transition-transform ".concat(N?"translate-x-6":"translate-x-1")})})]}),(0,a.jsxs)("nav",{className:"flex gap-1 bg-white/10 rounded-lg p-1",children:[(0,a.jsx)("button",{onClick:()=>n("apply"),className:"px-4 py-2 rounded-md text-sm font-medium transition-all ".concat("apply"===s?"bg-white text-purple-900 shadow-lg":"text-white/70 hover:text-white"),children:"Apply"}),(0,a.jsx)("button",{onClick:()=>{n("track"),C()},className:"px-4 py-2 rounded-md text-sm font-medium transition-all ".concat("track"===s?"bg-white text-purple-900 shadow-lg":"text-white/70 hover:text-white"),children:"Track"})]})]})]})}),(0,a.jsx)("main",{className:"max-w-6xl mx-auto px-6 py-8",children:"apply"===s?(0,a.jsxs)("div",{className:"grid lg:grid-cols-2 gap-8",children:[(0,a.jsxs)("div",{className:"bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-white mb-6",children:"New Application"}),(0,a.jsxs)("form",{onSubmit:P(O),className:"space-y-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Company Name *"}),(0,a.jsx)("input",{...T("companyName"),className:"w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50",placeholder:"e.g., Google, Microsoft"}),I.companyName&&(0,a.jsx)("p",{className:"text-red-400 text-sm mt-1",children:I.companyName.message})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Job Title *"}),(0,a.jsx)("input",{...T("jobTitle"),className:"w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50",placeholder:"e.g., Senior Software Engineer"}),I.jobTitle&&(0,a.jsx)("p",{className:"text-red-400 text-sm mt-1",children:I.jobTitle.message})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Job URL"}),(0,a.jsx)("input",{...T("jobUrl"),className:"w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50",placeholder:"https://..."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Resume"}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("input",{type:"file",accept:".pdf,.doc,.docx",onChange:e=>{var t;return h((null==(t=e.target.files)?void 0:t[0])||null)},className:"hidden",id:"resume-upload"}),(0,a.jsxs)("label",{htmlFor:"resume-upload",className:"flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 border-dashed text-white/70 hover:bg-white/20 hover:text-white cursor-pointer transition-all",children:[(0,a.jsx)(m.A,{className:"w-5 h-5"}),x?x.name:"Upload Resume (PDF, DOC)"]})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Cover Letter"}),(0,a.jsx)("textarea",{...T("coverLetter"),rows:4,className:"w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none",placeholder:"Brief cover letter or notes..."})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-white/80 mb-1",children:"Notes"}),(0,a.jsx)("textarea",{...T("notes"),rows:3,className:"w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none",placeholder:"Additional notes..."})]}),(0,a.jsx)("button",{type:"submit",disabled:j||p,className:"w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed",children:j||p?"Submitting...":"Submit Application"})]})]}),(0,a.jsxs)("div",{className:"space-y-6",children:[(0,a.jsxs)("div",{className:"bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6",children:[(0,a.jsx)("h3",{className:"text-lg font-semibold text-white mb-4",children:"Why Unnati?"}),(0,a.jsxs)("ul",{className:"space-y-3 text-white/70",children:[(0,a.jsxs)("li",{className:"flex items-start gap-2",children:[(0,a.jsx)(d.A,{className:"w-5 h-5 text-green-400 mt-0.5"}),"Track all your job applications in one place"]}),(0,a.jsxs)("li",{className:"flex items-start gap-2",children:[(0,a.jsx)(d.A,{className:"w-5 h-5 text-green-400 mt-0.5"}),"Upload and manage resumes per application"]}),(0,a.jsxs)("li",{className:"flex items-start gap-2",children:[(0,a.jsx)(d.A,{className:"w-5 h-5 text-green-400 mt-0.5"}),"Track status from Applied to Offer"]}),(0,a.jsxs)("li",{className:"flex items-start gap-2",children:[(0,a.jsx)(d.A,{className:"w-5 h-5 text-green-400 mt-0.5"}),"Integrated with career-ops for AI-powered applications"]})]})]}),(0,a.jsxs)("div",{className:"bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,a.jsx)("h3",{className:"text-lg font-semibold text-white",children:"Hunt Progress"}),(0,a.jsx)("button",{onClick:S,disabled:!N||v,className:"text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50",children:v?"Searching...":"Scan Now"})]}),(0,a.jsxs)("div",{className:"space-y-3",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,a.jsx)("span",{className:"text-white/60",children:"Jobs Found Today"}),(0,a.jsx)("span",{className:"text-white font-medium",children:e.filter(e=>"Found"===e.status).length})]}),(0,a.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,a.jsx)("span",{className:"text-white/60",children:"Hunt Sensitivity"}),(0,a.jsx)("span",{className:"text-white font-medium",children:"Balanced"})]}),(0,a.jsxs)("div",{className:"mt-4 pt-4 border-t border-white/5",children:[(0,a.jsx)("p",{className:"text-[10px] text-white/40 uppercase tracking-wider mb-2",children:"Automation Status"}),(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsx)("div",{className:"w-2 h-2 rounded-full ".concat(N?"bg-green-500 animate-pulse":"bg-slate-500")}),(0,a.jsx)("span",{className:"text-sm text-white/70 font-medium",children:N?"Monitoring Job Boards...":"Automation Paused"})]})]})]})]}),(0,a.jsxs)("div",{className:"bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 p-6",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[(0,a.jsx)(o.A,{className:"w-6 h-6 text-amber-400"}),(0,a.jsx)("h3",{className:"text-lg font-semibold text-white",children:"Pro Tip"})]}),(0,a.jsx)("p",{className:"text-white/70 text-sm",children:"Use the career-ops integration to auto-fill application forms with AI. Your data stays local and secure."})]})]})]}):(0,a.jsxs)("div",{className:"bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6",children:[(0,a.jsxs)("div",{className:"flex items-center justify-between mb-6",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-white",children:"Your Applications"}),(0,a.jsx)("div",{className:"flex gap-2",children:["APPLIED","VIEWED","INTERVIEW","OFFER","REJECTED"].map(e=>(0,a.jsx)("span",{className:"px-3 py-1 rounded-full text-xs font-medium ".concat(b[e]),children:e},e))})]}),0===e.length?(0,a.jsxs)("div",{className:"text-center py-12",children:[(0,a.jsx)(c.A,{className:"w-16 h-16 text-white/30 mx-auto mb-4"}),(0,a.jsx)("p",{className:"text-white/60 text-lg",children:"No applications yet"}),(0,a.jsx)("p",{className:"text-white/40 text-sm",children:"Start applying to see your progress here"})]}):(0,a.jsx)("div",{className:"space-y-3",children:e.map(e=>(0,a.jsxs)("div",{className:"flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsx)("div",{className:"w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center",children:(0,a.jsx)("span",{className:"text-white font-semibold",children:e.companyName.charAt(0)})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h4",{className:"text-white font-medium",children:e.jobTitle}),(0,a.jsx)("p",{className:"text-white/60 text-sm",children:e.companyName})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[(0,a.jsxs)("span",{className:"px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ".concat(b[e.status]),children:[w[e.status],e.status]}),(0,a.jsx)("span",{className:"text-white/40 text-sm",children:new Date(e.appliedAt).toLocaleDateString()})]})]},e.id))})]})})]})}}},e=>{e.O(0,[275,441,255,358],()=>e(e.s=169)),_N_E=e.O()}]);
```

```

```

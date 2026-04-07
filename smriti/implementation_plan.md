# Unnati V1: Refined Implementation Plan

This document outlines the current state and remaining steps for **Unnati**, the zero-cost AI Job Hunter.

## 🏗️ Architecture Overview

| Component | Provider | Purpose | Status |
| :--- | :--- | :--- | :--- |
| **Frontend/API** | **Cloudflare Pages** | UI, Dashboard, and Edge Logic | **ACTIVE** |
| **Database/Storage** | **Supabase** | Permanent state & Resume storage | **ACTIVE** |
| **Intelligence (AI)** | **OpenRouter** | Resume Parsing & Cover Letters (Gemini) | **IMPLEMENTED** |
| **Runner (Automation)** | **Hugging Face** | Playwright (Browser) based "Apply" engine | **TEMPLATE READY** |

---

## 🛠️ Implementation Progress

### ✅ Phase 1: The "Brain" (Completed)
- [x] **Supabase Client**: Server-side client logic integrated.
- [x] **AI Analysis API**: `api/career-ops` connected to **OpenRouter**.
- [x] **Resume Parsing**: Gemini (via OpenRouter) extracts skills and professional bio.
- [x] **User Profile**: Form-based profile management implemented.

### ✅ Phase 2: The "Hunt" (Completed)
- [x] **Job Search API**: Integrated **Adzuna** API.
- [x] **Database Sync**: Found jobs are saved into the `applications` table in Supabase.
- [x] **Application Tracking**: Dashboard logic for `Found`, `Pending`, `Applying`, and `Applied`.

### 🚧 Phase 3: The "Executor" (Pending Deployment)
- [x] **Docker Setup**: `Dockerfile` for Hugging Face Spaces created.
- [x] **Playwright Agent**: `worker.js` script created to poll Supabase and fill forms.
- [ ] **Deployment**: Final push to Hugging Face Spaces.
- [ ] **Site-Specific Logic**: Refine Playwright selectors for major job boards (LinkedIn, Indeed).

---

## 🚀 Next Steps

1. **Deploy Worker**: Push the `docker/` folder to Hugging Face Spaces.
2. **Environment Secrets**: Ensure `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, and `OPENROUTER_API_KEY` are set in Cloudflare and HF.
3. **Board-Specific Adapters**: Add specialized logic in `worker.js` for "Easy Apply" buttons on popular platforms.
4. **Monitoring Hub**: Finalize the dashboard UI to show real-time worker logs.

---

> [!TIP]
> **Status Check**: To verify the latest build, check the Cloudflare Pages dashboard. The `worker.js` can be tested locally using `node docker/worker.js`.

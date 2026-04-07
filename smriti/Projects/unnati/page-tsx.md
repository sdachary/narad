---
source: "/home/deepak/Work/unnati/src/app/page.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [docker, react, typescript]
lines: 431
size: 18516 bytes
last_modified: "2026-04-07 17:51"
scanned: "2026-04-07 17:52"
tags: [code, component, docker, project/unnati, react, tsx, typescript]
---

# page.tsx

> UI component using **docker, react, typescript** (431 lines).

**Key exports:** `Home`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/page.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | docker, react, typescript |
| **Lines** | 431 |
| **Size** | 18516 bytes |
| **Modified** | 2026-04-07 17:51 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText, CheckCircle, Briefcase } from "lucide-react";

const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobUrl: z.string().url().optional().or(z.literal("")),
  coverLetter: z.string().optional(),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const statusColors: Record<string, string> = {
  FOUND: "bg-amber-100 text-amber-800",
  APPLIED: "bg-blue-100 text-blue-800",
  VIEWED: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-purple-100 text-purple-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  FOUND: <FileText className="w-4 h-4" />,
  APPLIED: <Clock className="w-4 h-4" />,
  VIEWED: <Eye className="w-4 h-4" />,
  INTERVIEW: <Briefcase className="w-4 h-4" />,
  OFFER: <CheckCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
};

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string | null;
  status: string;
  appliedAt: string;
}

import { Clock, Eye, XCircle } from "lucide-react";

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<"apply" | "track">("apply");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isHuntActive, setIsHuntActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string>("");

  useEffect(() => {
    const initProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.profile) {
          setIsHuntActive(data.profile.is_active);
          setCurrentResumeUrl(data.profile.resume_url);
        }
        fetchApplications();
      } catch (err) {
        console.error("Profile init error:", err);
      }
    };
    initProfile();
  }, []);

  const handleSearchJobs = async () => {
    if (!currentResumeUrl) return;
    setIsSearching(true);
    try {
      await fetch("/api/jobs/search", {
        method: "POST",
        body: JSON.stringify({ resumeUrl: currentResumeUrl })
      });
      fetchApplications();
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setSubmitting(true);
    try {
      let resumeUrl = null;
      if (resumeFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", resumeFile);
        const uploadRes = await fetch("/api/resume/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        resumeUrl = uploadData.url;
        setUploading(false);
      }

      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, resumeUrl, status: "APPLIED" }),
      });

      reset();
      setResumeFile(null);
      setActiveTab("track");
      fetchApplications();
    } catch (error) {
      console.error("Failed to submit application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">उ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Unnati</h1>
              <p className="text-xs text-white/60">Career Acceleration Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Hunt Control Toggle */}
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 border border-white/10">
              <span className="text-xs font-medium text-white/70">Automatic Hunt</span>
              <button 
                onClick={async () => {
                  const newActive = !isHuntActive;
                  setIsHuntActive(newActive);
                  await fetch("/api/hunt/toggle", {
                    method: "POST",
                    body: JSON.stringify({ resumeUrl: currentResumeUrl, active: newActive })
                  });
                }}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${isHuntActive ? 'bg-green-500' : 'bg-slate-600'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isHuntActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <nav className="flex gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("apply")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "apply"
                    ? "bg-white text-purple-900 shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setActiveTab("track");
                  fetchApplications();
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "track"
                    ? "bg-white text-purple-900 shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Track
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === "apply" ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">New Application</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Company Name *
                  </label>
                  <input
                    {...register("companyName")}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="e.g., Google, Microsoft"
                  />
                  {errors.companyName && (
                    <p className="text-red-400 text-sm mt-1">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Job Title *
                  </label>
                  <input
                    {...register("jobTitle")}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.jobTitle && (
                    <p className="text-red-400 text-sm mt-1">{errors.jobTitle.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Job URL
                  </label>
                  <input
                    {...register("jobUrl")}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Resume
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 border-dashed text-white/70 hover:bg-white/20 hover:text-white cursor-pointer transition-all"
                    >
                      <Upload className="w-5 h-5" />
                      {resumeFile ? resumeFile.name : "Upload Resume (PDF, DOC)"}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    {...register("coverLetter")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                    placeholder="Brief cover letter or notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none"
                    placeholder="Additional notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting || uploading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Why Unnati?</h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    Track all your job applications in one place
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    Upload and manage resumes per application
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    Track status from Applied to Offer
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    Integrated with career-ops for AI-powered applications
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Hunt Progress</h3>
                  <button 
                    onClick={handleSearchJobs}
                    disabled={!isHuntActive || isSearching}
                    className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50"
                  >
                    {isSearching ? "Searching..." : "Scan Now"}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Jobs Found Today</span>
                    <span className="text-white font-medium">{applications.filter(a => a.status === 'Found').length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Hunt Sensitivity</span>
                    <span className="text-white font-medium">Balanced</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Automation Status</p>
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${isHuntActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                       <span className="text-sm text-white/70 font-medium">
                         {isHuntActive ? "Monitoring Job Boards..." : "Automation Paused"}
                       </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Pro Tip</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Use the career-ops integration to auto-fill application forms with AI.
                  Your data stays local and secure.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Applications</h2>
              <div className="flex gap-2">
                {["APPLIED", "VIEWED", "INTERVIEW", "OFFER", "REJECTED"].map((status) => (
                  <span
                    key={status}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                ))}
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-white/60 text-lg">No applications yet</p>
                <p className="text-white/40 text-sm">Start applying to see your progress here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {app.companyName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{app.jobTitle}</h4>
                        <p className="text-white/60 text-sm">{app.companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusColors[app.status]}`}>
                        {statusIcons[app.status]}
                        {app.status}
                      </span>
                      <span className="text-white/40 text-sm">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

```

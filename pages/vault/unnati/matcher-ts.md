---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/matcher.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [docker, typescript]
lines: 226
size: 6889 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, docker, project/unnati, typescript, utility]
---

# matcher.ts

> Utility / helper module using **docker, typescript** (226 lines).

**Key exports:** `calculateMatch`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/matcher.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 226 |
| **Size** | 6889 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export interface UserProfile {
  skills: string[];
  preferredRoles: string[];
  preferredLocation: string;
  companyTypes: string[];
  experienceLevel: string;
  sectors: string[];
}

export interface JobListing {
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  companyType?: string;
  experienceLevel?: string;
  sector?: string;
}

export interface MatchResult {
  overallScore: number;
  skillsScore: number;
  locationScore: number;
  experienceScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gaps: string[];
  recommendation: 'Strong Apply' | 'Good Fit' | 'Maybe' | 'Low Match';
}

const EXPERIENCE_LEVELS = [
  'intern',
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'principal',
  'director',
  'vp',
];

function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

function fuzzyMatch(a: string, b: string, threshold = 0.7): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  if (longer.length === 0) return true;

  const editDistance = (s1: string, s2: string): number => {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j - 1] + 1, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
        }
      }
    }
    return dp[m][n];
  };

  const distance = editDistance(na, nb);
  return (longer.length - distance) / longer.length >= threshold;
}

function getExperienceIndex(level: string): number {
  const normalized = normalize(level);
  const idx = EXPERIENCE_LEVELS.findIndex(l => normalized.includes(l));
  return idx >= 0 ? idx : 3;
}

function calculateRoleMatch(roles: string[], title: string, description: string): number {
  if (!roles.length) return 50;
  const text = `${title} ${description}`.toLowerCase();
  let matchCount = 0;
  for (const role of roles) {
    if (fuzzyMatch(role, title) || text.includes(normalize(role))) {
      matchCount++;
    }
  }
  return Math.round((matchCount / roles.length) * 100);
}

function calculateSkillsMatch(profileSkills: string[], requiredSkills: string[]): {
  score: number;
  matching: string[];
  missing: string[];
} {
  const matching: string[] = [];
  const missing: string[] = [];

  for (const req of requiredSkills) {
    const found = profileSkills.some(ps => fuzzyMatch(ps, req));
    if (found) {
      matching.push(req);
    } else {
      missing.push(req);
    }
  }

  const score = requiredSkills.length > 0
    ? Math.round((matching.length / requiredSkills.length) * 100)
    : 100;

  return { score, matching, missing };
}

function calculateLocationMatch(preferred: string, jobLocation: string): number {
  if (!preferred || !jobLocation) return 50;
  
  const normalizedPreferred = normalize(preferred);
  const normalizedJob = normalize(jobLocation);

  if (normalizedPreferred === normalizedJob) return 100;
  if (normalizedJob.includes(normalizedPreferred) || normalizedPreferred.includes(normalizedJob)) return 80;

  const remoteKeywords = ['remote', 'work from home', 'wfh'];
  const isRemote = remoteKeywords.some(k => normalizedJob.includes(k));
  if (isRemote) return 90;

  const jobWords = normalizedJob.split(/\s+/);
  for (const word of jobWords) {
    if (word.length > 3 && normalizedPreferred.includes(word)) return 75;
  }

  return 30;
}

function calculateExperienceMatch(profileLevel: string, jobLevel?: string): number {
  if (!profileLevel) return 50;
  if (!jobLevel) return 50;

  const profileIdx = getExperienceIndex(profileLevel);
  const jobIdx = getExperienceIndex(jobLevel);

  const diff = jobIdx - profileIdx;
  if (diff < 0) return 100;
  if (diff === 0) return 90;
  if (diff === 1) return 70;
  if (diff === 2) return 40;
  return 20;
}

function calculateCompanyTypeMatch(profileTypes: string[], jobType?: string): number {
  if (!profileTypes.length || !jobType) return 50;

  for (const pt of profileTypes) {
    if (fuzzyMatch(pt, jobType)) return 100;
  }
  return 30;
}

function calculateSectorMatch(profileSectors: string[], jobSector?: string): number {
  if (!profileSectors.length || !jobSector) return 50;

  for (const ps of profileSectors) {
    if (fuzzyMatch(ps, jobSector)) return 100;
  }
  return 30;
}

export function calculateMatch(profile: UserProfile, job: JobListing): MatchResult {
  const roleScore = calculateRoleMatch(profile.preferredRoles, job.title, job.description);
  const { score: skillsScore, matching: matchingSkills, missing: missingSkills } =
    calculateSkillsMatch(profile.skills, job.requiredSkills);
  const locationScore = calculateLocationMatch(profile.preferredLocation, job.location);
  const experienceScore = calculateExperienceMatch(profile.experienceLevel, job.experienceLevel);
  const companyScore = calculateCompanyTypeMatch(profile.companyTypes, job.companyType);
  const sectorScore = calculateSectorMatch(profile.sectors, job.sector);

  const weightedSkills = roleScore > 0 
    ? (skillsScore * 0.4 + roleScore * 0.2)
    : skillsScore * 0.6;
  const weightedLocation = locationScore * 0.2;
  const weightedExperience = experienceScore * 0.2;
  const weightedCompany = companyScore * 0.1;
  const weightedSector = sectorScore * 0.1;

  const overallScore = Math.round(
    weightedSkills + weightedLocation + weightedExperience + weightedCompany + weightedSector
  );

  const strengths: string[] = [];
  const gaps: string[] = [];

  if (skillsScore >= 70) strengths.push('Strong skills match');
  if (skillsScore < 50) gaps.push('Skills gap');
  if (locationScore >= 80) strengths.push('Great location fit');
  if (locationScore < 40) gaps.push('Location mismatch');
  if (experienceScore >= 70) strengths.push('Good experience match');
  if (experienceScore < 40) gaps.push('Experience level mismatch');
  if (companyScore >= 80) strengths.push('Preferred company type');
  if (sectorScore >= 80) strengths.push('Preferred sector');

  let recommendation: MatchResult['recommendation'];
  if (overallScore >= 80) recommendation = 'Strong Apply';
  else if (overallScore >= 60) recommendation = 'Good Fit';
  else if (overallScore >= 40) recommendation = 'Maybe';
  else recommendation = 'Low Match';

  return {
    overallScore,
    skillsScore,
    locationScore,
    experienceScore,
    matchingSkills,
    missingSkills,
    strengths,
    gaps,
    recommendation,
  };
}

```

---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/env.ts"
project: "unnati"
role: config
language: typescript
frameworks: [typescript]
lines: 192
size: 4282 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, project/unnati, typescript]
---

# env.ts

> Configuration file for the project using **typescript** (192 lines).

**Key exports:** `getEnvConfig`, `getEnv`, `validateEnvironment`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/env.ts` |
| **Role** | config |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 192 |
| **Size** | 4282 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
/**
 * Environment Variables Validation & Configuration
 * 
 * This module validates all required environment variables at startup
 * and provides a typed config object for the application.
 * 
 * @module env
 */

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

interface AIConfig {
  workersAi: {
    accountId: string;
    apiToken: string;
  };
  groq: {
    apiKey: string;
  };
  openrouter: {
    apiKey: string;
  };
}

interface JobApisConfig {
  adzuna: {
    appId: string;
    appKey: string;
  };
  serpapi: {
    apiKey: string;
  };
  remotive: {
    apiUrl: string;
  };
  remoteok: {
    apiUrl: string;
  };
  wwr: {
    apiUrl: string;
  };
  jooble: {
    apiUrl: string;
  };
}

interface EphemeralComputeConfig {
  beam: {
    apiKey: string;
  };
  instavm: {
    apiKey: string;
  };
}

interface CloudflareConfig {
  accountId: string;
  apiToken: string;
}

export interface EnvConfig {
  supabase: SupabaseConfig;
  r2: R2Config;
  ai: AIConfig;
  jobApis: JobApisConfig;
  ephemeralCompute: EphemeralComputeConfig;
  cloudflare: CloudflareConfig;
}

class EnvironmentError extends Error {
  constructor(variableName: string) {
    super(`Missing required environment variable: ${variableName}`);
    this.name = 'EnvironmentError';
  }
}

function getRequiredVar(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new EnvironmentError(name);
  }
  return value;
}

function getOptionalVar(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

/**
 * Validates and returns the environment configuration.
 * Throws if required variables are missing.
 */
export function getEnvConfig(): EnvConfig {
  return {
    supabase: {
      url: getRequiredVar('SUPABASE_URL'),
      anonKey: getRequiredVar('SUPABASE_ANON_KEY'),
      serviceRoleKey: getRequiredVar('SUPABASE_SERVICE_ROLE_KEY'),
    },
    r2: {
      accountId: getRequiredVar('R2_ACCOUNT_ID'),
      accessKeyId: getRequiredVar('R2_ACCESS_KEY_ID'),
      secretAccessKey: getRequiredVar('R2_SECRET_ACCESS_KEY'),
      bucketName: getRequiredVar('R2_BUCKET_NAME'),
    },
    ai: {
      workersAi: {
        accountId: getRequiredVar('WORKERS_AI_ACCOUNT_ID'),
        apiToken: getRequiredVar('WORKERS_AI_API_TOKEN'),
      },
      groq: {
        apiKey: getRequiredVar('GROQ_API_KEY'),
      },
      openrouter: {
        apiKey: getRequiredVar('OPENROUTER_API_KEY'),
      },
    },
    jobApis: {
      adzuna: {
        appId: getRequiredVar('ADZUNA_APP_ID'),
        appKey: getRequiredVar('ADZUNA_APP_KEY'),
      },
      serpapi: {
        apiKey: getRequiredVar('SERPAPI_KEY'),
      },
      remotive: {
        apiUrl: getOptionalVar('REMOTIVE_API_URL', 'https://remotive.com/api/remote-jobs'),
      },
      remoteok: {
        apiUrl: getOptionalVar('REMOTEOK_API_URL', 'https://remoteok.com/api'),
      },
      wwr: {
        apiUrl: getOptionalVar('WWR_API_URL', 'https://weworkremotely.com/api'),
      },
      jooble: {
        apiUrl: getOptionalVar('JOOBLE_API_URL', 'https://jooble.org/api/'),
      },
    },
    ephemeralCompute: {
      beam: {
        apiKey: getRequiredVar('BEAM_API_KEY'),
      },
      instavm: {
        apiKey: getRequiredVar('INSTAVM_API_KEY'),
      },
    },
    cloudflare: {
      accountId: getRequiredVar('CLOUDFLARE_ACCOUNT_ID'),
      apiToken: getRequiredVar('CLOUDFLARE_API_TOKEN'),
    },
  };
}

/**
 * Singleton instance of validated environment config.
 * Lazily initialized on first access.
 */
let cachedConfig: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = getEnvConfig();
  }
  return cachedConfig;
}

/**
 * Validate environment at module load time (optional).
 * Call this early in your application entry point.
 */
export function validateEnvironment(): void {
  try {
    getEnv();
  } catch (error) {
    if (error instanceof EnvironmentError) {
      console.error(`[ENV] ${error.message}`);
      console.error('[ENV] Please set all required environment variables in .env.local');
    }
    throw error;
  }
}

```

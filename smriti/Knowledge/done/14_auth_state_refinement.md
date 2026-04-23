# Unnati Auth State Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correctly display user authentication state in the Header and across the application by implementing a global Auth Provider.

**Architecture:** Use React Context to manage Supabase session and user profile state. This ensures that the Header and other components stay in sync without redundant API calls.

**Tech Stack:** React Context, Supabase Auth, Next.js (App Router).

---

### Task 1: Create AuthProvider and update Supabase lib

**Files:**
- Create: `unnati/src/components/providers/AuthProvider.tsx`
- Modify: `unnati/src/lib/supabase.ts`

- [ ] **Step 1: Add getSession helper to lib/supabase.ts**

```typescript
// Add to unnati/src/lib/supabase.ts
export async function getSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  return session;
}
```

- [ ] **Step 2: Implement AuthProvider in src/components/providers/AuthProvider.tsx**

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  user_id?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const updateCookie = (session: Session | null) => {
    if (session) {
      document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    } else {
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure';
    }
  };

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setLoading(false);
      return;
    }

    // Initial session check
    client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      updateCookie(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      updateCookie(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signOut" })
      });
      await client.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      updateCookie(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      profile, 
      loading, 
      signOut, 
      refreshProfile: () => user ? fetchProfile(user.id) : Promise.resolve() 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

---

### Task 2: Wrap Application in AuthProvider

**Files:**
- Modify: `unnati/src/app/layout.tsx`

- [ ] **Step 1: Wrap layout children in AuthProvider**

```tsx
// Inside unnati/src/app/layout.tsx
import { AuthProvider } from "@/components/providers/AuthProvider";

// ... in RootLayout component return:
<body className="min-h-full flex flex-col bg-background text-foreground">
  <AuthProvider>
    <Header />
    <main className="flex-1 relative z-0">{children}</main>
    {/* ... footer ... */}
  </AuthProvider>
</body>
```

---

### Task 3: Update Header to use useAuth

**Files:**
- Modify: `unnati/src/components/Header.tsx`

- [ ] **Step 1: Update imports and use useAuth hook**

```tsx
// Replace profile/loading state with:
const { user, profile, loading, signOut: handleSignOut } = useAuth();
const isLoggedIn = !!user;

// Add displayProfile helper
const displayProfile = profile || (user ? { name: user.email?.split('@')[0], email: user.email } : null);
```

- [ ] **Step 2: Update JSX to show profile if isLoggedIn is true**

```tsx
// Change the conditional rendering at line 112:
{loading ? (
  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
) : isLoggedIn ? (
  <div className="relative" ref={menuRef}>
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border hover:bg-muted/50 transition-colors"
      aria-label="Profile menu"
    >
      <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
        {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
      </div>
      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
    </button>
    {/* ... dropdown menu using displayProfile ... */}
  </div>
) : (
  <Link href="/login" className="...">Sign In</Link>
)}
```

---

### Task 4: Refine Auth Redirection in Pages

**Files:**
- Modify: `unnati/src/app/login/page.tsx`
- Modify: `unnati/src/app/register/page.tsx`

- [ ] **Step 1: Redirect to dashboard if user is already logged in**

```tsx
// In both pages
const { user } = useAuth();
useEffect(() => {
  if (user) {
    router.push('/dashboard');
  }
}, [user, router]);
```

---

### Task 5: Verification

- [ ] **Step 1: Check Header on /dashboard after login** - Expected: Profile button visible.
- [ ] **Step 2: Check Header after Sign Out** - Expected: "Sign In" button visible.
- [ ] **Step 3: Check /login while logged in** - Expected: Automatic redirect to /dashboard.

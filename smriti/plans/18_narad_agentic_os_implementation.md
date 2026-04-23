# Narad Agentic OS Implementation Plan

> **Plan:** Execute the transformation of narad from AI chat assistant to agentic command center
> **For:** Gemini CLI
> **Location:** `/home/deepak/Work/narad`

---

## Overview

This plan implements the Narad Agentic OS with:
1. **Dashboard UI** with service tiles + feature tiles
2. **Floating Chat Widget** with session history
3. **Multi-Agent AI System** with Finance Expert as the primary feature
4. **Finance Expert Agent** with comprehensive financial tracking

---

## Phase 1: Dashboard Foundation

### Task 1.1: Design System Tokens

**Files:**
- Create: `narad/src/styles/design-tokens.css`

**CSS Variables to define:**
```css
:root {
  /* Dark theme (default) */
  --bg-canvas: #0a0a0c;
  --bg-surface: #141418;
  --bg-elevated: #1c1c22;
  --border-subtle: #2a2a32;
  --text-primary: #e4e4e8;
  --text-secondary: #8b8b96;
  --accent: #10b981;
  --accent-alt: #8b5cf6;
  --status-online: #22c55e;
  --status-warning: #f59e0b;
  --status-error: #ef4444;
  
  /* Spacing, radius, shadows */
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 24px;
  --shadow-tile: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-floating: 0 12px 48px rgba(0, 0, 0, 0.5);
}

:root[data-theme="light"] {
  --bg-canvas: #fafafa;
  --bg-surface: #ffffff;
  --bg-elevated: #f5f5f5;
  --border-subtle: #e5e5e8;
  --text-primary: #18181b;
  --text-secondary: #71717a;
  --accent: #059669;
  --accent-alt: #7c3aed;
  --shadow-tile: 0 4px 24px rgba(0, 0, 0, 0.08);
  --shadow-floating: 0 12px 48px rgba(0, 0, 0, 0.12);
}
```

---

### Task 1.2: Theme Hook

**Files:**
- Create: `narad/src/hooks/useTheme.js`

```javascript
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('narad_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('narad_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
```

---

### Task 1.3: Service Tile Component

**Files:**
- Create: `narad/src/components/ServiceTile.jsx`

**Features:**
- Service name + icon
- Status indicator (green/yellow/red dot)
- Quick metric
- Click to open service URL

---

### Task 1.4: Dashboard Grid Layout

**Files:**
- Create: `narad/src/components/Dashboard.jsx`
- Create: `narad/src/hooks/useServices.js`
- Create: `narad/pages/routes/dashboard.js`

**Dashboard Structure:**
- Services section (6 services): Narad, Vishwakarma, Chitragupta, Karma, Kanak, Unnati
- Features section: Portfolio tile + Finance Expert tile
- Responsive grid (2 cols mobile, 3 tablet, 4 desktop)

---

## Phase 2: Floating Chat Widget

### Task 2.1: Floating Chat Button

**Files:**
- Create: `narad/src/components/FloatingChatButton.jsx`

**Features:**
- Fixed position (bottom-right)
- Unread badge
- Hover scale animation

---

### Task 2.2: Chat Window

**Files:**
- Create: `narad/src/components/ChatWindow.jsx`

**Features:**
- Message list with role-based styling
- Input field with send button
- History button (shows sessions)
- Close button

---

### Task 2.3: FloatingChat Container

**Files:**
- Create: `narad/src/components/FloatingChat.jsx`

**Features:**
- Toggle between button and window
- Message state management
- API integration for chat

---

## Phase 3: Finance Expert Agent

### Task 3.1: Supabase Finance Tables

**Files:**
- Create: `narad/supabase/migrations/001_finance_tables.sql`

**Tables:**
```sql
-- LOANS
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('car', 'personal', 'home', 'education', 'other')),
  principal_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  tenure_months INTEGER NOT NULL,
  emi_amount NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  total_emis INTEGER NOT NULL,
  paid_emis INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'paid_off', 'defaulted')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREDIT_CARDS
CREATE TABLE public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  limit_amount NUMERIC NOT NULL,
  bill_date INTEGER CHECK (bill_date BETWEEN 1 AND 31) NOT NULL,
  due_date INTEGER CHECK (due_date BETWEEN 1 AND 31) NOT NULL,
  current_balance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CARD_PAYMENTS (bill + payment tracking)
CREATE TABLE public.card_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.credit_cards(id),
  bill_month DATE NOT NULL,
  bill_amount NUMERIC NOT NULL,
  payment_amount NUMERIC,
  payment_date DATE,
  is_fully_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPENSES
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('fixed', 'variable', 'one_time')) NOT NULL,
  amount NUMERIC NOT NULL,
  frequency TEXT CHECK (frequency IN ('monthly', 'quarterly', 'yearly', 'one_time')) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BANK_ACCOUNTS
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  bank_name TEXT NOT NULL,
  account_number_last4 TEXT NOT NULL,
  account_type TEXT DEFAULT 'savings',
  balance NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WALLETS (digital)
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVESTMENTS
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID DEFAULT auth.uid(),
  type TEXT NOT NULL,  -- 'epf', 'ppf', 'nps', 'mutual_fund', 'stock', 'gold'
  name TEXT NOT NULL,
  institution TEXT,
  quantity NUMERIC DEFAULT 0,
  avg_price NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Policies (using auth.uid())
CREATE POLICY "Users own data" ON public.loans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.credit_cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.card_payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own data" ON public.investments FOR ALL USING (auth.uid() = user_id);
```

---

### Task 3.2: Finance Service API

**Files:**
- Create: `narad/pages/services/finance.js`

**Endpoints:**
- `GET /api/finance/loans` — List all loans
- `POST /api/finance/loans` — Create new loan
- `POST /api/finance/loans/:id/pay` — Mark EMI paid
- `GET /api/finance/cards` — List credit cards
- `POST /api/finance/cards` — Add credit card
- `POST /api/finance/cards/:id/bill` — Record bill
- `POST /api/finance/cards/:id/pay` — Record payment
- `GET /api/finance/expenses` — List expenses
- `POST /api/finance/expenses` — Add expense
- `GET /api/finance/accounts` — List bank accounts
- `POST /api/finance/accounts` — Add bank account
- `GET /api/finance/wallets` — List wallets
- `POST /api/finance/wallets` — Add wallet
- `GET /api/finance/investments` — List investments
- `POST /api/finance/investments` — Add investment
- `GET /api/finance/insights` — Full financial insights + net worth

**Net Worth Formula:**
```
Net Worth = (Bank Balances + Wallets + Investments) - (Loans Liability + Credit Card Due)
```

---

### Task 3.3: Finance Dashboard UI

**Files:**
- Create: `narad/src/components/FinanceDashboard.jsx`
- Create: `narad/src/hooks/useFinance.js`

**Features (Insights-First UX):**
- 4 clickable insight cards:
  1. **Net Worth** — Total assets - liabilities
  2. **Total Liability** — Loans due
  3. **Credit Cards** — Utilization %
  4. **Monthly Fixed** — Expenses
- Click card → expands to show details
- Add/Update/Delete operations

---

### Task 3.4: Finance Tile for Dashboard

**Files:**
- Create: `narad/src/components/FinanceTile.jsx`

**Features:**
- Net worth display
- Quick stats (loans, cards, expenses)
- Notification badge for upcoming dues
- Click to open Finance Dashboard

---

### Task 3.5: Credit Card Usage Graph

**Files:**
- Create: `narad/src/components/CardUsageGraph.jsx`

**Features:**
- 6-month line/bar chart
- Shows bill amount + payment
- Uses Recharts library

---

### Task 3.6: Finance Agent (Chat Integration)

**Files:**
- Modify: `narad/pages/services/agents.js`

**Sub-Agents:**
1. **Loan Agent** — Track loans, EMI payments
2. **Card Agent** — Bill cycle, usage patterns
3. **Expense Agent** — Categorization, trends
4. **Wealth Agent** — Bank accounts, wallets, net worth
5. **Investment Agent** — EPF, PPF, NPS, MF, stocks, gold
6. **Insight Agent** — AI analysis, forecasting

**Natural Commands:**
- "I took a car loan of 5L at 12% for 3 years"
- "paid EMI for car"
- "HDFC bill is 45000"
- "I paid 30000 on HDFC"
- "My HDFC savings has 50000"
- "Amazon Pay has 2000"
- "Add 5L in EPF"
- "What's my net worth?"
- "Show my investments"

---

## Phase 4: Integration

### Task 4.1: App Integration

**Files:**
- Modify: `narad/src/App.jsx`

**Add:**
- Dashboard import and routing
- FloatingChat component
- ThemeToggle component

---

### Task 4.2: Build & Deploy

**Commands:**
```bash
cd narad
npm run build
npm run deploy
```

---

## File Structure Summary

```
narad/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ServiceTile.jsx
│   │   ├── FinanceTile.jsx
│   │   ├── FinanceDashboard.jsx
│   │   ├── LoanTile.jsx
│   │   ├── CreditCardTile.jsx
│   │   ├── ExpenseTile.jsx
│   │   ├── CardUsageGraph.jsx
│   │   ├── FloatingChat.jsx
│   │   ├── FloatingChatButton.jsx
│   │   ├── ChatWindow.jsx
│   │   └── ThemeToggle.jsx
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useServices.js
│   │   └── useFinance.js
│   └── styles/
│       └── design-tokens.css
├── pages/
│   ├── routes/
│   │   └── dashboard.js
│   └── services/
│       ├── finance.js
│       └── agents.js
├── supabase/
│   └── migrations/
│       └── 001_finance_tables.sql
└── package.json (add recharts)
```

---

## Testing Checklist

- [ ] Dashboard loads with all service tiles
- [ ] Portfolio tile shows
- [ ] Finance Expert tile shows net worth
- [ ] Click Finance tile opens Finance Dashboard
- [ ] Can add/view loans
- [ ] Can add/view credit cards
- [ ] Can add/view expenses
- [ ] Can add/view bank accounts
- [ ] Can add/view wallets
- [ ] Can add/view investments
- [ ] Net worth calculates correctly
- [ ] Credit card usage graph displays
- [ ] Floating chat opens/closes
- [ ] Theme toggle works (dark/light)
- [ ] Deploy succeeds

---

## Commands Reference

```bash
# Development
cd narad && npm run dev

# Build
npm run build

# Deploy
npm run deploy

# Local Pages preview
npx wrangler pages dev dist
```

---

## Dependencies to Add

```json
{
  "recharts": "^2.10.0"
}
```

---

**End of Implementation Plan**

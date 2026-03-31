# Chitragupta - Financial Intelligence Service

## Project Overview
**Name:** Chitragupta (चित्रगुप्त - Keeper of Financial Records)
**Type:** Personal Finance Dashboard + AI Assistant
**Stack:** Cloudflare Workers + D1 (SQLite) + Narad Integration

## Database Schema (Cloudflare D1)

### Tables

```sql
-- Core financial data
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('bank', 'investment', 'loan', 'lend', 'wallet')) NOT NULL,
  balance REAL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stock/ETF holdings
CREATE TABLE holdings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  quantity REAL DEFAULT 0,
  avg_cost REAL DEFAULT 0,
  ltp REAL DEFAULT 0,
  invested REAL DEFAULT 0,
  current_value REAL DEFAULT 0,
  pnl REAL DEFAULT 0,
  net_chg_percent REAL DEFAULT 0,
  day_chg_percent REAL DEFAULT 0,
  exchange TEXT DEFAULT 'NSE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dividend tracking
CREATE TABLE dividends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  ltp REAL DEFAULT 0,
  allocation REAL DEFAULT 0,
  monthly_sip REAL DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  actual_sip REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recurring transactions (bills, SIPs, goals)
CREATE TABLE recurrings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT CHECK(category IN ('bill', 'insurance', 'goal', 'safety', 'gold', 'loan', 'investment')),
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  frequency TEXT CHECK(frequency IN ('daily', 'weekly', 'monthly', 'quarter', 'annual')),
  start_date INTEGER,
  end_date INTEGER,
  monthly_saving REAL DEFAULT 0,
  planned_saving REAL DEFAULT 0,
  actual_saving REAL DEFAULT 0,
  is_paid INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Expense tracking
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Investment portfolio summary
CREATE TABLE portfolio_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_invested REAL DEFAULT 0,
  total_current REAL DEFAULT 0,
  total_pnl REAL DEFAULT 0,
  target_investment REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gold/Commodity prices
CREATE TABLE commodities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price REAL DEFAULT 0,
  change REAL DEFAULT 0,
  change_percent REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## UI/UX Design

### Layout Structure
- **Main Container:** Full-width dashboard with sidebar
- **Header:** Chitragupta branding + navigation tabs + Narad toggle
- **Dashboard Grid:** CSS Grid with responsive cards
- **Floating Chat:** Narad chatbot as floating button/window

### Color Palette
- **Primary:** `#0D1B2A` (Deep Navy)
- **Secondary:** `#1B263B` (Dark Blue)
- **Accent:** `#E0A458` (Gold - represents wealth)
- **Success:** `#2ECC71` (Green - gains)
- **Danger:** `#E74C3C` (Red - losses)
- **Text:** `#E5E5E5` (Light gray)
- **Background:** `#0A1628` (Darker navy)

### Typography
- **Headings:** Sora (existing)
- **Numbers:** JetBrains Mono (financial data)
- **Body:** Sora

### Dashboard Components

1. **Net Worth Card** - Total assets - liabilities
2. **Holdings Overview** - Pie chart of portfolio allocation
3. **Top Gainers/Losers** - Top 5 performing stocks
4. **Monthly SIP Progress** - Target vs actual
5. **Upcoming Bills** - Next 5 due payments
6. **Dividend Summary** - Monthly payout tracking
7. **Gold Prices** - Live commodity prices
8. **Expense Breakdown** - Category-wise pie chart

### Navigation Tabs
- Dashboard (default)
- Holdings
- Dividends
- Recurring
- Expenses (New tracking system implemented)
- Insights (AI-powered suggestions)
- Settings (Cloud-synced preferences)

### Celestial Ledger Design System (Stitch Suggestions)
- **Typography**: Dual-tone voice using **Sora** for labels and **JetBrains Mono** for numbers.
- **Surface Logic**: "No-Line" rule. Define sections via background shifts (Tonal Layering).
- **Glassmorphism**: 20px blur with 60% opacity for floating elements and modals.
- **Palette**: Deep Navy (#061423), Gold (#E0A458), and Ethereal Blue (#D6E4F9).

### Chat Integration
- Floating button (bottom-right)
- Opens as overlay panel
- Persists chat history per session
- Context-aware financial suggestions

## Data Flow

```
Excel File → Migration Script → D1 Database
                                    ↓
                           Workers API Endpoints
                                    ↓
                    Dashboard UI ← Financial Analysis
                                    ↓
                           Narad Chatbot Context
```

## API Endpoints

```javascript
// Account endpoints
GET    /api/finance/accounts
POST   /api/finance/accounts
PUT    /api/finance/accounts/:id
DELETE /api/finance/accounts/:id

// Holdings endpoints  
GET    /api/finance/holdings
POST   /api/finance/holdings
PUT    /api/finance/holdings/:id
DELETE /api/finance/holdings/:id
GET    /api/finance/holdings/summary

// Dividends endpoints
GET    /api/finance/dividends
POST   /api/finance/dividends
PUT    /api/finance/dividends/:id
GET    /api/finance/dividends/summary

// Recurring endpoints
GET    /api/finance/recurring
POST   /api/finance/recurring
PUT    /api/finance/recurring/:id
DELETE /api/finance/recurring/:id
GET    /api/finance/recurring/upcoming

// Dashboard endpoints
GET    /api/finance/dashboard/summary
GET    /api/finance/dashboard/insights

// Analysis endpoints
GET    /api/finance/analysis/portfolio
GET    /api/finance/analysis/budget
GET    /api/finance/analysis/suggestions

// Settings endpoints
GET    /api/finance/settings
POST   /api/finance/settings
```

## Narad Integration

### Context Injection
- Finance-specific system prompt for Chitragupta queries
- Access to database for real-time data
- Tool functions for calculations

### Floating Chat Behavior
- Toggle button always visible on Chitragupta pages
- Chat window opens as modal/overlay
- Chat history persists in localStorage
- Returns to main page without losing conversation

## Migration Strategy

1. **Parse Excel** → JavaScript with `xlsx` library
2. **Transform Data** → Map to D1 schema
3. **Insert via API** → Batch insert endpoints
4. **Verify** → Compare totals with Excel
5. **Deploy** → Cloudflare D1 + Workers
6. **Remove Excel** → After successful verification

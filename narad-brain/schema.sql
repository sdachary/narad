-- Chitragupta Database Schema for Cloudflare D1
-- Run this in D1 console: wrangler d1 execute chitragupta --file=./schema.sql

-- Core financial data
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('bank', 'investment', 'loan', 'lend', 'wallet')) NOT NULL,
  balance REAL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stock/ETF holdings
CREATE TABLE IF NOT EXISTS holdings (
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
CREATE TABLE IF NOT EXISTS dividends (
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
CREATE TABLE IF NOT EXISTS recurrings (
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
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  description TEXT,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio summary
CREATE TABLE IF NOT EXISTS portfolio_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_invested REAL DEFAULT 0,
  total_current REAL DEFAULT 0,
  total_pnl REAL DEFAULT 0,
  target_investment REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gold/Commodity prices
CREATE TABLE IF NOT EXISTS commodities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  price REAL DEFAULT 0,
  change REAL DEFAULT 0,
  change_percent REAL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_holdings_symbol ON holdings(symbol);
CREATE INDEX IF NOT EXISTS idx_dividends_symbol ON dividends(symbol);
CREATE INDEX IF NOT EXISTS idx_recurrings_category ON recurrings(category);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

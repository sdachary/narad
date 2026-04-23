-- =============================================================================
-- FINANCE SCHEMA FOR NARAD
-- =============================================================================
-- Personal finance tracking: loans, credit cards, expenses, investments
-- =============================================================================

-- Create dedicated schema
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'finance') THEN
        CREATE SCHEMA finance;
    END IF;
END $$;

-- Set schema path for convenience
SET search_path TO finance, public;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Loans (home, car, personal, education, etc.)
CREATE TABLE IF NOT EXISTS finance.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    loan_type TEXT NOT NULL,  -- 'home', 'car', 'personal', 'education', 'gold', 'other'
    principal_amount DECIMAL(15,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    tenure_months INTEGER NOT NULL,
    emi_amount DECIMAL(15,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    total_emis INTEGER NOT NULL,
    paid_emis INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',  -- 'active', 'closed', 'prepaid'
    lender TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Cards
CREATE TABLE IF NOT EXISTS finance.credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bank TEXT NOT NULL,
    card_type TEXT,  -- 'credit', 'fuel', 'shopping', 'travel'
    limit_amount DECIMAL(15,2) NOT NULL,
    current_balance DECIMAL(15,2) DEFAULT 0,
    available_credit DECIMAL(15,2),
    billing_cycle_day INTEGER,  -- 1-31
    due_date_day INTEGER,
    last_payment_date DATE,
    last_payment_amount DECIMAL(15,2),
    reward_rate DECIMAL(5,2),  -- e.g., 2.5%
    annual_fee DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'active',  -- 'active', 'closed', 'blocked'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bank Accounts
CREATE TABLE IF NOT EXISTS finance.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_type TEXT,  -- 'savings', 'current', 'fixed_deposit'
    account_number TEXT,
    ifsc_code TEXT,
    balance DECIMAL(15,2) DEFAULT 0,
    interest_rate DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets (UPI, Paytm, Amazon Pay, etc.)
CREATE TABLE IF NOT EXISTS finance.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,  -- 'paytm', 'amazon', 'phonepe', 'gpay', 'other'
    balance DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investments (mutual funds, stocks, PPF, NPS, etc.)
CREATE TABLE IF NOT EXISTS finance.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    investment_type TEXT NOT NULL,  -- 'mutual_fund', 'stock', 'ppf', 'nps', 'fd', 'bonds', 'crypto', 'other'
    folio_number TEXT,
    purchase_date DATE,
    purchase_price DECIMAL(15,2),
    current_value DECIMAL(15,2),
    units DECIMAL(15,4),
    nav DECIMAL(15,4),
    returns_percent DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses (recurring and one-time)
CREATE TABLE IF NOT EXISTS finance.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,  -- 'rent', 'utilities', 'insurance', 'subscription', 'groceries', 'transport', 'other'
    amount DECIMAL(15,2) NOT NULL,
    frequency TEXT,  -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one-time'
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    is_essential BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_finance_loans_status ON finance.loans(status);
CREATE INDEX IF NOT EXISTS idx_finance_credit_cards_status ON finance.credit_cards(status);
CREATE INDEX IF NOT EXISTS idx_finance_investments_type ON finance.investments(investment_type);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_category ON finance.expenses(category);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_is_active ON finance.expenses(is_active);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE finance.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies (allow access to authenticated users)
-- For personal use, allow all authenticated access
CREATE POLICY "Allow all access to loans" ON finance.loans
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to credit_cards" ON finance.credit_cards
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to bank_accounts" ON finance.bank_accounts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to wallets" ON finance.wallets
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to investments" ON finance.investments
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to expenses" ON finance.expenses
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grant table permissions to service role
GRANT ALL ON SCHEMA finance TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA finance TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA finance TO service_role;

-- =============================================================================
-- USAGE NOTES
-- =============================================================================
-- 
-- Query examples:
--   SELECT * FROM finance.loans;
--   SELECT * FROM finance.credit_cards;
--   INSERT INTO finance.loans (name, loan_type, principal_amount, interest_rate, tenure_months, emi_amount, start_date, total_emis)
--   VALUES ('Home Loan', 'home', 5000000, 8.5, 240, 43439, '2024-01-01', 240);
--
-- =============================================================================
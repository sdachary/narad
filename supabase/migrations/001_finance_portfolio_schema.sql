-- =============================================================================
-- FINANCE + PORTFOLIO TABLES - IDEMPOTENT
-- Run in Supabase SQL Editor - safe to run multiple times
-- =============================================================================

-- Create finance schema
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'finance') THEN
        CREATE SCHEMA finance;
    END IF;
END $$;

SET search_path TO finance, public;

-- =============================================================================
-- FINANCE TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS finance.loans ();
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS loan_type TEXT NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS principal_amount DECIMAL(15,2) NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2) NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS tenure_months INTEGER NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS emi_amount DECIMAL(15,2) NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS total_emis INTEGER NOT NULL;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS paid_emis INTEGER DEFAULT 0;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS lender TEXT;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.loans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS finance.credit_cards ();
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS bank TEXT NOT NULL;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS card_type TEXT;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS limit_amount DECIMAL(15,2) NOT NULL;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS current_balance DECIMAL(15,2) DEFAULT 0;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS available_credit DECIMAL(15,2);
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS billing_cycle_day INTEGER;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS due_date_day INTEGER;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS last_payment_date DATE;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS last_payment_amount DECIMAL(15,2);
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS reward_rate DECIMAL(5,2);
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS annual_fee DECIMAL(10,2) DEFAULT 0;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.credit_cards ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS finance.bank_accounts ();
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS account_name TEXT NOT NULL;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS bank_name TEXT NOT NULL;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS account_type TEXT;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS account_number TEXT;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS interest_rate DECIMAL(5,2);
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.bank_accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS finance.wallets ();
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL;
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS balance DECIMAL(15,2) DEFAULT 0;
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.wallets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS finance.investments ();
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS investment_type TEXT NOT NULL;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS folio_number TEXT;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS purchase_date DATE;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS purchase_price DECIMAL(15,2);
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS current_value DECIMAL(15,2);
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS units DECIMAL(15,4);
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS nav DECIMAL(15,4);
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS returns_percent DECIMAL(10,2);
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.investments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS finance.planned_savings ();
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS id_number INTEGER;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS category TEXT NOT NULL;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS name TEXT NOT NULL;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS target_amount DECIMAL(15,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS frequency TEXT;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS monthly_saving DECIMAL(15,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS planned_saving DECIMAL(15,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS actual_saving DECIMAL(15,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS pending DECIMAL(15,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS progress DECIMAL(5,2);
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE finance.planned_savings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================================
-- PORTFOLIO TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS portfolio_stocks ();
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS instrument TEXT NOT NULL;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS ltp DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS allocation_percent DECIMAL(5,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS monthly_sip DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS avg_cost DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS invested DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS current_value DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS pl DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE portfolio_stocks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS portfolio_dividends ();
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS instrument TEXT NOT NULL;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS ltp DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS avg_cost DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS invested DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS current_value DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS pl DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS target_invest DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS target_achieved DECIMAL(5,2) DEFAULT 0;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE portfolio_dividends ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS portfolio_summary ();
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid();
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS target_monthly_payout DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS actual_monthly_payout DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS monthly_sip DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS actual_sip DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS extra_contribution DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS total_invested DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS total_current DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS total_pl DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS target_investment DECIMAL(15,2) DEFAULT 0;
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE portfolio_summary ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================================
-- RLS + POLICIES (idempotent)
-- =============================================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'loans' AND schemaname = 'finance') THEN
        ALTER TABLE finance.loans ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access loans' AND c.relname = 'loans') THEN
            CREATE POLICY "Access loans" ON finance.loans FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'credit_cards' AND schemaname = 'finance') THEN
        ALTER TABLE finance.credit_cards ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access credit_cards' AND c.relname = 'credit_cards') THEN
            CREATE POLICY "Access credit_cards" ON finance.credit_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'bank_accounts' AND schemaname = 'finance') THEN
        ALTER TABLE finance.bank_accounts ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access bank_accounts' AND c.relname = 'bank_accounts') THEN
            CREATE POLICY "Access bank_accounts" ON finance.bank_accounts FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'wallets' AND schemaname = 'finance') THEN
        ALTER TABLE finance.wallets ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access wallets' AND c.relname = 'wallets') THEN
            CREATE POLICY "Access wallets" ON finance.wallets FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'investments' AND schemaname = 'finance') THEN
        ALTER TABLE finance.investments ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access investments' AND c.relname = 'investments') THEN
            CREATE POLICY "Access investments" ON finance.investments FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'planned_savings' AND schemaname = 'finance') THEN
        ALTER TABLE finance.planned_savings ENABLE ROW LEVEL SECURITY;
        IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access planned_savings' AND c.relname = 'planned_savings') THEN
            CREATE POLICY "Access planned_savings" ON finance.planned_savings FOR ALL TO authenticated USING (true) WITH CHECK (true);
        END IF;
    END IF;
END $$;

DO $$ BEGIN
    ALTER TABLE portfolio_stocks ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access stocks' AND c.relname = 'portfolio_stocks') THEN
        CREATE POLICY "Access stocks" ON portfolio_stocks FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    ALTER TABLE portfolio_dividends ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access dividends' AND c.relname = 'portfolio_dividends') THEN
        CREATE POLICY "Access dividends" ON portfolio_dividends FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

DO $$ BEGIN
    ALTER TABLE portfolio_summary ENABLE ROW LEVEL SECURITY;
    IF NOT EXISTS (SELECT 1 FROM pg_policy p JOIN pg_class c ON c.oid = p.polrelid WHERE p.polname = 'Access summary' AND c.relname = 'portfolio_summary') THEN
        CREATE POLICY "Access summary" ON portfolio_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
-- =============================================================================
-- FINANCE SCHEMA COMPLETE - NARAD
-- =============================================================================
-- Personal finance + Portfolio tracking
-- =============================================================================

SET search_path TO finance, public;

-- =============================================================================
-- PLANNED SAVINGS (missing from earlier)
-- =============================================================================

CREATE TABLE IF NOT EXISTS finance.planned_savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,  -- 'Bill', 'Insurance', 'Goal', 'Safety', 'Gold', 'Loan'
    name TEXT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    frequency TEXT,  -- 'Monthly', 'Quarterly', 'Annual'
    start_date DATE,
    end_date DATE,
    monthly_saving DECIMAL(15,2) DEFAULT 0,
    planned_saving DECIMAL(15,2) DEFAULT 0,
    actual_saving DECIMAL(15,2) DEFAULT 0,
    pending DECIMAL(15,2) DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- PORTFOLIO TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS portfolio_stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument TEXT NOT NULL,
    company_name TEXT,
    ltp DECIMAL(15,2) DEFAULT 0,
    allocation_percent DECIMAL(5,2) DEFAULT 0,
    monthly_sip DECIMAL(15,2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    avg_cost DECIMAL(15,2) DEFAULT 0,
    invested DECIMAL(15,2) DEFAULT 0,
    current_value DECIMAL(15,2) DEFAULT 0,
    pl DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_dividends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument TEXT NOT NULL,
    company_name TEXT,
    ltp DECIMAL(15,2) DEFAULT 0,
    avg_cost DECIMAL(15,2) DEFAULT 0,
    quantity INTEGER DEFAULT 0,
    invested DECIMAL(15,2) DEFAULT 0,
    current_value DECIMAL(15,2) DEFAULT 0,
    pl DECIMAL(15,2) DEFAULT 0,
    target_invest DECIMAL(15,2) DEFAULT 0,
    target_achieved DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_monthly_payout DECIMAL(15,2) DEFAULT 0,
    actual_monthly_payout DECIMAL(15,2) DEFAULT 0,
    monthly_sip DECIMAL(15,2) DEFAULT 0,
    actual_sip DECIMAL(15,2) DEFAULT 0,
    extra_contribution DECIMAL(15,2) DEFAULT 0,
    total_invested DECIMAL(15,2) DEFAULT 0,
    total_current DECIMAL(15,2) DEFAULT 0,
    total_pl DECIMAL(15,2) DEFAULT 0,
    target_investment DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- RLS FOR NEW TABLES
-- =============================================================================

ALTER TABLE finance.planned_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Access planned_savings" ON finance.planned_savings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Access stocks" ON portfolio_stocks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Access dividends" ON portfolio_dividends FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Access summary" ON portfolio_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON finance.planned_savings TO service_role;
GRANT ALL ON portfolio_stocks TO service_role;
GRANT ALL ON portfolio_dividends TO service_role;
GRANT ALL ON portfolio_summary TO service_role;
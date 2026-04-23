-- Portfolio tables for stock holdings and dividend tracking
CREATE TABLE IF NOT EXISTS portfolio_stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument TEXT NOT NULL,
  company_name TEXT,
  ltp NUMERIC DEFAULT 0,
  allocation_percent NUMERIC DEFAULT 0,
  monthly_sip NUMERIC DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  avg_cost NUMERIC DEFAULT 0,
  invested NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  pl NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_dividends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument TEXT NOT NULL,
  company_name TEXT,
  ltp NUMERIC DEFAULT 0,
  avg_cost NUMERIC DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  invested NUMERIC DEFAULT 0,
  current_value NUMERIC DEFAULT 0,
  pl NUMERIC DEFAULT 0,
  target_invest NUMERIC DEFAULT 0,
  target_achieved NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_monthly_payout NUMERIC DEFAULT 0,
  actual_monthly_payout NUMERIC DEFAULT 0,
  monthly_sip NUMERIC DEFAULT 0,
  actual_sip NUMERIC DEFAULT 0,
  extra_contribution NUMERIC DEFAULT 0,
  total_invested NUMERIC DEFAULT 0,
  total_current NUMERIC DEFAULT 0,
  total_pl NUMERIC DEFAULT 0,
  target_investment NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies
CREATE POLICY "Allow all access to portfolio_stocks" ON portfolio_stocks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to portfolio_dividends" ON portfolio_dividends FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to portfolio_summary" ON portfolio_summary FOR ALL TO authenticated USING (true) WITH CHECK (true);
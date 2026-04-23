-- =============================================================================
-- SUPABASE SCHEMA FOR CHITRAGUPTA
-- =============================================================================
-- This file creates the tables needed for Chitragupta to track platform taxes.
-- Only sync summaries, NOT individual user transactions.
-- =============================================================================

-- Organization table (your platform company)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT DEFAULT 'platform_owner',  -- 'platform_owner', 'client', 'partner'
    gstin TEXT,  -- Your GSTIN for issuing invoices
    pan TEXT,    -- Your PAN for TDS
    upi_id TEXT,  -- Your UPI for receiving payments
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert your organization (the platform owner)
INSERT INTO organizations (id, name, type, gstin, pan) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Kosh', 'platform_owner', '07AAGCKXXXXX1ZQ', 'AAGCK1234K')
ON CONFLICT (id) DO NOTHING;

-- Transactions table (summary records only)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    type TEXT NOT NULL,  -- 'income', 'expense', 'asset'
    category TEXT NOT NULL,  -- 'compute', 'infrastructure', 'tax'
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying
CREATE INDEX IF NOT EXISTS idx_transactions_org_date 
    ON transactions(organization_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category 
    ON transactions(category);

-- GST Records (auto-calculated, stored for reference)
CREATE TABLE IF NOT EXISTS gst_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    period TEXT NOT NULL,  -- '2026-04' format
    total_output_gst DECIMAL(15,2) DEFAULT 0,
    total_input_gst DECIMAL(15,2) DEFAULT 0,
    net_gst DECIMAL(15,2) DEFAULT 0,
    cgst DECIMAL(15,2) DEFAULT 0,
    sgst DECIMAL(15,2) DEFAULT 0,
    igst DECIMAL(15,2) DEFAULT 0,
    status TEXT DEFAULT 'pending',  -- 'pending', 'filed', 'adjusted'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TDS Records
CREATE TABLE IF NOT EXISTS tds_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    period TEXT NOT NULL,
    total_payout DECIMAL(15,2) DEFAULT 0,
    tds_deducted DECIMAL(15,2) DEFAULT 0,
    vendor_count INT DEFAULT 0,
    form_16a_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync Log (track what came from where)
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,  -- 'karma', 'vishwakarma'
    sync_type TEXT NOT NULL,  -- 'monthly_summary', 'daily'
    period TEXT,  -- '2026-04'
    status TEXT DEFAULT 'success',  -- 'success', 'failed'
    records_count INT DEFAULT 0,
    error_message TEXT,
    synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- WHAT GETS SYNCED FROM EACH PLATFORM
-- =============================================================================

-- KARMA → CHITRAGUPTA (Monthly Summary)
-- What: Platform commission earnings, GST collected
-- Example: ₹684 commission earned, ₹123.12 GST
--
-- {
--   "month": "2026-04",
--   "source": "karma",
--   "task_count": 47,
--   "total_earnings": 3420.00,     -- Total paid to providers
--   "total_commission": 684.00,    -- Platform's cut (20%)
--   "gst_collected": 123.12        -- GST on commission (18%)
-- }

-- VISHWAKARMA → CHITRAGUPTA (Monthly Summary)
-- What: Infrastructure costs, depreciation
-- Example: ₹5000 OCI costs, ₹500 depreciation
--
-- {
--   "month": "2026-04",
--   "source": "vishwakarma",
--   "total_cost": 5000.00,
--   "depreciation": 500.00,
--   "assets_count": 3
-- }

-- =============================================================================
-- VIEW: Tax Summary for ITR
-- =============================================================================

CREATE OR REPLACE VIEW tax_summary AS
SELECT 
    o.name as organization,
    o.gstin,
    EXTRACT(YEAR FROM t.date) as year,
    EXTRACT(MONTH FROM t.date) as month,
    t.category,
    SUM(t.amount) as total,
    COUNT(*) as transaction_count
FROM transactions t
JOIN organizations o ON t.organization_id = o.id
GROUP BY o.name, o.gstin, EXTRACT(YEAR FROM t.date), EXTRACT(MONTH FROM t.date), t.category
ORDER BY year DESC, month DESC;

-- =============================================================================
-- QUERY: Get sync status
-- =============================================================================

SELECT * FROM sync_logs 
ORDER BY synced_at DESC 
LIMIT 10;

-- =============================================================================
-- RLS POLICIES (Enable security)
-- =============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tds_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access
CREATE POLICY "org_all" ON organizations FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "trans_all" ON transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "gst_all" ON gst_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "tds_all" ON tds_records FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "sync_all" ON sync_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow authenticated read
CREATE POLICY "trans_read" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "gst_read" ON gst_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "sync_read" ON sync_logs FOR SELECT TO authenticated USING (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

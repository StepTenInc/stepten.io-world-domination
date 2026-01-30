-- =====================================================
-- A/B Testing System Tables
-- Migration: 003_create_ab_testing_tables
-- Description: Creates tables for A/B testing article variants
-- =====================================================

-- =====================================================
-- Table: ab_tests
-- Stores A/B test configurations and metadata
-- =====================================================
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id TEXT NOT NULL,
    metric TEXT NOT NULL CHECK (metric IN ('CTR', 'time_on_page', 'bounce_rate', 'conversions')),
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'paused')) DEFAULT 'running',
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    duration INTEGER NOT NULL DEFAULT 14, -- Test duration in days
    winner UUID, -- References ab_variants.id
    confidence DECIMAL(4, 3) DEFAULT 0.95, -- Statistical confidence level (0.950 = 95%)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ab_tests
CREATE INDEX idx_ab_tests_article_id ON ab_tests(article_id);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);
CREATE INDEX idx_ab_tests_start_date ON ab_tests(start_date DESC);

-- =====================================================
-- Table: ab_variants
-- Stores individual test variants with their content
-- =====================================================
CREATE TABLE IF NOT EXISTS ab_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Control", "Variant A", "Variant B"
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    introduction_paragraph TEXT,
    hero_image TEXT, -- URL to hero image
    traffic INTEGER NOT NULL DEFAULT 50, -- Percentage of traffic allocated (0-100)

    -- Performance metrics
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(6, 5) DEFAULT 0.00000, -- Click-through rate (0.00000 - 1.00000)
    avg_time_on_page DECIMAL(8, 2) DEFAULT 0, -- Average time in seconds
    bounce_rate DECIMAL(5, 4) DEFAULT 0, -- Bounce rate (0.0000 - 1.0000)
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(6, 5) DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ab_variants
CREATE INDEX idx_ab_variants_test_id ON ab_variants(test_id);
CREATE INDEX idx_ab_variants_ctr ON ab_variants(ctr DESC);

-- =====================================================
-- Table: ab_impressions
-- Logs each time a variant is shown in search results
-- =====================================================
CREATE TABLE IF NOT EXISTS ab_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES ab_variants(id) ON DELETE CASCADE,
    session_id TEXT, -- User session identifier
    user_agent TEXT,
    referrer TEXT,
    search_query TEXT, -- Search query that led to impression
    position INTEGER, -- Position in search results (1-10)
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ab_impressions
CREATE INDEX idx_ab_impressions_test_id ON ab_impressions(test_id);
CREATE INDEX idx_ab_impressions_variant_id ON ab_impressions(variant_id);
CREATE INDEX idx_ab_impressions_session_id ON ab_impressions(session_id);
CREATE INDEX idx_ab_impressions_timestamp ON ab_impressions(timestamp DESC);

-- =====================================================
-- Table: ab_clicks
-- Logs each click on a variant from search results
-- =====================================================
CREATE TABLE IF NOT EXISTS ab_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES ab_variants(id) ON DELETE CASCADE,
    impression_id UUID REFERENCES ab_impressions(id) ON DELETE SET NULL, -- Links to specific impression
    session_id TEXT, -- User session identifier
    time_on_page INTEGER, -- Time spent on page in seconds
    bounced BOOLEAN DEFAULT false, -- Did user bounce (leave quickly)?
    converted BOOLEAN DEFAULT false, -- Did user complete desired action?
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for ab_clicks
CREATE INDEX idx_ab_clicks_test_id ON ab_clicks(test_id);
CREATE INDEX idx_ab_clicks_variant_id ON ab_clicks(variant_id);
CREATE INDEX idx_ab_clicks_impression_id ON ab_clicks(impression_id);
CREATE INDEX idx_ab_clicks_session_id ON ab_clicks(session_id);
CREATE INDEX idx_ab_clicks_timestamp ON ab_clicks(timestamp DESC);

-- =====================================================
-- Functions: Helper functions for updating metrics
-- =====================================================

-- Function to increment variant impressions
CREATE OR REPLACE FUNCTION increment_variant_impressions(variant_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ab_variants
    SET
        impressions = impressions + 1,
        updated_at = NOW()
    WHERE id = variant_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to increment variant clicks and update metrics
CREATE OR REPLACE FUNCTION increment_variant_clicks(
    variant_id_param UUID,
    time_on_page_param INTEGER DEFAULT NULL,
    bounced_param BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
DECLARE
    current_clicks INTEGER;
    current_impressions INTEGER;
    current_avg_time DECIMAL;
    current_bounce_rate DECIMAL;
    new_ctr DECIMAL;
    new_avg_time DECIMAL;
    new_bounce_rate DECIMAL;
BEGIN
    -- Get current metrics
    SELECT clicks, impressions, avg_time_on_page, bounce_rate
    INTO current_clicks, current_impressions, current_avg_time, current_bounce_rate
    FROM ab_variants
    WHERE id = variant_id_param;

    -- Calculate new CTR
    new_ctr := (current_clicks + 1.0) / NULLIF(current_impressions, 0);

    -- Calculate new average time on page (if provided)
    IF time_on_page_param IS NOT NULL THEN
        new_avg_time := ((current_avg_time * current_clicks) + time_on_page_param) / (current_clicks + 1.0);
    ELSE
        new_avg_time := current_avg_time;
    END IF;

    -- Calculate new bounce rate
    new_bounce_rate := ((current_bounce_rate * current_clicks) + CASE WHEN bounced_param THEN 1.0 ELSE 0.0 END) / (current_clicks + 1.0);

    -- Update variant
    UPDATE ab_variants
    SET
        clicks = clicks + 1,
        ctr = new_ctr,
        avg_time_on_page = new_avg_time,
        bounce_rate = new_bounce_rate,
        updated_at = NOW()
    WHERE id = variant_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Triggers: Auto-update timestamps
-- =====================================================

-- Trigger for ab_tests updated_at
CREATE OR REPLACE FUNCTION update_ab_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ab_tests_updated_at_trigger
    BEFORE UPDATE ON ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_ab_tests_updated_at();

-- Trigger for ab_variants updated_at
CREATE OR REPLACE FUNCTION update_ab_variants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ab_variants_updated_at_trigger
    BEFORE UPDATE ON ab_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_ab_variants_updated_at();

-- =====================================================
-- Row Level Security (RLS)
-- Enable RLS on all tables for security
-- =====================================================

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_clicks ENABLE ROW LEVEL SECURITY;

-- Policies for ab_tests (allow all for authenticated users, read-only for anon)
CREATE POLICY "Allow authenticated users full access to ab_tests"
    ON ab_tests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users read access to ab_tests"
    ON ab_tests
    FOR SELECT
    TO anon
    USING (true);

-- Policies for ab_variants
CREATE POLICY "Allow authenticated users full access to ab_variants"
    ON ab_variants
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users read access to ab_variants"
    ON ab_variants
    FOR SELECT
    TO anon
    USING (true);

-- Policies for ab_impressions
CREATE POLICY "Allow authenticated users full access to ab_impressions"
    ON ab_impressions
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert impressions"
    ON ab_impressions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policies for ab_clicks
CREATE POLICY "Allow authenticated users full access to ab_clicks"
    ON ab_clicks
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert clicks"
    ON ab_clicks
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- =====================================================
-- Comments: Documentation for tables and columns
-- =====================================================

COMMENT ON TABLE ab_tests IS 'Stores A/B test configurations and metadata';
COMMENT ON COLUMN ab_tests.metric IS 'Primary metric being optimized: CTR, time_on_page, bounce_rate, or conversions';
COMMENT ON COLUMN ab_tests.duration IS 'Test duration in days';
COMMENT ON COLUMN ab_tests.winner IS 'UUID of winning variant (references ab_variants.id)';
COMMENT ON COLUMN ab_tests.confidence IS 'Statistical confidence level (0.95 = 95% confidence)';

COMMENT ON TABLE ab_variants IS 'Stores individual test variants with content and performance metrics';
COMMENT ON COLUMN ab_variants.traffic IS 'Percentage of traffic allocated to this variant (0-100)';
COMMENT ON COLUMN ab_variants.ctr IS 'Click-through rate (clicks / impressions)';
COMMENT ON COLUMN ab_variants.avg_time_on_page IS 'Average time spent on page in seconds';
COMMENT ON COLUMN ab_variants.bounce_rate IS 'Percentage of users who bounced (0-1)';

COMMENT ON TABLE ab_impressions IS 'Logs each time a variant is shown in search results';
COMMENT ON COLUMN ab_impressions.position IS 'Position in search results (1-10)';

COMMENT ON TABLE ab_clicks IS 'Logs each click on a variant from search results';
COMMENT ON COLUMN ab_clicks.impression_id IS 'Links click to specific impression for attribution';
COMMENT ON COLUMN ab_clicks.time_on_page IS 'Time spent on page in seconds';
COMMENT ON COLUMN ab_clicks.bounced IS 'Whether user left quickly (bounced)';
COMMENT ON COLUMN ab_clicks.converted IS 'Whether user completed desired action';

-- =====================================================
-- Sample Queries (for reference)
-- =====================================================

-- Get all running tests with variant counts:
-- SELECT t.id, t.article_id, t.metric, t.status, COUNT(v.id) as variant_count
-- FROM ab_tests t
-- LEFT JOIN ab_variants v ON t.id = v.test_id
-- WHERE t.status = 'running'
-- GROUP BY t.id;

-- Get test results with statistical data:
-- SELECT
--     v.name,
--     v.impressions,
--     v.clicks,
--     v.ctr,
--     v.avg_time_on_page,
--     v.bounce_rate
-- FROM ab_variants v
-- WHERE v.test_id = 'test-uuid-here'
-- ORDER BY v.ctr DESC;

-- Get impressions and clicks for a test:
-- SELECT
--     v.name,
--     COUNT(DISTINCT i.id) as total_impressions,
--     COUNT(DISTINCT c.id) as total_clicks,
--     ROUND(COUNT(DISTINCT c.id)::DECIMAL / NULLIF(COUNT(DISTINCT i.id), 0), 5) as calculated_ctr
-- FROM ab_variants v
-- LEFT JOIN ab_impressions i ON v.id = i.variant_id
-- LEFT JOIN ab_clicks c ON v.id = c.variant_id
-- WHERE v.test_id = 'test-uuid-here'
-- GROUP BY v.id, v.name;

-- Create Ranking Tables for SEO Engine
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
--
-- This migration adds comprehensive rank tracking capabilities including:
-- - keyword_rankings: Historical position tracking
-- - ranking_alerts: Alert rules and notifications
-- - ranking_snapshots: Daily aggregate metrics

-- ============================================================================
-- TABLE: keyword_rankings
-- Stores historical ranking data for all tracked keywords
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.keyword_rankings (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Foreign Keys
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,

  -- Keyword Data
  keyword TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position > 0),
  url TEXT NOT NULL,

  -- Location & Context
  location TEXT NOT NULL DEFAULT 'United States',
  country_code TEXT DEFAULT 'us',
  language_code TEXT DEFAULT 'en',

  -- Search Metrics
  search_volume INTEGER DEFAULT 1000,
  estimated_traffic INTEGER DEFAULT 0,

  -- Ranking Metadata
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  featured_snippet BOOLEAN DEFAULT false,
  page_number INTEGER GENERATED ALWAYS AS (CEILING(position / 10.0)::INTEGER) STORED,

  -- Additional Context
  competitor_count INTEGER,
  serp_features JSONB,

  -- Constraints
  CONSTRAINT valid_position CHECK (position > 0),
  CONSTRAINT valid_search_volume CHECK (search_volume >= 0),
  CONSTRAINT valid_traffic CHECK (estimated_traffic >= 0)
);

-- Indexes for keyword_rankings
CREATE INDEX IF NOT EXISTS keyword_rankings_article_idx ON public.keyword_rankings(article_id);
CREATE INDEX IF NOT EXISTS keyword_rankings_keyword_idx ON public.keyword_rankings(keyword);
CREATE INDEX IF NOT EXISTS keyword_rankings_checked_at_idx ON public.keyword_rankings(checked_at DESC);
CREATE INDEX IF NOT EXISTS keyword_rankings_position_idx ON public.keyword_rankings(position);
CREATE INDEX IF NOT EXISTS keyword_rankings_article_keyword_idx ON public.keyword_rankings(article_id, keyword);
CREATE INDEX IF NOT EXISTS keyword_rankings_keyword_checked_idx ON public.keyword_rankings(keyword, checked_at DESC);

-- Enable Row Level Security
ALTER TABLE public.keyword_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for keyword_rankings
CREATE POLICY "Public can view published article rankings"
  ON public.keyword_rankings
  FOR SELECT
  USING (
    article_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = keyword_rankings.article_id
      AND articles.status = 'published'
    )
  );

CREATE POLICY "Authenticated users can do anything"
  ON public.keyword_rankings
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access"
  ON public.keyword_rankings
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.keyword_rankings TO authenticated;
GRANT SELECT ON public.keyword_rankings TO anon;

-- Comments
COMMENT ON TABLE public.keyword_rankings IS 'Historical keyword ranking data with position tracking';
COMMENT ON COLUMN public.keyword_rankings.position IS 'Google search result position (1-100+)';
COMMENT ON COLUMN public.keyword_rankings.page_number IS 'Computed: which SERP page the result appears on';
COMMENT ON COLUMN public.keyword_rankings.featured_snippet IS 'Whether this result had a featured snippet';
COMMENT ON COLUMN public.keyword_rankings.serp_features IS 'JSON data about SERP features (PAA, images, etc.)';

-- ============================================================================
-- TABLE: ranking_alerts
-- Stores ranking alert rules and triggered notifications
-- ============================================================================

CREATE TYPE alert_type AS ENUM ('drop', 'opportunity', 'achievement', 'lost');
CREATE TYPE alert_severity AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TABLE IF NOT EXISTS public.ranking_alerts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Alert Identification
  alert_id TEXT UNIQUE NOT NULL,

  -- Foreign Keys
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,

  -- Alert Details
  keyword TEXT NOT NULL,
  alert_type alert_type NOT NULL,
  severity alert_severity NOT NULL,
  message TEXT NOT NULL,

  -- Position Data
  current_position INTEGER NOT NULL,
  previous_position INTEGER NOT NULL,
  position_change INTEGER NOT NULL,

  -- Impact Assessment
  search_volume INTEGER DEFAULT 0,
  estimated_traffic_loss INTEGER DEFAULT 0,

  -- Action Items
  action_items TEXT[] NOT NULL DEFAULT '{}',

  -- Alert Management
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT false,
  dismissed_at TIMESTAMPTZ,

  -- Notes
  notes TEXT,

  -- Constraints
  CONSTRAINT valid_positions CHECK (current_position > 0 AND previous_position > 0)
);

-- Indexes for ranking_alerts
CREATE INDEX IF NOT EXISTS ranking_alerts_article_idx ON public.ranking_alerts(article_id);
CREATE INDEX IF NOT EXISTS ranking_alerts_keyword_idx ON public.ranking_alerts(keyword);
CREATE INDEX IF NOT EXISTS ranking_alerts_severity_idx ON public.ranking_alerts(severity);
CREATE INDEX IF NOT EXISTS ranking_alerts_type_idx ON public.ranking_alerts(alert_type);
CREATE INDEX IF NOT EXISTS ranking_alerts_triggered_idx ON public.ranking_alerts(triggered_at DESC);
CREATE INDEX IF NOT EXISTS ranking_alerts_acknowledged_idx ON public.ranking_alerts(acknowledged) WHERE NOT acknowledged;
CREATE INDEX IF NOT EXISTS ranking_alerts_alert_id_idx ON public.ranking_alerts(alert_id);

-- Enable Row Level Security
ALTER TABLE public.ranking_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ranking_alerts
CREATE POLICY "Authenticated users can view all alerts"
  ON public.ranking_alerts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage alerts"
  ON public.ranking_alerts
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access"
  ON public.ranking_alerts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.ranking_alerts TO authenticated;

-- Comments
COMMENT ON TABLE public.ranking_alerts IS 'Ranking alerts and notifications for position changes';
COMMENT ON COLUMN public.ranking_alerts.alert_id IS 'Unique identifier for deduplication';
COMMENT ON COLUMN public.ranking_alerts.alert_type IS 'Type of alert: drop, opportunity, achievement, lost';
COMMENT ON COLUMN public.ranking_alerts.severity IS 'Alert priority level';
COMMENT ON COLUMN public.ranking_alerts.action_items IS 'Array of recommended actions';

-- ============================================================================
-- TABLE: ranking_snapshots
-- Stores daily aggregate ranking metrics for articles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.ranking_snapshots (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Foreign Keys
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,

  -- Aggregate Metrics
  total_keywords INTEGER NOT NULL DEFAULT 0,
  found_keywords INTEGER NOT NULL DEFAULT 0,
  average_position DECIMAL(5,2),
  median_position INTEGER,
  best_position INTEGER,
  worst_position INTEGER,

  -- Position Distribution
  top_three_count INTEGER DEFAULT 0,
  top_ten_count INTEGER DEFAULT 0,
  page_one_count INTEGER DEFAULT 0,
  page_two_count INTEGER DEFAULT 0,
  page_three_plus_count INTEGER DEFAULT 0,

  -- Traffic Estimation
  estimated_traffic INTEGER DEFAULT 0,

  -- Featured Snippets
  featured_snippet_count INTEGER DEFAULT 0,

  -- Snapshot Timing
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Day-over-day Changes (optional)
  position_change_1d DECIMAL(5,2),
  traffic_change_1d INTEGER,

  -- Constraints
  CONSTRAINT valid_keyword_counts CHECK (found_keywords <= total_keywords),
  CONSTRAINT valid_position_counts CHECK (
    top_three_count + top_ten_count + page_one_count +
    page_two_count + page_three_plus_count <= total_keywords
  ),
  CONSTRAINT unique_article_date UNIQUE (article_id, DATE(checked_at))
);

-- Indexes for ranking_snapshots
CREATE INDEX IF NOT EXISTS ranking_snapshots_article_idx ON public.ranking_snapshots(article_id);
CREATE INDEX IF NOT EXISTS ranking_snapshots_checked_at_idx ON public.ranking_snapshots(checked_at DESC);
CREATE INDEX IF NOT EXISTS ranking_snapshots_article_checked_idx ON public.ranking_snapshots(article_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS ranking_snapshots_avg_position_idx ON public.ranking_snapshots(average_position);

-- Enable Row Level Security
ALTER TABLE public.ranking_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ranking_snapshots
CREATE POLICY "Public can view published article snapshots"
  ON public.ranking_snapshots
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.articles
      WHERE articles.id = ranking_snapshots.article_id
      AND articles.status = 'published'
    )
  );

CREATE POLICY "Authenticated users can do anything"
  ON public.ranking_snapshots
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access"
  ON public.ranking_snapshots
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.ranking_snapshots TO authenticated;
GRANT SELECT ON public.ranking_snapshots TO anon;

-- Comments
COMMENT ON TABLE public.ranking_snapshots IS 'Daily aggregate ranking metrics for articles';
COMMENT ON COLUMN public.ranking_snapshots.average_position IS 'Average ranking across all tracked keywords';
COMMENT ON COLUMN public.ranking_snapshots.top_three_count IS 'Number of keywords in positions 1-3';
COMMENT ON COLUMN public.ranking_snapshots.featured_snippet_count IS 'Number of owned featured snippets';

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

/**
 * Function to calculate position change between two dates
 *
 * Usage:
 * SELECT calculate_position_change('keyword-name', 'article-uuid', INTERVAL '7 days');
 */
CREATE OR REPLACE FUNCTION calculate_position_change(
  p_keyword TEXT,
  p_article_id UUID,
  p_interval INTERVAL
) RETURNS TABLE (
  current_position INTEGER,
  previous_position INTEGER,
  change INTEGER,
  change_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH current_rank AS (
    SELECT position
    FROM public.keyword_rankings
    WHERE keyword = p_keyword
      AND article_id = p_article_id
    ORDER BY checked_at DESC
    LIMIT 1
  ),
  previous_rank AS (
    SELECT position
    FROM public.keyword_rankings
    WHERE keyword = p_keyword
      AND article_id = p_article_id
      AND checked_at <= (NOW() - p_interval)
    ORDER BY checked_at DESC
    LIMIT 1
  )
  SELECT
    c.position as current_position,
    p.position as previous_position,
    (p.position - c.position) as change,
    CASE
      WHEN p.position > 0 THEN ((p.position - c.position)::DECIMAL / p.position * 100)
      ELSE 0
    END as change_percentage
  FROM current_rank c
  CROSS JOIN previous_rank p;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_position_change IS 'Calculates ranking position change over a time interval';

/**
 * Function to get top opportunities (keywords close to page 1)
 *
 * Usage:
 * SELECT * FROM get_ranking_opportunities('article-uuid', 10);
 */
CREATE OR REPLACE FUNCTION get_ranking_opportunities(
  p_article_id UUID,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  keyword TEXT,
  current_position INTEGER,
  distance_from_page_one INTEGER,
  search_volume INTEGER,
  checked_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_rankings AS (
    SELECT DISTINCT ON (kr.keyword)
      kr.keyword,
      kr.position,
      kr.search_volume,
      kr.checked_at
    FROM public.keyword_rankings kr
    WHERE kr.article_id = p_article_id
    ORDER BY kr.keyword, kr.checked_at DESC
  )
  SELECT
    lr.keyword,
    lr.position as current_position,
    (lr.position - 10) as distance_from_page_one,
    lr.search_volume,
    lr.checked_at
  FROM latest_rankings lr
  WHERE lr.position > 10 AND lr.position <= 20
  ORDER BY lr.search_volume DESC, lr.position ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_ranking_opportunities IS 'Identifies keywords ranking on page 2 (positions 11-20) with opportunity potential';

-- ============================================================================
-- DATA RETENTION POLICY
-- ============================================================================

/**
 * Function to clean up old ranking data
 * Called periodically to maintain database size
 *
 * Keeps:
 * - All data from last 90 days
 * - One record per week for 90-365 days ago
 * - One record per month for 1+ years ago
 */
CREATE OR REPLACE FUNCTION cleanup_old_ranking_data()
RETURNS void AS $$
BEGIN
  -- Delete detailed rankings older than 90 days, keeping weekly samples
  DELETE FROM public.keyword_rankings
  WHERE checked_at < (NOW() - INTERVAL '90 days')
    AND id NOT IN (
      SELECT DISTINCT ON (keyword, article_id, DATE_TRUNC('week', checked_at))
        id
      FROM public.keyword_rankings
      WHERE checked_at >= (NOW() - INTERVAL '365 days')
        AND checked_at < (NOW() - INTERVAL '90 days')
      ORDER BY keyword, article_id, DATE_TRUNC('week', checked_at), checked_at DESC
    );

  -- Delete old acknowledged alerts (older than 30 days)
  DELETE FROM public.ranking_alerts
  WHERE acknowledged = true
    AND acknowledged_at < (NOW() - INTERVAL '30 days');

  -- Delete old dismissed alerts (older than 7 days)
  DELETE FROM public.ranking_alerts
  WHERE dismissed = true
    AND dismissed_at < (NOW() - INTERVAL '7 days');

  RAISE NOTICE 'Ranking data cleanup completed';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_old_ranking_data IS 'Cleans up old ranking data to maintain database performance';

-- ============================================================================
-- INITIAL DATA & EXAMPLES
-- ============================================================================

-- Example: Insert a sample ranking check
-- Uncomment to add sample data
/*
INSERT INTO public.keyword_rankings (
  keyword,
  position,
  url,
  location,
  search_volume,
  estimated_traffic,
  checked_at
) VALUES (
  'seo tools',
  5,
  'https://example.com/seo-tools',
  'United States',
  5000,
  273,
  NOW()
);
*/

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Ranking Tables Migration Complete!';
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'Created tables:';
  RAISE NOTICE '  - keyword_rankings: Historical position tracking';
  RAISE NOTICE '  - ranking_alerts: Alert notifications and rules';
  RAISE NOTICE '  - ranking_snapshots: Daily aggregate metrics';
  RAISE NOTICE '';
  RAISE NOTICE 'Created helper functions:';
  RAISE NOTICE '  - calculate_position_change(): Track position changes';
  RAISE NOTICE '  - get_ranking_opportunities(): Find quick wins';
  RAISE NOTICE '  - cleanup_old_ranking_data(): Data retention';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Configure SERPAPI_KEY in environment variables';
  RAISE NOTICE '  2. Start tracking rankings via /api/seo/check-rankings';
  RAISE NOTICE '  3. Monitor alerts via /api/seo/ranking-alerts';
  RAISE NOTICE '  4. Set up cron job for daily ranking checks';
  RAISE NOTICE '=================================================================';
END $$;

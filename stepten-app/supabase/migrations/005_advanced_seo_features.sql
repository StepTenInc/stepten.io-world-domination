-- Migration: Advanced SEO Features
-- Description: Creates tables for all 11 advanced SEO features
-- Date: 2026-01-20
-- Features: SERP Analysis, Content Clusters, NLP Entities, Featured Snippets,
--           Content Refresh, Multi-Language, A/B Testing, Rank Tracking,
--           Content Score Predictor, AI SEO Agent

-- ============================================================================
-- 1. SERP ANALYSIS & COMPETITOR INTELLIGENCE
-- ============================================================================

CREATE TABLE IF NOT EXISTS serp_analyses (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  featured_snippet_type TEXT CHECK (featured_snippet_type IN ('paragraph', 'list', 'table', 'video', NULL)),
  featured_snippet_content TEXT,
  featured_snippet_source TEXT,
  avg_word_count INTEGER,
  common_headings JSONB DEFAULT '[]'::jsonb,
  content_gaps JSONB DEFAULT '[]'::jsonb,
  target_word_count INTEGER,
  must_have_topics JSONB DEFAULT '[]'::jsonb,
  suggested_headings JSONB DEFAULT '[]'::jsonb,
  content_angle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_serp_analyses_keyword ON serp_analyses(keyword);
CREATE INDEX idx_serp_analyses_created_at ON serp_analyses(created_at DESC);

CREATE TABLE IF NOT EXISTS serp_articles (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 100),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  domain TEXT,
  snippet TEXT,
  word_count INTEGER,
  headings JSONB DEFAULT '[]'::jsonb,
  topics JSONB DEFAULT '[]'::jsonb,
  entities JSONB DEFAULT '[]'::jsonb,
  has_featured_snippet BOOLEAN DEFAULT false,
  has_video BOOLEAN DEFAULT false,
  has_faq BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (analysis_id) REFERENCES serp_analyses(id) ON DELETE CASCADE
);

CREATE INDEX idx_serp_articles_analysis_id ON serp_articles(analysis_id);
CREATE INDEX idx_serp_articles_position ON serp_articles(position);
CREATE INDEX idx_serp_articles_domain ON serp_articles(domain);

-- ============================================================================
-- 2. CONTENT CLUSTER BUILDER
-- ============================================================================

CREATE TYPE cluster_status AS ENUM ('planning', 'in_progress', 'completed', 'paused');

CREATE TABLE IF NOT EXISTS content_clusters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  main_keyword TEXT NOT NULL,
  pillar_article_id TEXT,
  status cluster_status DEFAULT 'planning',
  total_articles INTEGER DEFAULT 0,
  completed_articles INTEGER DEFAULT 0,
  estimated_time_to_rank TEXT,
  priority INTEGER DEFAULT 50 CHECK (priority >= 0 AND priority <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (pillar_article_id) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_content_clusters_status ON content_clusters(status);
CREATE INDEX idx_content_clusters_priority ON content_clusters(priority DESC);
CREATE INDEX idx_content_clusters_created_at ON content_clusters(created_at DESC);

CREATE TABLE IF NOT EXISTS cluster_articles (
  id TEXT PRIMARY KEY,
  cluster_id TEXT NOT NULL,
  article_id TEXT,
  article_role TEXT NOT NULL CHECK (article_role IN ('pillar', 'cluster', 'supporting')),
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  target_word_count INTEGER,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'writing', 'published')),
  position_in_cluster INTEGER,
  internal_links_to JSONB DEFAULT '[]'::jsonb,
  internal_links_from JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (cluster_id) REFERENCES content_clusters(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_cluster_articles_cluster_id ON cluster_articles(cluster_id);
CREATE INDEX idx_cluster_articles_article_id ON cluster_articles(article_id);
CREATE INDEX idx_cluster_articles_role ON cluster_articles(article_role);
CREATE INDEX idx_cluster_articles_status ON cluster_articles(status);

-- ============================================================================
-- 3. NLP ENTITY & TOPIC COVERAGE
-- ============================================================================

CREATE TYPE entity_type AS ENUM ('person', 'organization', 'concept', 'product', 'location', 'event', 'other');
CREATE TYPE coverage_level AS ENUM ('missing', 'mentioned', 'explained', 'detailed');

CREATE TABLE IF NOT EXISTS article_entities (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_type entity_type NOT NULL,
  mentions INTEGER DEFAULT 1,
  coverage coverage_level DEFAULT 'mentioned',
  context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_article_entities_article_id ON article_entities(article_id);
CREATE INDEX idx_article_entities_entity_type ON article_entities(entity_type);
CREATE INDEX idx_article_entities_coverage ON article_entities(coverage);

CREATE TABLE IF NOT EXISTS topic_coverage_analyses (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  completeness_score INTEGER CHECK (completeness_score >= 0 AND completeness_score <= 100),
  required_entities JSONB DEFAULT '[]'::jsonb,
  missing_entities JSONB DEFAULT '[]'::jsonb,
  semantic_keywords JSONB DEFAULT '[]'::jsonb,
  missing_subtopics JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_topic_coverage_article_id ON topic_coverage_analyses(article_id);
CREATE INDEX idx_topic_coverage_completeness ON topic_coverage_analyses(completeness_score);

-- ============================================================================
-- 4. FEATURED SNIPPET OPTIMIZER
-- ============================================================================

CREATE TABLE IF NOT EXISTS snippet_optimizations (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  current_snippet_type TEXT,
  current_snippet_holder TEXT,
  recommended_format TEXT NOT NULL CHECK (recommended_format IN ('paragraph', 'list', 'table')),
  optimized_content TEXT NOT NULL,
  win_probability INTEGER CHECK (win_probability >= 0 AND win_probability <= 100),
  insertion_point TEXT,
  paragraph_index INTEGER,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'applied', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_snippet_optimizations_article_id ON snippet_optimizations(article_id);
CREATE INDEX idx_snippet_optimizations_keyword ON snippet_optimizations(keyword);
CREATE INDEX idx_snippet_optimizations_status ON snippet_optimizations(status);
CREATE INDEX idx_snippet_optimizations_win_probability ON snippet_optimizations(win_probability DESC);

-- ============================================================================
-- 5. CONTENT REFRESH DETECTOR
-- ============================================================================

CREATE TYPE refresh_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS content_freshness_analyses (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  freshness_score INTEGER CHECK (freshness_score >= 0 AND freshness_score <= 100),
  last_updated_days INTEGER,
  outdated_statistics JSONB DEFAULT '[]'::jsonb,
  outdated_dates JSONB DEFAULT '[]'::jsonb,
  outdated_technologies JSONB DEFAULT '[]'::jsonb,
  traffic_trend TEXT CHECK (traffic_trend IN ('up', 'stable', 'down', 'unknown')),
  traffic_change_percentage DECIMAL(5,2),
  refresh_priority refresh_priority DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_freshness_article_id ON content_freshness_analyses(article_id);
CREATE INDEX idx_freshness_score ON content_freshness_analyses(freshness_score);
CREATE INDEX idx_freshness_priority ON content_freshness_analyses(refresh_priority);

CREATE TABLE IF NOT EXISTS refresh_recommendations (
  id TEXT PRIMARY KEY,
  freshness_analysis_id TEXT NOT NULL,
  section_title TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('update_statistics', 'add_section', 'remove_section', 'update_examples', 'update_screenshots')),
  current_content TEXT,
  suggested_content TEXT,
  reasoning TEXT,
  priority refresh_priority DEFAULT 'medium',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (freshness_analysis_id) REFERENCES content_freshness_analyses(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_recs_analysis_id ON refresh_recommendations(freshness_analysis_id);
CREATE INDEX idx_refresh_recs_priority ON refresh_recommendations(priority);
CREATE INDEX idx_refresh_recs_status ON refresh_recommendations(status);

-- ============================================================================
-- 6. MULTI-LANGUAGE SUPPORT
-- ============================================================================

CREATE TABLE IF NOT EXISTS article_translations (
  id TEXT PRIMARY KEY,
  source_article_id TEXT NOT NULL,
  language_code TEXT NOT NULL, -- ISO 639-1 (e.g., 'es', 'fr', 'de')
  translated_title TEXT NOT NULL,
  translated_slug TEXT NOT NULL UNIQUE,
  translated_content TEXT NOT NULL,
  translated_excerpt TEXT,
  translated_meta_title TEXT,
  translated_meta_description TEXT,
  cultural_adaptations JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  translator TEXT, -- 'ai' or human translator name
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (source_article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_translations_source_article ON article_translations(source_article_id);
CREATE INDEX idx_translations_language ON article_translations(language_code);
CREATE INDEX idx_translations_status ON article_translations(status);
CREATE INDEX idx_translations_slug ON article_translations(translated_slug);

CREATE TABLE IF NOT EXISTS hreflang_tags (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  language_code TEXT NOT NULL,
  region_code TEXT, -- ISO 3166-1 alpha-2 (e.g., 'US', 'GB', 'ES')
  href TEXT NOT NULL,
  is_x_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_hreflang_article_id ON hreflang_tags(article_id);
CREATE INDEX idx_hreflang_language ON hreflang_tags(language_code);

-- ============================================================================
-- 7. A/B TESTING DASHBOARD
-- ============================================================================

CREATE TYPE test_status AS ENUM ('draft', 'running', 'completed', 'paused');

CREATE TABLE IF NOT EXISTS ab_tests (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('title', 'meta_description', 'intro', 'full_content')),
  status test_status DEFAULT 'draft',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  winner_variant_id TEXT,
  confidence_level DECIMAL(5,4),
  min_sample_size INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_ab_tests_article_id ON ab_tests(article_id);
CREATE INDEX idx_ab_tests_status ON ab_tests(status);
CREATE INDEX idx_ab_tests_started_at ON ab_tests(started_at DESC);

CREATE TABLE IF NOT EXISTS ab_variants (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  variant_name TEXT NOT NULL, -- 'A', 'B', 'C', etc.
  variant_content JSONB NOT NULL, -- { title, meta_description, intro, etc. }
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  is_control BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE
);

CREATE INDEX idx_ab_variants_test_id ON ab_variants(test_id);
CREATE INDEX idx_ab_variants_ctr ON ab_variants(ctr DESC);

CREATE TABLE IF NOT EXISTS ab_impressions (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  user_id TEXT, -- Can be session ID or user ID
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  device TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES ab_variants(id) ON DELETE CASCADE
);

CREATE INDEX idx_ab_impressions_test_id ON ab_impressions(test_id);
CREATE INDEX idx_ab_impressions_variant_id ON ab_impressions(variant_id);
CREATE INDEX idx_ab_impressions_timestamp ON ab_impressions(timestamp DESC);

CREATE TABLE IF NOT EXISTS ab_clicks (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  impression_id TEXT,
  user_id TEXT,
  clicked_element TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (test_id) REFERENCES ab_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES ab_variants(id) ON DELETE CASCADE
);

CREATE INDEX idx_ab_clicks_test_id ON ab_clicks(test_id);
CREATE INDEX idx_ab_clicks_variant_id ON ab_clicks(variant_id);
CREATE INDEX idx_ab_clicks_timestamp ON ab_clicks(timestamp DESC);

-- ============================================================================
-- 8. RANK TRACKING INTEGRATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS keyword_rankings (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  position INTEGER CHECK (position >= 1 AND position <= 100),
  previous_position INTEGER,
  position_change INTEGER,
  url TEXT NOT NULL,
  search_engine TEXT DEFAULT 'google' CHECK (search_engine IN ('google', 'bing', 'yahoo')),
  location TEXT, -- e.g., 'US', 'UK', 'Global'
  device TEXT DEFAULT 'desktop' CHECK (device IN ('desktop', 'mobile', 'tablet')),
  search_volume INTEGER,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_rankings_article_id ON keyword_rankings(article_id);
CREATE INDEX idx_rankings_keyword ON keyword_rankings(keyword);
CREATE INDEX idx_rankings_position ON keyword_rankings(position);
CREATE INDEX idx_rankings_checked_at ON keyword_rankings(checked_at DESC);

CREATE TABLE IF NOT EXISTS ranking_alerts (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('drop', 'rise', 'entered_top10', 'left_top10', 'featured_snippet_won', 'featured_snippet_lost')),
  previous_position INTEGER,
  new_position INTEGER,
  position_change INTEGER,
  threshold INTEGER,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_ranking_alerts_article_id ON ranking_alerts(article_id);
CREATE INDEX idx_ranking_alerts_triggered_at ON ranking_alerts(triggered_at DESC);
CREATE INDEX idx_ranking_alerts_acknowledged ON ranking_alerts(acknowledged);

CREATE TABLE IF NOT EXISTS ranking_snapshots (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  rankings_data JSONB NOT NULL, -- Full snapshot of all keyword rankings for that day
  avg_position DECIMAL(5,2),
  top_3_keywords INTEGER DEFAULT 0,
  top_10_keywords INTEGER DEFAULT 0,
  total_keywords INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_ranking_snapshots_article_id ON ranking_snapshots(article_id);
CREATE INDEX idx_ranking_snapshots_date ON ranking_snapshots(snapshot_date DESC);
CREATE INDEX idx_ranking_snapshots_avg_position ON ranking_snapshots(avg_position);

-- ============================================================================
-- 9. CONTENT SCORE PREDICTOR
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_predictions (
  id TEXT PRIMARY KEY,
  article_id TEXT,
  article_content TEXT NOT NULL, -- Can predict before article is saved
  target_keyword TEXT NOT NULL,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  predicted_traffic_monthly INTEGER,
  predicted_ranking_position INTEGER,
  confidence DECIMAL(5,4),
  top_positive_factors JSONB DEFAULT '[]'::jsonb,
  top_negative_factors JSONB DEFAULT '[]'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  feature_vector JSONB, -- All 50+ features
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_predictions_article_id ON content_predictions(article_id);
CREATE INDEX idx_predictions_quality_score ON content_predictions(quality_score DESC);
CREATE INDEX idx_predictions_created_at ON content_predictions(created_at DESC);

CREATE TABLE IF NOT EXISTS article_performance_history (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  date DATE NOT NULL,
  pageviews INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_time_on_page INTEGER, -- seconds
  bounce_rate DECIMAL(5,4),
  conversions INTEGER DEFAULT 0,
  avg_ranking_position DECIMAL(5,2),
  backlinks INTEGER DEFAULT 0,
  social_shares INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX idx_performance_article_id ON article_performance_history(article_id);
CREATE INDEX idx_performance_date ON article_performance_history(date DESC);

-- ============================================================================
-- 10. AI SEO AGENT (AUTONOMOUS CONTENT GENERATION)
-- ============================================================================

CREATE TYPE agent_status AS ENUM ('active', 'paused', 'stopped');
CREATE TYPE task_status AS ENUM ('queued', 'in_progress', 'completed', 'failed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS seo_agents (
  id TEXT PRIMARY KEY,
  agent_name TEXT NOT NULL,
  description TEXT,
  status agent_status DEFAULT 'active',
  auto_research BOOLEAN DEFAULT true,
  auto_write BOOLEAN DEFAULT true,
  auto_optimize BOOLEAN DEFAULT true,
  auto_publish BOOLEAN DEFAULT false, -- Requires human approval by default
  auto_internal_link BOOLEAN DEFAULT true,
  auto_refresh BOOLEAN DEFAULT false,
  quality_threshold INTEGER DEFAULT 75 CHECK (quality_threshold >= 0 AND quality_threshold <= 100),
  daily_article_limit INTEGER DEFAULT 1,
  articles_created INTEGER DEFAULT 0,
  avg_quality_score DECIMAL(5,2),
  estimated_monthly_traffic INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_agents_status ON seo_agents(status);
CREATE INDEX idx_seo_agents_articles_created ON seo_agents(articles_created DESC);

CREATE TABLE IF NOT EXISTS agent_tasks (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('research_keyword', 'write_article', 'optimize_seo', 'internal_link', 'refresh_content', 'analyze_competitors')),
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'queued',
  input_data JSONB NOT NULL, -- { keyword, cluster_id, article_id, etc. }
  output_data JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (agent_id) REFERENCES seo_agents(id) ON DELETE CASCADE
);

CREATE INDEX idx_agent_tasks_agent_id ON agent_tasks(agent_id);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority);
CREATE INDEX idx_agent_tasks_created_at ON agent_tasks(created_at DESC);

CREATE TABLE IF NOT EXISTS agent_articles (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  article_id TEXT, -- NULL until published
  article_data JSONB NOT NULL, -- Full article content before publishing
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  human_review_status TEXT DEFAULT 'pending' CHECK (human_review_status IN ('pending', 'approved', 'rejected', 'revision_requested')),
  reviewer_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (agent_id) REFERENCES seo_agents(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES agent_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_agent_articles_agent_id ON agent_articles(agent_id);
CREATE INDEX idx_agent_articles_task_id ON agent_articles(task_id);
CREATE INDEX idx_agent_articles_review_status ON agent_articles(human_review_status);
CREATE INDEX idx_agent_articles_quality_score ON agent_articles(quality_score DESC);

CREATE TABLE IF NOT EXISTS agent_metrics (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  date DATE NOT NULL,
  tasks_queued INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  tasks_failed INTEGER DEFAULT 0,
  articles_generated INTEGER DEFAULT 0,
  articles_approved INTEGER DEFAULT 0,
  articles_rejected INTEGER DEFAULT 0,
  avg_quality_score DECIMAL(5,2),
  avg_seo_score DECIMAL(5,2),
  total_traffic_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (agent_id) REFERENCES seo_agents(id) ON DELETE CASCADE,
  UNIQUE(agent_id, date)
);

CREATE INDEX idx_agent_metrics_agent_id ON agent_metrics(agent_id);
CREATE INDEX idx_agent_metrics_date ON agent_metrics(date DESC);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_serp_analyses_updated_at BEFORE UPDATE ON serp_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_clusters_updated_at BEFORE UPDATE ON content_clusters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cluster_articles_updated_at BEFORE UPDATE ON cluster_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_entities_updated_at BEFORE UPDATE ON article_entities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_coverage_updated_at BEFORE UPDATE ON topic_coverage_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_snippet_optimizations_updated_at BEFORE UPDATE ON snippet_optimizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freshness_analyses_updated_at BEFORE UPDATE ON content_freshness_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON article_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_agents_updated_at BEFORE UPDATE ON seo_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- View: Article SEO Health Dashboard
CREATE OR REPLACE VIEW article_seo_health AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.status,
  a.seo_score,
  a.word_count,
  kr.position as current_position,
  cfa.freshness_score,
  cfa.refresh_priority,
  so.win_probability as snippet_win_probability,
  tca.completeness_score as topic_completeness,
  COUNT(DISTINCT ils.id) as internal_links_suggested,
  COUNT(DISTINCT ila.id) as internal_links_applied
FROM articles a
LEFT JOIN keyword_rankings kr ON a.id = kr.article_id AND kr.keyword = a.main_keyword
LEFT JOIN content_freshness_analyses cfa ON a.id = cfa.article_id
LEFT JOIN snippet_optimizations so ON a.id = so.article_id AND so.status = 'suggested'
LEFT JOIN topic_coverage_analyses tca ON a.id = tca.article_id
LEFT JOIN internal_link_suggestions ils ON a.id = ils.source_article_id
LEFT JOIN internal_links_applied ila ON a.id = ila.source_article_id
GROUP BY a.id, a.title, a.slug, a.status, a.seo_score, a.word_count, kr.position,
         cfa.freshness_score, cfa.refresh_priority, so.win_probability, tca.completeness_score;

-- View: Content Cluster Progress
CREATE OR REPLACE VIEW cluster_progress AS
SELECT
  cc.id,
  cc.name,
  cc.main_keyword,
  cc.status,
  cc.total_articles,
  cc.completed_articles,
  ROUND((cc.completed_articles::decimal / NULLIF(cc.total_articles, 0)) * 100, 2) as completion_percentage,
  COUNT(CASE WHEN ca.status = 'published' THEN 1 END) as articles_published,
  COUNT(CASE WHEN ca.status = 'writing' THEN 1 END) as articles_in_progress,
  COUNT(CASE WHEN ca.status = 'planned' THEN 1 END) as articles_planned
FROM content_clusters cc
LEFT JOIN cluster_articles ca ON cc.id = ca.cluster_id
GROUP BY cc.id, cc.name, cc.main_keyword, cc.status, cc.total_articles, cc.completed_articles;

-- View: AI Agent Performance
CREATE OR REPLACE VIEW agent_performance_summary AS
SELECT
  sa.id,
  sa.agent_name,
  sa.status,
  sa.articles_created,
  sa.avg_quality_score,
  COUNT(DISTINCT at.id) as total_tasks,
  COUNT(CASE WHEN at.status = 'completed' THEN 1 END) as tasks_completed,
  COUNT(CASE WHEN at.status = 'failed' THEN 1 END) as tasks_failed,
  COUNT(CASE WHEN aa.human_review_status = 'approved' THEN 1 END) as articles_approved,
  COUNT(CASE WHEN aa.human_review_status = 'rejected' THEN 1 END) as articles_rejected,
  ROUND(AVG(aa.quality_score), 2) as avg_article_quality,
  ROUND(AVG(aa.seo_score), 2) as avg_article_seo_score
FROM seo_agents sa
LEFT JOIN agent_tasks at ON sa.id = at.agent_id
LEFT JOIN agent_articles aa ON sa.id = aa.agent_id
GROUP BY sa.id, sa.agent_name, sa.status, sa.articles_created, sa.avg_quality_score;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE serp_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE serp_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_coverage_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_freshness_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hreflang_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;

-- Policies: Authenticated users can do anything (admin panel)
CREATE POLICY "Authenticated users full access" ON serp_analyses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON serp_articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON content_clusters FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON cluster_articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON article_entities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON topic_coverage_analyses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON snippet_optimizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON content_freshness_analyses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON refresh_recommendations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON article_translations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON hreflang_tags FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ab_tests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ab_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ab_impressions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ab_clicks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON keyword_rankings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ranking_alerts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON ranking_snapshots FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON content_predictions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON article_performance_history FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON seo_agents FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON agent_tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON agent_articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users full access" ON agent_metrics FOR ALL USING (auth.role() = 'authenticated');

-- Policies: Public can view published translations
CREATE POLICY "Public can view published translations" ON article_translations FOR SELECT USING (status = 'published');

-- Policies: Public can participate in A/B tests (impression/click tracking)
CREATE POLICY "Public can insert impressions" ON ab_impressions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert clicks" ON ab_clicks FOR INSERT WITH CHECK (true);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON article_translations TO anon;
GRANT INSERT ON ab_impressions TO anon;
GRANT INSERT ON ab_clicks TO anon;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE serp_analyses IS 'Stores SERP analysis results for keywords';
COMMENT ON TABLE content_clusters IS 'Content cluster strategies with pillar/cluster/supporting hierarchy';
COMMENT ON TABLE article_entities IS 'NLP-extracted entities from articles for topic coverage';
COMMENT ON TABLE snippet_optimizations IS 'Featured snippet optimization recommendations';
COMMENT ON TABLE content_freshness_analyses IS 'Content freshness scores and refresh recommendations';
COMMENT ON TABLE article_translations IS 'Multi-language article translations';
COMMENT ON TABLE ab_tests IS 'A/B testing experiments for article optimization';
COMMENT ON TABLE keyword_rankings IS 'Daily keyword ranking position tracking';
COMMENT ON TABLE content_predictions IS 'ML-based predictions for article performance';
COMMENT ON TABLE seo_agents IS 'Autonomous AI agents for content generation';
COMMENT ON TABLE agent_tasks IS 'Task queue for AI agents';
COMMENT ON TABLE agent_articles IS 'Articles generated by AI agents awaiting human review';

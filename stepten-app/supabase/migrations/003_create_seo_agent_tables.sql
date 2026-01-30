-- Create SEO Agent Tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- =====================================================
-- 1. SEO Agents Table
-- =====================================================
-- Stores agent configurations and settings

CREATE TABLE IF NOT EXISTS public.seo_agents (
  -- Primary Key
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_run_at TIMESTAMPTZ,

  -- Basic Info
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped')),

  -- Strategy Configuration (JSONB)
  strategy JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example strategy structure:
  -- {
  --   "niche": "AI and machine learning",
  --   "articlesPerWeek": 3,
  --   "targetKeywords": 50,
  --   "focusFormats": ["pillar", "cluster", "supporting"],
  --   "qualityThreshold": 75,
  --   "contentClusterSize": 5
  -- }

  -- Autonomy Settings (JSONB)
  autonomy JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example autonomy structure:
  -- {
  --   "autoResearch": true,
  --   "autoWrite": true,
  --   "autoOptimize": true,
  --   "autoPublish": false,
  --   "autoInternalLink": true,
  --   "autoRefresh": true
  -- }

  -- Metrics (JSONB)
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb
  -- Example metrics structure:
  -- {
  --   "articlesCreated": 25,
  --   "articlesPublished": 20,
  --   "keywordsCovered": 25,
  --   "avgQualityScore": 82,
  --   "estimatedMonthlyTraffic": 15000
  -- }
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS seo_agents_status_idx ON public.seo_agents(status);
CREATE INDEX IF NOT EXISTS seo_agents_created_at_idx ON public.seo_agents(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_seo_agents_updated_at
  BEFORE UPDATE ON public.seo_agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. Agent Tasks Table
-- =====================================================
-- Stores task queue for agents

CREATE TABLE IF NOT EXISTS public.agent_tasks (
  -- Primary Key
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,

  -- Task Info
  type TEXT NOT NULL CHECK (type IN ('research', 'write', 'optimize', 'link', 'refresh', 'publish')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'review', 'complete', 'failed')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),

  -- Task Data (JSONB)
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example data structure:
  -- {
  --   "agentId": "agent-123",
  --   "keyword": "AI content writing",
  --   "searchVolume": 5000,
  --   "difficulty": 45,
  --   "targetPublishDate": "2026-02-15",
  --   "contentType": "pillar"
  -- }

  -- Error Info
  error TEXT,

  -- Foreign Keys (stored in data JSONB, not enforced)
  -- article_id: references agent_articles.id
  -- cluster_id: references content clusters
  -- agent_id: references seo_agents.id
  CONSTRAINT agent_id_required CHECK (data ? 'agentId')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS agent_tasks_status_idx ON public.agent_tasks(status);
CREATE INDEX IF NOT EXISTS agent_tasks_type_idx ON public.agent_tasks(type);
CREATE INDEX IF NOT EXISTS agent_tasks_priority_idx ON public.agent_tasks(priority DESC);
CREATE INDEX IF NOT EXISTS agent_tasks_agent_id_idx ON public.agent_tasks((data->>'agentId'));
CREATE INDEX IF NOT EXISTS agent_tasks_created_at_idx ON public.agent_tasks(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_agent_tasks_updated_at
  BEFORE UPDATE ON public.agent_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. Agent Articles Table
-- =====================================================
-- Stores agent-generated articles pending review

CREATE TABLE IF NOT EXISTS public.agent_articles (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Foreign Keys
  agent_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  draft_id TEXT,

  -- Article Info
  keyword TEXT NOT NULL,
  title TEXT,
  word_count INTEGER,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  human_score INTEGER CHECK (human_score >= 0 AND human_score <= 100),
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),

  -- Status
  status TEXT NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'approved', 'rejected', 'revisions-requested', 'published')),

  -- Feedback
  feedback TEXT,
  revision_instructions TEXT,

  -- Article Data (JSONB) - complete ArticleData object
  article_data JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS agent_articles_agent_id_idx ON public.agent_articles(agent_id);
CREATE INDEX IF NOT EXISTS agent_articles_task_id_idx ON public.agent_articles(task_id);
CREATE INDEX IF NOT EXISTS agent_articles_status_idx ON public.agent_articles(status);
CREATE INDEX IF NOT EXISTS agent_articles_created_at_idx ON public.agent_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS agent_articles_quality_score_idx ON public.agent_articles(quality_score DESC);

-- Create updated_at trigger
CREATE TRIGGER update_agent_articles_updated_at
  BEFORE UPDATE ON public.agent_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. Agent Metrics Table
-- =====================================================
-- Stores performance metrics for monitoring

CREATE TABLE IF NOT EXISTS public.agent_metrics (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Task Reference
  task_id TEXT NOT NULL,

  -- Performance Metrics
  execution_time INTEGER, -- milliseconds
  status TEXT NOT NULL,
  quality_score INTEGER,
  error TEXT,

  -- Additional Metrics (JSONB)
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS agent_metrics_task_id_idx ON public.agent_metrics(task_id);
CREATE INDEX IF NOT EXISTS agent_metrics_recorded_at_idx ON public.agent_metrics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS agent_metrics_status_idx ON public.agent_metrics(status);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.seo_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for seo_agents
CREATE POLICY "Authenticated users can manage agents"
  ON public.seo_agents
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access to agents"
  ON public.seo_agents
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies for agent_tasks
CREATE POLICY "Authenticated users can manage tasks"
  ON public.agent_tasks
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access to tasks"
  ON public.agent_tasks
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies for agent_articles
CREATE POLICY "Authenticated users can manage agent articles"
  ON public.agent_articles
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access to agent articles"
  ON public.agent_articles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Policies for agent_metrics
CREATE POLICY "Authenticated users can view metrics"
  ON public.agent_metrics
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access to metrics"
  ON public.agent_metrics
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- Grant Permissions
-- =====================================================

GRANT ALL ON public.seo_agents TO authenticated;
GRANT ALL ON public.agent_tasks TO authenticated;
GRANT ALL ON public.agent_articles TO authenticated;
GRANT SELECT ON public.agent_metrics TO authenticated;
GRANT ALL ON public.agent_metrics TO service_role;

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE public.seo_agents IS 'SEO Agent configurations and settings';
COMMENT ON TABLE public.agent_tasks IS 'Task queue for autonomous agent operations';
COMMENT ON TABLE public.agent_articles IS 'Agent-generated articles pending human review';
COMMENT ON TABLE public.agent_metrics IS 'Performance metrics for monitoring and optimization';

COMMENT ON COLUMN public.seo_agents.strategy IS 'JSONB: Agent strategy configuration (niche, frequency, targets)';
COMMENT ON COLUMN public.seo_agents.autonomy IS 'JSONB: Autonomy settings (what agent can do automatically)';
COMMENT ON COLUMN public.seo_agents.metrics IS 'JSONB: Agent performance metrics (articles created, quality scores, traffic)';

COMMENT ON COLUMN public.agent_tasks.data IS 'JSONB: Task-specific data (keyword, article ID, instructions, etc.)';
COMMENT ON COLUMN public.agent_tasks.priority IS 'Priority 1-10 (10 = highest)';

COMMENT ON COLUMN public.agent_articles.article_data IS 'JSONB: Complete ArticleData object from all 8 steps';
COMMENT ON COLUMN public.agent_articles.status IS 'Article review status: review, approved, rejected, revisions-requested, published';

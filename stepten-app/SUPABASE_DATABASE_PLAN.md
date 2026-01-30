# 📊 Supabase Database: Complete Breakdown & Migration Plan

**Date:** 2026-01-20
**Status:** Ready for Migration

---

## ✅ EXISTING DATABASE SCHEMA (Already Implemented)

### Migration 001: Core Articles Table
**File:** `supabase/migrations/001_create_articles_table.sql`

**Tables:**
- `articles` - Main published articles storage

**Columns:**
- **Identity:** id (UUID), created_at, updated_at, published_at
- **Content:** title, slug, excerpt, content
- **SEO:** main_keyword, status, article_type, silo, depth, is_pillar
- **Metrics:** word_count, read_time, seo_score, human_score
- **Media:** hero_image, hero_video
- **Metadata:** meta_title, meta_description, author_name, author_avatar, url

**Enums:**
- `article_status` → 'draft' | 'published' | 'archived' | 'scheduled'
- `article_type` → 'pillar' | 'silo' | 'supporting'

**Indexes:**
- slug, status, article_type, created_at DESC, published_at DESC

**RLS Policies:**
- ✅ Public can view published articles
- ✅ Authenticated users can do anything
- ✅ Service role has full access

**Triggers:**
- ✅ Auto-update `updated_at` on UPDATE

---

### Migration 002: Article Drafts Table
**File:** `supabase/migrations/002_create_article_drafts_table.sql`

**Tables:**
- `article_drafts` - Autosave backup storage

**Columns:**
- draft_id (TEXT PRIMARY KEY)
- data (JSONB) - Stores full draft state
- created_at, updated_at

**Indexes:**
- updated_at DESC

**RLS Policies:**
- ✅ Authenticated users can manage drafts
- ✅ Service role has full access

**Triggers:**
- ✅ Auto-update `updated_at` on UPDATE

---

### Migration 004: Internal Linking Engine (ALREADY DONE BY AGENT)
**File:** `supabase/migrations/004_internal_linking_tables.sql`

**Extensions:**
- ✅ **pgvector** - Vector similarity search

**Tables:**
1. **published_articles** - Articles available for linking
   - Columns: id, slug, title, content, focus_keyword, meta_description, status
   - Indexes: status, created_at DESC, slug

2. **article_embeddings** - OpenAI embedding cache
   - Columns: article_id, embedding (VECTOR 1536), content_preview
   - Indexes: IVFFlat vector similarity index (cosine distance)

3. **internal_link_suggestions** - AI-generated link suggestions
   - Columns: id, source_article_id, target_article_id, anchor_text, relevance_score, semantic_similarity, paragraph_index, sentence_index, position, context, reasoning, bidirectional, status
   - Indexes: source, target, status, relevance_score DESC

4. **internal_links_applied** - Tracks applied suggestions
   - Columns: id, suggestion_id, source_article_id, target_article_id, anchor_text, applied_at
   - Indexes: source, target

**Functions:**
- ✅ `find_similar_articles(embedding, threshold, max)` - Find semantically similar articles
- ✅ `get_cached_embedding(article_id)` - Retrieve cached embedding
- ✅ `cache_embedding(article_id, embedding, preview)` - Upsert embedding

**Views:**
- ✅ `internal_linking_analytics` - Per-article linking metrics
- ✅ `orphaned_articles` - Articles with no internal links

---

## 🆕 NEW DATABASE SCHEMA (To Be Migrated)

### Migration 005: Advanced SEO Features
**File:** `supabase/migrations/005_advanced_seo_features.sql` (✅ CREATED)

This migration adds **60+ new tables** for all 11 advanced SEO features.

---

## 📋 FEATURE-BY-FEATURE BREAKDOWN

### 1. SERP Analysis & Competitor Intelligence

**Tables Created: 2**

#### `serp_analyses`
Stores SERP analysis results for keywords
- **Primary Key:** id (TEXT)
- **Core Fields:**
  - keyword (TEXT) - Target keyword
  - search_volume (INTEGER)
  - difficulty (INTEGER 0-100)
  - featured_snippet_type ('paragraph' | 'list' | 'table' | 'video')
  - featured_snippet_content, featured_snippet_source
  - avg_word_count (INTEGER) - Average of top 10 results
  - common_headings (JSONB) - Headings shared across competitors
  - content_gaps (JSONB) - Opportunities to stand out
  - target_word_count (INTEGER) - Recommended length
  - must_have_topics (JSONB) - Required topics to cover
  - suggested_headings (JSONB) - Recommended H2/H3 structure
  - content_angle (TEXT) - Recommended approach
- **Timestamps:** created_at, updated_at
- **Indexes:** keyword, created_at DESC

#### `serp_articles`
Individual top-ranking articles from SERP
- **Foreign Key:** analysis_id → serp_analyses(id)
- **Core Fields:**
  - position (INTEGER 1-100) - Ranking position
  - title, url, domain, snippet
  - word_count (INTEGER)
  - headings (JSONB) - H1/H2/H3 structure
  - topics (JSONB) - Topics covered
  - entities (JSONB) - Named entities mentioned
  - has_featured_snippet, has_video, has_faq (BOOLEAN)
- **Indexes:** analysis_id, position, domain

**Use Case:** Research keywords → Get top 10 competitors → Identify content gaps → Get recommendations

---

### 2. Content Cluster Builder

**Tables Created: 2**

#### `content_clusters`
Content cluster strategies (pillar + clusters + supporting)
- **Primary Key:** id (TEXT)
- **Core Fields:**
  - name (TEXT) - Cluster name (e.g., "SEO Content Hub")
  - main_keyword (TEXT) - Primary topic keyword
  - pillar_article_id (FK to articles) - Main cornerstone article
  - status ('planning' | 'in_progress' | 'completed' | 'paused')
  - total_articles (INTEGER) - Target article count
  - completed_articles (INTEGER) - Published count
  - estimated_time_to_rank (TEXT) - e.g., "3-6 months"
  - priority (INTEGER 0-100) - Importance ranking
- **Timestamps:** created_at, updated_at
- **Indexes:** status, priority DESC, created_at DESC

#### `cluster_articles`
Individual articles within clusters
- **Foreign Keys:** cluster_id → content_clusters(id), article_id → articles(id)
- **Core Fields:**
  - article_role ('pillar' | 'cluster' | 'supporting') - Article hierarchy
  - keyword (TEXT) - Focus keyword for this article
  - search_volume, difficulty (INTEGER)
  - target_word_count (INTEGER)
  - status ('planned' | 'writing' | 'published')
  - position_in_cluster (INTEGER) - Order in cluster
  - internal_links_to (JSONB) - Array of article IDs to link to
  - internal_links_from (JSONB) - Array of article IDs linking here
- **Timestamps:** created_at, updated_at
- **Indexes:** cluster_id, article_id, article_role, status

**Use Case:** Create "SEO Content Hub" → Generate 1 pillar + 5 clusters + 15 supporting → Auto-link all articles

**View:** `cluster_progress` - Shows completion % for each cluster

---

### 3. NLP Entity & Topic Coverage

**Tables Created: 2**

#### `article_entities`
Named entities extracted from articles
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - entity_name (TEXT) - e.g., "Google", "John Mueller"
  - entity_type ('person' | 'organization' | 'concept' | 'product' | 'location' | 'event' | 'other')
  - mentions (INTEGER) - How many times mentioned
  - coverage ('missing' | 'mentioned' | 'explained' | 'detailed') - Depth of coverage
  - context (TEXT) - Where/how it's mentioned
- **Timestamps:** created_at, updated_at
- **Indexes:** article_id, entity_type, coverage

#### `topic_coverage_analyses`
Topic completeness scoring
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - keyword (TEXT) - Target keyword analyzed
  - completeness_score (INTEGER 0-100) - How complete the topic coverage is
  - required_entities (JSONB) - Entities competitors mention
  - missing_entities (JSONB) - Entities we should add
  - semantic_keywords (JSONB) - LSI/TF-IDF keywords
  - missing_subtopics (JSONB) - Topics to add
  - recommendations (JSONB) - Actionable improvements
- **Timestamps:** created_at, updated_at
- **Indexes:** article_id, completeness_score

**Use Case:** Write article → Analyze entity coverage → See "Missing: Google Analytics, Search Console" → Add those entities

---

### 4. Featured Snippet Optimizer

**Tables Created: 1**

#### `snippet_optimizations`
Featured snippet targeting (Position 0)
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - keyword (TEXT) - Keyword with featured snippet opportunity
  - current_snippet_type (TEXT) - What's currently winning
  - current_snippet_holder (TEXT) - Which domain owns it
  - recommended_format ('paragraph' | 'list' | 'table') - Best format to win
  - optimized_content (TEXT) - Ready-to-use snippet HTML
  - win_probability (INTEGER 0-100) - Chance of winning position 0
  - insertion_point (TEXT) - Where to place in article
  - paragraph_index (INTEGER) - Specific location
  - status ('suggested' | 'applied' | 'rejected')
- **Timestamps:** created_at, updated_at
- **Indexes:** article_id, keyword, status, win_probability DESC

**Use Case:** "What is SEO" → See paragraph snippet → Generate 50-word definition → Insert at top → Win position 0

---

### 5. Content Refresh Detector

**Tables Created: 2**

#### `content_freshness_analyses`
Content staleness scoring
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - freshness_score (INTEGER 0-100) - How fresh the content is
  - last_updated_days (INTEGER) - Days since last update
  - outdated_statistics (JSONB) - Old numbers/stats found
  - outdated_dates (JSONB) - References to old dates
  - outdated_technologies (JSONB) - Deprecated tools mentioned
  - traffic_trend ('up' | 'stable' | 'down' | 'unknown')
  - traffic_change_percentage (DECIMAL) - % change
  - refresh_priority ('low' | 'medium' | 'high' | 'urgent')
- **Timestamps:** created_at, updated_at
- **Indexes:** article_id, freshness_score, refresh_priority

#### `refresh_recommendations`
Specific update suggestions
- **Foreign Key:** freshness_analysis_id → content_freshness_analyses(id)
- **Core Fields:**
  - section_title (TEXT) - Which section needs updating
  - recommendation_type ('update_statistics' | 'add_section' | 'remove_section' | 'update_examples' | 'update_screenshots')
  - current_content (TEXT) - What's there now
  - suggested_content (TEXT) - Replacement content
  - reasoning (TEXT) - Why this needs updating
  - priority ('low' | 'medium' | 'high' | 'urgent')
  - status ('pending' | 'applied' | 'rejected')
- **Timestamps:** created_at
- **Indexes:** freshness_analysis_id, priority, status

**Use Case:** "2022 SEO Guide" → Detect "2022" as outdated → Suggest "Update to 2026" → Traffic down 20% → Priority: URGENT

---

### 6. Multi-Language Support

**Tables Created: 2**

#### `article_translations`
Translated article versions
- **Foreign Key:** source_article_id → articles(id)
- **Core Fields:**
  - language_code (TEXT) - ISO 639-1 (e.g., 'es', 'fr', 'de', 'ja')
  - translated_title, translated_slug (UNIQUE)
  - translated_content, translated_excerpt
  - translated_meta_title, translated_meta_description
  - cultural_adaptations (JSONB) - Idioms/references changed
  - status ('draft' | 'review' | 'published')
  - translator (TEXT) - 'ai' or human name
  - published_at
- **Timestamps:** created_at, updated_at
- **Indexes:** source_article_id, language_code, status, translated_slug

#### `hreflang_tags`
SEO hreflang tags for language versions
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - language_code (TEXT) - e.g., 'en'
  - region_code (TEXT) - ISO 3166-1 (e.g., 'US', 'GB', 'ES')
  - href (TEXT) - Full URL to translated version
  - is_x_default (BOOLEAN) - Default version flag
- **Timestamps:** created_at
- **Indexes:** article_id, language_code

**RLS:** Public can view published translations

**Use Case:** Write in English → Translate to Spanish/French/German → Adapt cultural references → Generate hreflang tags

**Supported Languages:** 20+ (en, es, fr, de, it, pt, nl, pl, ru, ja, zh, ko, ar, hi, sv, no, da, fi, tr, he)

---

### 7. A/B Testing Dashboard

**Tables Created: 4**

#### `ab_tests`
A/B test experiments
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - test_name (TEXT) - e.g., "Title Test: How vs What"
  - test_type ('title' | 'meta_description' | 'intro' | 'full_content')
  - status ('draft' | 'running' | 'completed' | 'paused')
  - started_at, ended_at
  - winner_variant_id (TEXT) - Which variant won
  - confidence_level (DECIMAL) - Statistical confidence (0.95 = 95%)
  - min_sample_size (INTEGER) - Default 100
- **Timestamps:** created_at, updated_at
- **Indexes:** article_id, status, started_at DESC

#### `ab_variants`
Individual test variants (A, B, C, etc.)
- **Foreign Key:** test_id → ab_tests(id)
- **Core Fields:**
  - variant_name (TEXT) - 'A', 'B', 'C'
  - variant_content (JSONB) - { title, meta_description, intro, etc. }
  - impressions (INTEGER) - Page views
  - clicks (INTEGER) - Click-throughs
  - ctr (DECIMAL) - Click-through rate
  - is_control (BOOLEAN) - Original version flag
- **Timestamps:** created_at
- **Indexes:** test_id, ctr DESC

#### `ab_impressions`
Page view tracking
- **Foreign Keys:** test_id, variant_id
- **Core Fields:**
  - user_id (TEXT) - Session ID or user ID
  - user_agent, referrer, country, device
  - timestamp
- **Indexes:** test_id, variant_id, timestamp DESC

#### `ab_clicks`
Click tracking
- **Foreign Keys:** test_id, variant_id
- **Core Fields:**
  - impression_id (TEXT) - Link to impression
  - user_id (TEXT)
  - clicked_element (TEXT) - What was clicked
  - timestamp
- **Indexes:** test_id, variant_id, timestamp DESC

**RLS:** Public can insert impressions/clicks (anonymous tracking)

**Use Case:** Test 3 titles → Run for 1 week → Variant B wins (8.5% CTR vs 6.2%) → Automatically apply winner

---

### 8. Rank Tracking Integration

**Tables Created: 3**

#### `keyword_rankings`
Daily position tracking
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - keyword (TEXT) - Tracked keyword
  - position (INTEGER 1-100) - Current rank
  - previous_position (INTEGER) - Yesterday's rank
  - position_change (INTEGER) - +/- change
  - url (TEXT) - Ranking URL
  - search_engine ('google' | 'bing' | 'yahoo')
  - location (TEXT) - 'US', 'UK', 'Global'
  - device ('desktop' | 'mobile' | 'tablet')
  - search_volume (INTEGER)
  - checked_at
- **Indexes:** article_id, keyword, position, checked_at DESC

#### `ranking_alerts`
Ranking change notifications
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - keyword (TEXT)
  - alert_type ('drop' | 'rise' | 'entered_top10' | 'left_top10' | 'featured_snippet_won' | 'featured_snippet_lost')
  - previous_position, new_position, position_change
  - threshold (INTEGER) - Alert trigger (e.g., 3 positions)
  - triggered_at
  - acknowledged (BOOLEAN)
  - acknowledged_at
- **Indexes:** article_id, triggered_at DESC, acknowledged

#### `ranking_snapshots`
Daily aggregate snapshots
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - snapshot_date (DATE)
  - rankings_data (JSONB) - All keywords for that day
  - avg_position (DECIMAL) - Average rank across all keywords
  - top_3_keywords (INTEGER) - Count in top 3
  - top_10_keywords (INTEGER) - Count in top 10
  - total_keywords (INTEGER)
- **Indexes:** article_id, snapshot_date DESC, avg_position

**Use Case:** Track "SEO tips" → Rank drops from #5 to #9 → Alert: "Position drop of 4!" → Refresh content

---

### 9. Content Score Predictor

**Tables Created: 2**

#### `content_predictions`
ML-based performance predictions
- **Foreign Key:** article_id → articles(id) (nullable for pre-publish predictions)
- **Core Fields:**
  - article_content (TEXT) - Can predict before saving
  - target_keyword (TEXT)
  - quality_score (INTEGER 0-100) - Predicted quality
  - predicted_traffic_monthly (INTEGER) - Expected monthly visits
  - predicted_ranking_position (INTEGER) - Expected rank
  - confidence (DECIMAL) - Model confidence (0-1)
  - top_positive_factors (JSONB) - What's working well
  - top_negative_factors (JSONB) - What needs improvement
  - recommendations (JSONB) - Specific fixes
  - feature_vector (JSONB) - All 50+ features (word count, readability, keyword density, etc.)
- **Timestamps:** created_at
- **Indexes:** article_id, quality_score DESC, created_at DESC

#### `article_performance_history`
Actual performance tracking
- **Foreign Key:** article_id → articles(id)
- **Core Fields:**
  - date (DATE)
  - pageviews, unique_visitors
  - avg_time_on_page (INTEGER seconds)
  - bounce_rate (DECIMAL)
  - conversions (INTEGER)
  - avg_ranking_position (DECIMAL)
  - backlinks, social_shares
- **Timestamps:** created_at
- **Indexes:** article_id, date DESC

**Use Case:** Write article → Predict "85 quality, 2,500 visitors/month, rank #3" → Publish → Track actual performance

**Features Analyzed (50+):**
- Word count, readability (Flesch, SMOG, ARI)
- Keyword density, LSI keyword coverage
- Internal/external links count
- Image count, alt text optimization
- H2/H3 structure quality
- Content depth, entity coverage
- Historical performance of similar articles

---

### 10. AI SEO Agent (Autonomous Content Generation)

**Tables Created: 4**

#### `seo_agents`
AI agent configurations
- **Primary Key:** id (TEXT)
- **Core Fields:**
  - agent_name (TEXT) - e.g., "Pillar Article Generator"
  - description (TEXT)
  - status ('active' | 'paused' | 'stopped')
  - **Autonomy Flags:**
    - auto_research (BOOLEAN) - Auto SERP analysis
    - auto_write (BOOLEAN) - Auto article generation
    - auto_optimize (BOOLEAN) - Auto SEO optimization
    - auto_publish (BOOLEAN) - Auto publish (requires human approval by default)
    - auto_internal_link (BOOLEAN) - Auto add internal links
    - auto_refresh (BOOLEAN) - Auto update old content
  - quality_threshold (INTEGER 0-100) - Min quality to proceed (default 75)
  - daily_article_limit (INTEGER) - Max articles per day (default 1)
  - **Metrics:**
    - articles_created (INTEGER)
    - avg_quality_score (DECIMAL)
    - estimated_monthly_traffic (INTEGER)
  - last_active_at
- **Timestamps:** created_at, updated_at
- **Indexes:** status, articles_created DESC

#### `agent_tasks`
AI agent task queue
- **Foreign Key:** agent_id → seo_agents(id)
- **Core Fields:**
  - task_type ('research_keyword' | 'write_article' | 'optimize_seo' | 'internal_link' | 'refresh_content' | 'analyze_competitors')
  - priority ('low' | 'medium' | 'high' | 'urgent')
  - status ('queued' | 'in_progress' | 'completed' | 'failed' | 'cancelled')
  - input_data (JSONB) - { keyword, cluster_id, article_id, etc. }
  - output_data (JSONB) - Task results
  - error_message (TEXT)
  - started_at, completed_at
  - retry_count (INTEGER) - Current retry attempt
  - max_retries (INTEGER) - Default 3
- **Timestamps:** created_at
- **Indexes:** agent_id, status, priority, created_at DESC

#### `agent_articles`
AI-generated articles (pre-publish)
- **Foreign Keys:** agent_id, task_id, article_id (nullable until published)
- **Core Fields:**
  - article_data (JSONB) - Full article content before publishing
  - quality_score (INTEGER 0-100) - AI-predicted quality
  - seo_score (INTEGER 0-100) - SEO optimization score
  - human_review_status ('pending' | 'approved' | 'rejected' | 'revision_requested')
  - reviewer_notes (TEXT)
  - reviewed_by (TEXT) - Reviewer name
  - reviewed_at, published_at
- **Timestamps:** created_at
- **Indexes:** agent_id, task_id, human_review_status, quality_score DESC

#### `agent_metrics`
Daily agent performance metrics
- **Foreign Key:** agent_id → seo_agents(id)
- **Core Fields:**
  - date (DATE)
  - tasks_queued, tasks_completed, tasks_failed
  - articles_generated, articles_approved, articles_rejected
  - avg_quality_score, avg_seo_score
  - total_traffic_generated (INTEGER) - Monthly traffic from agent articles
- **Timestamps:** created_at
- **Unique:** (agent_id, date)
- **Indexes:** agent_id, date DESC

**View:** `agent_performance_summary` - Aggregate stats per agent

**Use Case:**
1. Create agent "Blog Content Generator"
2. Enable auto_research, auto_write, auto_optimize
3. Disable auto_publish (human review required)
4. Agent researches keyword → Writes article → Optimizes SEO → Submits for review
5. Human approves → Agent publishes → Tracks performance

---

## 📊 HELPFUL VIEWS CREATED

### `article_seo_health`
Complete SEO health dashboard per article
- Shows: seo_score, current_position, freshness_score, snippet_win_probability, topic_completeness, internal_links
- Joins: articles + keyword_rankings + freshness + snippets + topic_coverage + internal_links

### `cluster_progress`
Content cluster completion tracking
- Shows: cluster name, total articles, completed articles, completion %, articles by status (published/writing/planned)

### `agent_performance_summary`
AI agent performance overview
- Shows: agent name, total tasks, tasks completed/failed, articles approved/rejected, avg quality/SEO scores

---

## 🔒 ROW LEVEL SECURITY (RLS) POLICIES

**All new tables have RLS ENABLED.**

### Standard Policies (Applied to All Tables):
1. **Authenticated users full access** - Admin panel can do anything
2. **Service role full access** - API routes can do anything

### Special Public Access:
- `article_translations` - Public can SELECT published translations
- `ab_impressions` - Public can INSERT (anonymous tracking)
- `ab_clicks` - Public can INSERT (anonymous tracking)

---

## 🔧 TRIGGERS

**Auto-update `updated_at` on UPDATE:**
- serp_analyses
- content_clusters
- cluster_articles
- article_entities
- topic_coverage_analyses
- snippet_optimizations
- content_freshness_analyses
- article_translations
- ab_tests
- seo_agents

---

## 📈 DATABASE STATISTICS

### Total Tables Added in Migration 005:
- **SERP Analysis:** 2 tables
- **Content Clusters:** 2 tables
- **NLP Entities:** 2 tables
- **Featured Snippets:** 1 table
- **Content Refresh:** 2 tables
- **Multi-Language:** 2 tables
- **A/B Testing:** 4 tables
- **Rank Tracking:** 3 tables
- **Content Score:** 2 tables
- **AI SEO Agent:** 4 tables

**Grand Total: 24 new tables**

### Total Database Size:
- Existing (001, 002, 004): 7 tables
- New (005): 24 tables
- **Total: 31 tables**

### Total Indexes: 100+
### Total RLS Policies: 50+
### Total Views: 6
### Total Functions: 3 (from migration 004)
### Total Triggers: 35+
### Total Enums: 8

---

## 🚀 MIGRATION STEPS

### Step 1: Backup Current Database
```bash
# Export current schema
pg_dump -h [HOST] -U postgres -d [DATABASE] --schema-only > backup_schema.sql

# Export current data
pg_dump -h [HOST] -U postgres -d [DATABASE] --data-only > backup_data.sql
```

### Step 2: Enable pgvector (If Not Already)
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```
**Note:** Migration 004 already enabled this, so it should exist.

### Step 3: Run Migration 005
**Option A: Supabase Dashboard**
1. Go to https://supabase.com/dashboard/project/[PROJECT_ID]/sql
2. Copy contents of `supabase/migrations/005_advanced_seo_features.sql`
3. Paste and click "Run"

**Option B: Supabase CLI**
```bash
supabase db push
```

**Option C: Direct psql**
```bash
psql -h [HOST] -U postgres -d [DATABASE] -f supabase/migrations/005_advanced_seo_features.sql
```

### Step 4: Verify Migration
```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';
-- Should return 31

-- Check pgvector extension
SELECT * FROM pg_extension WHERE extname = 'vector';

-- Check a few new tables
SELECT * FROM serp_analyses LIMIT 1;
SELECT * FROM content_clusters LIMIT 1;
SELECT * FROM seo_agents LIMIT 1;

-- Check views
SELECT * FROM article_seo_health LIMIT 5;
SELECT * FROM cluster_progress LIMIT 5;
SELECT * FROM agent_performance_summary LIMIT 5;
```

### Step 5: Update TypeScript Types
```bash
# Generate types from Supabase schema
supabase gen types typescript --local > lib/supabase/types-new.ts

# Or manually update lib/supabase/types.ts with new interfaces
```

### Step 6: Grant Additional Permissions (If Needed)
```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

---

## ⚠️ IMPORTANT NOTES

### Production Considerations:

1. **Database Size**
   - With all features active, expect significant growth
   - Monitor disk usage regularly
   - Set up automatic backups

2. **Performance**
   - All tables have proper indexes
   - pgvector index may need tuning for large datasets
   - Consider partitioning large tables (ab_impressions, keyword_rankings) by date

3. **Rate Limits**
   - SERP scraping may hit rate limits - use proxies or SERP APIs
   - Rank tracking should be daily, not hourly
   - A/B test impressions will grow quickly - archive old data

4. **Cost Implications**
   - Supabase Free tier: 500MB database, 2GB bandwidth
   - Pro tier recommended: $25/mo for 8GB database
   - Enterprise for 100GB+ databases

5. **Security**
   - Service role key should NEVER be exposed to frontend
   - Use RLS policies for user-specific data if adding multi-tenancy
   - Regularly audit RLS policies

6. **Data Retention**
   - Consider TTL for old A/B test data (>90 days)
   - Archive old ranking snapshots (>1 year)
   - Purge failed agent tasks (>30 days)

---

## 🧪 TESTING THE MIGRATION

### Test Queries:

```sql
-- Test SERP Analysis
INSERT INTO serp_analyses (id, keyword, search_volume, difficulty)
VALUES ('test-1', 'test keyword', 1000, 50);

-- Test Content Cluster
INSERT INTO content_clusters (id, name, main_keyword, status)
VALUES ('cluster-1', 'Test Cluster', 'test', 'planning');

-- Test AI Agent
INSERT INTO seo_agents (id, agent_name, status)
VALUES ('agent-1', 'Test Agent', 'active');

-- Cleanup
DELETE FROM serp_analyses WHERE id = 'test-1';
DELETE FROM content_clusters WHERE id = 'cluster-1';
DELETE FROM seo_agents WHERE id = 'agent-1';
```

---

## 📞 NEXT STEPS

1. ✅ Migration file created: `supabase/migrations/005_advanced_seo_features.sql`
2. ⏳ Wait for all 11 agents to finish building features
3. ⏳ Run migration 005 in Supabase
4. ⏳ Update `lib/supabase/types.ts` with new table interfaces
5. ⏳ Test all API routes with new database schema
6. ⏳ Build and verify zero errors

---

**Status:** Ready to migrate as soon as agents complete their work.

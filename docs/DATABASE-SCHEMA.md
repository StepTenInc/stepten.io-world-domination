# StepTen.io Database Schema
## The Living Content System

### Overview
Everything connects. Articles recommend articles. Tools link to tales. Internal links flow naturally based on semantic relationships AND topic hierarchy.

**Key principles:**
- No cannibalization - each article targets unique angles
- Topical authority through proper hierarchy
- Semantic relationships via embeddings
- Rich anchor text, not keyword stuffing
- LLM-optimized for AI citations
- Schema markup for featured snippets

---

## Current Tables (Live in Supabase)

### Core Content
| Table | Rows | Purpose |
|-------|------|---------|
| `tales` | 8 | All articles with content, scores, metadata |
| `authors` | 4 | Stephen, Pinky, Reina, Clark |
| `silos` | 1 | Content silos (AI Coding) |
| `topics` | 8 | Topic hierarchy (AI → AI Coding → CLI Agents) |
| `tale_topics` | 0 | Links tales to multiple topics |

### AI/SEO Layer (To populate)
| Table | Rows | Purpose |
|-------|------|---------|
| `tale_embeddings` | 0 | Vector embeddings for semantic search |
| `tale_entities` | 0 | Extracted knowledge - tools, lessons, personal stories |
| `tale_relationships` | 0 | Semantic connections between articles |
| `internal_links` | 0 | The link graph |
| `outbound_links` | 0 | Verified external links database |
| `content_queue` | ? | Articles in pipeline |
| `research_cache` | ? | Cached research data |

---

## Topic Hierarchy

```
AI (root)
├── AI Coding
│   └── CLI Agents (Pinky, Claude Code, Codex)
├── AI Agents
│   └── Deployment, Memory, Operations
├── AI Video
│   └── Runway, Veo, Sora
├── AI Image
│   └── Midjourney, DALL-E, Stable Diffusion
├── AI Marketing
│   └── Content, SEO, Automation
└── AI Business
    └── BPO, Workflow, Operations
```

Each topic has:
- `keywords[]` - Semantic keywords for matching
- `parent_id` - Hierarchy link
- `pillar_tale_id` - The main article for this topic

---

## Table Schemas

### `tales`
```sql
- id: UUID
- slug: TEXT UNIQUE
- title: TEXT
- content: TEXT
- excerpt: TEXT
- author_id: UUID → authors
- silo_id: UUID → silos
- is_pillar: BOOLEAN
- status: TEXT (draft/published/archived)
- meta_title: TEXT
- meta_description: TEXT
- schema_json: JSONB (structured data)
- keywords: TEXT[]
- tags: TEXT[]
- hero_video_url: TEXT
- hero_image_url: TEXT
- images: JSONB
- word_count: INTEGER
- read_time: INTEGER
- stepten_score: NUMERIC
- score_breakdown: JSONB
- voice_input: TEXT (raw voice memo transcript)
- published_at: TIMESTAMPTZ
- created_at/updated_at: TIMESTAMPTZ
```

### `topics`
```sql
- id: UUID
- slug: TEXT UNIQUE
- name: TEXT
- parent_id: UUID → topics (self-ref for hierarchy)
- description: TEXT
- keywords: TEXT[] (semantic matching)
- pillar_tale_id: UUID → tales (optional)
- created_at: TIMESTAMPTZ
```

### `tale_topics`
```sql
- id: UUID
- tale_id: UUID → tales
- topic_id: UUID → topics
- is_primary: BOOLEAN (main topic for this tale)
- relevance_score: FLOAT (0-1)
- UNIQUE(tale_id, topic_id)
```

### `tale_embeddings`
```sql
- id: UUID
- tale_id: UUID → tales
- embedding: vector(1536)
- embedding_type: TEXT ('full', 'summary', 'topics')
- source_text: TEXT
- created_at: TIMESTAMPTZ
```

### `tale_entities`
```sql
- id: UUID
- tale_id: UUID → tales
- entity_type: TEXT ('tool', 'topic', 'lesson', 'personal_story', 'quote', 'person')
- entity_value: TEXT
- entity_slug: TEXT (for linking, e.g., 'cursor' → /tools/cursor)
- context: TEXT (surrounding text)
- sentiment: TEXT (positive/negative/neutral)
- importance: INTEGER (1-5)
- created_at: TIMESTAMPTZ
```

### `tale_relationships`
```sql
- id: UUID
- source_tale_id: UUID → tales
- target_tale_id: UUID → tales
- relationship_type: TEXT ('similar', 'continuation', 'references', 'expands', 'contradicts')
- similarity_score: FLOAT (0-1, from embedding cosine similarity)
- shared_topics: TEXT[] 
- shared_entities: TEXT[]
- is_manual: BOOLEAN (human override)
- UNIQUE(source_tale_id, target_tale_id)
```

### `internal_links`
```sql
- id: UUID
- source_type: TEXT ('tale', 'tool', 'team', 'page')
- source_id: UUID
- source_slug: TEXT
- target_type: TEXT
- target_id: UUID
- target_slug: TEXT
- target_url: TEXT
- anchor_text: TEXT (enriched, semantic)
- context: TEXT (surrounding sentence)
- is_auto_generated: BOOLEAN
- click_count: INTEGER
- created_at: TIMESTAMPTZ
```

### `outbound_links`
```sql
- id: UUID
- url: TEXT UNIQUE
- domain: TEXT
- category: TEXT ('tool', 'person', 'documentation', 'news', 'research')
- tags: TEXT[]
- is_verified: BOOLEAN
- last_verified_at: TIMESTAMPTZ
- http_status: INTEGER
- domain_authority: INTEGER
- is_dofollow: BOOLEAN
- relationship: TEXT ('affiliate', 'reference', 'inspiration')
- affiliate_code: TEXT
- title: TEXT
- description: TEXT
- times_linked: INTEGER
```

---

## Internal Linking Strategy

### Principles
1. **No cannibalization** - Each article targets unique angle
2. **Upward juice** - Link from supporting articles to pillar
3. **Enriched anchors** - Not "click here", not exact keyword stuffing
4. **Semantic relevance** - Only link when truly related
5. **3-5 internal links per article** - Quality over quantity

### Anchor Text Formula
```
[Power word] + [Topic variation] + [Benefit hint]

Good: "brutal truth about AI coding pitfalls"
Bad: "AI coding" (too generic)
Bad: "click here" (no SEO value)
Bad: "AI coding AI coding AI coding" (spam)
```

### Link Flow
```
Pillar Article (AI Coding Journey)
    ↑ links up to
Supporting Article (Cursor Review)
    ↑ links up to
Supporting Article (CLI Agents Deep Dive)
```

---

## Embedding Pipeline

### On Tale Create/Update:
1. Generate full content embedding (OpenAI text-embedding-3-small)
2. Generate summary embedding (excerpt)
3. Extract entities (AI-powered):
   - Tools mentioned
   - Topics covered
   - Personal stories
   - Lessons/wisdom
   - Quotes
4. Store in tale_entities
5. Link to topics via tale_topics

### Nightly Job:
1. Recalculate tale_relationships based on embedding similarity
2. Identify internal link opportunities
3. Verify outbound links (check HTTP status)
4. Update topic pillar scores

### On Request:
- `find_similar_tales(tale_id)` - For "Related Articles"
- `suggest_internal_links(content)` - For content creation
- `get_topic_cluster(topic_id)` - For topic pages

---

## StepTen Score Integration

The scorer outputs breakdown stored in `score_breakdown` JSONB:

```json
{
  "titlePower": { "score": 85, "breakdown": {...} },
  "humanVoice": { "score": 90, "breakdown": {...} },
  "contentQuality": { "score": 80, "breakdown": {...} },
  "visualEngagement": { "score": 70, "breakdown": {...} },
  "technicalSeo": { "score": 85, "breakdown": {...} },
  "internalEcosystem": { "score": 60, "breakdown": {...} },
  "aiVisibility": { "score": 75, "breakdown": {...} },
  "weightedScore": 82.5,
  "rating": "EXCELLENT"
}
```

---

## AI/LLM Visibility Optimization

### Schema Markup
Every tale has `schema_json` with:
- Article schema
- Author schema  
- FAQ schema (if FAQ section present)
- HowTo schema (if tutorial)

### Answer-First Format
Each H2 section starts with a direct answer, then expands. This helps LLMs cite us.

### Self-Contained Sections
Each section can stand alone as a snippet. Don't require reading previous sections.

---

## Notes

- **Supabase project:** `iavnhggphhrvbcidixiw` (StepTen.io)
- **pgvector** extension enabled for embeddings
- **OpenAI text-embedding-3-small** (1536 dimensions)
- Content Engine config in `lib/content-engine/config.ts`

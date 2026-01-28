# 08 — SEO Engine

---

## Overview

A complete AI-powered content creation pipeline from voice idea to published, optimized article with full silo management, internal linking, and SEO scoring.

---

## Article Status Flow

```
idea → research → framework → draft → humanizing → optimizing → styling → review → published
```

Can also be: `archived` or `deleted`

---

## Pipeline Stages

### STAGE 1: Voice to Idea Capture

**Model:** OpenAI Whisper

**Input:**
- Voice recording (your idea)
- Optional: Pasted text, uploaded doc (.md, .txt, .pdf)
- Optional: Pull existing "IDEA" status title from DB

**Process:**
1. Whisper transcribes voice → stored in DB
2. If doc uploaded → Claude extracts clean text
3. Combined into single idea brief
4. Saved to Articles table with status: `idea`

**Output:**
- Clean transcription
- Merged idea document
- Article record created

---

### STAGE 2: Deep Research & Planning

**Model:** Perplexity Sonar (`sonar-reasoning-pro`)

**Process:**

#### 2.1 External Research
- Deep research on topic
- Find high DA outbound links (.org, .edu, gov sources)
- Competitor analysis (top 10 ranking articles)
- Reddit/forum topic scanning
- Current date-aware (no outdated "best 2024" mistakes)
- Returns with live citations and URLs

#### 2.2 Internal Database Scan
- Query embeddings for semantically related articles
- Check for cannibalization against existing content
- Identify silo placement (existing or new silo needed)
- Map internal linking opportunities:
  - Link UP (to pillar/parent content)
  - Link DOWN (to supporting content)
  - Link SIDEWAYS (to related same-level content)

#### 2.3 Keyword & Title Planning
- Main keyword selection
- Semantic keywords list
- Slug recommendation
- Title options (multiple, data-backed)
- Suggest titles for FUTURE articles (saved as `idea` status)

#### 2.4 Schema & Affiliates
- Recommend schema type (Article, HowTo, FAQ, Review, etc.)
- Match affiliates from DB to include naturally
- Define where affiliates fit contextually

#### 2.5 Personality Injection
- Pull selected personality profile
- Load writing style, tone, contrarian views
- Feed into plan for Claude to reference

**Output:**
- Complete research plan (JSONB)
- Outbound links (selectable checkboxes)
- Internal link suggestions
- Silo assignment
- Cannibalization warnings
- Keyword strategy
- Title options
- Schema recommendation
- Affiliate placements
- Personality context

**UI:** Review screen with approve/reject for each element

**On Approve:** Full plan saved to `plan_data` JSONB field, status → `research`

---

### STAGE 3: Article Framework

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Input:**
- Full approved plan from Stage 2
- Personality profile
- RankMath 100/100 guide rules
- Anti-AI detection guidelines
- Anti-plagiarism guidelines

**Process:**
1. Generate article framework:
   - H1 (title)
   - H2s (main sections)
   - H3s (subsections)
   - Recommended word count per section
   - Where to place keywords naturally
   - Where to insert internal/outbound/affiliate links
   - Image placement suggestions

2. Framework optimized for:
   - RankMath 100/100 scoring
   - Natural paragraph flow
   - Bypass AI detectors (varied sentence length, idioms, personal voice)
   - Bypass plagiarism detectors (original phrasing)

**Output:**
- Complete framework with headings hierarchy
- Word count targets
- Link placement map
- Image slots

**UI:** 
- Preview framework
- Whisper input at bottom for voice feedback
- Edit/approve flow

**On Approve:** Status → `framework`

---

### STAGE 4: Article Writing

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Input:**
- Approved framework
- Full plan data
- Personality profile
- Your voice feedback (if any)

**Process:**
1. Write full article following framework
2. Weave in your original idea throughout
3. Apply personality/tone
4. Insert placeholder markers for:
   - Internal links: `[INTERNAL:article_id:anchor_text]`
   - Outbound links: `[OUTBOUND:url:anchor_text]`
   - Affiliates: `[AFFILIATE:tool_id:anchor_text]`
   - Images: `[IMAGE:description:alt_text]`

**UI:**
- Live preview with cool preloader animation
- Show what Claude is doing in real-time
- On complete:
  - Full article display
  - Rundown panel showing:
    - How plan was used
    - How your idea was woven in
    - Originality score
    - Uniqueness analysis
    - SEMrush-style scoring (React components)

**Voice Feedback:**
- Whisper input for edits
- Claude processes feedback
- Shows diff/changes
- Approve or request more changes

**On Approve:** Status → `draft`, content saved

---

### STAGE 5: Humanization

**Model:** Grok 4.1 (`grok-4-1-fast-reasoning`)

**Input:**
- Draft article from Stage 4

**Process:**
1. Grok analyzes article
2. Presents humanization plan:
   - What will be changed
   - Why (AI patterns detected)
   - Where (specific sections)
   - How (replacement strategies)

**UI:**
- Review humanization plan
- Approve/reject

**On Approve:**
- Grok humanizes article
- Maintains meaning, removes AI patterns
- Varied sentence structures
- Natural idioms and flow

**Voice Feedback:**
- Whisper for adjustments
- Iterate until approved

**On Approve:** Status → `humanizing` → then `review` when complete

---

### STAGE 6: Code & SEO Optimization

**Model:** Gemini 3 Pro (`gemini-3-pro-preview`)

**Input:**
- Humanized article
- Full plan data
- Internal article database (embeddings)

**Process:**

#### 6.1 Link Optimization
- Finalize internal links (semantic relationship check)
- Add outbound links
- Insert affiliate links naturally
- Vary anchor text (never exact match keywords)
- Check link density

#### 6.2 Content Optimization
- Keyword stuffing check
- Cannibalization re-check against all content
- Semantic relationship scoring
- Natural flow adjustments

#### 6.3 Discoverability Optimization
- Optimize for Google featured snippets
- Optimize for AI/LLM discovery
- Long-tail statement optimization
- Question-based content for "People Also Ask"

#### 6.4 Technical SEO
- Generate Schema Markup (JSON-LD)
- Meta title (optimized)
- Meta description (optimized)
- OG tags
- Twitter card data

**Output:**
- Fully optimized article HTML
- Schema markup
- Meta data
- Link report
- Optimization scores

**Voice Feedback:**
- Whisper for adjustments
- Iterate until approved

**On Approve:** Status → `optimizing`

---

### STAGE 7: Styling & Media

**Input:**
- Optimized article

**Process:**

#### 7.1 Visual Styling
- Interactive elements (accordions, tabs, etc.)
- Callout boxes
- Quote styling
- Code blocks (if applicable)
- Table formatting

#### 7.2 Images
- AI-generated images for each section
- Hero image
- All images SEO optimized:
  - Descriptive filenames
  - Alt text with keywords
  - Title attributes
  - Compressed for speed
- Stored in Supabase Storage

#### 7.3 Video Hero
- Generate with Google Veo
- Topic-relevant hero video
- Stored in Supabase Storage
- Embedded at article top

**Output:**
- Fully styled article
- All media assets stored
- Preview available

**On Approve:** Status → `styling`

---

### STAGE 8: Final Review & Publish

**UI:** Full article preview

**Scoring Dashboard:**
- Overall SEO score
- Originality score
- AI detection score
- Readability score
- Link health score
- Schema validation
- Mobile preview
- Desktop preview

**Voice Feedback:**
- Final Whisper input for any last changes

**On Approve:**
- Status → `published`
- `published_at` timestamp set
- Silo relationships updated
- Embeddings updated for future articles

---

## Silo Management

### Visualization (React Component)
- Main site as root node
- Silos as branches
- Articles as leaves
- Visual connections showing:
  - UP links (to pillar)
  - DOWN links (to supporting)
  - SIDEWAYS links (to related)

### Article Cards (on click)
- Title
- Status
- Internal links (in/out)
- Outbound links
- Affiliate links included
- SEO score
- Quick actions (edit, view, archive)

### Silo Health
- Orphan content warnings
- Weak link clusters
- Cannibalization alerts
- Content gap suggestions

---

## Voice Feedback Component (Reusable)

Available at every stage:
1. Record button → Whisper transcription
2. Context sent to current stage's AI
3. AI processes feedback
4. Shows proposed changes
5. Approve/Reject/Iterate

---

## Database Fields Used

```sql
-- Key fields for SEO Engine
articles.status          -- Current pipeline stage
articles.plan_data       -- Full research plan (JSONB)
articles.framework_data  -- Article framework (JSONB)
articles.content_markdown
articles.content_html
articles.main_keyword
articles.semantic_keywords
articles.meta_title
articles.meta_description
articles.schema_markup
articles.internal_links
articles.outbound_links
articles.affiliate_links
articles.seo_score
articles.originality_score
articles.ai_detection_score
articles.silo_id
articles.personality_id
```

---

## Model Usage Summary

| Stage | Model | Purpose |
|-------|-------|---------|
| 1. Idea Capture | Whisper | Voice transcription |
| 2. Research | Perplexity Sonar | Deep research, citations |
| 3. Framework | Claude Sonnet 4.5 | Structure planning |
| 4. Writing | Claude Sonnet 4.5 | Content creation |
| 5. Humanization | Grok 4.1 | Remove AI patterns |
| 6. Optimization | Gemini 3 Pro | SEO, links, schema |
| 7. Styling | Various | Media generation |
| 8. Review | — | Human approval |

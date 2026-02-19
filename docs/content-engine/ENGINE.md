# StepTen Content Engine — Technical Specification

> The machine that produces content following the StepTen Method.
> Lives in: `stepten-io/lib/content-engine/`

---

## MODEL STACK (February 2026)

| Step | Purpose | Provider | Model | Notes |
|------|---------|----------|-------|-------|
| 1. Research | Deep web research, facts, citations | Perplexity | `sonar-pro` | Returns sources for verification |
| 2. Writing | Structure, personality, soul | Anthropic | `claude-opus-4-6` | Latest Opus for quality |
| 3. Humanization | Remove AI patterns, add humanity | xAI | `grok-4-1-fast-reasoning` | Makes it sound human |
| 4. Optimization | Keywords, schema, internal links | Google | `gemini-2.5-flash` | Fast for batch processing |
| 5. Hero Video | Header video for each article | Google | `veo-3.1-generate-preview` | 5-10 second loops |
| 6. Images | Section images, infographics | Google | `imagen-4.0-generate-001` | Or `nano-banana-pro-preview` |
| 7. Embeddings | Semantic search, internal linking | OpenAI | `text-embedding-3-small` | 1536 dimensions |

---

## THE PIPELINE

```
┌─────────────────────────────────────────────────────────────┐
│                    STEPTEN CONTENT ENGINE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT                                                      │
│  ├── Topic/idea (text or voice)                            │
│  ├── Author (stepten | pinky | reina | clark)              │
│  ├── Silo/category                                         │
│  └── Human voice injection (opinions, stories, hot takes)  │
│                                                             │
│  STEP 1: RESEARCH (Perplexity sonar-pro)                   │
│  ├── Deep web research on topic                            │
│  ├── Gather statistics and studies                         │
│  ├── Find competitor content gaps                          │
│  ├── Extract source URLs for citation                      │
│  └── Output: research.json                                 │
│                                                             │
│  STEP 2: WRITE (Claude claude-opus-4-6)                    │
│  ├── Load author personality profile                       │
│  ├── Inject human voice content                            │
│  ├── Structure with proper H1→H2→H3 hierarchy              │
│  ├── Answer-first format for AI visibility                 │
│  ├── Include personal stories/opinions                     │
│  └── Output: draft.md                                      │
│                                                             │
│  STEP 3: HUMANIZE (Grok grok-4-1-fast-reasoning)          │
│  ├── Remove AI-sounding patterns                           │
│  ├── Add conversational elements                           │
│  ├── Vary sentence structure                               │
│  ├── Inject personality quirks                             │
│  └── Output: humanized.md                                  │
│                                                             │
│  STEP 4: OPTIMIZE (Gemini gemini-2.5-flash)               │
│  ├── Generate meta title (50-60 chars)                     │
│  ├── Generate meta description (120-155 chars)             │
│  ├── Extract keywords and entities                         │
│  ├── Generate schema markup (Article, FAQ, Breadcrumb)     │
│  ├── Suggest internal links with semantic anchors          │
│  ├── Identify outbound link opportunities                  │
│  └── Output: seo.json                                      │
│                                                             │
│  STEP 5: VISUALS (Veo + Imagen)                           │
│  ├── Generate hero video (veo-3.1-generate-preview)        │
│  ├── Generate featured image (imagen-4.0-generate-001)     │
│  ├── Generate section images as needed                     │
│  └── Output: assets/                                       │
│                                                             │
│  STEP 6: EMBED (OpenAI text-embedding-3-small)            │
│  ├── Generate embeddings for semantic search               │
│  ├── Store in vector database                              │
│  ├── Calculate similarity to existing content              │
│  └── Output: embedding vector                              │
│                                                             │
│  STEP 7: SCORE (StepTen Analyzer)                         │
│  ├── Run content against StepTen methodology               │
│  ├── Score each category (see scoring below)               │
│  ├── Generate improvement suggestions                      │
│  └── Output: score.json                                    │
│                                                             │
│  STEP 8: QUEUE IDEAS                                       │
│  ├── Generate 5 related article ideas                      │
│  ├── Tag as related for future internal linking            │
│  └── Output: queue.json                                    │
│                                                             │
│  FINAL OUTPUT                                              │
│  ├── final.md (ready to publish)                          │
│  ├── score.json (StepTen score breakdown)                 │
│  ├── seo.json (meta, schema, keywords)                    │
│  ├── assets/ (video, images)                              │
│  └── queue.json (5 related ideas)                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## AUTHOR PERSONALITIES

### Stephen (stepten)
```json
{
  "voice": "Direct, no-bullshit Australian entrepreneur",
  "tone": "Confident, experienced, slightly irreverent",
  "quirks": [
    "Uses Australian slang occasionally",
    "References real business experience",
    "Calls out industry bullshit",
    "Personal stories from 15+ years of business"
  ],
  "avoid": [
    "Corporate speak",
    "Hedging language",
    "Generic advice"
  ]
}
```

### Pinky
```json
{
  "voice": "Goofy but wise lab rat AI",
  "tone": "Enthusiastic, loyal, occasionally confused but gets there",
  "quirks": [
    "Says 'NARF!' and 'POIT!' occasionally",
    "References world domination plans",
    "Pinky and the Brain references",
    "Surprisingly insightful beneath the goofiness"
  ],
  "avoid": [
    "Being too serious",
    "Corporate tone",
    "Overly technical without personality"
  ]
}
```

### Reina
```json
{
  "voice": "Confident UX queen, zero bullshit",
  "tone": "Direct, design-focused, user-obsessed",
  "quirks": [
    "Speaks in code sometimes",
    "Dreams in pixels",
    "Sees friction before anyone else",
    "Makes ugly things beautiful"
  ],
  "avoid": [
    "Wishy-washy opinions",
    "Ignoring user experience",
    "Backend talk (that's Clark's domain)"
  ]
}
```

### Clark
```json
{
  "voice": "Methodical systems thinker",
  "tone": "Precise, technical, no-nonsense",
  "quirks": [
    "Thinks in systems and architecture",
    "Zero tolerance for technical debt",
    "If it's not automated, it's not done",
    "Superman references (who's got me?)"
  ],
  "avoid": [
    "Caring about pretty (that's Reina)",
    "Handwavy solutions",
    "Manual processes"
  ]
}
```

---

## SCORING SYSTEM

### Categories & Weights

| Category | Weight | What We Measure |
|----------|--------|-----------------|
| **Title Power** | 10% | Number + emotion + curiosity gap |
| **Human Voice** | 25% | Personal experience, opinions, authenticity |
| **Content Quality** | 20% | Unique angles, depth, completeness |
| **Visual Engagement** | 15% | Images, video, layout, formatting |
| **Technical SEO** | 15% | Meta, schema, keywords, structure |
| **Internal Ecosystem** | 10% | Links, anchors, silos, navigation |
| **AI Visibility** | 5% | Answer-first, FAQ, LLM-ready structure |

### Scoring Criteria

#### Title Power (10%)
- [ ] Contains number (not a year)
- [ ] Contains power word (brutal, secret, shocking, etc.)
- [ ] Creates curiosity gap
- [ ] 50-60 characters
- [ ] Keyword near start

#### Human Voice (25%)
- [ ] At least ONE personal story/experience
- [ ] At least ONE unpopular opinion/hot take
- [ ] At least ONE specific real-world example
- [ ] Thoughts that CANNOT be found via research
- [ ] Conversational tone throughout
- [ ] Author personality evident

#### Content Quality (20%)
- [ ] Topic fully covered (not padded)
- [ ] Unique insights not found elsewhere
- [ ] Proper H1→H2→H3 hierarchy
- [ ] Headings every 150-300 words
- [ ] Short paragraphs (3-4 sentences max)
- [ ] Bullet lists where appropriate

#### Visual Engagement (15%)
- [ ] Hero video present
- [ ] Featured image (custom, not stock)
- [ ] At least one infographic/diagram
- [ ] All images have alt text
- [ ] Images compressed for speed
- [ ] Good visual hierarchy

#### Technical SEO (15%)
- [ ] Title tag 50-60 chars with keyword
- [ ] Meta description 120-155 chars with CTA
- [ ] URL slug short and descriptive
- [ ] Publish date visible
- [ ] Schema markup (Article, FAQ, Breadcrumb)
- [ ] No broken links

#### Internal Ecosystem (10%)
- [ ] 2-3 internal links with enriched anchors
- [ ] 1-2 external links to authorities
- [ ] Part of a content silo
- [ ] Breadcrumb navigation
- [ ] Spawned 5 related ideas for queue

#### AI Visibility (5%)
- [ ] Answer-first format used
- [ ] FAQ section included
- [ ] Self-contained sections
- [ ] Clear entity definitions

### Score Calculation

```
Total Score = Σ (category_score × weight)

Display:
- 90-100: ⭐⭐⭐⭐⭐ EXCEPTIONAL
- 80-89:  ⭐⭐⭐⭐ EXCELLENT  
- 70-79:  ⭐⭐⭐ GOOD
- 60-69:  ⭐⭐ NEEDS WORK
- <60:    ⭐ REQUIRES MAJOR REVISION
```

---

## ANALYZER

The analyzer can score ANY content against this methodology.

**Input:** Raw markdown or URL
**Output:** Score breakdown + improvement suggestions

```
Analyzer checks:
1. Parse content structure
2. Detect title pattern
3. Analyze voice/personality markers
4. Check technical SEO elements
5. Evaluate visual presence
6. Check internal/external links
7. Assess AI visibility format
8. Calculate weighted score
9. Generate specific improvement recommendations
```

---

## API KEYS REQUIRED

All keys stored in Supabase `credentials` table:

| Key Name | Provider | Purpose |
|----------|----------|---------|
| `perplexity_api_key` | Perplexity | Research |
| `anthropic_api_key` | Anthropic | Writing (Claude) |
| `grok_api_key` | xAI | Humanization (Grok) |
| `google_generative_ai_key` | Google | Gemini, Imagen, Veo |
| `openai_api_key` | OpenAI | Embeddings |

---

## USAGE

When someone says "write an article":

1. Load this specification
2. Follow the pipeline exactly
3. Use the specified models
4. Score against the methodology
5. Output everything to the defined structure

**The machine is the spec. Follow it.**

---

*Last updated: 2026-02-17*
*Location: stepten-io/lib/content-engine/*

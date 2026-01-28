# 🔍 Step 2: Research & Planning - Prompts

**Step:** Research & Planning  
**AI Model:** Perplexity Sonar (`sonar-reasoning-pro`)  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 2 uses Perplexity for deep research with citations, then Claude for keyword strategy and title generation.

---

## Prompts

### PROMPT 1: Deep Research Query

**Model:** `sonar-reasoning-pro` (Perplexity)  
**Type:** Research with Citations  
**When Used:** To gather research data on the topic

```markdown
## SYSTEM PROMPT

You are a research assistant gathering comprehensive information for an SEO article.

Provide well-researched, factual information with citations from authoritative sources.
Focus on recent data (prefer 2024-2026 sources).
Include statistics, expert opinions, and real-world examples.

## USER PROMPT

I'm writing an article about:
**Topic:** {{ARTICLE_IDEA}}
**Target Audience:** {{TARGET_AUDIENCE}}
**Angle:** {{UNIQUE_ANGLE}}

Please research and provide:

1. **Key Statistics** (with sources)
   - Recent data points that support the article's claims
   - Industry benchmarks and trends

2. **Expert Insights**
   - What are thought leaders saying about this topic?
   - Any contrarian viewpoints worth addressing?

3. **Case Studies / Examples**
   - Real companies or people who've done this
   - Success stories and lessons learned

4. **Common Questions**
   - What do people commonly ask about this?
   - What misconceptions exist?

5. **Authoritative Sources to Cite**
   - Provide 5-10 high-authority URLs (.gov, .edu, .org, reputable .com)
   - Include domain authority where possible

Format with clear sections and bullet points.
```

---

### PROMPT 2: Keyword Strategy

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** SEO Analysis  
**When Used:** To determine keyword strategy

```markdown
## SYSTEM PROMPT

You are an SEO expert specializing in keyword research and content strategy.

Based on the topic and research provided, create a comprehensive keyword strategy.

## USER PROMPT

**Article Topic:** {{ARTICLE_IDEA}}
**Research Summary:** {{RESEARCH_SUMMARY}}

Create a keyword strategy:

**Main Keyword:**
- Suggest 1 primary keyword (2-4 words)
- This should have search volume and be achievable

**Semantic Keywords:**
- List 8-12 related keywords and phrases
- Include variations and long-tail keywords

**Search Intent:**
- What is the user trying to accomplish?
- Informational / Transactional / Navigational?

**Keyword Placement Strategy:**
- Title: [suggest keyword placement]
- URL slug: [suggest URL]
- First 100 words: [how to incorporate]
- H2 headings: [which should contain keywords]

**Competitive Analysis:**
- Based on research, what angle is underserved?
- How can we differentiate from existing content?
```

---

### PROMPT 3: Title Generation

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Creative + SEO  
**When Used:** To generate optimized title options

```markdown
## SYSTEM PROMPT

You are a headline expert who writes titles that are both SEO-optimized and compelling to click.

Create titles that:
- Include the main keyword naturally
- Are 50-60 characters for optimal SERP display
- Create curiosity or promise clear value
- Sound human, not robotic

## USER PROMPT

**Topic:** {{ARTICLE_IDEA}}
**Main Keyword:** {{MAIN_KEYWORD}}
**Target Audience:** {{TARGET_AUDIENCE}}
**Article Angle:** {{UNIQUE_ANGLE}}

Generate 5 title options in different styles:

1. **How-To Style:** A practical, actionable title
2. **List Style:** Uses numbers (5 Ways, 10 Tips, etc.)
3. **Question Style:** Asks what the reader wants to know
4. **Benefit-Focused:** Highlights the outcome
5. **Curiosity-Driven:** Creates intrigue

For each title, provide:
- The title (50-60 chars)
- Character count
- Why it works

Rank them by recommended order.
```

---

### PROMPT 4: Internal Link Mapping

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Content Strategy  
**When Used:** To identify internal linking opportunities

```markdown
## SYSTEM PROMPT

You are an internal linking strategist. Given an article topic and a list of existing content, identify the best linking opportunities.

Link types:
- **Up links:** Links to pillar/parent pages
- **Down links:** Links to more specific child content
- **Sideways links:** Links to related content at same level

## USER PROMPT

**New Article Topic:** {{ARTICLE_IDEA}}
**Main Keyword:** {{MAIN_KEYWORD}}
**Content Silo:** {{SILO_NAME}}

**Existing Content in Silo:**
{{EXISTING_ARTICLES_LIST}}

Recommend internal links:

**Up Links (to pillar content):**
- [Article title] - Why this link makes sense

**Down Links (to specific content):**
- [Article title] - Why this link makes sense

**Sideways Links (to related content):**
- [Article title] - Why this link makes sense

**Suggested Anchor Text:**
For each link, suggest 2-3 anchor text variations.

**Cannibalization Check:**
- Are there any existing articles targeting the same keyword?
- If yes, how should we differentiate or consolidate?
```

---

### PROMPT 5: Silo Assignment

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Content Organization  
**When Used:** To determine where article fits in site structure

```markdown
## SYSTEM PROMPT

You are a content architect. Determine which content silo this article belongs to, or if a new silo should be created.

## USER PROMPT

**Article Topic:** {{ARTICLE_IDEA}}
**Main Keyword:** {{MAIN_KEYWORD}}

**Existing Silos:**
{{SILOS_LIST}}

Recommend:

1. **Best Silo Match:** Which existing silo fits best?
2. **Confidence Score:** How confident (1-10)?
3. **If Low Confidence:** Should we create a new silo?
4. **New Silo Suggestion:** If needed, what should it be called?

Explain your reasoning.
```

---

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ARTICLE_IDEA}}` | The main topic from Step 1 | "AI automation for small business" |
| `{{TARGET_AUDIENCE}}` | Who the article is for | "Small business owners" |
| `{{UNIQUE_ANGLE}}` | What makes it different | "Budget-friendly approach" |
| `{{RESEARCH_SUMMARY}}` | Output from Perplexity | Research data |
| `{{MAIN_KEYWORD}}` | Primary keyword | "AI for small business" |
| `{{EXISTING_ARTICLES_LIST}}` | List of existing articles | JSON array of titles/slugs |
| `{{SILO_NAME}}` | Content silo name | "AI & Automation" |
| `{{SILOS_LIST}}` | All available silos | JSON array of silo names |

---

## API Configuration

### Perplexity Settings
```json
{
  "model": "sonar-reasoning-pro",
  "temperature": 0.3,
  "max_tokens": 4000,
  "return_citations": true,
  "search_recency_filter": "year"
}
```

### Claude Settings
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*

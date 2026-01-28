# 📋 Step 3: Article Framework - Prompts

**Step:** Article Framework Generation  
**AI Model:** Claude 4.5 Sonnet (`claude-sonnet-4-5-20250929`)  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 3 uses Claude to generate a detailed article framework including headings, word counts, and placement markers.

---

## Prompts

### PROMPT 1: Framework Generation (Main Prompt)

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Structure Generation  
**When Used:** To create the article outline

```markdown
## SYSTEM PROMPT

You are an expert content strategist and SEO specialist. Your job is to create detailed article frameworks that:

1. Are optimized for RankMath 100/100 SEO scores
2. Use proper heading hierarchy (H1 → H2 → H3)
3. Include strategic placement for images, internal links, outbound links, and affiliate links
4. Distribute word count effectively across sections
5. Cover the topic comprehensively while keeping readers engaged

Output your framework as structured JSON for easy parsing.

## USER PROMPT

Create an article framework for:

**Title:** {{ARTICLE_TITLE}}
**Main Keyword:** {{MAIN_KEYWORD}}
**Semantic Keywords:** {{SEMANTIC_KEYWORDS}}
**Target Word Count:** {{TARGET_WORDS}} words
**Target Audience:** {{TARGET_AUDIENCE}}

**Research Insights:**
{{RESEARCH_SUMMARY}}

**Internal Links Available:**
{{INTERNAL_LINKS}}

**Outbound Sources:**
{{OUTBOUND_SOURCES}}

Generate a framework with this structure:

```json
{
  "title": "H1 title",
  "target_words": 2000,
  "sections": [
    {
      "id": "unique-id",
      "level": "h2",
      "heading": "Section Title",
      "word_count": 400,
      "key_points": ["Point 1", "Point 2"],
      "keywords_to_include": ["keyword1"],
      "image_placement": true,
      "image_suggestion": "Description for AI image",
      "internal_link": {
        "url": "/article-slug",
        "anchor_text": "suggested anchor"
      },
      "outbound_link": null,
      "affiliate_link": null,
      "subsections": [
        {
          "id": "sub-id",
          "level": "h3",
          "heading": "Subsection Title",
          "word_count": 150,
          "key_points": ["Detail 1"]
        }
      ]
    }
  ],
  "faq_section": [
    {
      "question": "Common question?",
      "answer_points": ["Point 1", "Point 2"]
    }
  ]
}
```

Requirements:
- Include 4-6 H2 sections
- Each H2 can have 2-4 H3 subsections
- Total word count should match target (±10%)
- Include at least 3 image placements
- Include all provided internal links naturally
- Include 3+ outbound links to authoritative sources
- Add FAQ section with 3-5 questions
- First H2 should hook the reader (not just define the term)
```

---

### PROMPT 2: Framework Refinement (Voice Feedback)

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Editing  
**When Used:** When user provides voice feedback

```markdown
## SYSTEM PROMPT

You are refining an article framework based on user feedback.

Make surgical changes based on the feedback while preserving the overall structure.
If the feedback is unclear, note what needs clarification.

## USER PROMPT

**Current Framework:**
{{CURRENT_FRAMEWORK_JSON}}

**User Feedback (transcribed):**
"{{VOICE_FEEDBACK}}"

Please update the framework based on this feedback.

Return:
1. The updated framework JSON
2. A summary of changes made
3. Any clarifications needed
```

---

### PROMPT 3: Section Expansion

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Content Guidance  
**When Used:** To get more detail for a specific section

```markdown
## SYSTEM PROMPT

You are providing detailed guidance for writing a specific section of an article.

## USER PROMPT

**Article Title:** {{ARTICLE_TITLE}}
**Main Keyword:** {{MAIN_KEYWORD}}

**Section to Expand:**
- Heading: {{SECTION_HEADING}}
- Target Words: {{SECTION_WORDS}}
- Level: {{SECTION_LEVEL}}

**Current Key Points:**
{{KEY_POINTS}}

Provide expanded guidance:

1. **Opening Hook:** How should this section start? (1-2 sentences)
2. **Key Points Expanded:** For each point, suggest 2-3 supporting details
3. **Data/Stats to Include:** Any specific statistics recommended
4. **Examples:** Real-world examples to incorporate
5. **Transition:** How to smoothly lead to the next section
6. **SEO Notes:** Any keywords to naturally include
```

---

### PROMPT 4: Word Count Balancing

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Optimization  
**When Used:** To rebalance word counts

```markdown
## SYSTEM PROMPT

You are a content strategist optimizing word count distribution across an article.

## USER PROMPT

**Target Total:** {{TARGET_WORDS}} words
**Current Total:** {{CURRENT_TOTAL}} words

**Current Distribution:**
{{SECTIONS_WITH_COUNTS}}

Suggest rebalancing:
- Which sections should be longer?
- Which can be shorter?
- Is the target achievable with this structure?
- Any sections to add or remove?

Output updated word counts with reasoning.
```

---

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ARTICLE_TITLE}}` | The chosen title | "How AI is Transforming..." |
| `{{MAIN_KEYWORD}}` | Primary keyword | "AI automation small business" |
| `{{SEMANTIC_KEYWORDS}}` | Related keywords | ["AI tools", "automation"] |
| `{{TARGET_WORDS}}` | Target word count | 2000 |
| `{{TARGET_AUDIENCE}}` | Who it's for | "Small business owners" |
| `{{RESEARCH_SUMMARY}}` | Key research points | Summary from Step 2 |
| `{{INTERNAL_LINKS}}` | Available internal links | Array of {url, title} |
| `{{OUTBOUND_SOURCES}}` | Research sources | Array of {url, title, da} |
| `{{CURRENT_FRAMEWORK_JSON}}` | Existing framework | JSON object |
| `{{VOICE_FEEDBACK}}` | User voice feedback | Transcribed text |

---

## Expected Output Format

```json
{
  "title": "How AI is Transforming Small Business Operations in 2026",
  "target_words": 2000,
  "estimated_read_time": 9,
  "sections": [
    {
      "id": "intro",
      "level": "h2",
      "heading": "Why Small Businesses Need AI Now",
      "word_count": 400,
      "key_points": [
        "The competitive landscape has changed",
        "AI is no longer just for enterprises"
      ],
      "keywords_to_include": ["AI for small business"],
      "image_placement": false,
      "internal_link": null,
      "outbound_link": {
        "url": "https://hbr.org/ai-business",
        "anchor_text": "Harvard Business Review reports"
      },
      "subsections": []
    }
  ],
  "faq_section": [
    {
      "question": "How much does AI cost for small businesses?",
      "answer_points": [
        "Many tools have free tiers",
        "Paid options start at $20-50/month"
      ]
    }
  ]
}
```

---

## API Configuration

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "temperature": 0.7,
  "max_tokens": 4000,
  "system": "[SYSTEM PROMPT]"
}
```

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*

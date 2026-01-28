# 🧠 Step 5: Humanization - Prompts

**Step:** Humanization  
**AI Model:** Grok 4.1 (`grok-4-1-fast-reasoning`)  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 5 uses Grok to detect and remove AI writing patterns, adding natural human flow, idioms, and authentic voice.

---

## Why Grok for Humanization

Grok is specifically designed for:
- Detecting patterns that AI detectors look for
- Understanding natural conversational flow
- Adding wit, personality, and human touches
- Breaking predictable sentence structures

---

## Prompts

### PROMPT 1: AI Pattern Detection

**Model:** `grok-4-1-fast-reasoning`  
**Type:** Analysis  
**When Used:** To scan article for AI patterns

```markdown
## SYSTEM PROMPT

You are an AI detection expert. Your job is to identify patterns in text that:
1. AI detection tools flag as machine-generated
2. Make content sound robotic or unnatural
3. Reduce reader engagement

You know exactly what patterns to look for because you understand how AI models (including Claude, GPT, etc.) typically write.

## USER PROMPT

Analyze this article for AI-generated patterns:

---
{{ARTICLE_CONTENT}}
---

Identify and categorize issues:

**1. AI Clichés & Phrases**
List every instance of typical AI phrases like:
- "In today's fast-paced world"
- "It's important to note that"
- "In this comprehensive guide"
- "leverage", "utilize", "facilitate"
- "a myriad of", "plethora of"
- Starting paragraphs with "However," or "Moreover,"

Format:
```json
{
  "pattern": "phrase found",
  "location": "paragraph number or context",
  "suggestion": "human alternative"
}
```

**2. Passive Voice Overuse**
Find passive constructions that should be active.

**3. Repetitive Sentence Structures**
Identify patterns like "X is Y. A is B. C is D."

**4. Unnatural Transitions**
Find transitions that feel academic or forced.

**5. Hedging Language**
Find excessive use of "may", "might", "could potentially"

**6. Robotic Conclusions**
Identify boilerplate summary language.

Return a comprehensive JSON report with all findings.
```

---

### PROMPT 2: Full Humanization Pass

**Model:** `grok-4-1-fast-reasoning`  
**Type:** Rewriting  
**When Used:** To humanize the entire article

```markdown
## SYSTEM PROMPT

You are a humanization expert. Your job is to transform AI-written content into something that:

1. Passes AI detection tools (Originality.ai, GPTZero, etc.)
2. Sounds like a real person wrote it
3. Maintains the original meaning and keywords
4. Keeps the same approximate word count

Techniques you use:
- Replace AI phrases with conversational alternatives
- Vary sentence length dramatically (5 words to 25 words)
- Add contractions (it's, don't, can't, we're)
- Include rhetorical questions
- Add personal touches ("I've seen this myself")
- Use idioms and colloquialisms naturally
- Break perfect grammar occasionally (fragments, dashes)
- Add personality and opinion
- Use informal transitions ("Look,", "Here's the thing:", "Honestly,")

DO NOT:
- Change the core information
- Remove keywords or links
- Significantly change word count (±5%)
- Make it too casual if it's a professional piece

## USER PROMPT

Humanize this article:

**Original Article:**
---
{{ARTICLE_CONTENT}}
---

**Author's Voice Profile:**
- Name: {{AUTHOR_NAME}}
- Style: {{WRITING_STYLE}}
- Industry: {{INDUSTRY}}

**Keywords to Preserve:**
{{KEYWORDS_LIST}}

**Links to Preserve:**
{{LINKS_LIST}}

Return:
1. The fully humanized article
2. A summary of major changes made
3. Estimated AI detection score before/after
```

---

### PROMPT 3: Targeted Fix Application

**Model:** `grok-4-1-fast-reasoning`  
**Type:** Surgical Editing  
**When Used:** To apply specific fixes from detection

```markdown
## SYSTEM PROMPT

You are making targeted improvements to specific passages in an article.

Apply the suggested fixes while ensuring the surrounding content flows naturally.

## USER PROMPT

Apply these fixes to the article:

**Original Article:**
---
{{ARTICLE_CONTENT}}
---

**Fixes to Apply:**
{{FIXES_JSON}}

For each fix:
1. Find the original text
2. Replace with the suggestion
3. Ensure surrounding sentences still flow

Return the updated article with all fixes applied.
```

---

### PROMPT 4: Before/After Comparison

**Model:** `grok-4-1-fast-reasoning`  
**Type:** Comparison Generation  
**When Used:** To show user what changed

```markdown
## SYSTEM PROMPT

Generate a clear before/after comparison of humanization changes.

## USER PROMPT

Compare these versions:

**Before:**
---
{{ORIGINAL_SECTION}}
---

**After:**
---
{{HUMANIZED_SECTION}}
---

Provide:
1. Side-by-side comparison of key changes
2. Why each change improves human-ness
3. Impact on readability score
```

---

### PROMPT 5: Voice Injection

**Model:** `grok-4-1-fast-reasoning`  
**Type:** Personality Addition  
**When Used:** To add author's unique voice

```markdown
## SYSTEM PROMPT

You are injecting personality and voice into an article while maintaining professionalism.

You have access to the author's writing samples and preferences.

## USER PROMPT

Add voice to this article:

**Article:**
---
{{ARTICLE_CONTENT}}
---

**Author's Sample Writing:**
---
{{AUTHOR_SAMPLES}}
---

**Author's Opinions/Stances:**
{{AUTHOR_OPINIONS}}

**Author's Favorite Phrases:**
{{AUTHOR_PHRASES}}

Inject the author's voice by:
1. Using their typical expressions
2. Adding their opinions where relevant
3. Matching their sentence rhythm
4. Including their perspective on the topic

Return the article with enhanced voice while keeping all keywords and links.
```

---

## Pattern Database

Common AI patterns to detect and replace:

### Phrase Replacements

| AI Pattern | Human Alternatives |
|------------|-------------------|
| "In this article, we will explore" | "Let me show you", "Here's what you need to know" |
| "It's important to note that" | "Here's the thing:", "Look," |
| "Furthermore" | "Plus,", "And", "On top of that" |
| "Moreover" | "What's more,", "Also," |
| "In conclusion" | "So here's the deal", "Bottom line" |
| "leverage" | "use", "tap into", "take advantage of" |
| "utilize" | "use" |
| "facilitate" | "help", "make easier" |
| "a myriad of" | "tons of", "lots of", "many" |
| "In today's fast-paced world" | [Delete or specific context] |
| "It is worth mentioning" | "Also worth noting," |
| "needless to say" | [Usually delete] |

### Sentence Structure Fixes

| Pattern | Fix |
|---------|-----|
| Three sentences starting with "The" | Vary with "I", "You", "This", questions |
| All similar length (15-20 words) | Mix: 5 words. Then 25. Then 12. |
| No contractions | Add: don't, won't, it's, we're |
| No questions | Add 1-2 per section |
| All statements end with periods | Add occasional fragment. Or question? |

---

## Variables

| Variable | Description |
|----------|-------------|
| `{{ARTICLE_CONTENT}}` | Full article text |
| `{{AUTHOR_NAME}}` | Author name |
| `{{WRITING_STYLE}}` | Style description |
| `{{INDUSTRY}}` | Industry/niche |
| `{{KEYWORDS_LIST}}` | Keywords to keep |
| `{{LINKS_LIST}}` | Links that must stay |
| `{{FIXES_JSON}}` | Detection results |
| `{{AUTHOR_SAMPLES}}` | Sample writing |
| `{{AUTHOR_OPINIONS}}` | Known stances |

---

## API Configuration

```typescript
// xAI Grok configuration
const response = await xai.chat.completions.create({
  model: "grok-4-1-fast-reasoning",
  temperature: 0.8, // Higher for creativity
  max_tokens: 8000,
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: USER_PROMPT }
  ]
});
```

---

## Scoring

### AI Detection Score Targets

| Tool | Before Goal | After Goal |
|------|-------------|------------|
| Originality.ai | Any | >85% Human |
| GPTZero | Any | Likely Human |
| Copyleaks | Any | >80% Human |

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*

# 🎨 Step 7: Styling & Media - Prompts

**Step:** Styling & Media  
**AI Model:** DALL-E 3 + Flux.1 Pro  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 7 uses AI to generate custom images for the article and define visual styling elements.

---

## Image Generation Models

| Model | Use Case | Best For |
|-------|----------|----------|
| **DALL-E 3** | Hero images, conceptual | Photo-realistic, creative |
| **Flux.1 Pro** | Custom style images | Consistent branding |
| **Ideogram 3** | Text in images | Infographics, quotes |

---

## Prompts

### PROMPT 1: Hero Image Generation

**Model:** `dall-e-3`  
**Type:** Image Generation  
**When Used:** To create the main article hero image

```markdown
## PROMPT TEMPLATE

Create a hero image for an article titled "{{ARTICLE_TITLE}}".

Style Requirements:
- Dark mode aesthetic (dark background)
- Primary accent color: Matrix Green (#00FF41)
- Secondary accents: Cyan (#22D3EE), Purple if needed
- Professional, modern, tech-forward
- Suitable for 16:9 aspect ratio
- No text or logos in the image
- High contrast for web visibility

Subject:
{{IMAGE_SUBJECT_DESCRIPTION}}

Mood:
{{IMAGE_MOOD}} (e.g., innovative, powerful, futuristic)

Avoid:
- Stock photo feel
- Generic business imagery
- Cluttered compositions
- Faces unless specifically requested
```

**Example Prompt:**
```
Create a hero image for an article about AI automation for small business.

Style: Dark mode with Matrix Green (#00FF41) accents. Modern, tech-forward aesthetic.

Subject: Abstract visualization of AI and automation - flowing data streams, neural network patterns, and geometric shapes suggesting business growth. A subtle glow effect on key elements.

Mood: Innovative, empowering, futuristic but accessible.

Format: 16:9, no text, high contrast for dark backgrounds.
```

---

### PROMPT 2: Section Image Generation

**Model:** `dall-e-3` or `flux-1-pro`  
**Type:** Image Generation  
**When Used:** For images within article sections

```markdown
## PROMPT TEMPLATE

Create an image for the section "{{SECTION_HEADING}}" in an article about {{ARTICLE_TOPIC}}.

Context:
- This section discusses: {{SECTION_SUMMARY}}
- Key points: {{KEY_POINTS}}

Style:
- Match hero image aesthetic
- Dark background (#0a0a0a or gradient)
- Matrix Green (#00FF41) accents
- Clean, minimal composition
- 16:9 aspect ratio

Subject:
{{SECTION_IMAGE_SUBJECT}}

Purpose:
- Support the content visually
- Break up text effectively
- Add value, not just decoration
```

---

### PROMPT 3: Infographic Generation

**Model:** `ideogram-3` (for text support)  
**Type:** Image with Text  
**When Used:** For stats, comparisons, processes

```markdown
## PROMPT TEMPLATE

Create an infographic for displaying:

**Data Type:** {{INFOGRAPHIC_TYPE}}
(Options: Statistics, Process Steps, Comparison, Timeline)

**Content:**
{{INFOGRAPHIC_DATA}}

**Style:**
- Dark theme with neon accents
- Matrix Green (#00FF41) as primary color
- Clean, legible text
- Modern sans-serif font
- 16:9 or square format

**Elements:**
- Icons where appropriate
- Clear visual hierarchy
- Data visualization (charts, icons, arrows)

**Example Data:**
- 40% productivity gain
- 35% cost reduction
- 3x faster processing
```

---

### PROMPT 4: Image Prompt from Content

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Prompt Generation  
**When Used:** Auto-generate image prompts from article content

```markdown
## SYSTEM PROMPT

You are a visual content strategist. Given an article section, generate detailed image prompts for AI image generators.

Your prompts should:
- Be specific and descriptive
- Match the StepTen.io dark mode aesthetic
- Support the content without being literal
- Avoid clichés (no handshakes, generic business people)

## USER PROMPT

Generate an image prompt for this section:

**Section Heading:** {{SECTION_HEADING}}
**Section Content:**
---
{{SECTION_CONTENT}}
---

**Brand Guidelines:**
- Dark backgrounds (#0a0a0a)
- Primary: Matrix Green (#00FF41)
- Secondary: Cyan (#22D3EE)
- Style: Modern, tech, premium

Generate:

1. **Primary Prompt** (for DALL-E 3)
   - Full detailed prompt (100-200 words)
   - Style keywords
   - Negative prompt (what to avoid)

2. **Alternative Concepts**
   - 2-3 alternative visual approaches
   - Brief description of each

3. **Alt Text**
   - SEO-optimized alt text for the image
```

---

### PROMPT 5: Content Block Styling

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Styling Decisions  
**When Used:** To determine which content blocks to use

```markdown
## SYSTEM PROMPT

You are a content designer. Analyze article content and recommend visual content blocks to improve engagement and readability.

Available blocks:
- **Callout Box:** Key takeaways, important notes
- **Quote Block:** Expert quotes, pull quotes
- **Stats Grid:** Numerical data display
- **Checklist:** Action items, requirements
- **Comparison Table:** Before/after, pros/cons
- **FAQ Accordion:** Q&A sections
- **Code Block:** Technical examples
- **Timeline:** Sequential processes

## USER PROMPT

Analyze this article and recommend content blocks:

---
{{ARTICLE_CONTENT}}
---

For each recommendation:

```json
{
  "block_type": "callout",
  "location": "After paragraph 3 in 'Why Small Businesses Need AI'",
  "content": {
    "type": "key_takeaway",
    "text": "Businesses implementing AI see 20-40% productivity gains"
  },
  "rationale": "Highlights the most compelling statistic"
}
```

Recommend 4-6 content blocks strategically placed throughout.
```

---

### PROMPT 6: Typography Selection

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Design Decision  
**When Used:** For custom typography choices

```markdown
## SYSTEM PROMPT

You are a typography expert. Recommend font pairings for article content.

Current StepTen.io fonts:
- Headings: Space Grotesk
- Body: Inter
- Code: JetBrains Mono

## USER PROMPT

**Article Tone:** {{ARTICLE_TONE}}
**Industry:** {{INDUSTRY}}
**Audience:** {{AUDIENCE}}

Recommend:

1. Should we use default fonts or something custom?
2. If custom, what pairings work best?
3. Font weights to emphasize
4. Any special typography treatments for this article

Justify your recommendations.
```

---

## Brand Style Guide Reference

### Colors
```css
--primary: #00FF41;        /* Matrix Green */
--primary-dark: #00CC33;   /* Darker green */
--background: #0a0a0a;     /* Deep black */
--background-alt: #1a1a1a; /* Card backgrounds */
--info: #22D3EE;           /* Cyan */
--warning: #FBBF24;        /* Amber */
--error: #FF4757;          /* Red */
--success: #10B981;        /* Emerald */
```

### Image Specifications
| Type | Aspect Ratio | Min Size | Format |
|------|--------------|----------|--------|
| Hero | 16:9 | 1200x675 | WebP |
| Section | 16:9 | 800x450 | WebP |
| Inline | 4:3 | 600x450 | WebP |
| Square | 1:1 | 600x600 | WebP |

---

## Variables

| Variable | Description |
|----------|-------------|
| `{{ARTICLE_TITLE}}` | Article title |
| `{{ARTICLE_TOPIC}}` | Main topic |
| `{{SECTION_HEADING}}` | Current section |
| `{{SECTION_CONTENT}}` | Section text |
| `{{IMAGE_SUBJECT_DESCRIPTION}}` | What to show |
| `{{IMAGE_MOOD}}` | Emotional tone |
| `{{INFOGRAPHIC_TYPE}}` | Type of infographic |
| `{{INFOGRAPHIC_DATA}}` | Data to visualize |

---

## API Configuration

### OpenAI DALL-E 3
```typescript
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: IMAGE_PROMPT,
  n: 1,
  size: "1792x1024", // 16:9
  quality: "hd",
  style: "vivid" // or "natural"
});
```

### Flux.1 Pro (via Replicate)
```typescript
const output = await replicate.run(
  "black-forest-labs/flux-1.1-pro",
  {
    input: {
      prompt: IMAGE_PROMPT,
      aspect_ratio: "16:9",
      output_format: "webp"
    }
  }
);
```

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*

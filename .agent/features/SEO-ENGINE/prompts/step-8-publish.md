# 🚀 Step 8: Review & Publish - Prompts

**Step:** Review & Publish  
**AI Model:** Various (for final checks)  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Overview

Step 8 performs final quality checks and handles the publishing process. Most of this step is internal logic, but some AI prompts assist with final reviews.

---

## Prompts

### PROMPT 1: Final Quality Review

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Comprehensive Review  
**When Used:** Final check before publish

```markdown
## SYSTEM PROMPT

You are a senior editor performing a final quality check before publication.

Check for:
- Factual accuracy
- Logical flow
- Missing information
- Broken links or placeholders
- Grammar and spelling
- Brand voice consistency
- Call-to-action clarity

Be critical but constructive.

## USER PROMPT

Perform a final review of this article:

**Title:** {{ARTICLE_TITLE}}
**Target Audience:** {{TARGET_AUDIENCE}}
**Goal of Article:** {{ARTICLE_GOAL}}

**Content:**
---
{{ARTICLE_CONTENT}}
---

**Checklist:**
- [ ] Introduction hooks the reader
- [ ] All claims are supported
- [ ] Transitions are smooth
- [ ] No placeholder content remains
- [ ] Links are properly formatted
- [ ] Images have alt text
- [ ] CTA is clear and compelling
- [ ] Conclusion summarizes and motivates action

**Report:**

1. **Overall Quality Score:** X/10
2. **Issues Found:** (list any problems)
3. **Suggested Quick Fixes:** (minor improvements)
4. **Publish Recommendation:** Ready / Needs Work

If "Needs Work," specify exactly what needs to change.
```

---

### PROMPT 2: Social Media Post Generation

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Content Repurposing  
**When Used:** To create social posts for article promotion

```markdown
## SYSTEM PROMPT

You create engaging social media posts that drive clicks to articles.

Style:
- Conversational, not promotional
- Create curiosity or promise value
- Use appropriate hashtags
- Match platform norms

## USER PROMPT

Create social posts for this article:

**Title:** {{ARTICLE_TITLE}}
**URL:** {{ARTICLE_URL}}
**Key Takeaway:** {{KEY_TAKEAWAY}}
**Target Audience:** {{TARGET_AUDIENCE}}

Generate posts for:

**1. Twitter/X (280 chars max)**
- Version A: Question hook
- Version B: Bold statement
- Version C: Stat-driven

**2. LinkedIn (1500 chars max)**
- Professional tone
- Personal insight angle
- Include a question for engagement

**3. Facebook (500 chars ideal)**
- Conversational tone
- Include emoji sparingly
- Clear value proposition

**4. Thread Starter (for Twitter/X thread)**
- Hook tweet (280 chars)
- Outline for 5-7 tweet thread
- Thread ending with CTA

Include relevant hashtags for each platform.
```

---

### PROMPT 3: Newsletter Blurb

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Email Content  
**When Used:** For email newsletter inclusion

```markdown
## SYSTEM PROMPT

You write newsletter blurbs that entice readers to click through to articles.

Keep it brief but compelling. Make readers feel they'll miss out if they don't read.

## USER PROMPT

Write a newsletter blurb for:

**Article Title:** {{ARTICLE_TITLE}}
**Article URL:** {{ARTICLE_URL}}
**Key Points:**
{{KEY_POINTS}}

**Newsletter Context:**
- Newsletter name: {{NEWSLETTER_NAME}}
- Typical reader: {{READER_PROFILE}}
- Tone: {{NEWSLETTER_TONE}}

Generate:

**Subject Line Options (3):**
1. [Subject line]
2. [Subject line]
3. [Subject line]

**Preview Text (90 chars):**
[Preview text]

**Newsletter Blurb (100-150 words):**
[Compelling summary that drives clicks]

**CTA Button Text:**
[Button text]
```

---

### PROMPT 4: Publish Checklist Generation

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Checklist  
**When Used:** To generate custom pre-publish checklist

```markdown
## SYSTEM PROMPT

Generate a tailored publish checklist based on the article content and SEO requirements.

## USER PROMPT

Generate a pre-publish checklist for:

**Article Title:** {{ARTICLE_TITLE}}
**Has Images:** {{IMAGE_COUNT}}
**Has Internal Links:** {{INTERNAL_LINK_COUNT}}
**Has Outbound Links:** {{OUTBOUND_LINK_COUNT}}
**Has FAQ:** {{HAS_FAQ}}
**Has Schema:** {{SCHEMA_TYPES}}
**Publishing To:** {{PLATFORMS}}

Create a checklist with status:

```json
{
  "categories": [
    {
      "name": "Content",
      "items": [
        {
          "check": "Title is 50-60 characters",
          "status": "pass",
          "value": "58 characters"
        }
      ]
    }
  ],
  "publish_ready": true,
  "blockers": []
}
```

Include all relevant checks for this specific article.
```

---

### PROMPT 5: Scheduling Recommendation

**Model:** `claude-sonnet-4-5-20250929`  
**Type:** Strategic Planning  
**When Used:** To suggest optimal publish time

```markdown
## SYSTEM PROMPT

You recommend optimal publishing times based on:
- Target audience timezone
- Industry best practices
- Content type
- Day of week patterns

## USER PROMPT

Recommend publish time for:

**Article Title:** {{ARTICLE_TITLE}}
**Target Audience:** {{TARGET_AUDIENCE}}
**Audience Location:** {{PRIMARY_TIMEZONE}}
**Content Type:** {{CONTENT_TYPE}} (e.g., educational, news, entertainment)
**Industry:** {{INDUSTRY}}

Consider:
- When is the audience most active?
- Best days for this type of content
- Avoiding competing with major events

Recommend:

**Best Day:** [Day]
**Best Time:** [Time with timezone]
**Alternative Slot:** [Second option]
**Reasoning:** [Why this timing]

**Scheduling Tips:**
- When to post on social media after publish
- Email newsletter timing
```

---

## Non-AI Publish Actions

These don't use AI prompts but are part of Step 8:

### Database Operations
```typescript
// Save to articles table
await supabase.from('articles').insert({
  title: articleData.title,
  slug: articleData.slug,
  content: articleData.content,
  status: 'published',
  meta_title: articleData.metaTitle,
  meta_description: articleData.metaDescription,
  schema_json: articleData.schema,
  published_at: new Date().toISOString()
});
```

### Cache Invalidation
```typescript
// Revalidate pages
await revalidatePath('/');
await revalidatePath(`/${articleData.slug}`);
await revalidatePath('/blog');
```

### Sitemap Update
```typescript
// Regenerate sitemap
await generateSitemap();
```

### Notification Triggers
```typescript
// Trigger social posting
await triggerSocialPosts(articleData);

// Add to newsletter queue
await addToNewsletterQueue(articleData);

// Notify subscribers
await notifySubscribers(articleData);
```

---

## Variables

| Variable | Description |
|----------|-------------|
| `{{ARTICLE_TITLE}}` | Article title |
| `{{ARTICLE_URL}}` | Full URL |
| `{{ARTICLE_CONTENT}}` | Full markdown |
| `{{KEY_TAKEAWAY}}` | Main insight |
| `{{TARGET_AUDIENCE}}` | Who it's for |
| `{{ARTICLE_GOAL}}` | Purpose |
| `{{NEWSLETTER_NAME}}` | Email list name |
| `{{PRIMARY_TIMEZONE}}` | Audience TZ |

---

## Publish Channels

| Channel | Automated | Config |
|---------|-----------|--------|
| Website | ✅ Yes | Database insert |
| Twitter/X | 🔲 Optional | API integration |
| LinkedIn | 🔲 Optional | API integration |
| Newsletter | 🔲 Optional | Email service |
| RSS | ✅ Yes | Auto-generated |

---

## Post-Publish Tracking

After publishing, track:

1. **Indexing Status** - Google Search Console
2. **Initial Traffic** - Analytics
3. **Social Engagement** - Platform analytics
4. **Ranking Position** - SERP tracking
5. **Backlink Acquisition** - Ahrefs/SEMrush

---

## Prompt Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-10 | Initial prompts created |

---

*Last updated: 2026-01-10 11:00 SGT*

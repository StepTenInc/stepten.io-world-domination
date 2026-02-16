/**
 * Step 4: Optimizer (Gemini)
 * 
 * Generates SEO elements: meta, schema, keywords, internal links.
 */

import { config } from '../config';

const OPTIMIZER_PROMPT = `You are an SEO optimization engine. Analyze this article and generate all required SEO elements.

## THE ARTICLE

Title: {{TITLE}}

Content:
{{CONTENT}}

## EXISTING ARTICLES ON THE SITE (for internal linking)

{{EXISTING_ARTICLES}}

## YOUR TASK

Generate comprehensive SEO optimization for this article.

### 1. META TITLE
- 50-60 characters
- Include primary keyword near the start
- Make it compelling (not just descriptive)
- Different from the H1 but related

### 2. META DESCRIPTION
- 120-155 characters
- Include a clear call-to-action
- Mention the primary benefit
- Include primary keyword naturally

### 3. URL SLUG
- 3-5 words max
- Lowercase, hyphens only
- No dates or numbers unless essential
- Include primary keyword

### 4. PRIMARY & SECONDARY KEYWORDS
- Identify the main keyword this should rank for
- Identify 3-5 secondary keywords
- Include long-tail variations

### 5. INTERNAL LINK SUGGESTIONS
For each existing article that's relevant, suggest:
- Where in THIS article to place the link (quote the sentence)
- What anchor text to use (semantic, enriched - NOT "click here")
- Why this link makes sense

### 6. SCHEMA MARKUP
Generate JSON-LD for:
- Article schema
- BreadcrumbList schema
- FAQ schema (if FAQ section exists)

### 7. BREADCRUMBS
Based on the topic, suggest the breadcrumb path:
Home > Category > Subcategory > This Article

## OUTPUT FORMAT

Return as JSON:

{
  "meta": {
    "title": "Meta title here (50-60 chars)",
    "description": "Meta description here (120-155 chars)",
    "slug": "url-slug-here"
  },
  "keywords": {
    "primary": "main keyword",
    "secondary": ["keyword 2", "keyword 3", "keyword 4"],
    "longTail": ["long tail phrase 1", "long tail phrase 2"]
  },
  "internalLinks": [
    {
      "targetArticle": "slug of article to link to",
      "insertAfter": "Quote the sentence after which to insert the link",
      "anchorText": "the enriched anchor text to use",
      "reason": "why this link is relevant"
    }
  ],
  "schema": {
    "article": { /* Article JSON-LD */ },
    "breadcrumb": { /* BreadcrumbList JSON-LD */ },
    "faq": { /* FAQPage JSON-LD if applicable */ }
  },
  "breadcrumbs": [
    { "name": "Home", "url": "/" },
    { "name": "Category", "url": "/category" },
    { "name": "Article Title", "url": "/tales/slug" }
  ],
  "suggestions": [
    "SEO improvement suggestion 1",
    "SEO improvement suggestion 2"
  ]
}`;

export interface OptimizerOutput {
  meta: {
    title: string;
    description: string;
    slug: string;
  };
  keywords: {
    primary: string;
    secondary: string[];
    longTail: string[];
  };
  internalLinks: Array<{
    targetArticle: string;
    insertAfter: string;
    anchorText: string;
    reason: string;
  }>;
  schema: {
    article: object;
    breadcrumb: object;
    faq?: object;
  };
  breadcrumbs: Array<{
    name: string;
    url: string;
  }>;
  suggestions: string[];
}

export async function runOptimizer(
  title: string,
  content: string,
  existingArticles: Array<{ slug: string; title: string; excerpt: string }>,
  apiKey: string
): Promise<OptimizerOutput> {
  const existingList = existingArticles.length > 0
    ? existingArticles.map(a => `- ${a.title} (/tales/${a.slug}): ${a.excerpt}`).join('\n')
    : 'No existing articles yet.';

  const prompt = OPTIMIZER_PROMPT
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', content)
    .replace('{{EXISTING_ARTICLES}}', existingList);

  const response = await fetch(
    `${config.models.optimizer.endpoint}/models/${config.models.optimizer.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Failed to generate SEO optimization');
  }

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse optimizer output');
  }

  return JSON.parse(jsonMatch[0]) as OptimizerOutput;
}

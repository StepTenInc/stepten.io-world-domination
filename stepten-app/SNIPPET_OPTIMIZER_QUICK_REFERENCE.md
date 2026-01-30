# Featured Snippet Optimizer - Quick Reference

## API Endpoint

```typescript
POST /api/seo/optimize-snippet
```

## Request

```json
{
  "keyword": "what is seo",
  "articleContent": "<h1>Article HTML...</h1>",
  "targetFormat": "paragraph" // optional: "paragraph" | "list" | "table"
}
```

## Response

```json
{
  "keyword": "what is seo",
  "targetFormat": "paragraph",
  "winProbability": 78,
  "optimizedContent": {
    "paragraph": "SEO is...",
    "html": "<p>SEO is...</p>"
  },
  "insertionPoint": {
    "afterHeading": "What is SEO?",
    "paragraphIndex": 0
  }
}
```

## Format Rules

| Format    | Length      | Best For                    |
|-----------|-------------|-----------------------------|
| Paragraph | 40-60 words | Questions (what, why, when) |
| List      | 5-8 items   | How-to, steps, best/top     |
| Table     | 2-4 columns | Comparisons (vs, versus)    |

## Win Probability Factors

- ✅ Keyword in title/heading: +15 pts
- ✅ Content quality (1000-3000 words): +15 pts
- ✅ Optimal format & length: +20 pts
- ⚠️ Competition level: -20 to +10 pts
- **Range**: 0-100%

## Quick Usage

```typescript
// Fetch from API
const res = await fetch('/api/seo/optimize-snippet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ keyword, articleContent })
});
const optimization = await res.json();

// Use the optimized content
console.log(optimization.winProbability); // 78
console.log(optimization.optimizedContent.html); // "<p>...</p>"
```

## Direct Import

```typescript
import { detectFeaturedSnippet } from '@/lib/snippet-analyzer';
import { generateSnippetOptimization } from '@/lib/snippet-optimizer';

const detection = await detectFeaturedSnippet(keyword, content);
const optimization = generateSnippetOptimization(
  keyword, content, detection.snippet, 'paragraph'
);
```

## Constants

```typescript
import {
  SNIPPET_PARAGRAPH_LENGTH,  // [40, 60]
  SNIPPET_LIST_ITEMS,         // [5, 8]
  SNIPPET_TABLE_COLUMNS       // [2, 4]
} from '@/lib/constants';
```

## Files

- `lib/snippet-analyzer.ts` - Detection & analysis
- `lib/snippet-optimizer.ts` - Content generation
- `app/api/seo/optimize-snippet/route.ts` - API endpoint
- `lib/constants.ts` - Configuration constants

## Documentation

- `SNIPPET_OPTIMIZER_DOCUMENTATION.md` - Full documentation
- `SNIPPET_OPTIMIZER_EXAMPLES.md` - Usage examples
- `SNIPPET_OPTIMIZER_SUMMARY.md` - Implementation summary

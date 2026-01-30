# NLP Entity & Topic Coverage System

Complete documentation for the NLP Entity Extraction and Topic Coverage Analysis system for the SEO Article Engine.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [API Reference](#api-reference)
5. [Usage Examples](#usage-examples)
6. [Type Definitions](#type-definitions)
7. [Configuration](#configuration)
8. [Best Practices](#best-practices)

---

## Overview

The NLP Entity & Topic Coverage system analyzes article content to:

- **Extract entities** (people, organizations, products, concepts, locations, events)
- **Analyze topic coverage** against competitor articles
- **Identify content gaps** and missing subtopics
- **Extract semantic keywords** (LSI keywords)
- **Calculate completeness scores** (0-100)
- **Provide actionable recommendations** for improvement

### Key Benefits

✅ **Data-driven content optimization** - Know exactly what's missing
✅ **Competitive analysis** - See how you compare to top-ranking articles
✅ **Entity coverage** - Ensure all important entities are mentioned
✅ **Semantic SEO** - Optimize for LSI keywords and topic depth
✅ **Automated suggestions** - Get AI-powered placement recommendations

---

## Architecture

### File Structure

```
lib/
├── entity-extractor.ts       # Entity extraction and analysis
├── topic-coverage.ts          # Topic coverage analyzer
├── seo-types.ts              # Type definitions (Entity, TopicCoverage)
└── constants.ts              # NLP configuration constants

app/api/seo/
└── analyze-entities/
    └── route.ts              # API endpoint for entity analysis
```

### Data Flow

```
Article Content + Keyword
         ↓
   Entity Extraction
         ↓
   Competitor Analysis
         ↓
   Topic Coverage Analysis
         ↓
   Completeness Scoring
         ↓
   Recommendations
```

---

## Features

### 1. Entity Extraction

Identifies and classifies entities in your article:

**Entity Types:**
- `Person` - Authors, experts, historical figures
- `Organization` - Companies, institutions, frameworks
- `Concept` - Ideas, methodologies, principles
- `Product` - Software, tools, libraries, platforms
- `Location` - Places, countries, cities
- `Event` - Conferences, releases, milestones

**Entity Metrics:**
- **Mentions** - Count of times entity appears
- **Coverage Level** - missing/mentioned/explained/detailed
- **Importance Score** - 1-100 relevance to main topic
- **Competitor Mentions** - How often competitors mention it

### 2. Topic Coverage Analysis

Compares your article against competitors:

**Metrics:**
- **Completeness Score** (0-100) - Overall topic coverage
- **Required Subtopics** - Essential topics identified from competitors
- **Semantic Keywords** - LSI keywords and variations
- **Coverage Depth** - Shallow/Medium/Deep analysis

**Gap Analysis:**
- Missing subtopics
- Under-covered topics
- Missing semantic keywords
- Entity coverage gaps

### 3. Semantic Keyword Extraction

Identifies related keywords and phrases:

- **LSI Keywords** - Terms frequently co-occurring with main keyword
- **Natural Variations** - Different ways to express the same concept
- **Related Terms** - Semantically related concepts
- **Frequency Analysis** - Current vs. suggested usage

### 4. AI-Powered Recommendations

Generates actionable improvement suggestions:

- Add missing subtopics
- Expand shallow coverage
- Incorporate missing entities
- Increase keyword frequency
- Natural placement suggestions

---

## API Reference

### POST /api/seo/analyze-entities

Analyzes article content for entity coverage and topic completeness.

#### Request Body

```typescript
{
  articleContent: string;        // HTML content of your article
  keyword: string;               // Main keyword/topic
  competitorArticles?: string[]; // Optional competitor HTML (max 5)
}
```

#### Response

```typescript
{
  topicCoverage: TopicCoverage;  // Complete analysis
  recommendations: string[];      // Actionable suggestions
  summary: {
    completeness: number;         // 0-100
    competitorAverage: number;    // 0-100
    scoreGap: number;             // Your score - competitor avg
    totalEntities: number;
    missingEntities: number;
    totalSubtopics: number;
    missingSubtopics: number;
    totalKeywords: number;
    missingKeywords: number;
  };
}
```

#### Example Request

```javascript
const response = await fetch('/api/seo/analyze-entities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleContent: '<h1>React Hooks Guide</h1><p>...</p>',
    keyword: 'React hooks tutorial',
    competitorArticles: [
      '<article>Competitor 1 content...</article>',
      '<article>Competitor 2 content...</article>',
    ]
  })
});

const data = await response.json();
console.log(`Completeness: ${data.summary.completeness}%`);
console.log(`Recommendations:`, data.recommendations);
```

#### Error Codes

- `400` - Invalid request (missing fields, invalid format)
- `401` - API authentication failed
- `429` - Rate limit exceeded
- `500` - Server error during analysis

---

## Usage Examples

### Example 1: Basic Entity Extraction

```typescript
import { extractEntities } from '@/lib/entity-extractor';

const articleText = `
  React is a JavaScript library created by Facebook.
  Popular hooks include useState and useEffect.
`;

const entities = await extractEntities(articleText, 'React hooks');

entities.forEach(entity => {
  console.log(`${entity.name} (${entity.type})`);
  console.log(`  Coverage: ${entity.coverage}`);
  console.log(`  Importance: ${entity.importance}/100`);
});

// Output:
// React (Product)
//   Coverage: detailed
//   Importance: 95/100
// Facebook (Organization)
//   Coverage: mentioned
//   Importance: 40/100
// useState (Concept)
//   Coverage: mentioned
//   Importance: 85/100
```

### Example 2: Topic Coverage Analysis

```typescript
import { analyzeTopicCoverage } from '@/lib/topic-coverage';

const coverage = await analyzeTopicCoverage(
  yourArticle,
  'React state management',
  [competitor1, competitor2, competitor3]
);

console.log(`Completeness: ${coverage.completeness}%`);
console.log(`Competitor Average: ${coverage.competitorAverage}%`);
console.log(`Entities: ${coverage.entities.length}`);
console.log(`Subtopics: ${coverage.requiredSubtopics.length}`);
```

### Example 3: Identifying Content Gaps

```typescript
import {
  identifyMissingSubtopics,
  identifyMissingKeywords,
  calculateCoverageGaps,
} from '@/lib/topic-coverage';

const coverage = await analyzeTopicCoverage(article, keyword, competitors);

// Missing subtopics
const missingTopics = identifyMissingSubtopics(coverage);
console.log('Add these topics:', missingTopics);
// ["Error Handling", "Performance Optimization", "Testing Strategies"]

// Missing keywords
const missingKeywords = identifyMissingKeywords(coverage);
console.log('Use these keywords:', missingKeywords);
// ["dependency array", "cleanup function", "custom hook patterns"]

// Gap analysis
const gaps = calculateCoverageGaps(coverage);
console.log(`Missing ${gaps.missingSubtopics} subtopics`);
console.log(`Score gap: ${gaps.scoreGap}%`);
```

### Example 4: Getting Recommendations

```typescript
import { generateCoverageRecommendations } from '@/lib/topic-coverage';

const coverage = await analyzeTopicCoverage(article, keyword, competitors);
const recommendations = generateCoverageRecommendations(coverage);

recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});

// Output:
// 1. Improve overall topic completeness by 15% to reach target of 85%
// 2. Add sections on: useContext, useReducer, custom hooks
// 3. Mention important entities: React DevTools, ESLint plugin
// 4. Increase usage of semantic keywords: dependency array, cleanup
```

### Example 5: Entity Placement Suggestions

```typescript
import { suggestEntityPlacement } from '@/lib/entity-extractor';

const missingEntity = {
  name: 'Redux',
  type: 'Product',
  mentions: 0,
  coverage: 'missing',
  importance: 75,
  competitorMentions: 12,
};

const placement = await suggestEntityPlacement(
  missingEntity,
  articleHtml,
  'React state management'
);

console.log(`Suggested Section: ${placement.section}`);
console.log(`Context: ${placement.context}`);

// Output:
// Suggested Section: "Alternative Solutions"
// Context: Mention Redux as a popular alternative to Context API
//          for complex state management scenarios
```

---

## Type Definitions

### Entity

```typescript
interface Entity {
  name: string;
  type: 'Person' | 'Organization' | 'Concept' | 'Product' | 'Location' | 'Event';
  mentions: number;
  coverage: 'missing' | 'mentioned' | 'explained' | 'detailed';
  importance: number; // 1-100
  competitorMentions: number;
  suggestedPlacement?: {
    section: string;
    context: string;
  };
}
```

### TopicCoverage

```typescript
interface TopicCoverage {
  mainTopic: string;
  requiredSubtopics: Array<{
    topic: string;
    covered: boolean;
    depth: 'shallow' | 'medium' | 'deep';
    competitorCoverage: number; // percentage
  }>;
  semanticKeywords: Array<{
    keyword: string;
    relevance: number; // 1-100
    present: boolean;
    frequency: number;
    suggestedFrequency: number;
  }>;
  entities: Entity[];
  completeness: number; // 0-100
  competitorAverage: number; // 0-100
}
```

---

## Configuration

### Constants (lib/constants.ts)

```typescript
// Minimum mentions to consider entity significant
export const MIN_ENTITY_MENTIONS = 2;

// Target completeness score (0-100)
export const TARGET_TOPIC_COMPLETENESS = 85;

// Maximum competitor articles to analyze
export const MAX_COMPETITORS_TO_ANALYZE = 5;
```

### Customization

You can adjust these constants based on your needs:

- **MIN_ENTITY_MENTIONS** - Lower for niche topics, raise for broad topics
- **TARGET_TOPIC_COMPLETENESS** - 85% is recommended, 90%+ for high-competition
- **MAX_COMPETITORS_TO_ANALYZE** - More competitors = better insights, but slower

---

## Best Practices

### 1. Competitor Selection

✅ **DO:**
- Analyze top 3-5 ranking articles
- Choose articles ranking for your target keyword
- Include different content formats (guides, tutorials, comparisons)

❌ **DON'T:**
- Analyze low-quality or thin content
- Include articles from different topics
- Exceed 5 competitors (diminishing returns)

### 2. Interpreting Completeness Scores

- **90-100%** - Excellent coverage, likely comprehensive
- **75-89%** - Good coverage, minor gaps
- **60-74%** - Adequate, but room for improvement
- **Below 60%** - Significant gaps, needs expansion

### 3. Acting on Recommendations

**Priority Order:**
1. Add missing high-importance entities (importance 70+)
2. Cover missing subtopics (80%+ competitor coverage)
3. Expand shallow coverage to medium/deep
4. Add missing semantic keywords (relevance 70+)
5. Increase under-utilized keyword frequency

### 4. Entity Coverage Levels

- **Missing** (0 mentions) - Add mention with context
- **Mentioned** (1-2 mentions) - Expand with brief explanation
- **Explained** (3-5 mentions) - Good coverage, maintain
- **Detailed** (6+ mentions) - Excellent, possibly over-optimized

### 5. Semantic Keyword Usage

**Natural Incorporation:**
- Don't force keywords unnaturally
- Use variations and synonyms
- Consider user intent and context
- Aim for suggested frequency ±20%

### 6. Re-analysis

Run analysis:
- **After major content updates** - Verify improvements
- **Monthly for live articles** - Track competitor changes
- **Before publishing** - Final quality check

---

## Integration Guide

### Frontend Integration

```typescript
// components/EntityAnalysis.tsx
import { useState } from 'react';

export function EntityAnalysis({ article, keyword }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/seo/analyze-entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleContent: article,
          keyword: keyword,
          competitorArticles: [], // Add competitor scraping
        }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={analyzeContent} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Topic Coverage'}
      </button>

      {analysis && (
        <div>
          <h2>Completeness: {analysis.summary.completeness}%</h2>
          <p>Competitor Average: {analysis.summary.competitorAverage}%</p>

          <h3>Recommendations:</h3>
          <ul>
            {analysis.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Backend Workflow Integration

```typescript
// In your article generation pipeline
import { analyzeTopicCoverage } from '@/lib/topic-coverage';

async function generateOptimizedArticle(keyword: string) {
  // 1. Generate initial draft
  const draftArticle = await generateDraft(keyword);

  // 2. Analyze topic coverage
  const competitors = await scrapeTopCompetitors(keyword);
  const coverage = await analyzeTopicCoverage(draftArticle, keyword, competitors);

  // 3. If completeness < 85%, enhance draft
  if (coverage.completeness < 85) {
    const missingTopics = identifyMissingSubtopics(coverage);
    const enhancedDraft = await addMissingContent(draftArticle, missingTopics);
    return enhancedDraft;
  }

  return draftArticle;
}
```

---

## Performance Considerations

### API Response Times

- **No competitors**: 3-5 seconds
- **1-3 competitors**: 8-15 seconds
- **4-5 competitors**: 15-25 seconds

### Optimization Tips

1. **Cache results** - Don't re-analyze unchanged content
2. **Limit competitor count** - 3-5 is optimal
3. **Batch requests** - Avoid concurrent analysis
4. **Use queues** - For bulk analysis operations

### Rate Limiting

Google AI API limits:
- **Free tier**: 60 requests/minute
- **Monitor quota**: Check usage regularly
- **Implement retries**: Handle rate limit errors gracefully

---

## Troubleshooting

### Common Issues

**Issue: Low completeness score despite good content**
- **Cause**: Article focused on unique angle competitors don't cover
- **Solution**: Acceptable if intentional differentiation

**Issue: Too many missing entities**
- **Cause**: Niche topic with limited competitor data
- **Solution**: Lower MIN_ENTITY_MENTIONS constant

**Issue: Semantic keywords not detected**
- **Cause**: Using very different terminology than competitors
- **Solution**: Consider incorporating standard terminology

**Issue: Slow API responses**
- **Cause**: Too many competitors or long articles
- **Solution**: Reduce competitor count, trim article length

**Issue: Inaccurate entity classification**
- **Cause**: AI ambiguity (e.g., "Apple" could be fruit or company)
- **Solution**: Provide more context in article or manually adjust

---

## Future Enhancements

Planned features:
- [ ] Real-time SERP scraping integration
- [ ] Visual coverage heat maps
- [ ] Automated content expansion
- [ ] Multi-language support
- [ ] Historical tracking and trends
- [ ] Entity relationship graphs
- [ ] Competitive change alerts

---

## Support

For issues or questions:
1. Check this documentation
2. Review example usage in `entity-extractor.test.example.ts`
3. Examine API route for implementation details
4. Contact development team

---

## License

Part of the SEO Article Engine - StepTen.io

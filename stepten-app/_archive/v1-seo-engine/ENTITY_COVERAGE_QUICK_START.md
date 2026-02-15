# Entity & Topic Coverage - Quick Start Guide

Fast-track guide to using the NLP Entity & Topic Coverage system.

## 🚀 Quick Setup (2 minutes)

### 1. Ensure API Key is Set

```bash
# .env file
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

### 2. Import Functions

```typescript
// For entity extraction
import { extractEntities } from '@/lib/entity-extractor';

// For topic coverage
import { analyzeTopicCoverage } from '@/lib/topic-coverage';
```

### 3. Use the API

```typescript
const response = await fetch('/api/seo/analyze-entities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleContent: yourArticleHtml,
    keyword: 'your main keyword',
    competitorArticles: [competitor1, competitor2] // optional
  })
});

const { topicCoverage, recommendations, summary } = await response.json();
```

---

## 📊 Understanding the Results

### Completeness Score

```
90-100% = Excellent (comprehensive coverage)
75-89%  = Good (minor gaps)
60-74%  = Adequate (needs improvement)
< 60%   = Poor (significant gaps)
```

### Score Gap

```
+10% or more = You're ahead of competitors ✅
0 to +10%    = Competitive 👍
-10 to 0%    = Below average ⚠️
-10% or less = Major gaps 🚨
```

---

## 🎯 Common Use Cases

### Use Case 1: Analyze Your Draft

```typescript
const coverage = await analyzeTopicCoverage(
  draftArticle,
  'React hooks',
  [] // No competitors
);

console.log(`Completeness: ${coverage.completeness}%`);
```

### Use Case 2: Compare Against Competitors

```typescript
const coverage = await analyzeTopicCoverage(
  yourArticle,
  'React hooks',
  [competitor1, competitor2, competitor3]
);

const gap = coverage.completeness - coverage.competitorAverage;
console.log(`You're ${gap > 0 ? 'ahead' : 'behind'} by ${Math.abs(gap)}%`);
```

### Use Case 3: Get Actionable Recommendations

```typescript
import { generateCoverageRecommendations } from '@/lib/topic-coverage';

const recommendations = generateCoverageRecommendations(coverage);
recommendations.forEach(rec => console.log(`- ${rec}`));
```

### Use Case 4: Find Missing Content

```typescript
import {
  identifyMissingSubtopics,
  identifyMissingKeywords
} from '@/lib/topic-coverage';

const missingTopics = identifyMissingSubtopics(coverage);
const missingKeywords = identifyMissingKeywords(coverage);

console.log('Add these topics:', missingTopics);
console.log('Use these keywords:', missingKeywords);
```

---

## 🔍 Key Metrics Explained

### Entity Coverage Levels

| Level | Mentions | Meaning |
|-------|----------|---------|
| **Missing** | 0 | Not mentioned at all |
| **Mentioned** | 1-2 | Briefly referenced |
| **Explained** | 3-5 | Some detail provided |
| **Detailed** | 6+ | Thoroughly covered |

### Importance Scores

| Score | Priority | Action |
|-------|----------|--------|
| **90-100** | Critical | Must include |
| **70-89** | High | Should include |
| **50-69** | Medium | Consider including |
| **30-49** | Low | Optional |
| **1-29** | Minimal | Skip unless relevant |

### Subtopic Depth

| Depth | Coverage |
|-------|----------|
| **Shallow** | 1-2 sentences, no detail |
| **Medium** | 1-2 paragraphs with some explanation |
| **Deep** | 3+ paragraphs with examples/details |

---

## ✅ Actionable Workflow

### Step 1: Analyze
```typescript
const analysis = await fetch('/api/seo/analyze-entities', {
  method: 'POST',
  body: JSON.stringify({ articleContent, keyword, competitorArticles })
});
```

### Step 2: Review Summary
```typescript
const { summary } = await analysis.json();
console.log(`
  Completeness: ${summary.completeness}%
  Competitor Avg: ${summary.competitorAverage}%
  Missing: ${summary.missingSubtopics} subtopics, ${summary.missingEntities} entities
`);
```

### Step 3: Get Recommendations
```typescript
const { recommendations } = await analysis.json();
recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec}`);
});
```

### Step 4: Identify Gaps
```typescript
const { topicCoverage } = await analysis.json();

// Missing subtopics
const missing = topicCoverage.requiredSubtopics
  .filter(s => !s.covered)
  .map(s => s.topic);

// Under-utilized keywords
const underUsed = topicCoverage.semanticKeywords
  .filter(k => k.present && k.frequency < k.suggestedFrequency)
  .map(k => k.keyword);
```

### Step 5: Improve Content
1. Add missing subtopics
2. Expand shallow sections
3. Mention missing entities
4. Use semantic keywords more
5. Re-analyze to verify

### Step 6: Verify Improvements
```typescript
const newAnalysis = await analyzeTopicCoverage(
  improvedArticle,
  keyword,
  competitorArticles
);

console.log(`
  Old score: ${oldScore}%
  New score: ${newAnalysis.completeness}%
  Improvement: +${newAnalysis.completeness - oldScore}%
`);
```

---

## 💡 Pro Tips

### Tip 1: Target 85%+ Completeness
This is the sweet spot for comprehensive coverage without over-optimization.

### Tip 2: Focus on High-Impact Gaps
Prioritize:
1. Missing entities with importance 70+
2. Subtopics covered by 80%+ competitors
3. Semantic keywords with relevance 70+

### Tip 3: Don't Over-Optimize
- Coverage level "explained" is often sufficient
- Don't force keywords unnaturally
- Quality > hitting every metric

### Tip 4: Use Competitor Data Wisely
- Analyze top 3-5 ranking articles
- Choose articles for your exact keyword
- Mix different content types (guides, tutorials, etc.)

### Tip 5: Re-analyze After Changes
Always verify improvements with a new analysis.

---

## 🐛 Troubleshooting

### Problem: Low Completeness Score

**Possible Causes:**
- Article too short
- Missing essential subtopics
- Different content angle than competitors

**Solutions:**
1. Check `missingSubtopics` array
2. Review `recommendations`
3. Expand shallow sections
4. Add missing entities

### Problem: High Score But Poor Rankings

**Explanation:**
Topic coverage is ONE factor. Also consider:
- Domain authority
- Backlinks
- User engagement
- Technical SEO
- Content quality

### Problem: Many Missing Entities

**Solutions:**
1. Lower `MIN_ENTITY_MENTIONS` in constants
2. Focus on high-importance entities only
3. Check if competitor data is relevant
4. Consider if your angle differs intentionally

### Problem: Slow API Response

**Solutions:**
1. Reduce competitor count (3-5 is optimal)
2. Trim article length before analysis
3. Implement caching for repeated requests
4. Use pagination for bulk operations

---

## 📈 Measuring Success

### Before Publishing
- ✅ Completeness score 85%+
- ✅ All high-importance entities covered
- ✅ No critical missing subtopics
- ✅ Semantic keywords incorporated naturally

### After Publishing
- Track rankings for target keyword
- Monitor organic traffic growth
- Compare CTR vs. competitors
- Re-analyze monthly to maintain edge

---

## 🔗 Related Resources

- **Full Documentation**: `NLP_ENTITY_TOPIC_COVERAGE_DOCUMENTATION.md`
- **Example Code**: `lib/entity-extractor.test.example.ts`
- **Type Definitions**: `lib/seo-types.ts`
- **API Route**: `app/api/seo/analyze-entities/route.ts`

---

## 🎓 Learning Path

1. **Start Simple**: Analyze without competitors
2. **Add Competition**: Compare against 2-3 competitors
3. **Act on Gaps**: Implement top recommendations
4. **Verify**: Re-analyze to confirm improvements
5. **Optimize**: Fine-tune based on results
6. **Monitor**: Track rankings and adjust

---

## ✨ Best Results Come From

1. **Quality competitor selection** - Top-ranking, relevant articles
2. **Actionable improvements** - Don't just analyze, act on findings
3. **Natural integration** - Incorporate recommendations organically
4. **Iterative refinement** - Analyze → Improve → Re-analyze
5. **Holistic approach** - Combine with other SEO best practices

---

**Ready to optimize your content? Start with the API!**

```bash
POST /api/seo/analyze-entities
```

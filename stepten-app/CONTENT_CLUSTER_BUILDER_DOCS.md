# Content Cluster Builder System - Complete Documentation

## Overview

The Content Cluster Builder is a comprehensive SEO content strategy system that automatically generates content clusters with pillar articles, cluster articles, and supporting articles, all interconnected with strategic internal linking.

## System Architecture

### Core Components

1. **Keyword Clustering Utility** (`lib/keyword-clustering.ts`)
2. **Cluster Generator** (`lib/cluster-generator.ts`)
3. **Generate Cluster API** (`app/api/seo/generate-cluster/route.ts`)
4. **Generate Cluster Article API** (`app/api/seo/generate-cluster-article/route.ts`)
5. **Constants** (`lib/constants.ts`)

---

## 1. Keyword Clustering Utility

**Location:** `/lib/keyword-clustering.ts`

### Functions

#### `findRelatedKeywords(mainKeyword, maxKeywords)`

Finds related keywords for a main topic using semantic expansion.

```typescript
const keywords = await findRelatedKeywords("Next.js SEO", 20);
// Returns: [
//   { keyword: "Next.js meta tags", searchVolume: 1200, difficulty: 45, intent: "informational" },
//   { keyword: "how to optimize Next.js", searchVolume: 1800, difficulty: 38, intent: "informational" },
//   ...
// ]
```

**Parameters:**
- `mainKeyword` (string): The primary keyword to expand
- `maxKeywords` (number): Maximum keywords to return (default: 30)

**Returns:** `ContentClusterKeyword[]`

---

#### `groupKeywordsBySimilarity(keywords, maxGroups)`

Groups keywords into semantic clusters based on shared terms and intent.

```typescript
const groups = groupKeywordsBySimilarity(keywords, 5);
// Returns: [
//   {
//     groupName: "Getting Started",
//     primaryKeyword: "what is Next.js SEO",
//     keywords: [...],
//     avgSearchVolume: 1500,
//     avgDifficulty: 35
//   },
//   ...
// ]
```

**Parameters:**
- `keywords` (ContentClusterKeyword[]): Keywords to group
- `maxGroups` (number): Max groups to create (default: 7)

**Returns:** `SemanticGroup[]`

---

#### `assignContentHierarchy(keywords, pillarKeyword)`

Assigns pillar/cluster/supporting hierarchy based on search volume and difficulty.

```typescript
const hierarchy = assignContentHierarchy(keywords, "Next.js SEO");
// Returns: {
//   pillar: { keyword: "Next.js SEO", searchVolume: 8500, ... },
//   clusters: [{ keyword: "Next.js meta tags", ... }, ...],
//   supporting: [{ keyword: "Next.js robots.txt", ... }, ...]
// }
```

**Parameters:**
- `keywords` (ContentClusterKeyword[]): Keywords to categorize
- `pillarKeyword` (string): Main pillar keyword

**Returns:** Object with `pillar`, `clusters`, and `supporting` arrays

---

#### `calculateKeywordMetrics(keywords)`

Calculates aggregated metrics for a keyword set.

```typescript
const metrics = calculateKeywordMetrics(keywords);
// Returns: {
//   totalVolume: 45000,
//   avgVolume: 1500,
//   avgDifficulty: 42,
//   minDifficulty: 18,
//   maxDifficulty: 78,
//   informationalCount: 18,
//   commercialCount: 5,
//   ...
// }
```

---

#### `scoreKeywordDifficulty(keyword, competitorData?)`

Scores keyword difficulty on 0-100 scale with rating.

```typescript
const score = scoreKeywordDifficulty("best Next.js hosting");
// Returns: {
//   score: 67,
//   factors: {
//     lengthScore: 15,
//     competitionScore: 25,
//     commercialIntentScore: 25,
//     brandScore: 0
//   },
//   rating: "Hard"
// }
```

---

## 2. Cluster Generator

**Location:** `/lib/cluster-generator.ts`

### Main Function

#### `generateContentCluster(mainKeyword, config?)`

Generates a complete content cluster with all articles and linking structure.

```typescript
const cluster = await generateContentCluster("Next.js SEO", {
  minClusterSize: 5,
  maxClusterSize: 7,
  minSupportingArticles: 10,
  maxSupportingArticles: 15,
  pillarWordCount: 3500
});

// Returns ContentCluster with:
// - 1 pillar article (3500 words)
// - 6 cluster articles (2000 words each)
// - 12 supporting articles (1200 words each)
// - Complete internal linking structure
// - Estimated time to rank: "4-6 months"
```

**Configuration Options:**

```typescript
interface ClusterGenerationConfig {
  minClusterSize?: number;        // Default: 5
  maxClusterSize?: number;        // Default: 7
  minSupportingArticles?: number; // Default: 10
  maxSupportingArticles?: number; // Default: 15
  pillarWordCount?: number;       // Default: 3500
  clusterWordCount?: number;      // Default: 2000
  supportingWordCount?: number;   // Default: 1200
}
```

**Returns:** `ContentCluster`

---

### Utility Functions

#### `calculateTimeToRank(avgDifficulty, totalArticles)`

Estimates time to rank based on difficulty and cluster size.

```typescript
const timeEstimate = calculateTimeToRank(45, 18);
// Returns: "4-6 months"
```

---

#### `getClusterCompletionPercentage(cluster)`

Calculates completion percentage of a cluster.

```typescript
const completion = getClusterCompletionPercentage(cluster);
// Returns: 35 (35% complete)
```

---

#### `getArticlesByStatus(cluster, status)`

Filters articles by status.

```typescript
const published = getArticlesByStatus(cluster, "published");
const inProgress = getArticlesByStatus(cluster, "writing");
```

---

#### `getPublishingOrder(cluster)`

Returns recommended publishing order (pillar first, then by priority/difficulty).

```typescript
const publishOrder = getPublishingOrder(cluster);
publishOrder.forEach((article, index) => {
  console.log(`${index + 1}. ${article.keyword.keyword} (${article.type})`);
});
// Output:
// 1. Next.js SEO (pillar)
// 2. Next.js meta tags (cluster)
// 3. Next.js sitemap (cluster)
// ...
```

---

#### `generateClusterSummary(cluster)`

Generates human-readable strategy summary.

```typescript
const summary = generateClusterSummary(cluster);
console.log(summary.description);
console.log(summary.keyMetrics);
console.log(summary.strategy);
```

---

## 3. Generate Cluster API Endpoint

**Location:** `/app/api/seo/generate-cluster/route.ts`

### POST /api/seo/generate-cluster

Generates a complete content cluster strategy from a main keyword.

#### Request Body

```json
{
  "mainKeyword": "Next.js SEO",
  "config": {
    "minClusterSize": 5,
    "maxClusterSize": 7,
    "minSupportingArticles": 10,
    "maxSupportingArticles": 15,
    "pillarWordCount": 3500,
    "clusterWordCount": 2000,
    "supportingWordCount": 1200
  }
}
```

**Note:** All config fields are optional. Defaults from `constants.ts` will be used.

#### Response (Success)

```json
{
  "cluster": {
    "id": "cluster-nextjs-seo-1737408000000",
    "name": "Next.js SEO Content Cluster",
    "mainKeyword": "Next.js SEO",
    "pillarArticle": {
      "id": "pillar-nextjs-seo-1737408000000-a1b2",
      "keyword": {
        "keyword": "Next.js SEO",
        "searchVolume": 8500,
        "difficulty": 65,
        "intent": "informational"
      },
      "type": "pillar",
      "wordCount": 3500,
      "status": "planned",
      "linksTo": ["cluster-1-id", "cluster-2-id", ...],
      "depth": 0,
      "priority": 100
    },
    "clusterArticles": [...],
    "supportingArticles": [...],
    "totalArticles": 18,
    "completedArticles": 0,
    "estimatedTimeToRank": "4-6 months",
    "createdAt": "2026-01-20T19:00:00.000Z",
    "updatedAt": "2026-01-20T19:00:00.000Z"
  },
  "summary": {
    "description": "Complete content cluster for \"Next.js SEO\" with 18 articles...",
    "keyMetrics": {
      "totalArticles": 18,
      "totalWords": 35400,
      "avgDifficulty": 42,
      "estimatedTraffic": 45000
    },
    "timeline": "4-6 months",
    "strategy": [
      "Start with the pillar article: \"Next.js SEO\" (3500 words)",
      "Publish 6 cluster articles covering major subtopics",
      "Build out 12 supporting articles for long-tail keywords",
      "Implement internal linking structure to create topic authority",
      "Monitor rankings and optimize based on performance"
    ]
  },
  "success": true
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "mainKeyword is required and must be a string",
  "success": false
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to generate content cluster",
  "success": false
}
```

### GET /api/seo/generate-cluster?example=true

Returns example request structure and documentation.

---

## 4. Generate Cluster Article API Endpoint

**Location:** `/app/api/seo/generate-cluster-article/route.ts`

### POST /api/seo/generate-cluster-article

Generates an article following cluster strategy with automatic internal linking.

#### Request Body

```json
{
  "clusterArticle": {
    "id": "cluster-nextjs-meta-tags-1737408000000-a1b2",
    "keyword": {
      "keyword": "Next.js meta tags",
      "searchVolume": 1200,
      "difficulty": 45,
      "intent": "informational"
    },
    "type": "cluster",
    "wordCount": 2000,
    "status": "planned",
    "linksTo": ["pillar-id", "supporting-1-id"],
    "depth": 1,
    "priority": 90
  },
  "pillarArticle": {
    "keyword": {
      "keyword": "Next.js SEO"
    },
    "id": "pillar-nextjs-seo-1737408000000-a1b2"
  },
  "relatedArticles": [
    {
      "keyword": { "keyword": "Next.js Open Graph tags" },
      "id": "supporting-og-tags-1737408000000-a1b2",
      "type": "supporting"
    }
  ],
  "customInstructions": "Include code examples for each meta tag type"
}
```

#### Response (Success)

```json
{
  "article": "<h1>Next.js Meta Tags: Complete Guide</h1>\n\n<p>Hook paragraph...</p>...",
  "wordCount": 2050,
  "internalLinks": [
    {
      "targetArticleId": "pillar-nextjs-seo-1737408000000-a1b2",
      "anchorText": "complete Next.js SEO guide",
      "targetKeyword": "Next.js SEO"
    },
    {
      "targetArticleId": "supporting-og-tags-1737408000000-a1b2",
      "anchorText": "Next.js Open Graph tags",
      "targetKeyword": "Next.js Open Graph tags"
    }
  ],
  "metadata": {
    "type": "cluster",
    "keyword": "Next.js meta tags",
    "targetWordCount": 2000,
    "actualWordCount": 2050,
    "intent": "informational",
    "difficulty": 45,
    "searchVolume": 1200
  },
  "success": true
}
```

#### Internal Link Format

Generated articles use special data attributes for cluster links:

```html
<a href="#" data-cluster-link="Next.js SEO" rel="internal">complete Next.js SEO guide</a>
```

The `data-cluster-link` attribute contains the target article's keyword, allowing the frontend to resolve the actual URL.

---

## 5. Constants Configuration

**Location:** `/lib/constants.ts`

### Content Cluster Constants

```typescript
// Cluster size range
export const CLUSTER_SIZE_MIN = 5;
export const CLUSTER_SIZE_MAX = 7;

// Supporting articles range
export const SUPPORTING_ARTICLES_MIN = 10;
export const SUPPORTING_ARTICLES_MAX = 15;

// Default word counts by article type
export const PILLAR_WORD_COUNT = 3500;
export const CLUSTER_WORD_COUNT = 2000;
export const SUPPORTING_WORD_COUNT = 1200;
```

---

## Content Cluster Structure

### Article Hierarchy

```
Pillar Article (3500 words)
├── Cluster Article 1 (2000 words)
│   ├── Supporting Article 1 (1200 words)
│   └── Supporting Article 2 (1200 words)
├── Cluster Article 2 (2000 words)
│   ├── Supporting Article 3 (1200 words)
│   └── Supporting Article 4 (1200 words)
└── ...
```

### Internal Linking Strategy

1. **Pillar Article:**
   - Links to ALL cluster articles
   - Serves as hub for entire topic

2. **Cluster Articles:**
   - Link back to pillar article
   - Link to 3-5 related supporting articles
   - May cross-link to other relevant cluster articles

3. **Supporting Articles:**
   - Link back to pillar article
   - Link to related cluster article
   - May cross-link to 1-2 related supporting articles

### Article Status Flow

```
planned → writing → complete → published
```

---

## Usage Examples

### Example 1: Generate a Complete Cluster

```typescript
// Client-side fetch
const response = await fetch('/api/seo/generate-cluster', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mainKeyword: 'Next.js SEO optimization',
    config: {
      maxClusterSize: 6,
      maxSupportingArticles: 12
    }
  })
});

const { cluster, summary } = await response.json();

console.log(`Generated ${cluster.totalArticles} articles`);
console.log(`Expected to rank in: ${cluster.estimatedTimeToRank}`);
console.log(summary.strategy);
```

### Example 2: Generate Articles in Publishing Order

```typescript
import { getPublishingOrder } from '@/lib/cluster-generator';

// Get cluster from API
const { cluster } = await fetch('/api/seo/generate-cluster', {...}).then(r => r.json());

// Get recommended publishing order
const publishOrder = getPublishingOrder(cluster);

// Generate articles in order
for (const article of publishOrder) {
  const response = await fetch('/api/seo/generate-cluster-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clusterArticle: article,
      pillarArticle: cluster.pillarArticle,
      relatedArticles: cluster.clusterArticles.filter(c =>
        article.linksTo.includes(c.id)
      )
    })
  });

  const { article: htmlContent, wordCount } = await response.json();

  console.log(`Generated: ${article.keyword.keyword} (${wordCount} words)`);

  // Save article to database/CMS
  await saveArticle(article.id, htmlContent);

  // Update article status
  article.status = 'complete';
  cluster.completedArticles++;
}
```

### Example 3: Track Cluster Progress

```typescript
import { getClusterCompletionPercentage, getArticlesByStatus } from '@/lib/cluster-generator';

const completion = getClusterCompletionPercentage(cluster);
console.log(`Cluster is ${completion}% complete`);

const published = getArticlesByStatus(cluster, 'published');
const inProgress = getArticlesByStatus(cluster, 'writing');
const planned = getArticlesByStatus(cluster, 'planned');

console.log(`Published: ${published.length}`);
console.log(`In Progress: ${inProgress.length}`);
console.log(`Planned: ${planned.length}`);
```

---

## TypeScript Types Reference

### ContentCluster

```typescript
interface ContentCluster {
  id: string;
  name: string;
  mainKeyword: string;
  pillarArticle: ClusterArticle;
  clusterArticles: ClusterArticle[];
  supportingArticles: ClusterArticle[];
  totalArticles: number;
  completedArticles: number;
  estimatedTimeToRank: string;
  createdAt: string;
  updatedAt: string;
}
```

### ClusterArticle

```typescript
interface ClusterArticle {
  id: string;
  keyword: ContentClusterKeyword;
  type: 'pillar' | 'cluster' | 'supporting';
  wordCount: number;
  status: 'planned' | 'writing' | 'complete' | 'published';
  linksTo: string[];
  depth: number;
  priority: number;
}
```

### ContentClusterKeyword

```typescript
interface ContentClusterKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  parent?: string;
}
```

---

## Best Practices

### 1. Cluster Generation

- Start with well-researched pillar keywords (high volume, medium-high difficulty)
- Aim for 15-20 total articles per cluster (1 pillar + 5-7 clusters + 10-15 supporting)
- Use default word counts unless you have specific requirements

### 2. Article Creation

- Always generate pillar article first
- Generate cluster articles before supporting articles
- Use the `getPublishingOrder()` function for optimal sequencing
- Include custom instructions for technical topics requiring code examples

### 3. Internal Linking

- Let the system auto-generate internal links
- Review and approve links before publishing
- Ensure all articles link back to the pillar
- Maintain 3-5 internal links per cluster article

### 4. Publishing Strategy

- Publish pillar article first to establish authority
- Publish 1-2 cluster articles per week
- Fill in supporting articles as cluster articles go live
- Monitor rankings and adjust strategy based on performance

### 5. Performance Optimization

- Generate clusters asynchronously (can take 10-30 seconds)
- Cache generated clusters for reuse
- Store article generation requests in a queue
- Track cluster metrics over time

---

## Error Handling

### Common Errors

1. **Missing API Key:**
   ```json
   { "error": "Anthropic API key not configured" }
   ```
   Solution: Set `ANTHROPIC_API_KEY` environment variable

2. **Invalid Configuration:**
   ```json
   { "error": "minClusterSize cannot be greater than maxClusterSize" }
   ```
   Solution: Verify configuration values are within valid ranges

3. **Generation Timeout:**
   - Default timeout: 30 seconds
   - Solution: Implement retry logic with exponential backoff

4. **Malformed Article:**
   - Article may not start with `<h1>` tag
   - Solution: HTML conversion fallback is automatic

---

## Performance Metrics

### Cluster Generation Speed

- Small cluster (15 articles): ~2-5 seconds
- Medium cluster (20 articles): ~5-10 seconds
- Large cluster (25 articles): ~10-15 seconds

### Article Generation Speed

- Pillar article (3500 words): ~30-45 seconds
- Cluster article (2000 words): ~20-30 seconds
- Supporting article (1200 words): ~15-20 seconds

### SEO Performance Expectations

Based on cluster size and difficulty:
- Low difficulty (avg 20-30): 2-3 months to rank
- Medium difficulty (avg 40-50): 4-6 months to rank
- High difficulty (avg 60-70): 8-12 months to rank

---

## Future Enhancements

1. **Real Keyword Research Integration:**
   - Connect to SEMrush/Ahrefs API for actual search volumes
   - Pull competitor data for difficulty scoring

2. **AI-Powered Keyword Suggestions:**
   - Use LLM to suggest related keywords beyond templates
   - Semantic clustering with embeddings

3. **Automatic SERP Analysis:**
   - Analyze top-ranking content for each keyword
   - Recommend content gaps to fill

4. **Progress Tracking:**
   - Store cluster progress in database
   - Dashboard for cluster completion status

5. **Link Opportunity Detection:**
   - Scan existing content for linking opportunities
   - Suggest new supporting articles based on gaps

---

## Support & Maintenance

### Logging

All API endpoints log:
- Request parameters
- Generation time
- Error details (in development mode)

### Monitoring

Monitor these metrics:
- Cluster generation success rate
- Article generation success rate
- Average generation time
- API timeout rate

### Testing

Test coverage:
- Unit tests for keyword clustering functions
- Integration tests for cluster generation
- E2E tests for API endpoints

---

## Conclusion

The Content Cluster Builder is a production-ready system for generating comprehensive SEO content strategies. It automates keyword research, content hierarchy planning, and internal linking structure, making it easy to build topical authority at scale.

For questions or issues, refer to the TypeScript source code which includes comprehensive JSDoc comments for all functions.

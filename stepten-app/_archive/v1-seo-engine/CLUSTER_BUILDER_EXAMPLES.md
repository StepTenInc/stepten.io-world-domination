# Content Cluster Builder - Usage Examples

## Quick Start Guide

### Example 1: Generate a Basic Cluster

```typescript
// Make API request to generate cluster
const response = await fetch('/api/seo/generate-cluster', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mainKeyword: 'Next.js SEO optimization'
  })
});

const { cluster, summary, success } = await response.json();

if (success) {
  console.log('Cluster Generated!');
  console.log('Total Articles:', cluster.totalArticles);
  console.log('Pillar:', cluster.pillarArticle.keyword.keyword);
  console.log('Clusters:', cluster.clusterArticles.length);
  console.log('Supporting:', cluster.supportingArticles.length);
  console.log('Time to Rank:', cluster.estimatedTimeToRank);
}
```

**Output:**
```
Cluster Generated!
Total Articles: 18
Pillar: Next.js SEO optimization
Clusters: 6
Supporting: 11
Time to Rank: 4-6 months
```

---

### Example 2: Generate Cluster with Custom Configuration

```typescript
const response = await fetch('/api/seo/generate-cluster', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mainKeyword: 'React Performance Optimization',
    config: {
      maxClusterSize: 5,           // Only 5 cluster articles
      maxSupportingArticles: 8,    // Only 8 supporting articles
      pillarWordCount: 4000,       // Longer pillar article
      clusterWordCount: 2500,      // Longer cluster articles
      supportingWordCount: 1500    // Longer supporting articles
    }
  })
});

const { cluster, summary } = await response.json();

console.log('Strategy:', summary.strategy);
console.log('Key Metrics:', summary.keyMetrics);
```

**Output:**
```
Strategy: [
  'Start with the pillar article: "React Performance Optimization" (4000 words)',
  'Publish 5 cluster articles covering major subtopics',
  'Build out 8 supporting articles for long-tail keywords',
  'Implement internal linking structure to create topic authority',
  'Monitor rankings and optimize based on performance'
]

Key Metrics: {
  totalArticles: 14,
  totalWords: 38000,
  avgDifficulty: 48,
  estimatedTraffic: 52000
}
```

---

### Example 3: Generate First Article (Pillar)

```typescript
// First, get the cluster
const clusterResponse = await fetch('/api/seo/generate-cluster', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mainKeyword: 'TypeScript Best Practices' })
});

const { cluster } = await clusterResponse.json();

// Generate the pillar article
const articleResponse = await fetch('/api/seo/generate-cluster-article', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clusterArticle: cluster.pillarArticle,
    pillarArticle: cluster.pillarArticle,
    relatedArticles: cluster.clusterArticles,
    customInstructions: 'Include modern TypeScript 5.0 features and real-world examples from popular projects'
  })
});

const { article, wordCount, internalLinks, metadata } = await articleResponse.json();

console.log('Article Generated!');
console.log('Word Count:', wordCount);
console.log('Internal Links:', internalLinks.length);
console.log('Type:', metadata.type);
```

**Output:**
```
Article Generated!
Word Count: 3542
Internal Links: 6
Type: pillar

article: <h1>TypeScript Best Practices: Complete Guide</h1>

<p>Most developers think TypeScript is just JavaScript with types.</p>

<p>They're wrong.</p>

<p>Here's why: TypeScript isn't about adding types to your code—it's about...</p>
...
```

---

### Example 4: Generate All Articles in Recommended Order

```typescript
import { getPublishingOrder } from '@/lib/cluster-generator';

async function generateAllArticles(mainKeyword: string) {
  // Generate cluster strategy
  const clusterRes = await fetch('/api/seo/generate-cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mainKeyword })
  });

  const { cluster } = await clusterRes.json();

  // Get recommended publishing order
  const publishOrder = getPublishingOrder(cluster);

  console.log('Publishing Order:');
  publishOrder.forEach((article, index) => {
    console.log(`${index + 1}. ${article.keyword.keyword} (${article.type}) - Priority: ${article.priority}`);
  });

  // Generate each article
  for (const article of publishOrder) {
    console.log(`\nGenerating: ${article.keyword.keyword}...`);

    const articleRes = await fetch('/api/seo/generate-cluster-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clusterArticle: article,
        pillarArticle: cluster.pillarArticle,
        relatedArticles: cluster.clusterArticles.concat(cluster.supportingArticles)
      })
    });

    const { article: htmlContent, wordCount } = await articleRes.json();

    console.log(`✓ Generated ${wordCount} words`);

    // Here you would save to database/CMS
    // await saveArticleToCMS(article.id, htmlContent);
  }

  console.log('\n✓ All articles generated!');
}

// Usage
await generateAllArticles('Next.js Performance');
```

**Output:**
```
Publishing Order:
1. Next.js Performance (pillar) - Priority: 100
2. Next.js Image Optimization (cluster) - Priority: 90
3. Next.js Code Splitting (cluster) - Priority: 85
4. Next.js Lazy Loading (cluster) - Priority: 80
...

Generating: Next.js Performance...
✓ Generated 3521 words

Generating: Next.js Image Optimization...
✓ Generated 2043 words

...

✓ All articles generated!
```

---

### Example 5: Track Cluster Progress

```typescript
import {
  getClusterCompletionPercentage,
  getArticlesByStatus
} from '@/lib/cluster-generator';

function trackClusterProgress(cluster: ContentCluster) {
  const completion = getClusterCompletionPercentage(cluster);

  const planned = getArticlesByStatus(cluster, 'planned');
  const writing = getArticlesByStatus(cluster, 'writing');
  const complete = getArticlesByStatus(cluster, 'complete');
  const published = getArticlesByStatus(cluster, 'published');

  console.log(`\n=== Cluster Progress: ${cluster.name} ===`);
  console.log(`Overall: ${completion}% complete`);
  console.log(`\nStatus Breakdown:`);
  console.log(`  Planned:   ${planned.length} articles`);
  console.log(`  Writing:   ${writing.length} articles`);
  console.log(`  Complete:  ${complete.length} articles`);
  console.log(`  Published: ${published.length} articles`);
  console.log(`\nTotal: ${cluster.completedArticles}/${cluster.totalArticles}`);

  if (published.length > 0) {
    console.log(`\nPublished Articles:`);
    published.forEach(article => {
      console.log(`  - ${article.keyword.keyword} (${article.type})`);
    });
  }
}

// Usage
trackClusterProgress(cluster);
```

**Output:**
```
=== Cluster Progress: Next.js SEO Content Cluster ===
Overall: 35% complete

Status Breakdown:
  Planned:   8 articles
  Writing:   3 articles
  Complete:  4 articles
  Published: 3 articles

Total: 6/18

Published Articles:
  - Next.js SEO (pillar)
  - Next.js meta tags (cluster)
  - Next.js sitemap (cluster)
```

---

### Example 6: Get Cluster Metrics and Strategy

```typescript
import { generateClusterSummary, calculateKeywordMetrics } from '@/lib/cluster-generator';

async function analyzeClusterStrategy(mainKeyword: string) {
  const res = await fetch('/api/seo/generate-cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mainKeyword })
  });

  const { cluster, summary } = await res.json();

  console.log('\n=== Cluster Strategy Analysis ===');
  console.log('\nDescription:');
  console.log(summary.description);

  console.log('\nKey Metrics:');
  console.log(`  Total Articles: ${summary.keyMetrics.totalArticles}`);
  console.log(`  Total Words: ${summary.keyMetrics.totalWords.toLocaleString()}`);
  console.log(`  Avg Difficulty: ${summary.keyMetrics.avgDifficulty}/100`);
  console.log(`  Est. Monthly Traffic: ${summary.keyMetrics.estimatedTraffic.toLocaleString()}`);

  console.log(`\nTimeline: ${summary.timeline}`);

  console.log('\nExecution Strategy:');
  summary.strategy.forEach((step, i) => {
    console.log(`  ${i + 1}. ${step}`);
  });

  // Get all keywords for detailed metrics
  const allKeywords = [
    cluster.pillarArticle.keyword,
    ...cluster.clusterArticles.map(a => a.keyword),
    ...cluster.supportingArticles.map(a => a.keyword)
  ];

  const metrics = calculateKeywordMetrics(allKeywords);

  console.log('\nKeyword Intent Distribution:');
  console.log(`  Informational: ${metrics.informationalCount}`);
  console.log(`  Commercial: ${metrics.commercialCount}`);
  console.log(`  Transactional: ${metrics.transactionalCount}`);
  console.log(`  Navigational: ${metrics.navigationalCount}`);

  console.log('\nDifficulty Range:');
  console.log(`  Easiest: ${metrics.minDifficulty}/100`);
  console.log(`  Hardest: ${metrics.maxDifficulty}/100`);
  console.log(`  Average: ${metrics.avgDifficulty}/100`);
}

// Usage
await analyzeClusterStrategy('AI Content Writing');
```

**Output:**
```
=== Cluster Strategy Analysis ===

Description:
Complete content cluster for "AI Content Writing" with 18 articles (1 pillar, 6 clusters, 11 supporting). Expected to rank in 4-6 months.

Key Metrics:
  Total Articles: 18
  Total Words: 35,400
  Avg Difficulty: 42/100
  Est. Monthly Traffic: 48,500

Timeline: 4-6 months

Execution Strategy:
  1. Start with the pillar article: "AI Content Writing" (3500 words)
  2. Publish 6 cluster articles covering major subtopics
  3. Build out 11 supporting articles for long-tail keywords
  4. Implement internal linking structure to create topic authority
  5. Monitor rankings and optimize based on performance

Keyword Intent Distribution:
  Informational: 14
  Commercial: 4
  Transactional: 0
  Navigational: 0

Difficulty Range:
  Easiest: 18/100
  Hardest: 72/100
  Average: 42/100
```

---

### Example 7: Generate Cluster Article with Custom Instructions

```typescript
async function generateClusterArticleWithInstructions(
  clusterArticle: ClusterArticle,
  pillarArticle: ClusterArticle,
  customInstructions: string
) {
  const res = await fetch('/api/seo/generate-cluster-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clusterArticle,
      pillarArticle,
      relatedArticles: [],
      customInstructions
    })
  });

  return await res.json();
}

// Example: Generate technical article with code examples
const result = await generateClusterArticleWithInstructions(
  clusterArticles[0], // "Next.js API Routes"
  pillarArticle,      // "Next.js Development"
  `
  Include:
  - Code examples for GET, POST, PUT, DELETE routes
  - Authentication middleware examples
  - Error handling patterns
  - Type-safe API routes with TypeScript
  - Real-world examples from production apps

  Avoid:
  - Generic "hello world" examples
  - Overly simplified code
  - Outdated Next.js 12 patterns (focus on App Router)
  `
);

console.log('Generated:', result.metadata.keyword);
console.log('Word Count:', result.wordCount);
console.log('Internal Links:', result.internalLinks.length);
```

---

### Example 8: Batch Generate Multiple Clusters

```typescript
async function generateMultipleClusters(keywords: string[]) {
  const clusters = [];

  for (const keyword of keywords) {
    console.log(`\nGenerating cluster for: ${keyword}...`);

    const res = await fetch('/api/seo/generate-cluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mainKeyword: keyword })
    });

    const { cluster, summary } = await res.json();

    clusters.push(cluster);

    console.log(`✓ ${cluster.totalArticles} articles planned`);
    console.log(`  Timeline: ${cluster.estimatedTimeToRank}`);
    console.log(`  Est. Traffic: ${summary.keyMetrics.estimatedTraffic.toLocaleString()}/mo`);

    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n✓ Generated ${clusters.length} clusters!`);
  console.log(`Total articles planned: ${clusters.reduce((sum, c) => sum + c.totalArticles, 0)}`);

  return clusters;
}

// Usage: Generate clusters for entire content strategy
const clusters = await generateMultipleClusters([
  'Next.js Performance',
  'React Server Components',
  'TypeScript Best Practices',
  'Web Vitals Optimization',
  'SEO for JavaScript Apps'
]);
```

**Output:**
```
Generating cluster for: Next.js Performance...
✓ 18 articles planned
  Timeline: 4-6 months
  Est. Traffic: 45,200/mo

Generating cluster for: React Server Components...
✓ 17 articles planned
  Timeline: 5-7 months
  Est. Traffic: 38,500/mo

...

✓ Generated 5 clusters!
Total articles planned: 88
```

---

### Example 9: Working with Internal Links

```typescript
async function analyzeInternalLinks(cluster: ContentCluster) {
  console.log('\n=== Internal Linking Structure ===\n');

  // Analyze pillar article links
  console.log(`Pillar: ${cluster.pillarArticle.keyword.keyword}`);
  console.log(`  Links to: ${cluster.pillarArticle.linksTo.length} articles`);

  // Analyze cluster articles
  console.log(`\nCluster Articles:`);
  cluster.clusterArticles.forEach(article => {
    const linkedArticles = [
      cluster.pillarArticle,
      ...cluster.clusterArticles,
      ...cluster.supportingArticles
    ].filter(a => article.linksTo.includes(a.id));

    console.log(`\n  ${article.keyword.keyword}`);
    console.log(`    Links to ${article.linksTo.length} articles:`);
    linkedArticles.forEach(linked => {
      console.log(`      → ${linked.keyword.keyword} (${linked.type})`);
    });
  });

  // Analyze supporting articles
  console.log(`\nSupporting Articles:`);
  cluster.supportingArticles.slice(0, 3).forEach(article => {
    const linkedArticles = [
      cluster.pillarArticle,
      ...cluster.clusterArticles,
      ...cluster.supportingArticles
    ].filter(a => article.linksTo.includes(a.id));

    console.log(`\n  ${article.keyword.keyword}`);
    console.log(`    Links to ${article.linksTo.length} articles:`);
    linkedArticles.forEach(linked => {
      console.log(`      → ${linked.keyword.keyword} (${linked.type})`);
    });
  });
}

// Usage
analyzeInternalLinks(cluster);
```

**Output:**
```
=== Internal Linking Structure ===

Pillar: Next.js SEO
  Links to: 6 articles

Cluster Articles:

  Next.js meta tags
    Links to 4 articles:
      → Next.js SEO (pillar)
      → Next.js Open Graph tags (supporting)
      → Next.js Twitter cards (supporting)
      → Next.js structured data (supporting)

  Next.js sitemap
    Links to 3 articles:
      → Next.js SEO (pillar)
      → Next.js robots.txt (supporting)
      → Next.js dynamic routes (supporting)

Supporting Articles:

  Next.js Open Graph tags
    Links to 2 articles:
      → Next.js SEO (pillar)
      → Next.js meta tags (cluster)
```

---

## Error Handling Examples

### Example 10: Robust Error Handling

```typescript
async function generateClusterWithErrorHandling(mainKeyword: string) {
  try {
    const res = await fetch('/api/seo/generate-cluster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mainKeyword })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to generate cluster');
    }

    const { cluster, summary, success } = await res.json();

    if (!success) {
      throw new Error('Cluster generation reported failure');
    }

    return { cluster, summary };

  } catch (error) {
    console.error('Cluster generation failed:', error.message);

    if (error.message.includes('API key')) {
      console.error('Please configure ANTHROPIC_API_KEY environment variable');
    } else if (error.message.includes('timeout')) {
      console.error('Request timed out. Try again with a simpler keyword.');
    } else {
      console.error('Unexpected error. Please try again.');
    }

    return null;
  }
}

// Usage
const result = await generateClusterWithErrorHandling('Next.js SEO');
if (result) {
  console.log('Cluster generated successfully!');
} else {
  console.log('Failed to generate cluster.');
}
```

---

## Integration Examples

### Example 11: Save to Database

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function saveClusterToDatabase(cluster: ContentCluster) {
  // Save cluster
  const savedCluster = await prisma.contentCluster.create({
    data: {
      id: cluster.id,
      name: cluster.name,
      mainKeyword: cluster.mainKeyword,
      totalArticles: cluster.totalArticles,
      completedArticles: cluster.completedArticles,
      estimatedTimeToRank: cluster.estimatedTimeToRank,
      createdAt: new Date(cluster.createdAt),
      updatedAt: new Date(cluster.updatedAt)
    }
  });

  // Save all articles
  const allArticles = [
    cluster.pillarArticle,
    ...cluster.clusterArticles,
    ...cluster.supportingArticles
  ];

  for (const article of allArticles) {
    await prisma.clusterArticle.create({
      data: {
        id: article.id,
        clusterId: cluster.id,
        keyword: article.keyword.keyword,
        searchVolume: article.keyword.searchVolume,
        difficulty: article.keyword.difficulty,
        intent: article.keyword.intent,
        type: article.type,
        wordCount: article.wordCount,
        status: article.status,
        linksTo: article.linksTo,
        depth: article.depth,
        priority: article.priority
      }
    });
  }

  console.log(`Saved cluster with ${allArticles.length} articles to database`);
}
```

---

## Testing Examples

### Example 12: Unit Test for Cluster Generation

```typescript
import { describe, it, expect } from '@jest/globals';
import { generateContentCluster } from '@/lib/cluster-generator';

describe('Content Cluster Generator', () => {
  it('should generate cluster with correct structure', async () => {
    const cluster = await generateContentCluster('Test Keyword');

    expect(cluster).toBeDefined();
    expect(cluster.mainKeyword).toBe('Test Keyword');
    expect(cluster.pillarArticle).toBeDefined();
    expect(cluster.clusterArticles.length).toBeGreaterThanOrEqual(5);
    expect(cluster.clusterArticles.length).toBeLessThanOrEqual(7);
    expect(cluster.supportingArticles.length).toBeGreaterThanOrEqual(10);
    expect(cluster.totalArticles).toBe(
      1 + cluster.clusterArticles.length + cluster.supportingArticles.length
    );
  });

  it('should create proper internal linking structure', async () => {
    const cluster = await generateContentCluster('Test Keyword');

    // Pillar should link to all clusters
    expect(cluster.pillarArticle.linksTo.length).toBe(cluster.clusterArticles.length);

    // Each cluster should link back to pillar
    cluster.clusterArticles.forEach(article => {
      expect(article.linksTo).toContain(cluster.pillarArticle.id);
    });

    // Each supporting should link back to pillar
    cluster.supportingArticles.forEach(article => {
      expect(article.linksTo).toContain(cluster.pillarArticle.id);
    });
  });
});
```

---

These examples demonstrate the full capabilities of the Content Cluster Builder system. Use them as a starting point for building your own SEO content automation workflows!

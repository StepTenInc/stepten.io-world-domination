# Automatic Internal Linking Engine

## Overview

The Automatic Internal Linking Engine uses AI-powered semantic analysis and embeddings to intelligently suggest internal links between articles. It leverages OpenAI's text embeddings for semantic similarity and Claude AI for contextual placement suggestions.

## Architecture

### Components

1. **Embeddings Utility** (`lib/embeddings.ts`)
   - Generates text embeddings using OpenAI's `text-embedding-3-small` model
   - Calculates cosine similarity between embeddings
   - Caches embeddings in Supabase for performance
   - Finds semantically similar articles

2. **Internal Linking Engine** (`lib/internal-linking.ts`)
   - Analyzes article content for topics and entities
   - Uses Claude AI to suggest optimal anchor text and placement
   - Scores link relevance (0-100 scale)
   - Extracts existing internal links
   - Generates comprehensive linking analysis

3. **API Route** (`app/api/seo/suggest-internal-links/route.ts`)
   - POST endpoint accepting article content + metadata
   - Fetches all published articles from Supabase
   - Enriches articles with cached embeddings
   - Returns InternalLinkingAnalysis with suggestions

4. **Constants** (`lib/constants.ts`)
   - `MAX_INTERNAL_LINK_SUGGESTIONS = 5`
   - `MIN_RELEVANCE_SCORE = 70`
   - `EMBEDDING_MODEL = "text-embedding-3-small"`

## Database Schema

### Required Supabase Tables

#### 1. `published_articles` Table
```sql
CREATE TABLE published_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  focus_keyword TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_published_articles_status ON published_articles(status);
CREATE INDEX idx_published_articles_created_at ON published_articles(created_at);
```

#### 2. `article_embeddings` Table
```sql
CREATE TABLE article_embeddings (
  article_id TEXT PRIMARY KEY REFERENCES published_articles(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- pgvector extension required
  content_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable pgvector extension first
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index for similarity search
CREATE INDEX idx_article_embeddings_vector ON article_embeddings
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## API Usage

### Endpoint
```
POST /api/seo/suggest-internal-links
```

### Request Body
```typescript
{
  articleId: string;           // Unique identifier for the article
  articleContent: string;      // Full HTML content of the article
  metadata: {
    title: string;            // Article title (required)
    focusKeyword: string;     // Primary SEO keyword (required)
    metaDescription?: string; // Meta description (optional)
    slug?: string;            // URL slug (optional)
  }
}
```

### Response Body
```typescript
{
  currentArticleId: string;
  suggestions: InternalLinkSuggestion[];
  existingLinks: Array<{
    targetId: string;
    anchorText: string;
  }>;
  metrics: {
    totalInternalLinks: number;
    optimalRange: [number, number];
    orphanedContent: boolean;
    topicClusterCoverage: number;
  };
}
```

### InternalLinkSuggestion Interface
```typescript
interface InternalLinkSuggestion {
  id: string;
  targetArticle: {
    id: string;
    slug: string;
    title: string;
    focusKeyword: string;
    url: string;
  };
  anchorText: string;
  relevanceScore: number;        // 0-100
  semanticSimilarity: number;    // 0-1
  placement: {
    paragraphIndex: number;
    sentenceIndex: number;
    position: number;
    context: string;
  };
  reasoning: string;
  bidirectional: boolean;
  status: 'suggested' | 'accepted' | 'rejected';
}
```

### Example Request
```typescript
const response = await fetch('/api/seo/suggest-internal-links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleId: 'article-123',
    articleContent: '<h1>My Article</h1><p>Content here...</p>',
    metadata: {
      title: 'Complete Guide to SEO',
      focusKeyword: 'SEO optimization',
      metaDescription: 'Learn how to optimize your website for search engines'
    }
  })
});

const analysis = await response.json();
console.log(`Generated ${analysis.suggestions.length} suggestions`);
```

## Features

### 1. Semantic Similarity Analysis
- Uses OpenAI embeddings (1536 dimensions) for deep semantic understanding
- Calculates cosine similarity between articles
- Filters candidates with minimum similarity threshold (0.3)

### 2. AI-Powered Placement
- Claude AI analyzes article structure and context
- Suggests natural anchor text (avoids generic "click here")
- Identifies optimal paragraph and sentence placement
- Provides reasoning for each suggestion

### 3. Relevance Scoring
- Weighted scoring system (0-100):
  - 60% semantic similarity
  - 30% topic overlap
  - 10% keyword match
- Only suggests links with score >= 70

### 4. Embedding Caching
- Stores embeddings in Supabase for performance
- Automatically retrieves cached embeddings when available
- Falls back to generating new embeddings on cache miss
- Fire-and-forget caching pattern for efficiency

### 5. Existing Link Detection
- Extracts current internal links from article HTML
- Identifies anchor text and target URLs
- Prevents duplicate suggestions

### 6. Metrics & Analysis
- Total internal link count
- Optimal range comparison (3-10 links)
- Orphaned content detection (no links)
- Topic cluster coverage percentage

## Error Handling

The engine implements comprehensive error handling:

1. **API Key Validation**
   - Checks for OPENAI_API_KEY
   - Checks for ANTHROPIC_API_KEY
   - Checks for SUPABASE credentials

2. **Request Validation**
   - Validates required fields
   - Type checks all inputs
   - Returns 400 for invalid requests

3. **Database Errors**
   - Graceful fallback when no articles found
   - Warns on embedding cache failures
   - Continues processing on non-critical errors

4. **AI API Failures**
   - Catches OpenAI embedding errors
   - Handles Claude placement failures
   - Provides fallback values when possible

5. **Response Sanitization**
   - Validates AI-generated JSON
   - Cleans markdown code blocks
   - Ensures proper data types

## Performance Optimization

### 1. Embedding Caching
- Embeddings stored in Supabase with pgvector
- O(1) lookup for cached embeddings
- Reduces OpenAI API calls by ~90%

### 2. Batch Processing
- Fetches all articles in single query
- Enriches with embeddings in parallel
- Processes candidates in order of similarity

### 3. Smart Truncation
- Limits article content to 32,000 characters (~8,000 tokens)
- Prevents token limit errors
- Maintains semantic accuracy

### 4. Rate Limiting
- 500ms delay between Claude API calls
- Prevents rate limit errors
- Ensures reliable processing

### 5. Candidate Filtering
- Pre-filters by minimum similarity (0.3)
- Stops after MAX_INTERNAL_LINK_SUGGESTIONS (5)
- Only processes top candidates

## Usage in Frontend

### Step 6: SEO Optimization Integration
```typescript
// In Step 6 component
const generateLinkSuggestions = async () => {
  try {
    const response = await fetch('/api/seo/suggest-internal-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: draftId,
        articleContent: articleHtml,
        metadata: {
          title: articleTitle,
          focusKeyword: primaryKeyword,
          metaDescription: metaDesc,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate suggestions');
    }

    const analysis = await response.json();

    // Display suggestions in UI
    setSuggestions(analysis.suggestions);
    setMetrics(analysis.metrics);

  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to generate link suggestions');
  }
};
```

### Applying Suggestions
```typescript
// Insert link at suggested position
const applyLinkSuggestion = (suggestion: InternalLinkSuggestion) => {
  const { placement, anchorText, targetArticle } = suggestion;

  // Parse article into structure
  const structure = parseArticleStructure(articleHtml);

  // Get target paragraph and sentence
  const paragraph = structure[placement.paragraphIndex];
  const sentence = paragraph[placement.sentenceIndex];

  // Create link HTML
  const link = `<a href="${targetArticle.url}">${anchorText}</a>`;

  // Insert link at position
  const updatedSentence =
    sentence.slice(0, placement.position) +
    link +
    sentence.slice(placement.position);

  // Update article content
  updateArticleContent(updatedSentence);
};
```

## Environment Variables

Required environment variables:

```bash
# OpenAI API (for embeddings)
OPENAI_API_KEY=sk-...

# Anthropic API (for link placement)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase (for data storage)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Testing

### Manual Testing
```bash
# Start development server
npm run dev

# Test API endpoint
curl -X POST http://localhost:33333/api/seo/suggest-internal-links \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "test-123",
    "articleContent": "<h1>Test Article</h1><p>Content here...</p>",
    "metadata": {
      "title": "Test Article",
      "focusKeyword": "testing"
    }
  }'
```

### Unit Testing
```typescript
import { calculateCosineSimilarity, findSimilarArticles } from '@/lib/embeddings';

test('cosine similarity calculation', () => {
  const vecA = [1, 0, 0];
  const vecB = [0, 1, 0];
  const similarity = calculateCosineSimilarity(vecA, vecB);
  expect(similarity).toBe(0); // Orthogonal vectors
});
```

## Limitations & Future Improvements

### Current Limitations
1. Requires pgvector extension in Supabase
2. Limited to 5 suggestions per article
3. English language only
4. No link frequency tracking
5. No bidirectional link implementation

### Planned Improvements
1. **Multi-language Support**
   - Add language detection
   - Use multilingual embeddings

2. **Link Frequency Tracking**
   - Track how many times each article is linked to
   - Suggest underlinked content

3. **Bidirectional Linking**
   - Automatically suggest reciprocal links
   - Build content clusters

4. **Link Quality Scoring**
   - Track click-through rates
   - Measure user engagement
   - Learn from patterns

5. **Visual Link Graph**
   - Display article relationships
   - Show content clusters
   - Identify orphaned content

## Troubleshooting

### "No embeddings generated"
- Check OPENAI_API_KEY is set
- Verify OpenAI account has credits
- Check for rate limiting

### "No published articles found"
- Ensure published_articles table exists
- Check article status = 'published'
- Verify Supabase connection

### "Failed to suggest placements"
- Check ANTHROPIC_API_KEY is set
- Verify Claude API quota
- Check for malformed content

### "Vector dimension mismatch"
- Ensure using text-embedding-3-small (1536 dimensions)
- Recreate article_embeddings table
- Clear old embeddings

## License

Proprietary - StepTen.io

# Featured Snippet Optimizer - Usage Examples

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Frontend Integration](#frontend-integration)
3. [React Component Example](#react-component-example)
4. [Advanced Scenarios](#advanced-scenarios)
5. [Error Handling](#error-handling)

## Basic Usage

### Example 1: Optimize for Question Keyword

```typescript
const response = await fetch('/api/seo/optimize-snippet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keyword: 'what is content marketing',
    articleContent: `
      <h1>Content Marketing Guide</h1>
      <p>Content marketing is a strategic marketing approach focused on creating and distributing valuable, relevant, and consistent content to attract and retain a clearly defined audience.</p>
      <h2>Why Content Marketing Matters</h2>
      <p>In today's digital landscape, content marketing helps businesses build trust, engage audiences, and drive profitable customer action.</p>
    `
  })
});

const optimization = await response.json();

console.log('Format:', optimization.targetFormat); // "paragraph"
console.log('Win Probability:', optimization.winProbability + '%'); // e.g., "78%"
console.log('Optimized Content:', optimization.optimizedContent.paragraph);
// "Content marketing is a strategic marketing approach focused on creating
// and distributing valuable, relevant, and consistent content to attract
// and retain a clearly defined audience."
```

### Example 2: Optimize for How-To Keyword

```typescript
const response = await fetch('/api/seo/optimize-snippet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keyword: 'how to improve seo',
    articleContent: `
      <h1>SEO Improvement Guide</h1>
      <h2>How to Improve Your SEO</h2>
      <ol>
        <li>Conduct comprehensive keyword research</li>
        <li>Create high-quality, original content</li>
        <li>Optimize meta titles and descriptions</li>
        <li>Build authoritative backlinks</li>
        <li>Improve site speed and mobile responsiveness</li>
        <li>Use structured data markup</li>
      </ol>
    `,
    targetFormat: 'list'
  })
});

const optimization = await response.json();

console.log('List Items:', optimization.optimizedContent.list);
// [
//   "Conduct comprehensive keyword research",
//   "Create high-quality, original content",
//   "Optimize meta titles and descriptions",
//   ...
// ]

console.log('HTML:', optimization.optimizedContent.html);
// <ol>
//   <li>Conduct comprehensive keyword research</li>
//   <li>Create high-quality, original content</li>
//   ...
// </ol>
```

### Example 3: Optimize for Comparison Keyword

```typescript
const response = await fetch('/api/seo/optimize-snippet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    keyword: 'seo vs sem',
    articleContent: `
      <h1>SEO vs SEM: What's the Difference?</h1>
      <p>Both SEO and SEM are crucial for digital marketing success, but they work differently.</p>
      <h2>Key Differences</h2>
      <p>SEO focuses on organic rankings through content optimization, while SEM includes paid search advertising.</p>
    `,
    targetFormat: 'table'
  })
});

const optimization = await response.json();

console.log('Table:', optimization.optimizedContent.table);
// [
//   { Feature: "Definition", SEO: "Organic optimization", SEM: "Paid advertising" },
//   { Feature: "Cost", SEO: "Free (organic)", SEM: "Pay per click" },
//   ...
// ]
```

## Frontend Integration

### React Hook for Snippet Optimization

```typescript
// hooks/useSnippetOptimizer.ts
import { useState } from 'react';
import { SnippetOptimization } from '@/lib/seo-types';

export function useSnippetOptimizer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimization, setOptimization] = useState<SnippetOptimization | null>(null);

  async function optimizeSnippet(
    keyword: string,
    articleContent: string,
    targetFormat?: 'paragraph' | 'list' | 'table'
  ) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/seo/optimize-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, articleContent, targetFormat })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize snippet');
      }

      const data = await response.json();
      setOptimization(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { optimizeSnippet, loading, error, optimization };
}
```

## React Component Example

### Snippet Optimizer Panel

```typescript
// components/SnippetOptimizerPanel.tsx
import { useState } from 'react';
import { useSnippetOptimizer } from '@/hooks/useSnippetOptimizer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SnippetOptimizerPanelProps {
  articleContent: string;
  onInsertSnippet: (html: string, afterHeading: string) => void;
}

export function SnippetOptimizerPanel({ articleContent, onInsertSnippet }: SnippetOptimizerPanelProps) {
  const [keyword, setKeyword] = useState('');
  const { optimizeSnippet, loading, error, optimization } = useSnippetOptimizer();

  async function handleOptimize() {
    if (!keyword.trim()) {
      alert('Please enter a keyword');
      return;
    }

    try {
      await optimizeSnippet(keyword, articleContent);
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  }

  function handleInsert() {
    if (optimization) {
      onInsertSnippet(
        optimization.optimizedContent.html,
        optimization.insertionPoint.afterHeading
      );
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Featured Snippet Optimizer</h3>

      {/* Keyword Input */}
      <div className="mb-4">
        <Input
          placeholder="Enter target keyword (e.g., 'what is seo')"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleOptimize()}
        />
      </div>

      {/* Optimize Button */}
      <Button onClick={handleOptimize} disabled={loading} className="w-full mb-4">
        {loading ? 'Analyzing...' : 'Optimize Snippet'}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results */}
      {optimization && (
        <div className="space-y-4">
          {/* Win Probability */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span className="font-medium">Win Probability:</span>
            <span className="text-2xl font-bold text-blue-600">
              {optimization.winProbability}%
            </span>
          </div>

          {/* Target Format */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-medium">Format:</span>
            <span className="capitalize">{optimization.targetFormat}</span>
          </div>

          {/* Optimized Content */}
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <div
                className="prose max-w-none p-4 border rounded"
                dangerouslySetInnerHTML={{ __html: optimization.optimizedContent.html }}
              />
            </TabsContent>

            <TabsContent value="html" className="mt-4">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto text-sm">
                {optimization.optimizedContent.html}
              </pre>
            </TabsContent>
          </Tabs>

          {/* Insertion Point */}
          <div className="p-3 bg-green-50 rounded">
            <p className="font-medium text-green-800 mb-1">Insert After:</p>
            <p className="text-green-700">{optimization.insertionPoint.afterHeading}</p>
            <p className="text-sm text-green-600 mt-2">
              {optimization.insertionPoint.reasoning}
            </p>
          </div>

          {/* Recommendations */}
          {optimization.analysis?.recommendations && (
            <div className="p-3 bg-purple-50 rounded">
              <p className="font-medium text-purple-800 mb-2">Recommendations:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700 text-sm">
                {optimization.analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Insert Button */}
          <Button onClick={handleInsert} variant="default" className="w-full">
            Insert into Article
          </Button>
        </div>
      )}
    </Card>
  );
}
```

## Advanced Scenarios

### Scenario 1: Batch Optimization

Optimize multiple keywords at once:

```typescript
async function optimizeMultipleKeywords(
  keywords: string[],
  articleContent: string
) {
  const results = await Promise.all(
    keywords.map(keyword =>
      fetch('/api/seo/optimize-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, articleContent })
      }).then(r => r.json())
    )
  );

  // Find the keyword with highest win probability
  const best = results.reduce((prev, current) =>
    current.winProbability > prev.winProbability ? current : prev
  );

  console.log('Best keyword:', best.keyword);
  console.log('Win probability:', best.winProbability + '%');

  return { results, best };
}

// Usage
const keywords = [
  'what is seo',
  'how does seo work',
  'why is seo important'
];

const { results, best } = await optimizeMultipleKeywords(keywords, articleContent);
```

### Scenario 2: Progressive Enhancement

Add snippet optimization to existing article workflow:

```typescript
async function enhanceArticleWithSnippet(article: ArticleData) {
  // Extract focus keyword from article
  const focusKeyword = article.step3?.metadata?.focusKeyword || '';
  const content = article.step4?.revised || article.step4?.original || '';

  if (!focusKeyword || !content) {
    return article;
  }

  // Optimize snippet
  const optimization = await fetch('/api/seo/optimize-snippet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword: focusKeyword,
      articleContent: content
    })
  }).then(r => r.json());

  // Auto-insert if high probability
  if (optimization.winProbability >= 70) {
    const enhancedContent = insertSnippetAfterHeading(
      content,
      optimization.insertionPoint.afterHeading,
      optimization.optimizedContent.html
    );

    return {
      ...article,
      step4: {
        ...article.step4,
        revised: enhancedContent
      },
      snippetOptimization: optimization
    };
  }

  return article;
}

function insertSnippetAfterHeading(
  html: string,
  headingText: string,
  snippetHtml: string
): string {
  // Find the heading and insert snippet after it
  const headingRegex = new RegExp(
    `(<h[2-3][^>]*>${headingText}</h[2-3]>)`,
    'i'
  );

  return html.replace(
    headingRegex,
    `$1\n${snippetHtml}\n`
  );
}
```

### Scenario 3: A/B Testing Snippets

Test different formats:

```typescript
async function testSnippetFormats(keyword: string, content: string) {
  const formats: Array<'paragraph' | 'list' | 'table'> = ['paragraph', 'list', 'table'];

  const tests = await Promise.all(
    formats.map(format =>
      fetch('/api/seo/optimize-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          articleContent: content,
          targetFormat: format
        })
      }).then(r => r.json())
    )
  );

  // Compare probabilities
  const comparison = tests.map((test, i) => ({
    format: formats[i],
    winProbability: test.winProbability,
    html: test.optimizedContent.html
  }));

  // Sort by probability
  comparison.sort((a, b) => b.winProbability - a.winProbability);

  console.log('Format Comparison:');
  comparison.forEach(({ format, winProbability }) => {
    console.log(`  ${format}: ${winProbability}%`);
  });

  return comparison[0]; // Return best format
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
async function safeSnippetOptimization(
  keyword: string,
  articleContent: string
) {
  try {
    // Validate inputs
    if (!keyword || keyword.length < 2) {
      throw new Error('Keyword must be at least 2 characters');
    }

    if (!articleContent || articleContent.length < 100) {
      throw new Error('Article content too short for snippet optimization');
    }

    // Make API call
    const response = await fetch('/api/seo/optimize-snippet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, articleContent })
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const optimization = await response.json();

    // Validate response
    if (!optimization.optimizedContent?.html) {
      throw new Error('Invalid optimization response');
    }

    return {
      success: true,
      data: optimization,
      error: null
    };

  } catch (error: any) {
    console.error('Snippet optimization failed:', error);

    return {
      success: false,
      data: null,
      error: error.message || 'Unknown error occurred'
    };
  }
}

// Usage with error handling
const result = await safeSnippetOptimization(keyword, content);

if (result.success) {
  console.log('Optimization successful:', result.data);
} else {
  console.error('Optimization failed:', result.error);
  // Show user-friendly error message
  showErrorToast(result.error);
}
```

### Retry Logic

```typescript
async function optimizeWithRetry(
  keyword: string,
  content: string,
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/seo/optimize-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, articleContent: content })
      });

      if (response.ok) {
        return await response.json();
      }

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        const error = await response.json();
        throw new Error(error.error);
      }

      // Retry on 5xx errors (server errors)
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
    }
  }

  throw new Error('Max retries exceeded');
}
```

## Performance Optimization

### Debounced Keyword Input

```typescript
import { useMemo, useCallback } from 'react';
import debounce from 'lodash/debounce';

function SnippetOptimizerInput({ articleContent, onOptimize }: Props) {
  const [keyword, setKeyword] = useState('');

  // Debounce optimization calls
  const debouncedOptimize = useMemo(
    () => debounce(async (kw: string) => {
      if (kw.length >= 3) {
        const result = await fetch('/api/seo/optimize-snippet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: kw, articleContent })
        }).then(r => r.json());

        onOptimize(result);
      }
    }, 1000),
    [articleContent, onOptimize]
  );

  const handleKeywordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    debouncedOptimize(value);
  }, [debouncedOptimize]);

  return (
    <Input
      value={keyword}
      onChange={handleKeywordChange}
      placeholder="Enter keyword to auto-optimize..."
    />
  );
}
```

---

These examples demonstrate the full range of capabilities of the Featured Snippet Optimizer. For more details, see the main documentation.

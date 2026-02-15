import { test, expect } from '@playwright/test';

/**
 * SEO API Validation Tests
 *
 * These tests validate that all SEO Engine API endpoints:
 * 1. Return 200 status codes
 * 2. Return expected JSON structure
 * 3. Handle errors gracefully
 *
 * NOTE: These tests hit REAL APIs and may be slow/expensive.
 * Set SKIP_API_TESTS=true environment variable to skip these tests.
 */

const SKIP_API_TESTS = process.env.SKIP_API_TESTS === 'true';

test.describe('SEO Engine API Endpoints', () => {
  test.skip(SKIP_API_TESTS, 'Skipping API tests (SKIP_API_TESTS=true)');

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:33333';

  test('API: POST /api/seo/research - Returns research data', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/research`, {
      data: {
        idea: 'How to build a simple Next.js app',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('version');
    expect(data.version).toHaveProperty('decomposition');
    expect(data.version).toHaveProperty('keywords');
  });

  test('API: POST /api/seo/generate-framework - Returns framework', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/generate-framework`, {
      data: {
        idea: 'How to build a Next.js app',
        research: {
          mainTopic: 'Next.js Tutorial',
          subtopics: ['Setup', 'Routing'],
        },
        mainKeyword: 'next.js tutorial',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('framework');
    expect(data.framework).toHaveProperty('introduction');
    expect(data.framework).toHaveProperty('sections');
    expect(data.framework).toHaveProperty('conclusion');
  });

  test('API: POST /api/seo/write-article - Returns article HTML', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/write-article`, {
      data: {
        framework: {
          introduction: 'Test intro',
          sections: [
            {
              heading: 'Getting Started',
              keyPoints: ['Install Next.js', 'Create pages'],
              purpose: 'Setup',
            },
          ],
          conclusion: 'Test conclusion',
        },
        title: 'How to Build a Next.js App',
        mainKeyword: 'next.js tutorial',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('article');
    expect(typeof data.article).toBe('string');
    expect(data.article.length).toBeGreaterThan(100);
  });

  test('API: POST /api/seo/revise-article - Returns revised article', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/revise-article`, {
      data: {
        article: '<h1>Test</h1><p>This is a test article.</p>',
        feedback: 'Make it more engaging',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('revisedArticle');
    expect(data).toHaveProperty('changeAnalysis');
  });

  test('API: POST /api/seo/humanize-article - Returns humanized version', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/humanize-article`, {
      data: {
        article: '<p>This is a test article about Next.js. It provides information.</p>',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('humanizedArticle');
    expect(data).toHaveProperty('changes');
    expect(Array.isArray(data.changes)).toBe(true);
    expect(data).toHaveProperty('changeSummary');
  });

  test('API: POST /api/seo/analyze-seo - Returns SEO analysis', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/analyze-seo`, {
      data: {
        article: '<h1>How to Build a Next.js App</h1><p>Next.js is a React framework that makes building web applications easy. Learn how to create your first Next.js app with routing, pages, and deployment.</p>',
        title: 'How to Build a Next.js App',
        keyword: 'next.js tutorial',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('score');
    expect(data).toHaveProperty('maxScore');
    expect(data).toHaveProperty('checks');
    expect(Array.isArray(data.checks)).toBe(true);
    expect(data.checks.length).toBeGreaterThan(0);
  });

  test('API: POST /api/seo/extract-content-blocks - Returns content blocks', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/extract-content-blocks`, {
      data: {
        article: '<h1>How to Build a Next.js App</h1><p>Next.js is a React framework. According to React documentation, it is the most popular framework. Here are the steps: 1. Install Next.js 2. Create pages 3. Deploy your app.</p>',
        title: 'How to Build a Next.js App',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('contentBlocks');
    expect(Array.isArray(data.contentBlocks)).toBe(true);
  });

  test('API: POST /api/seo/generate-image - Returns base64 image', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/generate-image`, {
      data: {
        prompt: 'A modern Next.js application dashboard',
      },
      timeout: 60000, // Image generation can take time
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('imageData');
    expect(data.imageData).toContain('data:image');
  });

  test('API: POST /api/articles/publish - Saves article to localStorage', async ({ page }) => {
    // This endpoint needs to run in browser context to access localStorage
    await page.goto('/');

    const publishData = {
      title: 'Test Article Title',
      slug: 'test-article-slug-' + Date.now(),
      content: '<h1>Test</h1><p>Test content</p>',
      excerpt: 'Test excerpt',
      heroImage: 'none',
      metaTitle: 'Test Meta Title',
      metaDescription: 'Test meta description',
      status: 'published',
      articleType: 'how-to',
      silo: 'tutorials',
      depth: 1,
      wordCount: 500,
      seoScore: 85,
    };

    const response = await page.request.post('/api/articles/publish', {
      data: publishData,
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('slug');
  });
});

test.describe('API Error Handling', () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:33333';

  test('API: Returns 400 for missing required fields', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/research`, {
      data: {
        // Missing 'idea' field
      },
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(400);
  });

  test('API: Returns proper error message for invalid input', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/seo/write-article`, {
      data: {
        framework: null, // Invalid framework
        title: '',
      },
      failOnStatusCode: false,
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});

test.describe('API Performance', () => {
  test.skip(SKIP_API_TESTS);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:33333';

  test('API: Research endpoint responds within 30 seconds', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${baseURL}/api/seo/research`, {
      data: {
        idea: 'How to optimize website performance',
      },
      timeout: 30000,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(30000);

    console.log(`Research API took ${duration}ms`);
  });

  test('API: Framework generation responds within 30 seconds', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${baseURL}/api/seo/generate-framework`, {
      data: {
        idea: 'Test idea',
        research: { mainTopic: 'Test', subtopics: ['A', 'B'] },
        mainKeyword: 'test',
      },
      timeout: 30000,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(30000);

    console.log(`Framework API took ${duration}ms`);
  });

  test('API: Article writing responds within 60 seconds', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${baseURL}/api/seo/write-article`, {
      data: {
        framework: {
          introduction: 'Test',
          sections: [{ heading: 'Test', keyPoints: ['A'], purpose: 'Test' }],
          conclusion: 'Test',
        },
        title: 'Test Article',
        mainKeyword: 'test',
      },
      timeout: 60000,
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    expect(response.ok()).toBeTruthy();
    expect(duration).toBeLessThan(60000);

    console.log(`Write Article API took ${duration}ms`);
  });
});

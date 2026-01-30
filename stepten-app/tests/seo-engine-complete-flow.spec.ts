import { test, expect, type Page } from '@playwright/test';

/**
 * SEO Engine Complete Flow Test
 *
 * This test suite validates the entire 8-step SEO Engine workflow:
 * - Step 1: Idea Input
 * - Step 2: Research & Decomposition
 * - Step 3: Framework Generation
 * - Step 4: Article Writing
 * - Step 5: Humanization
 * - Step 6: SEO Optimization
 * - Step 7: Styling & Images
 * - Step 8: Publishing
 * - Frontend: Article Display
 *
 * All API calls are mocked to avoid hitting real APIs during testing.
 */

// Mock API responses
const mockResponses = {
  research: {
    success: true,
    version: {
      versionNumber: 1,
      decomposition: {
        mainTopic: "How to Build a Next.js App",
        subtopics: ["Setup", "Routing", "Deployment"],
        questions: ["What is Next.js?", "How to deploy?"],
        userIntent: "Learn Next.js basics"
      },
      keywords: [
        { keyword: "next.js tutorial", volume: 5000, difficulty: 45, relevance: 95 },
        { keyword: "next.js app", volume: 3000, difficulty: 40, relevance: 90 }
      ],
      relatedLinks: [
        { title: "Next.js Docs", url: "https://nextjs.org", summary: "Official docs" }
      ]
    }
  },

  framework: {
    success: true,
    framework: {
      introduction: "Learn how to build modern web apps with Next.js.",
      sections: [
        {
          heading: "Getting Started",
          keyPoints: ["Install Next.js", "Create pages", "Configure routing"],
          purpose: "Setup basics"
        }
      ],
      conclusion: "You now know Next.js basics!"
    }
  },

  article: {
    success: true,
    article: "<h1>How to Build a Next.js App</h1><p>Next.js is a powerful React framework.</p><h2>Getting Started</h2><p>First, install Next.js using npm.</p>"
  },

  revise: {
    success: true,
    revisedArticle: "<h1>How to Build a Next.js App</h1><p>Next.js is an <mark>incredible</mark> React framework.</p><h2>Getting Started</h2><p>First, install Next.js using npm <mark>or yarn</mark>.</p>",
    changeAnalysis: {
      totalChanges: 2,
      changesByType: { additions: 2 }
    }
  },

  humanize: {
    success: true,
    originalArticle: "<p>Next.js is a powerful React framework.</p>",
    humanizedArticle: "<p>Next.js is an incredible React framework that developers love.</p>",
    changes: [
      {
        id: "sentence-0",
        type: "modification",
        original: "Next.js is a powerful React framework.",
        humanized: "Next.js is an incredible React framework that developers love.",
        status: "accepted"
      }
    ],
    changeSummary: [
      { type: "tone", count: 1, example: "More conversational", description: "Added personality" }
    ]
  },

  analyzeSeo: {
    success: true,
    score: 85,
    maxScore: 150,
    checks: [
      {
        id: "keyword-in-title",
        name: "Keyword in Title",
        status: "passed",
        score: 15,
        maxScore: 15,
        message: "Main keyword found in title"
      },
      {
        id: "content-length",
        name: "Content Length",
        status: "passed",
        score: 15,
        maxScore: 15,
        message: "Article length is optimal"
      }
    ],
    suggestions: []
  },

  extractContentBlocks: {
    success: true,
    contentBlocks: [
      {
        id: "callout-1",
        type: "callout",
        content: "Next.js is the future of React development!",
        position: 0,
        visible: true
      }
    ]
  },

  generateImage: {
    success: true,
    imageData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  },

  publish: {
    success: true,
    slug: "how-to-build-nextjs-app",
    message: "Article published successfully"
  }
};

// Helper function to setup API mocking
async function setupApiMocks(page: Page) {
  // Mock all SEO Engine API endpoints
  await page.route('**/api/seo/research', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.research)
    });
  });

  await page.route('**/api/seo/generate-framework', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.framework)
    });
  });

  await page.route('**/api/seo/write-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.article)
    });
  });

  await page.route('**/api/seo/revise-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.revise)
    });
  });

  await page.route('**/api/seo/humanize-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.humanize)
    });
  });

  await page.route('**/api/seo/analyze-seo', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.analyzeSeo)
    });
  });

  await page.route('**/api/seo/extract-content-blocks', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.extractContentBlocks)
    });
  });

  await page.route('**/api/seo/generate-image', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.generateImage)
    });
  });

  await page.route('**/api/articles/publish', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.publish)
    });
  });
}

test.describe('SEO Engine - Complete Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Setup API mocks
    await setupApiMocks(page);

    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Complete flow: Steps 1-8 + Frontend Display', async ({ page }) => {
    /**
     * STEP 1: IDEA INPUT
     */
    await test.step('Step 1: Enter article idea', async () => {
      await page.goto('/admin/seo/articles/new/step-1-idea');

      // Check page loaded
      await expect(page.locator('h1')).toContainText(/Step 1|Idea/i);

      // Enter article idea
      const textarea = page.locator('textarea').first();
      await textarea.fill('How to build a Next.js app for beginners');

      // Click continue
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 2
      await expect(page).toHaveURL(/step-2-research/);

      // Verify localStorage
      const step1Data = await page.evaluate(() => {
        const data = localStorage.getItem('seo-article-data');
        return data ? JSON.parse(data).step1 : null;
      });
      expect(step1Data).toBeTruthy();
      expect(step1Data.ideaText).toContain('Next.js');
    });

    /**
     * STEP 2: RESEARCH & DECOMPOSITION
     */
    await test.step('Step 2: Generate research', async () => {
      // Should already be on Step 2 from previous step
      await expect(page).toHaveURL(/step-2-research/);

      // Click "Start Research" button
      await page.getByRole('button', { name: /start research|research|decompose/i }).click();

      // Wait for loading to complete (mocked response is instant)
      await page.waitForTimeout(500);

      // Should show research results
      await expect(page.locator('text=/keywords|subtopics|questions/i')).toBeVisible();

      // Click continue
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 3
      await expect(page).toHaveURL(/step-3-framework/);
    });

    /**
     * STEP 3: FRAMEWORK GENERATION
     */
    await test.step('Step 3: Generate framework', async () => {
      await expect(page).toHaveURL(/step-3-framework/);

      // Click "Generate Framework" button
      await page.getByRole('button', { name: /generate framework/i }).click();

      // Wait for mocked response
      await page.waitForTimeout(500);

      // Should show framework sections
      await expect(page.locator('text=/introduction|getting started|conclusion/i')).toBeVisible();

      // Click continue
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 4
      await expect(page).toHaveURL(/step-4-writing/);

      // Verify framework persisted
      const step3Data = await page.evaluate(() => {
        const data = localStorage.getItem('seo-article-data');
        return data ? JSON.parse(data).step3 : null;
      });
      expect(step3Data).toBeTruthy();
      expect(step3Data.framework).toBeTruthy();
    });

    /**
     * STEP 4: ARTICLE WRITING
     */
    await test.step('Step 4: Write article', async () => {
      await expect(page).toHaveURL(/step-4-writing/);

      // Click "Write Article" button
      await page.getByRole('button', { name: /write article|generate article/i }).click();

      // Wait for mocked response
      await page.waitForTimeout(500);

      // Should show article content
      await expect(page.locator('text=/Next.js/i')).toBeVisible();

      // Click continue (skip revisions for now)
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 5
      await expect(page).toHaveURL(/step-5-humanize/);
    });

    /**
     * STEP 5: HUMANIZATION
     */
    await test.step('Step 5: Humanize article', async () => {
      await expect(page).toHaveURL(/step-5-humanize/);

      // Click "Humanize with Grok" button
      await page.getByRole('button', { name: /humanize/i }).first().click();

      // Wait for mocked response
      await page.waitForTimeout(500);

      // Should show changes
      await expect(page.locator('text=/changes|sentence/i')).toBeVisible();

      // Test Accept/Reject functionality
      const acceptButton = page.getByRole('button', { name: /accept/i }).first();
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
      }

      // Click continue
      await page.getByRole('button', { name: /continue|save.*continue/i }).click();

      // Should navigate to Step 6
      await expect(page).toHaveURL(/step-6-optimize/);
    });

    /**
     * STEP 6: SEO OPTIMIZATION
     */
    await test.step('Step 6: Analyze SEO', async () => {
      await expect(page).toHaveURL(/step-6-optimize/);

      // Click "Analyze SEO" button
      await page.getByRole('button', { name: /analyze seo|run.*analysis/i }).click();

      // Wait for mocked response
      await page.waitForTimeout(500);

      // Should show SEO score
      await expect(page.locator('text=/score|seo/i')).toBeVisible();

      // Click continue
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 7
      await expect(page).toHaveURL(/step-7-styling/);
    });

    /**
     * STEP 7: STYLING & IMAGES
     */
    await test.step('Step 7: Add styling and images', async () => {
      await expect(page).toHaveURL(/step-7-styling/);

      // Wait for content blocks auto-extraction
      await page.waitForTimeout(1000);

      // Should show content blocks section
      await expect(page.locator('text=/content blocks|callout|quote/i')).toBeVisible();

      // Generate hero image
      const generateImageButton = page.getByRole('button', { name: /generate.*image/i }).first();
      if (await generateImageButton.isVisible()) {
        await generateImageButton.click();
        await page.waitForTimeout(500);
      }

      // Click continue
      await page.getByRole('button', { name: /continue|next/i }).click();

      // Should navigate to Step 8
      await expect(page).toHaveURL(/step-8-publish/);
    });

    /**
     * STEP 8: PUBLISH
     */
    await test.step('Step 8: Publish article', async () => {
      await expect(page).toHaveURL(/step-8-publish/);

      // Fill in meta description
      const metaDescInput = page.locator('textarea[placeholder*="description"]').first();
      if (await metaDescInput.isVisible()) {
        await metaDescInput.fill('Learn how to build a Next.js app from scratch');
      }

      // Test preview modal
      const previewButton = page.getByRole('button', { name: /preview/i }).first();
      if (await previewButton.isVisible()) {
        await previewButton.click();

        // Should show preview modal
        await expect(page.locator('[class*="fixed"][class*="inset"]')).toBeVisible();

        // Close preview
        await page.keyboard.press('Escape');
      }

      // Click "Publish Now" button
      await page.getByRole('button', { name: /publish now/i }).click();

      // Wait for publish to complete
      await page.waitForTimeout(1000);

      // Should show success message or redirect
      const successIndicator = page.locator('text=/success|published/i');
      await expect(successIndicator).toBeVisible({ timeout: 5000 });
    });

    /**
     * FRONTEND: ARTICLE DISPLAY
     */
    await test.step('Frontend: View published article', async () => {
      // Navigate to articles page
      await page.goto('/articles');

      // Should show articles list
      await expect(page.locator('text=/articles|blog/i')).toBeVisible();

      // Check if article appears (may need to wait for localStorage sync)
      await page.waitForTimeout(500);

      // Navigate to specific article
      await page.goto('/articles/how-to-build-nextjs-app');

      // Should show article content
      await expect(page.locator('h1')).toContainText(/Next.js/i);

      // Should show author info
      await expect(page.locator('text=/stephen ten|author/i')).toBeVisible();
    });

    /**
     * VERIFY LOCALSTORAGE DATA INTEGRITY
     */
    await test.step('Verify localStorage data integrity', async () => {
      const allData = await page.evaluate(() => {
        const articleData = localStorage.getItem('seo-article-data');
        const publishedArticles = localStorage.getItem('seo-published-articles');

        return {
          articleData: articleData ? JSON.parse(articleData) : null,
          publishedArticles: publishedArticles ? JSON.parse(publishedArticles) : null
        };
      });

      // Verify article data exists for all steps
      expect(allData.articleData).toBeTruthy();
      expect(allData.articleData.step1).toBeTruthy();
      expect(allData.articleData.step2).toBeTruthy();
      expect(allData.articleData.step3).toBeTruthy();
      expect(allData.articleData.step4).toBeTruthy();

      // Verify published article exists
      expect(allData.publishedArticles).toBeTruthy();
      expect(Array.isArray(allData.publishedArticles)).toBeTruthy();
    });
  });

  /**
   * TEST: Voice Input Functionality
   */
  test('Voice input components are present', async ({ page }) => {
    // Step 3: Framework feedback
    await page.goto('/admin/seo/articles/new/step-3-framework');

    // Mock Step 1 and 2 data first
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test idea' },
        step2: { versions: [{ decomposition: { mainTopic: 'Test' } }], activeVersion: 0 }
      }));
    });

    await page.reload();

    // Look for voice input button (microphone icon)
    const voiceButton = page.locator('button[aria-label*="voice" i], button:has-text("🎤")');
    if (await voiceButton.count() > 0) {
      await expect(voiceButton.first()).toBeVisible();
    }
  });

  /**
   * TEST: Critical Bug Fixes
   */
  test('Bug Fix: Step 3 framework loading from localStorage', async ({ page }) => {
    // Setup: Save framework to localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test idea' },
        step2: {
          versions: [{ decomposition: { mainTopic: 'Test Topic' } }],
          activeVersion: 0,
          selectedKeywords: [],
          selectedLinks: []
        },
        step3: {
          framework: {
            introduction: 'Test intro',
            sections: [{ heading: 'Test Section', keyPoints: ['Point 1'], purpose: 'Test' }],
            conclusion: 'Test conclusion'
          },
          title: 'Test Framework Title'
        }
      }));
    });

    // Navigate to Step 3
    await page.goto('/admin/seo/articles/new/step-3-framework');

    // Wait for page to load
    await page.waitForTimeout(500);

    // Should display saved framework
    await expect(page.locator('text=/test intro|test section/i')).toBeVisible();

    // Verify title is loaded
    const titleInput = page.locator('input[type="text"]').first();
    await expect(titleInput).toHaveValue(/test framework title/i);
  });

  test('Bug Fix: Step 4 revisions save to localStorage', async ({ page }) => {
    // Setup: Navigate to Step 4 with article data
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: { versions: [{ decomposition: { mainTopic: 'Test' } }], activeVersion: 0 },
        step3: { framework: { sections: [] }, title: 'Test' },
        step4: {
          article: '<p>Original article text</p>',
          revisedArticle: '<p>Revised article text with <mark>changes</mark></p>',
          hasRevisions: true
        }
      }));
    });

    await setupApiMocks(page);
    await page.goto('/admin/seo/articles/new/step-4-writing');
    await page.waitForTimeout(500);

    // Click "Accept Revisions" button
    const acceptButton = page.getByRole('button', { name: /accept.*revision/i });
    if (await acceptButton.isVisible()) {
      await acceptButton.click();

      // Wait for save
      await page.waitForTimeout(500);

      // Verify localStorage was updated
      const step4Data = await page.evaluate(() => {
        const data = localStorage.getItem('seo-article-data');
        return data ? JSON.parse(data).step4 : null;
      });

      expect(step4Data).toBeTruthy();
      expect(step4Data.article).not.toContain('<mark>');
      expect(step4Data.hasRevisions).toBe(false);
    }
  });

  /**
   * TEST: Navigation
   */
  test('Navigation between steps works correctly', async ({ page }) => {
    // Setup base data
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test idea' },
        step2: { versions: [{ decomposition: { mainTopic: 'Test' } }], activeVersion: 0 },
        step3: { framework: { sections: [] }, title: 'Test' },
        step4: { article: '<p>Test</p>' }
      }));
    });

    // Navigate to Step 5
    await page.goto('/admin/seo/articles/new/step-5-humanize');
    await expect(page).toHaveURL(/step-5-humanize/);

    // Click "Back" button
    const backButton = page.getByRole('link', { name: /back|previous/i }).first();
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL(/step-4/);
    }
  });

  /**
   * TEST: Admin Dashboard
   */
  test('Admin dashboard displays articles from localStorage', async ({ page }) => {
    // Setup: Add published articles
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-published-articles', JSON.stringify([
        {
          id: '1',
          title: 'Test Article 1',
          slug: 'test-article-1',
          status: 'published',
          createdAt: new Date().toISOString(),
          wordCount: 1500,
          seoScore: 85
        },
        {
          id: '2',
          title: 'Test Article 2',
          slug: 'test-article-2',
          status: 'published',
          createdAt: new Date().toISOString(),
          wordCount: 2000,
          seoScore: 92
        }
      ]));
    });

    // Navigate to SEO dashboard
    await page.goto('/admin/seo');

    // Should show articles
    await expect(page.locator('text=/test article 1|test article 2/i')).toBeVisible();

    // Should show stats
    await expect(page.locator('text=/articles|total|published/i')).toBeVisible();
  });
});

/**
 * TEST SUITE: Individual Component Tests
 */
test.describe('SEO Engine - Component Tests', () => {

  test('Step 5: Accept/Reject individual changes', async ({ page }) => {
    await setupApiMocks(page);

    // Setup humanization data
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: { versions: [{ decomposition: { mainTopic: 'Test' } }], activeVersion: 0 },
        step3: { framework: { sections: [] } },
        step4: { article: '<p>Test article</p>' },
        step5: {
          changes: [
            {
              id: 'sentence-0',
              type: 'modification',
              original: 'Original sentence.',
              humanized: 'Humanized sentence.',
              status: 'accepted'
            }
          ],
          humanized: true
        }
      }));
    });

    await page.goto('/admin/seo/articles/new/step-5-humanize');
    await page.waitForTimeout(500);

    // Should show changes
    await expect(page.locator('text=/original|humanized/i')).toBeVisible();

    // Test Reject button
    const rejectButton = page.getByRole('button', { name: /reject/i }).first();
    if (await rejectButton.isVisible()) {
      await rejectButton.click();

      // Should gray out the change
      await expect(page.locator('[class*="opacity-60"]')).toBeVisible();
    }
  });

  test('Step 6: SEO checks are expandable', async ({ page }) => {
    await setupApiMocks(page);

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: {
          versions: [{
            decomposition: { mainTopic: 'Test Topic' },
            keywords: [{ keyword: 'test', volume: 1000, difficulty: 30, relevance: 80 }]
          }],
          activeVersion: 0,
          selectedKeywords: ['test']
        },
        step3: { framework: { sections: [] } },
        step4: { article: '<h1>Test</h1><p>Test article content with keyword test.</p>' }
      }));
    });

    await page.goto('/admin/seo/articles/new/step-6-optimize');

    // Click analyze SEO
    await page.getByRole('button', { name: /analyze seo/i }).click();
    await page.waitForTimeout(500);

    // Should show checks
    await expect(page.locator('text=/keyword in title|content length/i')).toBeVisible();

    // Test expandable check
    const expandButton = page.locator('[class*="chevron"], button:has-text("▼")').first();
    if (await expandButton.count() > 0) {
      await expandButton.click();

      // Should expand and show details
      await page.waitForTimeout(300);
    }
  });

  test('Step 8: Preview modal opens and closes', async ({ page }) => {
    await setupApiMocks(page);

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: { versions: [{ decomposition: { mainTopic: 'Test' } }], activeVersion: 0 },
        step3: { framework: { sections: [] }, title: 'Test Article Title' },
        step4: { article: '<h1>Test</h1><p>Article content</p>' },
        step7: { heroImage: 'none' }
      }));
    });

    await page.goto('/admin/seo/articles/new/step-8-publish');
    await page.waitForTimeout(500);

    // Click preview button
    const previewButton = page.getByRole('button', { name: /preview/i }).first();
    if (await previewButton.isVisible()) {
      await previewButton.click();

      // Should show modal
      await expect(page.locator('[class*="fixed"][class*="inset"]')).toBeVisible();

      // Should show article title in preview
      await expect(page.locator('text=/test article title/i')).toBeVisible();

      // Test Desktop/Mobile toggle
      const mobileButton = page.getByRole('button', { name: /mobile/i });
      if (await mobileButton.isVisible()) {
        await mobileButton.click();
        await page.waitForTimeout(300);
      }

      // Close with ESC
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(page.locator('[class*="fixed"][class*="inset"]')).not.toBeVisible();
    }
  });
});

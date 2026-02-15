import { test, expect, type Locator, type Page } from '@playwright/test';

const mockResponses = {
  research: {
    success: true,
    version: {
      versionNumber: 1,
      decomposition: {
        mainTopic: 'How to Build a Next.js App',
        subtopics: ['Setup', 'Routing', 'Deployment'],
        questions: ['What is Next.js?', 'How to deploy?'],
        userIntent: 'Learn Next.js basics',
      },
      keywords: [
        { keyword: 'next.js tutorial', volume: 5000, difficulty: 45, relevance: 95 },
        { keyword: 'next.js app', volume: 3000, difficulty: 40, relevance: 90 },
      ],
      relatedLinks: [
        { title: 'Next.js Docs', url: 'https://nextjs.org', summary: 'Official docs' },
      ],
    },
  },
  framework: {
    success: true,
    framework: {
      introduction: 'Learn how to build modern web apps with Next.js.',
      sections: [
        {
          heading: 'Getting Started',
          keyPoints: ['Install Next.js', 'Create pages', 'Configure routing'],
          purpose: 'Setup basics',
        },
      ],
      conclusion: 'You now know Next.js basics!',
    },
  },
  article: {
    success: true,
    article:
      '<h1>How to Build a Next.js App</h1><p>Next.js is a powerful React framework.</p><h2>Getting Started</h2><p>First, install Next.js using npm.</p>',
  },
  revise: {
    success: true,
    revisedArticle:
      '<h1>How to Build a Next.js App</h1><p>Next.js is an <mark>incredible</mark> React framework.</p><h2>Getting Started</h2><p>First, install Next.js using npm <mark>or yarn</mark>.</p>',
    changeAnalysis: {
      totalChanges: 2,
      changesByType: { additions: 2 },
    },
  },
  humanize: {
    success: true,
    originalArticle: '<p>Next.js is a powerful React framework.</p>',
    humanizedArticle: '<p>Next.js is an incredible React framework that developers love.</p>',
    changes: [
      {
        id: 'sentence-0',
        type: 'modification',
        original: 'Next.js is a powerful React framework.',
        humanized: 'Next.js is an incredible React framework that developers love.',
        status: 'accepted',
      },
    ],
    changeSummary: [
      { type: 'tone', count: 1, example: 'More conversational', description: 'Added personality' },
    ],
  },
  analyzeSeo: {
    success: true,
    score: 85,
    maxScore: 150,
    checks: [
      {
        id: 'keyword-in-title',
        name: 'Keyword in Title',
        status: 'passed',
        score: 15,
        maxScore: 15,
        message: 'Main keyword found in title',
      },
    ],
    suggestions: [],
  },
  extractContentBlocks: {
    success: true,
    contentBlocks: [
      {
        id: 'callout-1',
        type: 'callout',
        content: 'Next.js is the future of React development!',
        position: 0,
        visible: true,
      },
    ],
  },
  generateImage: {
    success: true,
    imageData:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  },
  publish: {
    success: true,
    slug: 'how-to-build-nextjs-app',
    message: 'Article published successfully',
  },
};

async function setupApiMocks(page: Page) {
  await page.route('**/api/seo/research', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.research),
    });
  });

  await page.route('**/api/seo/generate-framework', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.framework),
    });
  });

  await page.route('**/api/seo/write-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.article),
    });
  });

  await page.route('**/api/seo/revise-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.revise),
    });
  });

  await page.route('**/api/seo/humanize-article', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.humanize),
    });
  });

  await page.route('**/api/seo/analyze-seo', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.analyzeSeo),
    });
  });

  await page.route('**/api/seo/extract-content-blocks', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.extractContentBlocks),
    });
  });

  await page.route('**/api/seo/generate-image', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.generateImage),
    });
  });

  await page.route('**/api/articles/publish', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResponses.publish),
    });
  });
}

async function setLocalStorage(page: Page, data: Record<string, unknown>) {
  await page.goto('/');
  await page.evaluate(payload => {
    localStorage.setItem('seo-article-data', JSON.stringify(payload));
  }, data);
}

async function optionalClick(locator: Locator) {
  if (await locator.count()) {
    const first = locator.first();
    if (await first.isVisible()) {
      await first.click();
    }
  }
}

async function spamClick(locator: Locator, times: number) {
  if (!(await locator.count())) {
    return;
  }
  const target = locator.first();
  if (!(await target.isVisible())) {
    return;
  }
  for (let i = 0; i < times; i += 1) {
    await target.click();
  }
}

async function optionalFill(locator: Locator, value: string) {
  if (await locator.count()) {
    const target = locator.first();
    if (await target.isVisible()) {
      await target.fill(value);
    }
  }
}

test.describe('Suzie Chaos QA - SEO Engine', () => {
  test('Step 1 chaos: Idea input', async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/admin/seo/articles/new/step-1-idea');
    await expect(page.locator('h1')).toContainText(/step 1|idea/i);

    const textarea = page.locator('textarea').first();
    await textarea.fill('My brilliant idea');

    const backLink = page.getByRole('link', { name: /back|previous/i });
    if (await backLink.isVisible()) {
      await backLink.click();
      await page.goto('/admin/seo/articles/new/step-1-idea');
    }

    await textarea.fill('A'.repeat(50000));
    await textarea.fill('🚀🔥💯');

    const continueButton = page.getByRole('button', { name: /continue|next/i });
    await textarea.fill('');
    await spamClick(continueButton, 10);

    await textarea.fill('<script>alert("x")</script><b>Idea</b>');
    await optionalClick(continueButton);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 2 chaos: Research', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, { step1: { ideaText: 'Test idea' } });

    await page.goto('/admin/seo/articles/new/step-2-research');
    await expect(page.locator('h1')).toContainText(/step 2|research/i);

    const startButton = page.getByRole('button', { name: /start research|research|decompose/i });
    await spamClick(startButton, 15);

    await optionalClick(startButton);
    await page.reload();

    await page.goto('/admin/seo/articles/new/step-1-idea');
    await page.goto('/admin/seo/articles/new/step-2-research');

    await optionalClick(startButton);
    await page.waitForTimeout(200);

    const editables = page.locator('textarea, [contenteditable="true"]');
    if (await editables.count()) {
      await editables.first().fill('Manually edited research');
    }

    const links = page.locator('a');
    if (await links.count()) {
      const href = await links.first().getAttribute('href');
      if (href && href.startsWith('/')) {
        await links.first().click();
        await page.goto('/admin/seo/articles/new/step-2-research');
      }
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 3 chaos: Framework', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
    });

    await page.goto('/admin/seo/articles/new/step-3-framework');
    await expect(page.locator('h1')).toContainText(/step 3|framework/i);

    await optionalClick(page.getByRole('button', { name: /generate framework/i }));
    await page.waitForTimeout(200);

    const deleteButtons = page.getByRole('button', { name: /delete.*section|remove.*section/i });
    const deleteCount = await deleteButtons.count();
    for (let i = 0; i < deleteCount; i += 1) {
      await deleteButtons.nth(i).click();
    }

    const addButton = page.getByRole('button', { name: /add section|add.*section/i });
    for (let i = 0; i < 50; i += 1) {
      if (!(await addButton.isVisible())) {
        break;
      }
      await addButton.click();
    }

    await optionalFill(page.locator('input[type="text"]'), '');
    await optionalFill(
      page.locator('textarea'),
      'Wikipedia: Next.js is a React framework for production.',
    );

    const moveButtons = page.locator(
      'button[aria-label*="move" i], button[aria-label*="up" i], button[aria-label*="down" i]',
    );
    if (await moveButtons.count()) {
      for (let i = 0; i < 100; i += 1) {
        await moveButtons.first().click();
      }
    }

    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 4 chaos: Writing', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
    });

    await page.goto('/admin/seo/articles/new/step-4-writing');
    await expect(page.locator('h1')).toContainText(/step 4|writing/i);

    await optionalClick(page.getByRole('button', { name: /write article|generate article/i }));
    await page.waitForTimeout(200);

    const originalButton = page.getByRole('button', { name: /original/i });
    const revisedButton = page.getByRole('button', { name: /revised/i });
    if ((await originalButton.count()) && (await revisedButton.count())) {
      for (let i = 0; i < 50; i += 1) {
        await originalButton.first().click();
        await revisedButton.first().click();
      }
    }

    await optionalClick(page.getByRole('button', { name: /revise|request revision/i }));
    await page.goto('/admin/seo/articles/new/step-3-framework');
    await page.goto('/admin/seo/articles/new/step-4-writing');

    const editor = page.locator('textarea, [contenteditable="true"]');
    if (await editor.count()) {
      await editor.first().fill('Editing while AI writes...');
      await editor.first().fill('');
    }

    await optionalClick(page.getByRole('button', { name: /save|continue|next/i }));

    const secondPage = await page.context().newPage();
    await setupApiMocks(secondPage);
    await setLocalStorage(secondPage, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
      step4: { article: '<p>Tab 1 content</p>' },
    });
    await secondPage.goto('/admin/seo/articles/new/step-4-writing');
    const secondEditor = secondPage.locator('textarea, [contenteditable="true"]');
    if (await secondEditor.count()) {
      await secondEditor.first().fill('Tab 2 edits');
    }
    await secondPage.close();

    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 5 chaos: Humanize', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
      step4: { article: mockResponses.article.article },
    });

    await page.goto('/admin/seo/articles/new/step-5-humanize');
    await expect(page.locator('h1')).toContainText(/step 5|humanize/i);

    await optionalClick(page.getByRole('button', { name: /humanize/i }).first());
    await page.waitForTimeout(200);

    const acceptButtons = page.getByRole('button', { name: /accept/i });
    const rejectButtons = page.getByRole('button', { name: /reject/i });
    const acceptCount = await acceptButtons.count();
    for (let i = 0; i < acceptCount; i += 1) {
      await acceptButtons.nth(i).click();
      if (i < (await rejectButtons.count())) {
        await rejectButtons.nth(i).click();
      }
    }

    await optionalClick(page.getByRole('button', { name: /accept all/i }));
    await optionalClick(page.getByRole('button', { name: /reject all/i }));
    await optionalClick(page.getByRole('button', { name: /accept all/i }));

    await optionalClick(page.getByRole('button', { name: /restore|revert|original/i }));
    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 6 chaos: Optimize', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: ['next.js tutorial'],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
      step4: { article: mockResponses.article.article },
    });

    await page.goto('/admin/seo/articles/new/step-6-optimize');
    await expect(page.locator('h1')).toContainText(/step 6|optimize|seo/i);

    await optionalClick(page.getByRole('button', { name: /analyze seo|run.*analysis/i }));
    await page.waitForTimeout(200);

    await optionalFill(page.locator('input[type="number"]'), '-5');
    await optionalFill(
      page.locator('textarea[placeholder*="description"], textarea'),
      'A'.repeat(10000),
    );
    await optionalFill(page.locator('input[type="text"]'), '!@#$%^&*()');
    await optionalFill(page.locator('input[type="text"]'), '');

    await optionalClick(page.getByRole('button', { name: /continue|next/i }));
    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 7 chaos: Styling & media', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
      step4: { article: mockResponses.article.article },
    });

    await page.goto('/admin/seo/articles/new/step-7-styling');
    await expect(page.locator('h1')).toContainText(/step 7|styling|media/i);

    const generateButtons = page.getByRole('button', { name: /generate.*image/i });
    const generateCount = await generateButtons.count();
    for (let i = 0; i < generateCount; i += 1) {
      await generateButtons.nth(i).click();
    }

    const deleteButtons = page.getByRole('button', { name: /delete.*image|remove.*image/i });
    if (await deleteButtons.count()) {
      await deleteButtons.first().click();
    }

    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.count()) {
      await fileInput.first().setInputFiles('/tmp/corrupt-image.png');
    }

    await optionalClick(generateButtons.first());
    await page.reload();

    await expect(page.locator('body')).toBeVisible();
  });

  test('Step 8 chaos: Publish', async ({ page }) => {
    await setupApiMocks(page);
    await setLocalStorage(page, {
      step1: { ideaText: 'Test idea' },
      step2: {
        versions: [mockResponses.research.version],
        activeVersion: 0,
        selectedKeywords: [],
        selectedLinks: [],
      },
      step3: { framework: mockResponses.framework.framework, title: 'Test Title' },
      step4: { article: mockResponses.article.article },
      step7: { heroImage: 'data:image/png;base64,abc' },
    });

    await page.goto('/admin/seo/articles/new/step-8-publish');
    await expect(page.locator('h1')).toContainText(/step 8|publish/i);

    await optionalFill(page.locator('textarea[placeholder*="description"], textarea'), '');

    const publishButton = page.getByRole('button', { name: /publish/i });
    await spamClick(publishButton, 20);

    await optionalClick(publishButton);
    await page.goto('/admin/seo');

    await page.goto('/admin/seo/articles/new/step-8-publish');
    await optionalClick(publishButton);

    const unpublishButton = page.getByRole('button', { name: /unpublish/i });
    await optionalClick(unpublishButton);

    await expect(page.locator('body')).toBeVisible();
  });
});

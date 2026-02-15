import { test, expect } from '@playwright/test';

/**
 * REAL VERIFICATION TEST
 *
 * This test actually navigates through the UI and reports real results
 */

test.describe('Real Manual Verification', () => {

  test('Step 1: Can we even load the page?', async ({ page }) => {
    console.log('\n🔍 TEST 1: Loading Step 1 page...');

    await page.goto('/admin/seo/articles/new/step-1-idea');

    // Take screenshot
    await page.screenshot({ path: 'test-results/step-1-loaded.png', fullPage: true });

    // Check if page loaded
    const pageContent = await page.content();
    console.log('✅ Page loaded. Length:', pageContent.length);

    // Look for textarea
    const textarea = page.locator('textarea');
    const textareaCount = await textarea.count();
    console.log('Textarea count:', textareaCount);

    if (textareaCount > 0) {
      console.log('✅ Found textarea');

      // Try to type in it
      await textarea.first().fill('Test idea: How to build a Next.js app');
      console.log('✅ Successfully typed in textarea');

      // Take screenshot
      await page.screenshot({ path: 'test-results/step-1-filled.png', fullPage: true });
    } else {
      console.log('❌ No textarea found');
    }

    // Look for continue button
    const continueButton = page.getByRole('button', { name: /continue|next/i });
    const buttonCount = await continueButton.count();
    console.log('Continue button count:', buttonCount);

    if (buttonCount > 0) {
      console.log('✅ Found continue button');
    } else {
      console.log('❌ No continue button found');
    }
  });

  test('Step 2: Can we navigate and does research page load?', async ({ page }) => {
    console.log('\n🔍 TEST 2: Testing Step 2 navigation...');

    // Setup Step 1 data
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: {
          ideaText: 'How to build a Next.js app for beginners',
          timestamp: new Date().toISOString()
        }
      }));
    });

    // Navigate to Step 2
    await page.goto('/admin/seo/articles/new/step-2-research');
    await page.screenshot({ path: 'test-results/step-2-loaded.png', fullPage: true });

    // Check for research button
    const researchButton = page.getByRole('button', { name: /research|start|decompose/i });
    const buttonCount = await researchButton.count();
    console.log('Research button count:', buttonCount);

    if (buttonCount > 0) {
      console.log('✅ Found research button');
    } else {
      console.log('❌ No research button found');
    }
  });

  test('Step 3: Check framework page with saved data', async ({ page }) => {
    console.log('\n🔍 TEST 3: Testing Step 3 with saved framework...');

    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: {
          versions: [{ decomposition: { mainTopic: 'Test Topic' } }],
          activeVersion: 0,
          selectedKeywords: [],
          selectedLinks: []
        },
        step3: {
          framework: {
            introduction: 'Test introduction text',
            sections: [{ heading: 'Test Section', keyPoints: ['Point 1'], purpose: 'Test' }],
            conclusion: 'Test conclusion'
          },
          title: 'Test Framework Title'
        }
      }));
    });

    await page.goto('/admin/seo/articles/new/step-3-framework');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/step-3-loaded.png', fullPage: true });

    // Check if framework text appears
    const pageText = await page.textContent('body');

    if (pageText?.includes('Test introduction') || pageText?.includes('Test Section')) {
      console.log('✅ Framework loaded from localStorage');
    } else {
      console.log('❌ Framework NOT loaded from localStorage');
      console.log('Page text preview:', pageText?.substring(0, 500));
    }
  });

  test('Frontend: Check if articles page loads', async ({ page }) => {
    console.log('\n🔍 TEST 4: Testing frontend articles page...');

    await page.goto('/articles');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/articles-page.png', fullPage: true });

    const pageText = await page.textContent('body');
    console.log('Articles page loaded, text length:', pageText?.length);

    // Check for "No articles" or article list
    if (pageText?.includes('No articles') || pageText?.includes('article')) {
      console.log('✅ Articles page loaded correctly');
    } else {
      console.log('⚠️ Articles page content unclear');
    }
  });

  test('Admin Dashboard: Check if it loads', async ({ page }) => {
    console.log('\n🔍 TEST 5: Testing admin dashboard...');

    await page.goto('/admin/seo');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/admin-seo.png', fullPage: true });

    const pageText = await page.textContent('body');

    if (pageText?.includes('SEO') || pageText?.includes('Articles') || pageText?.includes('Dashboard')) {
      console.log('✅ Admin dashboard loaded');
    } else {
      console.log('❌ Admin dashboard not loaded properly');
    }
  });

  test('localStorage: Check data structure', async ({ page }) => {
    console.log('\n🔍 TEST 6: Checking localStorage structure...');

    await page.goto('/');

    // Add test data
    await page.evaluate(() => {
      localStorage.setItem('seo-article-data', JSON.stringify({
        step1: { ideaText: 'Test' },
        step2: { versions: [] },
        step3: { framework: {}, title: 'Test' },
        step4: { article: '<p>Test</p>' }
      }));

      localStorage.setItem('seo-published-articles', JSON.stringify([
        {
          id: '1',
          title: 'Test Article',
          slug: 'test-article',
          status: 'published'
        }
      ]));
    });

    // Verify it was saved
    const data = await page.evaluate(() => {
      return {
        articleData: localStorage.getItem('seo-article-data'),
        publishedArticles: localStorage.getItem('seo-published-articles')
      };
    });

    if (data.articleData && data.publishedArticles) {
      console.log('✅ localStorage working correctly');
      console.log('Article data length:', data.articleData.length);
      console.log('Published articles:', JSON.parse(data.publishedArticles).length);
    } else {
      console.log('❌ localStorage not working');
    }
  });

  test('REAL TEST: Try to complete Step 1 -> Step 2', async ({ page }) => {
    console.log('\n🔍 TEST 7: Real user flow Step 1 -> Step 2...');

    // Clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Go to Step 1
    await page.goto('/admin/seo/articles/new/step-1-idea');
    await page.waitForTimeout(1000);

    // Find and fill textarea
    const textareas = page.locator('textarea');
    const count = await textareas.count();
    console.log('Found', count, 'textareas');

    if (count > 0) {
      await textareas.first().fill('How to build a modern Next.js application');
      console.log('✅ Filled idea textarea');

      await page.screenshot({ path: 'test-results/step-1-ready-to-continue.png', fullPage: true });

      // Try to find and click continue button
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      console.log('Found', buttonCount, 'buttons on page');

      // Try to click a button that might be "Continue"
      const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next")');
      const continueBtnCount = await continueBtn.count();

      if (continueBtnCount > 0) {
        console.log('✅ Found continue button, clicking...');
        await continueBtn.first().click();
        await page.waitForTimeout(2000);

        const currentUrl = page.url();
        console.log('Current URL after click:', currentUrl);

        if (currentUrl.includes('step-2')) {
          console.log('✅✅✅ SUCCESS: Navigated to Step 2!');
        } else {
          console.log('❌ Did not navigate to Step 2. URL:', currentUrl);
        }

        await page.screenshot({ path: 'test-results/after-continue-click.png', fullPage: true });
      } else {
        console.log('❌ No continue button found');

        // List all button texts
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          const btnText = await buttons.nth(i).textContent();
          console.log(`  Button ${i}: "${btnText}"`);
        }
      }
    } else {
      console.log('❌ No textarea found');
    }
  });
});

# SEO Engine Testing Guide

## Overview

This directory contains comprehensive Playwright tests for the SEO Engine application.

## Test Suites

### 1. `seo-engine-complete-flow.spec.ts`
**Complete E2E flow testing with mocked APIs**

- Tests all 8 steps of the SEO Engine
- Mocks API responses to avoid hitting real APIs
- Verifies UI/UX interactions
- Tests localStorage persistence
- Validates frontend article display
- Tests critical bug fixes
- Fast execution (~2-3 minutes)

**What it tests:**
- ✅ Step 1: Idea input
- ✅ Step 2: Research & decomposition
- ✅ Step 3: Framework generation (with bug fix verification)
- ✅ Step 4: Article writing (with revision save bug fix)
- ✅ Step 5: Humanization (sentence-level tracking)
- ✅ Step 6: SEO optimization
- ✅ Step 7: Styling & images
- ✅ Step 8: Publishing (with preview modal)
- ✅ Frontend: Article display
- ✅ Admin: Dashboard display
- ✅ Voice input components
- ✅ Navigation between steps
- ✅ localStorage data integrity

### 2. `seo-api-validation.spec.ts`
**Real API endpoint validation**

- Tests actual API endpoints (hits real APIs!)
- Validates response structure
- Tests error handling
- Measures API performance
- Slow and expensive (requires API keys)

**What it tests:**
- ✅ POST /api/seo/research
- ✅ POST /api/seo/generate-framework
- ✅ POST /api/seo/write-article
- ✅ POST /api/seo/revise-article
- ✅ POST /api/seo/humanize-article
- ✅ POST /api/seo/analyze-seo
- ✅ POST /api/seo/extract-content-blocks
- ✅ POST /api/seo/generate-image
- ✅ POST /api/articles/publish
- ✅ Error handling (400, 500 errors)
- ✅ Performance benchmarks

## Running Tests

### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Ensure dev server is running:**
   ```bash
   npm run dev
   ```
   (Or let Playwright start it automatically)

### Run All Tests (Mocked APIs)

```bash
# Run E2E flow tests with mocked APIs (FAST)
npx playwright test seo-engine-complete-flow.spec.ts
```

### Run API Validation Tests (Real APIs)

```bash
# Run API validation tests (SLOW, hits real APIs)
npx playwright test seo-api-validation.spec.ts
```

**WARNING**: API validation tests hit real APIs and will:
- Use your API credits (Grok, Claude, Gemini, OpenAI)
- Take 5-10 minutes to complete
- Require all API keys in .env.local

To skip API tests:
```bash
SKIP_API_TESTS=true npx playwright test
```

### Run Specific Test

```bash
# Run a specific test by name
npx playwright test -g "Complete flow: Steps 1-8"

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests in UI mode (interactive)
npx playwright test --ui
```

### Run All Tests

```bash
# Run all tests (including API validation)
npx playwright test

# Run all tests except API validation
SKIP_API_TESTS=true npx playwright test
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests (mocked APIs only)
        run: npx playwright test seo-engine-complete-flow.spec.ts
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results (pass/fail)
- Screenshots of failures
- Video recordings (if enabled)
- Trace files for debugging

## Writing New Tests

### Example: Test a new feature

```typescript
import { test, expect } from '@playwright/test';

test('New feature: Description', async ({ page }) => {
  // Setup
  await page.goto('/admin/seo/articles/new/step-1-idea');

  // Action
  await page.getByRole('button', { name: /new feature/i }).click();

  // Assert
  await expect(page.locator('text=/expected result/i')).toBeVisible();
});
```

### Best Practices

1. **Use descriptive test names**
   ```typescript
   test('Step 5: Accept button marks change as accepted', async ({ page }) => {
     // Test code
   });
   ```

2. **Use test.step() for clarity**
   ```typescript
   test('Complete flow', async ({ page }) => {
     await test.step('Setup data', async () => {
       // Setup code
     });

     await test.step('Perform action', async () => {
       // Action code
     });
   });
   ```

3. **Mock expensive operations**
   ```typescript
   await page.route('**/api/expensive-operation', async route => {
     await route.fulfill({
       status: 200,
       body: JSON.stringify({ success: true })
     });
   });
   ```

4. **Clean up localStorage**
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.goto('/');
     await page.evaluate(() => localStorage.clear());
   });
   ```

5. **Use data-testid for reliable selectors**
   ```tsx
   // Component
   <button data-testid="publish-button">Publish</button>

   // Test
   await page.getByTestId('publish-button').click();
   ```

## Debugging Failed Tests

### 1. Run in headed mode
```bash
npx playwright test --headed
```

### 2. Run in debug mode
```bash
npx playwright test --debug
```

### 3. View trace
```bash
npx playwright show-trace trace.zip
```

### 4. Take screenshots on failure
Add to playwright.config.ts:
```typescript
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

## Coverage

### Current Test Coverage

- ✅ **Steps 1-8**: Complete flow tested
- ✅ **localStorage**: Persistence verified
- ✅ **Frontend**: Article display verified
- ✅ **Admin**: Dashboard verified
- ✅ **Bug Fixes**: Critical bugs verified fixed
- ✅ **Components**: Voice input, preview modal, SEO checks
- ✅ **Navigation**: Step transitions verified
- ✅ **APIs**: All endpoints validated (optional)

### Coverage Gaps (Future)

- ⚠️ Voice recording (requires microphone permissions)
- ⚠️ Image upload (file input testing)
- ⚠️ Error recovery (network failures, API errors)
- ⚠️ Mobile responsiveness (viewport testing)
- ⚠️ Accessibility (ARIA, keyboard navigation)
- ⚠️ Performance (Lighthouse scores)

## Troubleshooting

### Test failing: "localStorage is not defined"

**Solution**: Ensure you're navigating to a page before accessing localStorage:
```typescript
await page.goto('/');
await page.evaluate(() => localStorage.clear());
```

### Test failing: "Timeout waiting for selector"

**Solution**: Increase timeout or use waitFor:
```typescript
await page.waitForSelector('text=/expected/i', { timeout: 10000 });
```

### Test failing: "API key not found"

**Solution**: Ensure .env.local has all required API keys:
```bash
ANTHROPIC_API_KEY=...
GROK_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
OPENAI_API_KEY=...
```

### Test failing: "Port 262 already in use"

**Solution**: Stop existing dev server or configure Playwright to reuse:
```typescript
webServer: {
  reuseExistingServer: true,
}
```

## Performance Benchmarks

### Expected Test Execution Times

| Test Suite | Duration | Cost |
|-----------|----------|------|
| Complete E2E (mocked) | 2-3 min | Free |
| API Validation | 5-10 min | ~$0.50 |
| Single test | 10-30 sec | Free |
| Complete suite | 7-13 min | ~$0.50 |

### Optimization Tips

1. Run mocked tests in CI/CD
2. Run API tests only on release branches
3. Use parallel execution where possible
4. Mock expensive API calls
5. Skip API tests with `SKIP_API_TESTS=true`

---

## Quick Reference

```bash
# Fast: Run E2E with mocked APIs
npx playwright test seo-engine-complete-flow.spec.ts

# Slow: Run API validation (real APIs)
npx playwright test seo-api-validation.spec.ts

# Debug specific test
npx playwright test --debug -g "Step 5"

# View last report
npx playwright show-report

# Run in UI mode
npx playwright test --ui
```

---

**Built with Playwright v1.x**
**Tests cover: Steps 1-8, Frontend, Admin, APIs, Bug Fixes**
**Status: ✅ Ready for Production**

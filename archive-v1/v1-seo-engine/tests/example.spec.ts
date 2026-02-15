import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // We'll update this once we know the actual title, but checking for response is a good start.
    await expect(page).toHaveTitle(/StepTen/i);
});

test('get started link', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads by looking for a common element, e.g., main or body
    await expect(page.locator('body')).toBeVisible();
});

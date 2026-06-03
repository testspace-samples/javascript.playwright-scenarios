const { test, expect } = require('@playwright/test');

test('hello world smoke test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
});
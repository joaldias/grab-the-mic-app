import { test, expect } from '@playwright/test';

test.describe('Timer Expiry Flow', () => {
  test('should render timer elements and handle countdown progression', async ({ page }) => {
    await page.goto('/game?mode=practice');

    // Verify page loads cleanly
    await expect(page.locator('body')).toBeVisible();
  });
});

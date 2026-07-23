import { test, expect } from '@playwright/test';

test.describe('Room Creation Flow', () => {
  test('should display home page with Grab The Mic title and game mode options', async ({ page }) => {
    await page.goto('/');

    // Verify main title
    await expect(page.locator('h1')).toContainText('GRAB THE MIC');

    // Verify mode buttons exist
    await expect(page.getByText('Pass The Phone')).toBeVisible();
    await expect(page.getByText('Practice Mode')).toBeVisible();
  });

  test('should navigate to Pass The Phone game board', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Pass The Phone').click();

    await expect(page).toHaveURL(/\/game/);
  });
});

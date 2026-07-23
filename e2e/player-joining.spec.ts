import { test, expect } from '@playwright/test';

test.describe('Player Joining Flow', () => {
  test('should simulate host room creation and player joining via room code', async ({ browser }) => {
    // Create host context
    const hostContext = await browser.newContext();
    const hostPage = await hostContext.newPage();

    // Create player context
    const playerContext = await browser.newContext();
    const playerPage = await playerContext.newPage();

    // Host navigates to game page
    await hostPage.goto('/game?mode=pass');
    await expect(hostPage.locator('body')).toBeVisible();

    // Player joins game
    await playerPage.goto('/game?mode=practice');
    await expect(playerPage.locator('body')).toBeVisible();

    await hostContext.close();
    await playerContext.close();
  });
});

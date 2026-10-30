import { test, expect } from '@playwright/test';

/**
 * Navigations that arrive while a page transition is running are queued.
 * They must run one after another, so the outlet settles on the page for
 * the last navigation only.
 */
test.describe('Overlapping navigations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/overlapping-navigations/0');
  });

  test('should leave only the last page visible', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31650',
    });

    await page.locator('#navigate').click();

    await expect(page).toHaveURL(/\/standalone\/overlapping-navigations\/6$/);
    // Wait for every queued transition to finish before checking the pages.
    await page.waitForTimeout(3000);

    const visiblePages = page.locator('#overlapping-outlet > .ion-page:not(.ion-page-hidden)');
    await expect(visiblePages).toHaveCount(1);
    await expect(visiblePages.locator('.page-id')).toHaveText('6');
  });
});

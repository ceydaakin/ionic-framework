import { expect, test } from '@playwright/test';
import { ionSwipeToGoBack } from '../../utils/drag-utils';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist } from '../../utils/test-utils';

test.describe('Swipe Back Race', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/swipe-back-race?ionic:mode=ios');
  });

  test('should not throw when the stack is popped between pointer down and swipe start', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31291',
    });

    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));

    await ionPageVisible(page, 'app-swipe-back-race-main');

    await page.locator('#swipe-back-race-details').click();
    await ionPageVisible(page, 'app-swipe-back-race-details');
    await ionPageHidden(page, 'app-swipe-back-race-main');

    const viewport = page.viewportSize()!;
    const y = viewport.height / 2;

    // The swipe gesture checks whether it can go back on pointer down.
    await page.mouse.move(5, y);
    await page.mouse.down();

    // Pop the stack before the swipe moves far enough to start.
    await page.locator('#nav-back').dispatchEvent('click');
    await ionPageVisible(page, 'app-swipe-back-race-main');
    await ionPageDoesNotExist(page, 'app-swipe-back-race-details');

    // Moving past the threshold starts the swipe on a stack with a single view.
    await page.mouse.move(65, y, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    expect(errors).toEqual([]);
    await ionPageVisible(page, 'app-swipe-back-race-main');

    // The swipe gesture should still work afterwards.
    await page.locator('#swipe-back-race-details').click();
    await ionPageVisible(page, 'app-swipe-back-race-details');
    await ionPageHidden(page, 'app-swipe-back-race-main');

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-swipe-back-race-main');
    await ionPageDoesNotExist(page, 'app-swipe-back-race-details');
  });
});

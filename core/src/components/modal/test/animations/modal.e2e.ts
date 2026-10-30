import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('modal: animations'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setContent(
        `
        <ion-modal is-open="true" trigger="open-modal"></ion-modal>
      `,
        config
      );
    });
    test('card modal should clean up animations on dismiss', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28352',
      });

      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      const modal = page.locator('ion-modal');

      const initialAnimations = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.shadowRoot!.getAnimations();
      });

      // While the modal is open, it should have animations
      expect(initialAnimations.length).toBeGreaterThan(0);

      await modal.evaluate((el: HTMLIonModalElement) => {
        el.dismiss();
      });

      await ionModalDidDismiss.next();

      const currentAnimations = await modal.evaluate((el: HTMLIonModalElement) => {
        return el.shadowRoot!.getAnimations();
      });

      // Once the modal has finished closing, there should be no animations
      expect(currentAnimations.length).toBe(0);
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ config, title }) => {
  test.describe(title('modal: animations after present'), () => {
    test('should not keep an opacity animation on the wrapper after presenting', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31603',
      });

      await page.setContent(
        `
        <ion-modal>
          <div class="ion-page">Content</div>
        </ion-modal>
      `,
        config
      );

      const modal = page.locator('ion-modal');

      await modal.evaluate((el: HTMLIonModalElement) => el.present());

      const wrapper = modal.locator('.modal-wrapper');

      /**
       * Chromium treats an element with an applied opacity
       * animation as a backdrop root, so backdrop-filter
       * inside the modal could only see the modal's own content.
       */
      const opacityAnimations = await wrapper.evaluate((el: HTMLElement) => {
        return el.getAnimations().filter((ani) => {
          const effect = ani.effect as KeyframeEffect;
          return effect.getKeyframes().some((keyframe) => keyframe.opacity !== undefined);
        }).length;
      });

      expect(opacityAnimations).toBe(0);
      await expect(wrapper).toHaveCSS('opacity', '1');
    });

    test('should not keep an opacity animation on the sheet wrapper after presenting', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/31603',
      });

      await page.setContent(
        `
        <ion-modal initial-breakpoint="0.5">
          <div class="ion-page">Content</div>
        </ion-modal>
      `,
        config
      );

      const modal = page.locator('ion-modal');

      await modal.evaluate((el: HTMLIonModalElement) => {
        el.breakpoints = [0, 0.5, 1];
        return el.present();
      });

      const wrapper = modal.locator('.modal-wrapper');

      const opacityAnimations = await wrapper.evaluate((el: HTMLElement) => {
        return el.getAnimations().filter((ani) => {
          const effect = ani.effect as KeyframeEffect;
          return effect.getKeyframes().some((keyframe) => keyframe.opacity !== undefined);
        }).length;
      });

      expect(opacityAnimations).toBe(0);
      await expect(wrapper).toHaveCSS('opacity', '1');
    });
  });
});

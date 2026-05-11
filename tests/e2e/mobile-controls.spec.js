import { test, expect } from '@playwright/test';
import { gotoAndWait } from './helpers.js';

const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36';

test.use({
  viewport: { width: 412, height: 915 },
  userAgent: ANDROID_UA,
});

async function mockWindowOpen(page) {
  await page.evaluate(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(url);
      return { location: '' };
    };
  });
}

async function simulateCollisionStart(page, markerId) {
  await page.evaluate((id) => {
    document.querySelector('#shadow').dispatchEvent(
      new CustomEvent('obbcollisionstarted', {
        detail: { withEl: { id } },
      })
    );
  }, markerId);
}

test.describe('Mobile controls — touch input', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('touchstart on arrow-up-key sets rotateUp flag', async ({ page }) => {
    await page.dispatchEvent('#arrow-up-key', 'touchstart', {});
    const rotateUp = await page.evaluate(() => window.__vrState.rotateUp);
    expect(rotateUp).toBe(true);
    await page.dispatchEvent('#arrow-up-key', 'touchend', {});
  });

  test('touchend on arrow-up-key clears rotateUp flag', async ({ page }) => {
    await page.dispatchEvent('#arrow-up-key', 'touchstart', {});
    await page.dispatchEvent('#arrow-up-key', 'touchend', {});
    const rotateUp = await page.evaluate(() => window.__vrState.rotateUp);
    expect(rotateUp).toBe(false);
  });

  test('touching up arrow changes plane rotation', async ({ page }) => {
    await page.dispatchEvent('#arrow-up-key', 'touchstart', {});
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.x < 0;
    }, { timeout: 5000 });
    await page.dispatchEvent('#arrow-up-key', 'touchend', {});
    const rot = await page.evaluate(() => {
      const r = document.querySelector('#plane').getAttribute('rotation');
      return { x: r.x, y: r.y, z: r.z };
    });
    expect(rot.x).toBeLessThan(0);
  });

  test('contextmenu event on arrow keys is prevented', async ({ page }) => {
    const prevented = await page.evaluate(() => {
      const img = document.querySelector('#arrow-up-key');
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      img.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(prevented).toBe(true);
  });

  test('enter-key mousedown with active nav_link opens URL', async ({ page }) => {
    await mockWindowOpen(page);
    await simulateCollisionStart(page, 'github-nav');
    await page.dispatchEvent('#enter-key', 'mousedown', {});
    const urls = await page.evaluate(() => window.__openedUrls);
    expect(urls[0]).toBe('https://github.com/aslansutu');
  });
});

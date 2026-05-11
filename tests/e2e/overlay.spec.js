import { test, expect } from '@playwright/test';
import { routeAframeCDN } from './helpers.js';

const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

async function loadPage(page) {
  await routeAframeCDN(page);
  await page.goto('/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(300);
}

test.describe('Overlay — desktop viewport', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await loadPage(page);
  });

  test('mobile-controls is hidden', async ({ page }) => {
    const display = await page.evaluate(() =>
      window.getComputedStyle(document.getElementById('mobile-controls')).display
    );
    expect(display).toBe('none');
  });

  test('overlay is hidden', async ({ page }) => {
    const display = await page.evaluate(() =>
      window.getComputedStyle(document.getElementById('overlay')).display
    );
    expect(display).toBe('none');
  });
});

test.describe('Overlay — mobile portrait', () => {
  test.use({
    viewport: { width: 393, height: 852 },
    userAgent: IPHONE_UA,
  });

  test.beforeEach(async ({ page }) => {
    await loadPage(page);
  });

  test('mobile-controls is visible in portrait', async ({ page }) => {
    const display = await page.evaluate(() =>
      document.getElementById('mobile-controls').style.display
    );
    expect(display).toBe('block');
  });

  test('portrait orientation overlay is shown', async ({ page }) => {
    const display = await page.evaluate(() =>
      document.getElementById('overlay').style.display
    );
    expect(display).toBe('block');
  });
});

test.describe('Overlay — mobile landscape', () => {
  test.use({
    viewport: { width: 852, height: 393 },
    userAgent: IPHONE_UA,
  });

  test.beforeEach(async ({ page }) => {
    await loadPage(page);
  });

  test('mobile-controls is visible in landscape', async ({ page }) => {
    const display = await page.evaluate(() =>
      document.getElementById('mobile-controls').style.display
    );
    expect(display).toBe('block');
  });

  test('landscape orientation overlay is hidden', async ({ page }) => {
    const display = await page.evaluate(() =>
      document.getElementById('overlay').style.display
    );
    expect(display).toBe('none');
  });
});

test.describe('Overlay — resize behavior', () => {
  test.use({
    viewport: { width: 393, height: 852 },
    userAgent: IPHONE_UA,
  });

  test('resizing from landscape to portrait shows overlay', async ({ page }) => {
    await page.setViewportSize({ width: 852, height: 393 });
    await loadPage(page);

    let display = await page.evaluate(() => document.getElementById('overlay').style.display);
    expect(display).toBe('none');

    await page.setViewportSize({ width: 393, height: 852 });
    await page.waitForTimeout(200);

    display = await page.evaluate(() => document.getElementById('overlay').style.display);
    expect(display).toBe('block');
  });

  test('resizing from portrait to landscape hides overlay', async ({ page }) => {
    await loadPage(page);

    let display = await page.evaluate(() => document.getElementById('overlay').style.display);
    expect(display).toBe('block');

    await page.setViewportSize({ width: 852, height: 393 });
    await page.waitForTimeout(200);

    display = await page.evaluate(() => document.getElementById('overlay').style.display);
    expect(display).toBe('none');
  });
});

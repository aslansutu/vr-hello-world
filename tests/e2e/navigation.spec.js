import { test, expect } from '@playwright/test';
import { gotoAndWait } from './helpers.js';

async function mockWindowOpen(page) {
  await page.evaluate(() => {
    window.__openedUrls = [];
    window.open = (url) => {
      window.__openedUrls.push(url);
      return { location: '' };
    };
  });
}

async function getOpenedUrls(page) {
  return page.evaluate(() => window.__openedUrls);
}

test.describe('Navigation — collision and link opening', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
    // Clear any collision state the OBB system may have fired during scene init
    await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionended', { detail: {} })
      );
    });
    await mockWindowOpen(page);
  });

  // Reset nav_link and fire Enter in the same JS execution so no OBB rAF tick
  // can slip in between and set nav_link before the key press.
  test('Enter key with no active collision does not open a URL', async ({ page }) => {
    const opened = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionended', { detail: {} })
      );
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      return window.__openedUrls.length;
    });
    expect(opened).toBe(0);
  });

  test('Space key with no active collision does not open a URL', async ({ page }) => {
    const opened = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionended', { detail: {} })
      );
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      return window.__openedUrls.length;
    });
    expect(opened).toBe(0);
  });

  // Dispatch collision and read navLink atomically to avoid the A-Frame OBB system
  // firing obbcollisionended between the two separate page.evaluate calls.
  test('linkedin collision sets nav_link to LinkedIn URL', async ({ page }) => {
    const navLink = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'linkedin-nav' } } })
      );
      return window.__vrState.navLink;
    });
    expect(navLink).toBe('https://www.linkedin.com/in/atakan-onol-547427160/');
  });

  test('github collision sets nav_link to GitHub URL', async ({ page }) => {
    const navLink = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'github-nav' } } })
      );
      return window.__vrState.navLink;
    });
    expect(navLink).toBe('https://github.com/aslansutu');
  });

  test('blog collision sets nav_link to blog URL', async ({ page }) => {
    const navLink = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'blog-nav' } } })
      );
      return window.__vrState.navLink;
    });
    expect(navLink).toBe('https://blog.atakanonol.dev');
  });

  test('collision end clears nav_link to null', async ({ page }) => {
    const navLink = await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'linkedin-nav' } } })
      );
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionended', { detail: {} })
      );
      return window.__vrState.navLink;
    });
    expect(navLink).toBeNull();
  });

  // Dispatch collision start + synthetic keydown atomically so OBB can't clear
  // nav_link between the dispatch and the key press.
  test('Enter during linkedin collision opens LinkedIn URL', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'linkedin-nav' } } })
      );
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    const urls = await getOpenedUrls(page);
    expect(urls[0]).toBe('https://www.linkedin.com/in/atakan-onol-547427160/');
  });

  test('Space during github collision opens GitHub URL', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'github-nav' } } })
      );
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    });
    const urls = await getOpenedUrls(page);
    expect(urls[0]).toBe('https://github.com/aslansutu');
  });

  test('Enter after collision end does not open a URL', async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionstarted', { detail: { withEl: { id: 'blog-nav' } } })
      );
      document.querySelector('#shadow').dispatchEvent(
        new CustomEvent('obbcollisionended', { detail: {} })
      );
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(0);
  });
});

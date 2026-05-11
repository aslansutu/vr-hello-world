import { test, expect } from '@playwright/test';
import { gotoAndWait, getEntityRotation } from './helpers.js';

test.describe('Rotation — keyboard input moves the plane', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndWait(page);
  });

  test('page loads without JavaScript errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    // Re-navigate to capture errors from fresh load
    await page.reload();
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('#plane entity exists with initial rotation 0 0 0', async ({ page }) => {
    const rot = await getEntityRotation(page, '#plane');
    expect(rot).not.toBeNull();
    expect(rot.x).toBeCloseTo(0);
    expect(rot.y).toBeCloseTo(0);
    expect(rot.z).toBeCloseTo(0);
  });

  test('#earth entity exists with initial rotation 0 0 0', async ({ page }) => {
    const rot = await getEntityRotation(page, '#earth');
    expect(rot).not.toBeNull();
    expect(rot.x).toBeCloseTo(0);
    expect(rot.y).toBeCloseTo(0);
    expect(rot.z).toBeCloseTo(0);
  });

  test('ArrowUp key decrements plane rotation.x', async ({ page }) => {
    await page.keyboard.down('ArrowUp');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.x < 0;
    }, { timeout: 5000 });
    await page.keyboard.up('ArrowUp');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.x).toBeLessThan(0);
  });

  test('ArrowDown key increments plane rotation.x', async ({ page }) => {
    await page.keyboard.down('ArrowDown');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.x > 0;
    }, { timeout: 5000 });
    await page.keyboard.up('ArrowDown');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.x).toBeGreaterThan(0);
  });

  test('ArrowLeft key decrements plane rotation.y', async ({ page }) => {
    await page.keyboard.down('ArrowLeft');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y < 0;
    }, { timeout: 5000 });
    await page.keyboard.up('ArrowLeft');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.y).toBeLessThan(0);
  });

  test('ArrowRight key increments plane rotation.y', async ({ page }) => {
    await page.keyboard.down('ArrowRight');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y > 0;
    }, { timeout: 5000 });
    await page.keyboard.up('ArrowRight');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.y).toBeGreaterThan(0);
  });

  test('w key moves plane same direction as ArrowUp', async ({ page }) => {
    await page.keyboard.down('w');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.x < 0;
    }, { timeout: 5000 });
    await page.keyboard.up('w');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.x).toBeLessThan(0);
  });

  test('s key moves plane same direction as ArrowDown', async ({ page }) => {
    await page.keyboard.down('s');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.x > 0;
    }, { timeout: 5000 });
    await page.keyboard.up('s');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.x).toBeGreaterThan(0);
  });

  test('a key moves plane same direction as ArrowLeft', async ({ page }) => {
    await page.keyboard.down('a');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y < 0;
    }, { timeout: 5000 });
    await page.keyboard.up('a');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.y).toBeLessThan(0);
  });

  test('d key moves plane same direction as ArrowRight', async ({ page }) => {
    await page.keyboard.down('d');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y > 0;
    }, { timeout: 5000 });
    await page.keyboard.up('d');
    const rot = await getEntityRotation(page, '#plane');
    expect(rot.y).toBeGreaterThan(0);
  });

  test('holding ArrowUp clamps plane.x at -10 and redirects to earth rotation', async ({ page }) => {
    await page.keyboard.down('ArrowUp');
    // Wait for plane to be clamped AND earth to have started rotating
    await page.waitForFunction(
      () => {
        const pr = document.querySelector('#plane')?.getAttribute('rotation');
        const er = document.querySelector('#earth')?.getAttribute('rotation');
        return pr && er && pr.x < -9.9 && er.x > 0;
      },
      null,
      { timeout: 15000 }
    );
    await page.keyboard.up('ArrowUp');

    const planeRot = await getEntityRotation(page, '#plane');
    const earthRot = await getEntityRotation(page, '#earth');
    expect(planeRot.x).toBeCloseTo(-10, 0);
    expect(earthRot.x).toBeGreaterThan(0);
  });

  test('holding ArrowDown clamps plane.x at 60 and redirects to earth rotation', async ({ page }) => {
    await page.keyboard.down('ArrowDown');
    // A-Frame's DEG2RAD/RAD2DEG roundtrip causes x to saturate at ~59.999 rather than
    // exactly 60, so use a tolerance-aware threshold and wait for earth to also move.
    await page.waitForFunction(
      () => {
        const pr = document.querySelector('#plane')?.getAttribute('rotation');
        const er = document.querySelector('#earth')?.getAttribute('rotation');
        return pr && er && pr.x > 59.9 && er.x < 0;
      },
      null,
      { timeout: 25000 }
    );
    await page.keyboard.up('ArrowDown');

    const planeRot = await getEntityRotation(page, '#plane');
    const earthRot = await getEntityRotation(page, '#earth');
    expect(planeRot.x).toBeCloseTo(60, 0);
    expect(earthRot.x).toBeLessThan(0);
  });

  test('holding ArrowRight clamps plane.y at 40 and redirects to earth rotation', async ({ page }) => {
    await page.keyboard.down('ArrowRight');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y >= 40;
    }, { timeout: 10000 });
    await page.keyboard.up('ArrowRight');

    const planeRot = await getEntityRotation(page, '#plane');
    const earthRot = await getEntityRotation(page, '#earth');
    expect(planeRot.y).toBeCloseTo(40);
    expect(earthRot.y).toBeLessThan(0);
  });

  test('holding ArrowLeft clamps plane.y at -40 and redirects to earth rotation', async ({ page }) => {
    await page.keyboard.down('ArrowLeft');
    await page.waitForFunction(() => {
      const plane = document.querySelector('#plane');
      const r = plane && plane.getAttribute('rotation');
      return r && r.y <= -40;
    }, { timeout: 10000 });
    await page.keyboard.up('ArrowLeft');

    const planeRot = await getEntityRotation(page, '#plane');
    const earthRot = await getEntityRotation(page, '#earth');
    expect(planeRot.y).toBeCloseTo(-40);
    expect(earthRot.y).toBeGreaterThan(0);
  });

  test('releasing a key stops rotation', async ({ page }) => {
    // Move until partway
    await page.keyboard.down('ArrowUp');
    await page.waitForFunction(() => {
      const r = document.querySelector('#plane')?.getAttribute('rotation');
      return r && r.x < -3;
    }, { timeout: 5000 });
    await page.keyboard.up('ArrowUp');

    // Record position
    const before = await getEntityRotation(page, '#plane');
    await page.waitForTimeout(300);
    const after = await getEntityRotation(page, '#plane');

    expect(after.x).toBeCloseTo(before.x, 0);
  });
});

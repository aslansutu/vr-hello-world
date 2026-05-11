import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AFRAME_LOCAL = path.join(__dirname, '../../js/aframe.min.js');

/** Intercept the A-Frame CDN request and serve the local copy. */
export async function routeAframeCDN(page) {
  await page.route('https://aframe.io/releases/1.6.0/aframe.min.js', route =>
    route.fulfill({ path: AFRAME_LOCAL })
  );
}

/** Wait until the A-Frame scene has finished loading all assets. */
export async function waitForScene(page) {
  await page.waitForFunction(() => {
    const scene = document.querySelector('a-scene');
    return scene && scene.hasLoaded;
  }, { timeout: 20000 });
}

/** Navigate to the page and wait for the A-Frame scene to be ready. */
export async function gotoAndWait(page) {
  await routeAframeCDN(page);
  await page.goto('/');
  await waitForScene(page);
}

/** Read an A-Frame entity's rotation as a plain {x, y, z} object. */
export async function getEntityRotation(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getAttribute('rotation');
    if (!r) return null;
    return { x: r.x, y: r.y, z: r.z };
  }, selector);
}

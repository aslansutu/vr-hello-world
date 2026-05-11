import { describe, it, expect } from 'vitest';
import {
  ROTATION_STEP,
  X_TOP_LIMIT, X_BOTTOM_LIMIT,
  Y_TOP_LIMIT, Y_BOTTOM_LIMIT,
  links,
  toRadians,
  mobileAndTabletCheck,
  computeFlyUp, computeFlyDown, computeFlyLeft, computeFlyRight,
  getPlanePerspectiveTarget,
} from '../../js/game-logic.js';

// ─── toRadians ────────────────────────────────────────────────────────────────

describe('toRadians', () => {
  it('converts 0 to 0', () => expect(toRadians(0)).toBe(0));
  it('converts 180 to π', () => expect(toRadians(180)).toBeCloseTo(Math.PI));
  it('converts 90 to π/2', () => expect(toRadians(90)).toBeCloseTo(Math.PI / 2));
  it('converts 360 to 2π', () => expect(toRadians(360)).toBeCloseTo(Math.PI * 2));
  it('converts -90 to -π/2', () => expect(toRadians(-90)).toBeCloseTo(-Math.PI / 2));
  it('converts 45 to π/4', () => expect(toRadians(45)).toBeCloseTo(Math.PI / 4));
});

// ─── Constants (regression guards) ───────────────────────────────────────────

describe('constants', () => {
  it('ROTATION_STEP is 1', () => expect(ROTATION_STEP).toBe(1));
  it('X_TOP_LIMIT is 60', () => expect(X_TOP_LIMIT).toBe(60));
  it('X_BOTTOM_LIMIT is -10', () => expect(X_BOTTOM_LIMIT).toBe(-10));
  it('Y_TOP_LIMIT is 40', () => expect(Y_TOP_LIMIT).toBe(40));
  it('Y_BOTTOM_LIMIT is -40', () => expect(Y_BOTTOM_LIMIT).toBe(-40));
});

// ─── links (URL regression guards) ───────────────────────────────────────────

describe('links', () => {
  it('has exactly 3 entries', () => expect(Object.keys(links)).toHaveLength(3));
  it('linkedin-nav URL is correct', () =>
    expect(links['linkedin-nav'].link).toBe('https://www.linkedin.com/in/atakan-onol-547427160/'));
  it('github-nav URL is correct', () =>
    expect(links['github-nav'].link).toBe('https://github.com/aslansutu'));
  it('blog-nav URL is correct', () =>
    expect(links['blog-nav'].link).toBe('https://blog.atakanonol.dev'));
});

// ─── mobileAndTabletCheck ─────────────────────────────────────────────────────

describe('mobileAndTabletCheck', () => {
  it('returns false for desktop Chrome on macOS', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    )).toBe(false));

  it('returns false for empty string', () =>
    expect(mobileAndTabletCheck('')).toBe(false));

  it('returns false for Firefox desktop', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0'
    )).toBe(false));

  it('returns false for Safari desktop on macOS', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
    )).toBe(false));

  it('returns true for iPhone', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    )).toBe(true));

  it('returns true for Android Chrome', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.143 Mobile Safari/537.36'
    )).toBe(true));

  it('returns true for iPad', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    )).toBe(true));

  it('returns true for Amazon Silk (Kindle)', () =>
    expect(mobileAndTabletCheck(
      'Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/95.4.14 like Chrome/95.0.4638.74 Safari/537.36'
    )).toBe(true));
});

// ─── computeFlyUp ─────────────────────────────────────────────────────────────

describe('computeFlyUp', () => {
  it('decrements plane.x by ROTATION_STEP when not at limit', () => {
    const result = computeFlyUp({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(-1);
  });

  it('does not move earth when not at limit', () => {
    const result = computeFlyUp({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.earthMoved).toBe(false);
    expect(result.earth.x).toBe(0);
    expect(result.earth.z).toBe(0);
  });

  it('clamps plane.x to X_BOTTOM_LIMIT and sets earthMoved=true when at limit', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(-10);
    expect(result.earthMoved).toBe(true);
  });

  it('at limit with earth.y=0: earth.x increases by 1 and earth.z stays ~0', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.earth.x).toBeCloseTo(1);
    expect(result.earth.z).toBeCloseTo(0);
  });

  it('at limit with earth.y=90: earth.x stays ~0 and earth.z increases by 1', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 }, { x: 0, y: 90, z: 0 });
    expect(result.earth.x).toBeCloseTo(0, 5);
    expect(result.earth.z).toBeCloseTo(1);
  });

  it('x=-9 steps to -10 without moving earth', () => {
    const result = computeFlyUp({ x: -9, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(-10);
    expect(result.earthMoved).toBe(false);
  });

  it('uses earth.y (not earth.x) in trig calculation — critical regression guard', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 }, { x: 999, y: 45, z: 0 });
    // earth.x starts at 999; if code correctly uses earth.y the delta is cos(45°)
    expect(result.earth.x - 999).toBeCloseTo(Math.cos(Math.PI / 4));
    expect(result.earth.z).toBeCloseTo(Math.sin(Math.PI / 4));
  });

  it('does not mutate input objects', () => {
    const plane = { x: 0, y: 0, z: 0 };
    const earth = { x: 0, y: 0, z: 0 };
    computeFlyUp(plane, earth);
    expect(plane.x).toBe(0);
    expect(earth.x).toBe(0);
  });

  it('preserves plane.y and plane.z', () => {
    const result = computeFlyUp({ x: 0, y: 5, z: 3 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(5);
    expect(result.plane.z).toBe(3);
  });

  it('sequential calls clamp plane.x and keep it at limit', () => {
    let plane = { x: -8, y: 0, z: 0 };
    let earth = { x: 0, y: 0, z: 0 };
    for (let i = 0; i < 5; i++) {
      const result = computeFlyUp(plane, earth);
      plane = result.plane;
      earth = result.earth;
    }
    expect(plane.x).toBe(-10);
  });
});

// ─── computeFlyDown ───────────────────────────────────────────────────────────

describe('computeFlyDown', () => {
  it('increments plane.x by ROTATION_STEP when not at limit', () => {
    const result = computeFlyDown({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(1);
    expect(result.earthMoved).toBe(false);
  });

  it('clamps plane.x to X_TOP_LIMIT and sets earthMoved=true when at limit', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(60);
    expect(result.earthMoved).toBe(true);
  });

  it('at top limit with earth.y=0: earth.x decreases by 1, earth.z stays ~0', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.earth.x).toBeCloseTo(-1);
    expect(result.earth.z).toBeCloseTo(0);
  });

  it('at top limit with earth.y=90: earth.x stays ~0, earth.z decreases by 1', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 }, { x: 0, y: 90, z: 0 });
    expect(result.earth.x).toBeCloseTo(0, 5);
    expect(result.earth.z).toBeCloseTo(-1);
  });

  it('x=59 steps to 60 without moving earth', () => {
    const result = computeFlyDown({ x: 59, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(60);
    expect(result.earthMoved).toBe(false);
  });

  it('uses earth.y (not earth.x) in trig calculation — critical regression guard', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 }, { x: 999, y: 45, z: 0 });
    // earth.x starts at 999; if code correctly uses earth.y the delta is -cos(45°)
    expect(result.earth.x - 999).toBeCloseTo(-Math.cos(Math.PI / 4));
    expect(result.earth.z).toBeCloseTo(-Math.sin(Math.PI / 4));
  });

  it('does not mutate input objects', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyDown(plane, { x: 0, y: 0, z: 0 });
    expect(plane.x).toBe(0);
  });
});

// ─── computeFlyRight ──────────────────────────────────────────────────────────

describe('computeFlyRight', () => {
  it('increments plane.y by ROTATION_STEP when not at limit', () => {
    const result = computeFlyRight({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(1);
    expect(result.earthMoved).toBe(false);
  });

  it('clamps plane.y to Y_TOP_LIMIT and sets earthMoved=true when at limit', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(40);
    expect(result.earthMoved).toBe(true);
  });

  it('at right limit with earth.x=0: earth.y decreases by 1, earth.z stays ~0', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.earth.y).toBeCloseTo(-1);
    expect(result.earth.z).toBeCloseTo(0);
  });

  it('uses earth.x (not earth.y) in trig calculation — critical regression guard', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 }, { x: 45, y: 999, z: 0 });
    // earth.y starts at 999; if code correctly uses earth.x the delta is -cos(45°)
    expect(result.earth.y - 999).toBeCloseTo(-Math.cos(Math.PI / 4));
    expect(result.earth.z).toBeCloseTo(-Math.sin(Math.PI / 4));
  });

  it('y=39 steps to 40 without moving earth', () => {
    const result = computeFlyRight({ x: 0, y: 39, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(40);
    expect(result.earthMoved).toBe(false);
  });

  it('preserves plane.x and plane.z', () => {
    const result = computeFlyRight({ x: 5, y: 0, z: 3 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(5);
    expect(result.plane.z).toBe(3);
  });

  it('does not mutate input objects', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyRight(plane, { x: 0, y: 0, z: 0 });
    expect(plane.y).toBe(0);
  });
});

// ─── computeFlyLeft ───────────────────────────────────────────────────────────

describe('computeFlyLeft', () => {
  it('decrements plane.y by ROTATION_STEP when not at limit', () => {
    const result = computeFlyLeft({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(-1);
    expect(result.earthMoved).toBe(false);
  });

  it('clamps plane.y to Y_BOTTOM_LIMIT and sets earthMoved=true when at limit', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(-40);
    expect(result.earthMoved).toBe(true);
  });

  it('at left limit with earth.x=0: earth.y increases by 1, earth.z stays ~0', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.earth.y).toBeCloseTo(1);
    expect(result.earth.z).toBeCloseTo(0);
  });

  it('uses earth.x (not earth.y) in trig calculation — critical regression guard', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 }, { x: 45, y: 999, z: 0 });
    // earth.y starts at 999; if code correctly uses earth.x the delta is cos(45°)
    expect(result.earth.y - 999).toBeCloseTo(Math.cos(Math.PI / 4));
    expect(result.earth.z).toBeCloseTo(Math.sin(Math.PI / 4));
  });

  it('y=-39 steps to -40 without moving earth', () => {
    const result = computeFlyLeft({ x: 0, y: -39, z: 0 }, { x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(-40);
    expect(result.earthMoved).toBe(false);
  });

  it('does not mutate input objects', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyLeft(plane, { x: 0, y: 0, z: 0 });
    expect(plane.y).toBe(0);
  });
});

// ─── getPlanePerspectiveTarget ────────────────────────────────────────────────

describe('getPlanePerspectiveTarget', () => {
  it('returns null when no flags are set', () =>
    expect(getPlanePerspectiveTarget(false, false, false, false)).toBeNull());

  it('up only returns "5 90 25"', () =>
    expect(getPlanePerspectiveTarget(true, false, false, false)).toBe('5 90 25'));

  it('down only returns "5 -90 -50"', () =>
    expect(getPlanePerspectiveTarget(false, true, false, false)).toBe('5 -90 -50'));

  it('right only returns "55 5 -5"', () =>
    expect(getPlanePerspectiveTarget(false, false, false, true)).toBe('55 5 -5'));

  it('left only returns "-50 175 -5"', () =>
    expect(getPlanePerspectiveTarget(false, false, true, false)).toBe('-50 175 -5'));

  it('up+right returns "20 60 40"', () =>
    expect(getPlanePerspectiveTarget(true, false, false, true)).toBe('20 60 40'));

  it('right+down returns "25 -45 -35"', () =>
    expect(getPlanePerspectiveTarget(false, true, false, true)).toBe('25 -45 -35'));

  it('down+left returns "-30 250 -20"', () =>
    expect(getPlanePerspectiveTarget(false, true, true, false)).toBe('-30 250 -20'));

  it('left+up returns "-10 130 30"', () =>
    expect(getPlanePerspectiveTarget(true, false, true, false)).toBe('-10 130 30'));
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  ROTATION_STEP,
  X_TOP_LIMIT, X_BOTTOM_LIMIT,
  Y_TOP_LIMIT, Y_BOTTOM_LIMIT,
  links,
  toRadians,
  isTouchDevice,
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

// ─── isTouchDevice ────────────────────────────────────────────────────────────

function mockMatchMedia(matches) {
  vi.stubGlobal('matchMedia', (query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('isTouchDevice', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('returns true when pointer is coarse (touch device)', () => {
    mockMatchMedia(true);
    expect(isTouchDevice()).toBe(true);
  });

  it('returns false when pointer is fine (mouse/desktop)', () => {
    mockMatchMedia(false);
    expect(isTouchDevice()).toBe(false);
  });

  it('passes the correct media query string', () => {
    const matchMedia = vi.fn(() => ({ matches: false }));
    vi.stubGlobal('matchMedia', matchMedia);
    isTouchDevice();
    expect(matchMedia).toHaveBeenCalledWith('(pointer: coarse)');
  });
});

// ─── computeFlyUp ─────────────────────────────────────────────────────────────

describe('computeFlyUp', () => {
  it('decrements plane.x by ROTATION_STEP when not at limit', () => {
    const result = computeFlyUp({ x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(-1);
  });

  it('earthDelta is null when not at limit', () => {
    const result = computeFlyUp({ x: 0, y: 0, z: 0 });
    expect(result.earthDelta).toBeNull();
  });

  it('clamps plane.x to X_BOTTOM_LIMIT at limit', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 });
    expect(result.plane.x).toBe(-10);
  });

  it('returns earthDelta when at limit', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 });
    expect(result.earthDelta).not.toBeNull();
  });

  it('earthDelta specifies world +X axis rotation by ROTATION_STEP', () => {
    const result = computeFlyUp({ x: -10, y: 0, z: 0 });
    expect(result.earthDelta.axisX).toBe(1);
    expect(result.earthDelta.axisY).toBe(0);
    expect(result.earthDelta.axisZ).toBe(0);
    expect(result.earthDelta.angleDeg).toBe(ROTATION_STEP);
  });

  it('x=-9 steps to -10 without earthDelta', () => {
    const result = computeFlyUp({ x: -9, y: 0, z: 0 });
    expect(result.plane.x).toBe(-10);
    expect(result.earthDelta).toBeNull();
  });

  it('does not mutate input object', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyUp(plane);
    expect(plane.x).toBe(0);
  });

  it('preserves plane.y and plane.z', () => {
    const result = computeFlyUp({ x: 0, y: 5, z: 3 });
    expect(result.plane.y).toBe(5);
    expect(result.plane.z).toBe(3);
  });

  it('sequential calls clamp plane.x and keep it at limit', () => {
    let plane = { x: -8, y: 0, z: 0 };
    for (let i = 0; i < 5; i++) {
      const result = computeFlyUp(plane);
      plane = result.plane;
    }
    expect(plane.x).toBe(-10);
  });
});

// ─── computeFlyDown ───────────────────────────────────────────────────────────

describe('computeFlyDown', () => {
  it('increments plane.x by ROTATION_STEP when not at limit', () => {
    const result = computeFlyDown({ x: 0, y: 0, z: 0 });
    expect(result.plane.x).toBe(1);
    expect(result.earthDelta).toBeNull();
  });

  it('clamps plane.x to X_TOP_LIMIT at limit', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 });
    expect(result.plane.x).toBe(60);
  });

  it('returns earthDelta when at limit', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 });
    expect(result.earthDelta).not.toBeNull();
  });

  it('earthDelta specifies world +X axis rotation by -ROTATION_STEP', () => {
    const result = computeFlyDown({ x: 60, y: 0, z: 0 });
    expect(result.earthDelta.axisX).toBe(1);
    expect(result.earthDelta.axisY).toBe(0);
    expect(result.earthDelta.axisZ).toBe(0);
    expect(result.earthDelta.angleDeg).toBe(-ROTATION_STEP);
  });

  it('x=59 steps to 60 without earthDelta', () => {
    const result = computeFlyDown({ x: 59, y: 0, z: 0 });
    expect(result.plane.x).toBe(60);
    expect(result.earthDelta).toBeNull();
  });

  it('does not mutate input object', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyDown(plane);
    expect(plane.x).toBe(0);
  });
});

// ─── computeFlyRight ──────────────────────────────────────────────────────────

describe('computeFlyRight', () => {
  it('increments plane.y by ROTATION_STEP when not at limit', () => {
    const result = computeFlyRight({ x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(1);
    expect(result.earthDelta).toBeNull();
  });

  it('clamps plane.y to Y_TOP_LIMIT at limit', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 });
    expect(result.plane.y).toBe(40);
  });

  it('returns earthDelta when at limit', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 });
    expect(result.earthDelta).not.toBeNull();
  });

  it('earthDelta specifies world +Y axis rotation by -ROTATION_STEP', () => {
    const result = computeFlyRight({ x: 0, y: 40, z: 0 });
    expect(result.earthDelta.axisX).toBe(0);
    expect(result.earthDelta.axisY).toBe(1);
    expect(result.earthDelta.axisZ).toBe(0);
    expect(result.earthDelta.angleDeg).toBe(-ROTATION_STEP);
  });

  it('y=39 steps to 40 without earthDelta', () => {
    const result = computeFlyRight({ x: 0, y: 39, z: 0 });
    expect(result.plane.y).toBe(40);
    expect(result.earthDelta).toBeNull();
  });

  it('preserves plane.x and plane.z', () => {
    const result = computeFlyRight({ x: 5, y: 0, z: 3 });
    expect(result.plane.x).toBe(5);
    expect(result.plane.z).toBe(3);
  });

  it('does not mutate input object', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyRight(plane);
    expect(plane.y).toBe(0);
  });
});

// ─── computeFlyLeft ───────────────────────────────────────────────────────────

describe('computeFlyLeft', () => {
  it('decrements plane.y by ROTATION_STEP when not at limit', () => {
    const result = computeFlyLeft({ x: 0, y: 0, z: 0 });
    expect(result.plane.y).toBe(-1);
    expect(result.earthDelta).toBeNull();
  });

  it('clamps plane.y to Y_BOTTOM_LIMIT at limit', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 });
    expect(result.plane.y).toBe(-40);
  });

  it('returns earthDelta when at limit', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 });
    expect(result.earthDelta).not.toBeNull();
  });

  it('earthDelta specifies world +Y axis rotation by +ROTATION_STEP', () => {
    const result = computeFlyLeft({ x: 0, y: -40, z: 0 });
    expect(result.earthDelta.axisX).toBe(0);
    expect(result.earthDelta.axisY).toBe(1);
    expect(result.earthDelta.axisZ).toBe(0);
    expect(result.earthDelta.angleDeg).toBe(ROTATION_STEP);
  });

  it('y=-39 steps to -40 without earthDelta', () => {
    const result = computeFlyLeft({ x: 0, y: -39, z: 0 });
    expect(result.plane.y).toBe(-40);
    expect(result.earthDelta).toBeNull();
  });

  it('does not mutate input object', () => {
    const plane = { x: 0, y: 0, z: 0 };
    computeFlyLeft(plane);
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

export const ROTATION_STEP = 1;
export const X_TOP_LIMIT = 60;
export const X_BOTTOM_LIMIT = -10;
export const Y_TOP_LIMIT = 40;
export const Y_BOTTOM_LIMIT = -40;

export const links = {
  "linkedin-nav": {
    link: "https://www.linkedin.com/in/atakan-onol-547427160/",
  },
  "github-nav": { link: "https://github.com/aslansutu" },
  "blog-nav": { link: "https://blog.atakanonol.dev" },
};

export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function isTouchDevice() {
  return globalThis.matchMedia('(pointer: coarse)').matches;
}

export function computeFlyUp(planeRot) {
  const plane = { x: planeRot.x, y: planeRot.y, z: planeRot.z };

  if (plane.x - ROTATION_STEP < X_BOTTOM_LIMIT) {
    plane.x = X_BOTTOM_LIMIT;
    return { plane, earthDelta: { axisX: 1, axisY: 0, axisZ: 0, angleDeg: ROTATION_STEP } };
  }

  plane.x -= ROTATION_STEP;
  return { plane, earthDelta: null };
}

export function computeFlyDown(planeRot) {
  const plane = { x: planeRot.x, y: planeRot.y, z: planeRot.z };

  if (plane.x + ROTATION_STEP > X_TOP_LIMIT) {
    plane.x = X_TOP_LIMIT;
    return { plane, earthDelta: { axisX: 1, axisY: 0, axisZ: 0, angleDeg: -ROTATION_STEP } };
  }

  plane.x += ROTATION_STEP;
  return { plane, earthDelta: null };
}

export function computeFlyRight(planeRot) {
  const plane = { x: planeRot.x, y: planeRot.y, z: planeRot.z };

  if (plane.y + ROTATION_STEP > Y_TOP_LIMIT) {
    plane.y = Y_TOP_LIMIT;
    return { plane, earthDelta: { axisX: 0, axisY: 1, axisZ: 0, angleDeg: -ROTATION_STEP } };
  }

  plane.y += ROTATION_STEP;
  return { plane, earthDelta: null };
}

export function computeFlyLeft(planeRot) {
  const plane = { x: planeRot.x, y: planeRot.y, z: planeRot.z };

  if (plane.y - ROTATION_STEP < Y_BOTTOM_LIMIT) {
    plane.y = Y_BOTTOM_LIMIT;
    return { plane, earthDelta: { axisX: 0, axisY: 1, axisZ: 0, angleDeg: ROTATION_STEP } };
  }

  plane.y -= ROTATION_STEP;
  return { plane, earthDelta: null };
}

export function getPlanePerspectiveTarget(up, down, left, right) {
  if (up && right)   return "20 60 40";
  if (right && down) return "25 -45 -35";
  if (down && left)  return "-30 250 -20";
  if (left && up)    return "-10 130 30";
  if (up)            return "5 90 25";
  if (right)         return "55 5 -5";
  if (down)          return "5 -90 -50";
  if (left)          return "-50 175 -5";
  return null;
}

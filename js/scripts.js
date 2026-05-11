import {
  links,
  isTouchDevice,
  computeFlyUp, computeFlyDown, computeFlyLeft, computeFlyRight,
  getPlanePerspectiveTarget,
} from './game-logic.js';

const el = document.getElementById("test");

let rotateUp = false;
let rotateDown = false;
let rotateLeft = false;
let rotateRight = false;

const images = document.querySelectorAll(".arrow-container img");

var nav_link = null;

function _getRotation(id) {
  const r = document.getElementById(id).getAttribute("rotation");
  return { x: r.x, y: r.y, z: r.z };
}

// Rotate an A-Frame element around a world-space axis by angleDeg degrees.
// Uses quaternion pre-multiplication (Q_new = delta * Q) so the axis is always
// in world space regardless of the element's current orientation.
function applyWorldRotation(el, axisX, axisY, axisZ, angleDeg) {
  const half = angleDeg * Math.PI / 360;
  const s = Math.sin(half);
  const dw = Math.cos(half), dx = axisX * s, dy = axisY * s, dz = axisZ * s;
  const q = el.object3D.quaternion;
  const qx = q.x, qy = q.y, qz = q.z, qw = q.w;
  el.object3D.quaternion.set(
    dw*qx + dx*qw + dy*qz - dz*qy,
    dw*qy - dx*qz + dy*qw + dz*qx,
    dw*qz + dx*qy - dy*qx + dz*qw,
    dw*qw - dx*qx - dy*qy - dz*qz,
  );
  // Sync the A-Frame rotation attribute so getAttribute('rotation') stays correct.
  const r = el.object3D.rotation;
  const R2D = 180 / Math.PI;
  el.setAttribute('rotation', { x: r.x * R2D, y: r.y * R2D, z: r.z * R2D });
}

function update_plane_perspective() {
  const target = getPlanePerspectiveTarget(rotateUp, rotateDown, rotateLeft, rotateRight);
  if (target) {
    let el = document.getElementById("paper_plane");
    el.setAttribute("animation", {
      property: "rotation",
      to: target,
      dur: 500,
      easing: "easeInOutQuad",
    });
  }
}

function flyUp() {
  update_plane_perspective();
  const result = computeFlyUp(_getRotation("plane"));
  document.getElementById("plane").setAttribute("rotation", result.plane);
  if (result.earthDelta) {
    const { axisX, axisY, axisZ, angleDeg } = result.earthDelta;
    applyWorldRotation(document.getElementById("earth"), axisX, axisY, axisZ, angleDeg);
  }
}

function flyDown() {
  update_plane_perspective();
  const result = computeFlyDown(_getRotation("plane"));
  document.getElementById("plane").setAttribute("rotation", result.plane);
  if (result.earthDelta) {
    const { axisX, axisY, axisZ, angleDeg } = result.earthDelta;
    applyWorldRotation(document.getElementById("earth"), axisX, axisY, axisZ, angleDeg);
  }
}

function flyRight() {
  update_plane_perspective();
  const result = computeFlyRight(_getRotation("plane"));
  document.getElementById("plane").setAttribute("rotation", result.plane);
  if (result.earthDelta) {
    const { axisX, axisY, axisZ, angleDeg } = result.earthDelta;
    applyWorldRotation(document.getElementById("earth"), axisX, axisY, axisZ, angleDeg);
  }
}

function flyLeft() {
  update_plane_perspective();
  const result = computeFlyLeft(_getRotation("plane"));
  document.getElementById("plane").setAttribute("rotation", result.plane);
  if (result.earthDelta) {
    const { axisX, axisY, axisZ, angleDeg } = result.earthDelta;
    applyWorldRotation(document.getElementById("earth"), axisX, axisY, axisZ, angleDeg);
  }
}

function animateRotation() {
  if (rotateUp) { flyUp(); }
  if (rotateDown) { flyDown(); }
  if (rotateLeft) { flyLeft(); }
  if (rotateRight) { flyRight(); }
  requestAnimationFrame(animateRotation);
}

// Function to handle mouse down (or touch start)
function handleMouseDown(event) {
  const key = event.target.id;

  switch (key) {
    case "arrow-up-key":
      rotateUp = true;
      break;
    case "arrow-left-key":
      rotateLeft = true;
      break;
    case "arrow-right-key":
      rotateRight = true;
      break;
    case "arrow-down-key":
      rotateDown = true;
      break;
    case "enter-key":
      if (nav_link == null) {
        break;
      }
      window.open(nav_link, "_blank");
      break;
  }
}

// Function to handle mouse up (or touch end)
function handleMouseUp(event) {
  const key = event.target.id;

  switch (key) {
    case "arrow-up-key":
      rotateUp = false;
      break;
    case "arrow-left-key":
      rotateLeft = false;
      break;
    case "arrow-right-key":
      rotateRight = false;
      break;
    case "arrow-down-key":
      rotateDown = false;
      break;
  }
}

function overlayCheck() {
  let check = isTouchDevice();

  if (check == false) {
    document.getElementById("mobile-controls").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("desktop-directions").setAttribute('visible', true);
    document.getElementById("mobile-directions").setAttribute('visible', false);
  } else {
    if (window.innerHeight > window.innerWidth) {
      document.getElementById("overlay").style.display = "block";
    } else {
      document.getElementById("overlay").style.display = "none";
    }

    document.getElementById("mobile-controls").style.display = "block";
    document.getElementById("desktop-directions").setAttribute('visible', false);
    document.getElementById("mobile-directions").setAttribute('visible', true);
  }
}

requestAnimationFrame(animateRotation);

// Add event listeners to each image for mouse and touch events
images.forEach((img) => {
  img.addEventListener("mousedown", handleMouseDown);
  img.addEventListener("mouseup", handleMouseUp);

  // For touch devices
  img.addEventListener("touchstart", handleMouseDown);
  img.addEventListener("touchend", handleMouseUp);
});

window.onload = function() {
  overlayCheck();
};

window.addEventListener('resize', function(event) {
  overlayCheck();
}, true);

document.body.addEventListener("keydown", function (event) {
  const key = event.key;
  switch (key) {
    case "ArrowLeft":
    case "a":
    case "A":
      rotateLeft = true;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      rotateRight = true;
      break;
    case "ArrowUp":
    case "w":
    case "W":
      rotateUp = true;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      rotateDown = true;
      break;
    case "Enter":
    case " ":
      if (nav_link == null) {
        break;
      }
      window.open(nav_link, "_blank");
      break;
  }
});

document.body.addEventListener("keyup", function (event) {
  const key = event.key;
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      rotateUp = false;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      rotateDown = false;
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      rotateLeft = false;
      break;
    case "ArrowRight":
    case "d":
    case "D":
      rotateRight = false;
      break;
  }
});

document
  .querySelector("#shadow")
  .addEventListener("obbcollisionstarted", function (event) {
    let nav_id = event.detail.withEl.id;
    nav_link = links[nav_id].link;
  });

document
  .querySelector("#shadow")
  .addEventListener("obbcollisionended", function (event) {
    nav_link = null;
  });

document.querySelectorAll(".arrow-container img").forEach(img => {
  if (img.id !== "enter-key") {
    img.addEventListener("contextmenu", e => e.preventDefault());
    img.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
  }
});

// Expose internal state for E2E test inspection
window.__vrState = {
  get navLink() { return nav_link; },
  get rotateUp() { return rotateUp; },
  get rotateDown() { return rotateDown; },
  get rotateLeft() { return rotateLeft; },
  get rotateRight() { return rotateRight; },
};

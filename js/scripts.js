const el = document.getElementById("test");
const rotation_step = 1;
const position_step = 1;

const x_top_limit = 60;
const x_bottom_limit = -10;

const y_top_limit = 40;
const y_bottom_limit = -40;

let rotateUp = false;
let rotateDown = false;
let rotateLeft = false;
let rotateRight = false;

const images = document.querySelectorAll(".arrow-container img");

const links = {
  "linkedin-nav": {
    link: "https://www.linkedin.com/in/atakan-onol-547427160/",
  },
  "github-nav": { link: "https://github.com/aslansutu" },
  "blog-nav": { link: "https://blog.atakanonol.dev" },
};

var nav_link = null;

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function update_plane_perspective() {
  let el = document.getElementById("paper_plane");

  if (rotateUp == true && rotateRight == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "20 60 40", // Target rotation
      dur: 500, // Duration of the animation in milliseconds
      easing: "easeInOutQuad", // Easing function for smooth animation
    });
  } else if (rotateRight == true && rotateDown == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "25 -45 -35",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateDown == true && rotateLeft == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "-30 250 -20",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateLeft == true && rotateUp == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "-10 130 30",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateUp == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "5 90 25",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateRight == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "55 5 -5",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateDown == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "5 -90 -50",
      dur: 500,
      easing: "easeInOutQuad",
    });
  } else if (rotateLeft == true) {
    el.setAttribute("animation", {
      property: "rotation",
      to: "-50 175 -5",
      dur: 500,
      easing: "easeInOutQuad",
    });
  }
}

function flyUp() {
  let el = document.getElementById("plane");
  let rotation = el.getAttribute("rotation");

  update_plane_perspective();

  if (rotation.x - rotation_step < x_bottom_limit) {
    rotation.x = x_bottom_limit;
    el.setAttribute("rotation", rotation);

    let earth = document.getElementById("earth");
    let earth_rotation = earth.getAttribute("rotation");

    earth_rotation.x += rotation_step * Math.cos(toRadians(earth_rotation.y));
    earth_rotation.z += rotation_step * Math.sin(toRadians(earth_rotation.y));
    earth.setAttribute("rotation", earth_rotation);
    return;
  }

  rotation.x -= rotation_step;
  el.setAttribute("rotation", rotation);
}

function flyDown() {
  let el = document.getElementById("plane");
  let rotation = el.getAttribute("rotation");

  update_plane_perspective();

  if (rotation.x + rotation_step > x_top_limit) {
    rotation.x = x_top_limit;
    el.setAttribute("rotation", rotation);

    let earth = document.getElementById("earth");
    let earth_rotation = earth.getAttribute("rotation");

    earth_rotation.x -= rotation_step * Math.cos(toRadians(earth_rotation.y));
    earth_rotation.z -= rotation_step * Math.sin(toRadians(earth_rotation.y));
    earth.setAttribute("rotation", earth_rotation);
    return;
  }

  rotation.x += rotation_step;
  el.setAttribute("rotation", rotation);
}

function flyRight() {
  let el = document.getElementById("plane");
  let rotation = el.getAttribute("rotation");

  update_plane_perspective();

  if (rotation.y + rotation_step > y_top_limit) {
    rotation.y = y_top_limit;
    el.setAttribute("rotation", rotation);

    let earth = document.getElementById("earth");
    let earth_rotation = earth.getAttribute("rotation");

    earth_rotation.y -= rotation_step * Math.cos(toRadians(earth_rotation.x));
    earth_rotation.z -= rotation_step * Math.sin(toRadians(earth_rotation.x));
    earth.setAttribute("rotation", earth_rotation);
    return;
  }

  rotation.y += rotation_step;
  el.setAttribute("rotation", rotation);
}

function flyLeft() {
  let el = document.getElementById("plane");
  let rotation = el.getAttribute("rotation");

  update_plane_perspective();

  if (rotation.y - rotation_step < y_bottom_limit) {
    rotation.y = y_bottom_limit;
    el.setAttribute("rotation", rotation);

    let earth = document.getElementById("earth");
    let earth_rotation = earth.getAttribute("rotation");

    earth_rotation.y += rotation_step * Math.cos(toRadians(earth_rotation.x));
    earth_rotation.z += rotation_step * Math.sin(toRadians(earth_rotation.x));
    earth.setAttribute("rotation", earth_rotation);
    return;
  }

  rotation.y -= rotation_step;
  el.setAttribute("rotation", rotation);
}

function animateRotation() {
  if (rotateUp) {
    flyUp();
  }
  if (rotateDown) {
    flyDown();
  }
  if (rotateLeft) {
    flyLeft();
  }
  if (rotateRight) {
    flyRight();
  }
  requestAnimationFrame(animateRotation);
}

// Function to handle mouse down (or touch start)
function handleMouseDown(event) {
  // console.log("Image clicked:", event.target);
  // console.log("Image clicked:", event.target.id);
  // You can perform any action you want here when the image is clicked
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
  }
}

// Function to handle mouse up (or touch end)
function handleMouseUp(event) {
  // console.log("Image released:", event.target);
  // console.log("Image released:", event.target.id);
  // You can perform any action you want here when the click is released
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

function mobileAndTabletCheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function overlayCheck() {
  let check = mobileAndTabletCheck();

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
      window.open(nav_link, "_blank").location;
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
    // console.log("Collision started with:", event.detail.withEl);
    // console.log("Collision details:", event.detail);
    let nav_id = event.detail.withEl.id;
    nav_link = links[nav_id].link;
  });

document
  .querySelector("#shadow")
  .addEventListener("obbcollisionended", function (event) {
    // console.log("Collision ended with:", event.detail.withEl);
    // console.log("Collision details:", event.detail);
    nav_link = null;
  });

////////////////////
// Debug Controls
////////////////////

function rotateXup() {
  let rotation = el.getAttribute("rotation");
  rotation.x += rotation_step;
  el.setAttribute("rotation", rotation);
}

function rotateXdown() {
  let rotation = el.getAttribute("rotation");
  rotation.x -= rotation_step;
  el.setAttribute("rotation", rotation);
}

function rotateYup() {
  let rotation = el.getAttribute("rotation");
  rotation.y += rotation_step;
  el.setAttribute("rotation", rotation);
}

function rotateYdown() {
  let rotation = el.getAttribute("rotation");
  rotation.y -= rotation_step;
  el.setAttribute("rotation", rotation);
}

function rotateZup() {
  let rotation = el.getAttribute("rotation");
  rotation.z += rotation_step;
  el.setAttribute("rotation", rotation);
}

function rotateZdown() {
  let rotation = el.getAttribute("rotation");
  rotation.z -= rotation_step;
  el.setAttribute("rotation", rotation);
}

function moveXup() {
  let position = el.getAttribute("position");
  position.x += position_step;
  el.setAttribute("position", position);
}

function moveXdown() {
  let position = el.getAttribute("position");
  position.x -= position_step;
  el.setAttribute("position", position);
}

function moveYup() {
  let position = el.getAttribute("position");
  position.y += position_step;
  el.setAttribute("position", position);
}

function moveYdown() {
  let position = el.getAttribute("position");
  position.y -= position_step;
  el.setAttribute("position", position);
}

function moveZup() {
  let position = el.getAttribute("position");
  position.z += position_step;
  el.setAttribute("position", position);
}

function moveZdown() {
  let position = el.getAttribute("position");
  position.z -= position_step;
  el.setAttribute("position", position);
}

function getData() {
  var p = el.getAttribute("position");
  console.log("Position: " + "x: " + p.x + ", y: " + p.y + ", z: " + p.z);
  p = el.getAttribute("rotation");
  console.log("Rotation: " + "x: " + p.x + ", y: " + p.y + ", z: " + p.z);
}

function resetView() {
  rig = document.getElementById("camera");
  let position = rig.getAttribute("position");
  console.log(position);

  position.x = 0;
  position.y = -1;
  position.z = -1;

  rig.setAttribute("position", position);
}

# VR Hello World

An interactive WebXR portfolio page built with A-Frame. A low-poly Earth floats in space with a paper airplane that you can fly around it. Three checkpoint markers — each linking to a different page — are positioned on the globe. Navigate the plane onto a marker, then press Enter to open the link.

## Features

- Low-poly Earth with orbiting paper airplane
- Keyboard (arrow keys / WASD) and on-screen touch controls
- Three checkpoint markers: LinkedIn, GitHub, and blog
- OBB collision detection — land on a marker to activate its link
- WebXR / VR mode support (including Google Cardboard)
- Mobile-responsive with portrait-mode orientation warning
- Animated rotating sun and space background

## Tech Stack

| Layer | Technology |
|-------|-----------|
| 3D / VR framework | [A-Frame 1.6.0](https://aframe.io) |
| Language | Vanilla ES6 (no build step) |
| 3D models | glTF 2.0 (earth, sun, plane) + Wavefront OBJ (markers) |
| Styling | Plain CSS |
| Server | Python 3 `http.server` |
| Deployment | Docker + Traefik reverse proxy |

## Project Structure

```
vr-hello-world/
├── index.html                    # A-Frame scene entry point
├── js/
│   ├── game-logic.js             # Pure functions: rotation math, links, mobile check
│   ├── scripts.js                # DOM wiring: event listeners, animation loop
│   ├── aframe.js / aframe.min.js # A-Frame library (local copy)
├── css/
│   └── styles.css                # Mobile controls and overlay styling
├── assets/
│   ├── earth/                    # Low-poly Earth glTF model
│   ├── vehicle/                  # Paper airplane glTF model
│   ├── sun/                      # Sun glTF model
│   ├── navigation/               # Checkpoint marker OBJ models
│   ├── space.webp                # Space background texture
│   └── arrow-white.svg / enter-key-white.svg
├── tests/
│   ├── unit/game-logic.test.js   # Vitest unit tests for pure logic
│   └── e2e/                      # Playwright E2E tests
├── package.json
├── vitest.config.js
├── playwright.config.js
├── Dockerfile
└── docker-compose.yml
```

## Running Locally

Serve from the project root with any HTTP server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move up | Arrow Up / W | Up button |
| Move down | Arrow Down / S | Down button |
| Move left | Arrow Left / A | Left button |
| Move right | Arrow Right / D | Right button |
| Navigate to marker | Enter / Space | Enter button |

## Running Tests

### Unit tests (fast, no browser required)

```bash
npm install
npm test
```

### E2E tests (require Playwright and a running server)

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

### Run all tests

```bash
npm run test:all
```

## Building

### With Traefik

Edit the `.env` file with your domain. Adjust the Traefik labels in `docker-compose.yml` as needed.

```bash
docker compose up
```

### Without Traefik

```bash
python3 -m http.server 8000
```

## Known Issues / ToDo

- The Earth's 3D rotation has gimbal lock — since the local axis rotates with the object, rotation on multiple axes produces skewed results. Correct behaviour would keep rotation relative to the camera.
- Add other planets.
- Add the moon.

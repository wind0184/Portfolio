import * as THREE from "./vendor/three.module.js";

const starCanvas = document.getElementById("starfield");
const starContext = starCanvas.getContext("2d");
const planetHost = document.getElementById("planet-scene");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const pointer = { x: 0, y: 0 };
const stars = [];
let renderer;
let scene;
let camera;
let planetGroup;
let planet;
let heroVisible = true;
let frameHandle = 0;
let lastFrame = 0;
let elapsed = 0;
let width = 0;
let height = 0;

function prepareStars() {
  const ratio = Math.min(devicePixelRatio, 2);
  width = innerWidth;
  height = innerHeight;
  starCanvas.width = width * ratio;
  starCanvas.height = height * ratio;
  starContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars.length = 0;
  let seed = 1741;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const count = Math.min(330, Math.round((width * height) / 4000));
  for (let index = 0; index < count; index++) {
    stars.push({
      x: random() * width,
      y: random() * height,
      radius: 0.3 + random() * 0.85,
      alpha: 0.17 + random() * 0.52,
      phase: random() * Math.PI * 2,
      depth: random(),
    });
  }
  drawStars();
}

function drawStars() {
  starContext.clearRect(0, 0, width, height);
  for (const star of stars) {
    const brightness =
      star.alpha * (0.82 + Math.sin(elapsed * 0.35 + star.phase) * 0.18);
    starContext.fillStyle = `rgba(200,220,255,${brightness})`;
    starContext.beginPath();
    starContext.arc(
      star.x + pointer.x * star.depth * 6,
      star.y + pointer.y * star.depth * 6,
      star.radius,
      0,
      Math.PI * 2,
    );
    starContext.fill();
  }
}

function createPlanet() {
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.setClearColor(0x000000, 0);
  planetHost.append(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.set(0, 0, 8);

  planetGroup = new THREE.Group();
  planetGroup.rotation.z = -0.14;
  scene.add(planetGroup);
  const surface = new THREE.MeshPhongMaterial({
    color: 0xd9eaff,
    shininess: 12,
    specular: 0x597eae,
  });
  planet = new THREE.Mesh(new THREE.SphereGeometry(1.55, 96, 64), surface);
  planet.rotation.y = 0.55;
  planetGroup.add(planet);

  new THREE.TextureLoader().load("assets/planet-texture.webp", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    surface.map = texture;
    surface.needsUpdate = true;
    renderer.render(scene, camera);
  });

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.59, 64, 48),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 surfaceNormal;
        varying vec3 viewDirection;
        void main() {
          vec4 positionInView = modelViewMatrix * vec4(position, 1.0);
          surfaceNormal = normalize(normalMatrix * normal);
          viewDirection = normalize(-positionInView.xyz);
          gl_Position = projectionMatrix * positionInView;
        }
      `,
      fragmentShader: `
        varying vec3 surfaceNormal;
        varying vec3 viewDirection;
        void main() {
          float rim = pow(1.0 - abs(dot(normalize(surfaceNormal), normalize(viewDirection))), 3.0);
          gl_FragColor = vec4(0.21, 0.49, 1.0, rim * 0.62);
        }
      `,
    }),
  );
  planetGroup.add(atmosphere);

  const orbitCurve = new THREE.EllipseCurve(0, 0, 2.3, 2.3, 0, Math.PI * 2);
  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(220)),
    new THREE.LineBasicMaterial({
      color: 0x7298cf,
      transparent: true,
      opacity: 0.18,
    }),
  );
  orbit.rotation.set(1.05, 0.15, -0.32);
  planetGroup.add(orbit);

  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x7e8eac, roughness: 1 }),
  );
  moon.position.set(-1.95, -0.9, 0.6);
  planetGroup.add(moon);

  const sunlight = new THREE.DirectionalLight(0xe0edff, 3.3);
  sunlight.position.set(-3, 4, 5);
  scene.add(sunlight);
  const rimLight = new THREE.DirectionalLight(0x3868d4, 1.2);
  rimLight.position.set(3, -1, -2);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0x32466b, 0.7));
  document.documentElement.classList.add("webgl-ready");
  resizePlanet();
}

function resizePlanet() {
  if (!renderer) return;
  const box = planetHost.getBoundingClientRect();
  renderer.setSize(box.width, box.height);
  camera.aspect = box.width / box.height;
  camera.updateProjectionMatrix();
  const mobile = innerWidth <= 760;
  planetGroup.position.set(mobile ? 0 : 1.8, mobile ? 0.05 : 0.25, 0);
  planetGroup.scale.setScalar(mobile ? 0.83 : 1);
  renderer.render(scene, camera);
}

function drawFrame(time) {
  const delta = Math.min((time - lastFrame) / 1000, 0.05);
  lastFrame = time;
  elapsed += delta;
  drawStars();
  if (renderer && heroVisible) {
    planet.rotation.y += delta * 0.028;
    planetGroup.rotation.x = pointer.y * 0.018;
    planetGroup.rotation.z = -0.14 + pointer.x * 0.012;
    renderer.render(scene, camera);
  }
  if (!motionPreference.matches && !document.hidden)
    frameHandle = requestAnimationFrame(drawFrame);
}

function restartAnimation() {
  cancelAnimationFrame(frameHandle);
  if (document.hidden) return;
  lastFrame = performance.now();
  drawFrame(lastFrame);
}

prepareStars();
createPlanet();
restartAnimation();
addEventListener("resize", () => {
  prepareStars();
  resizePlanet();
});
addEventListener("pointermove", (event) => {
  if (motionPreference.matches || event.pointerType !== "mouse") return;
  pointer.x = event.clientX / innerWidth - 0.5;
  pointer.y = event.clientY / innerHeight - 0.5;
});
motionPreference.addEventListener("change", restartAnimation);
document.addEventListener("visibilitychange", restartAnimation);
new IntersectionObserver((entries) => {
  heroVisible = entries[0].isIntersecting;
}).observe(document.querySelector(".hero"));

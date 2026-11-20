import * as THREE from "./vendor/three.module.js";
import { createProjectLandmarks } from "./planet-landmarks.js";

const starCanvas = document.getElementById("starfield");
const starContext = starCanvas.getContext("2d");
const planetHost = document.getElementById("planet-scene");
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const pointer = { x: 0, y: 0 };
const stars = [];
let renderer;
let scene;
let camera;
const planetEntries = [];
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

function surfaceMaterial(kind, tint) {
  if (kind === "ocean") {
    return new THREE.MeshPhongMaterial({
      color: tint,
      shininess: 7,
      specular: 0x24405b,
    });
  }
  const weather = kind === "weather";
  return new THREE.ShaderMaterial({
    uniforms: {
      darkColor: { value: new THREE.Color(weather ? "#496879" : "#263545") },
      lightColor: { value: new THREE.Color(weather ? "#d6e7ec" : "#8a9aa7") },
      cloudBands: { value: weather ? 1 : 0 },
    },
    vertexShader: `
      varying vec3 localPosition;
      varying vec3 surfaceNormal;
      void main() {
        localPosition = position;
        surfaceNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 darkColor;
      uniform vec3 lightColor;
      uniform float cloudBands;
      varying vec3 localPosition;
      varying vec3 surfaceNormal;
      float hash(vec3 p) {
        return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
      }
      float noise(vec3 p) {
        vec3 cell = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(mix(hash(cell), hash(cell + vec3(1,0,0)), f.x), mix(hash(cell + vec3(0,1,0)), hash(cell + vec3(1,1,0)), f.x), f.y),
          mix(mix(hash(cell + vec3(0,0,1)), hash(cell + vec3(1,0,1)), f.x), mix(hash(cell + vec3(0,1,1)), hash(cell + vec3(1,1,1)), f.x), f.y), f.z);
      }
      float terrain(vec3 p) {
        return noise(p) * 0.55 + noise(p * 2.1) * 0.28 + noise(p * 4.3) * 0.12 + noise(p * 11.0) * 0.05;
      }
      void main() {
        float detail = terrain(localPosition * 5.0);
        float bands = sin(localPosition.y * 12.0 + detail * 7.0) * 0.5 + 0.5;
        float pattern = mix(detail, bands * 0.55 + detail * 0.45, cloudBands);
        float light = max(dot(normalize(surfaceNormal), normalize(vec3(-0.7, 0.9, 1.4))), 0.0);
        vec3 color = mix(darkColor, lightColor, smoothstep(0.18, 0.8, pattern));
        gl_FragColor = vec4(color * (0.17 + light * 1.05), 1.0);
      }
    `,
  });
}

function atmosphereMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec3 surfaceNormal;
      varying vec3 viewDirection;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        surfaceNormal = normalize(normalMatrix * normal);
        viewDirection = normalize(-viewPosition.xyz);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying vec3 surfaceNormal;
      varying vec3 viewDirection;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(surfaceNormal), normalize(viewDirection))), 3.5);
        gl_FragColor = vec4(glowColor, rim * 0.5);
      }
    `,
  });
}

function createPlanetSystem() {
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
  renderer.toneMappingExposure = 1.4;
  renderer.setClearColor(0x000000, 0);
  planetHost.append(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
  camera.position.z = 1000;
  const geometry = new THREE.SphereGeometry(1, 64, 48);
  const atmosphereGeometry = new THREE.SphereGeometry(1.025, 48, 32);
  const configurations = {
    "calculus-lab-escape": {
      kind: "ocean",
      tint: 0x73ffc1,
      glow: "#69e2bf",
      tilt: -0.12,
    },
    "vr-fishing": {
      kind: "ocean",
      tint: 0xc0e5ff,
      glow: "#68b7f4",
      tilt: -0.12,
    },
    "weather-simulation": { kind: "weather", glow: "#b3dfed", tilt: -0.1 },
    "interactive-robot": { kind: "rock", glow: "#e2ab79", tilt: 0.05 },
  };
  for (const anchor of document.querySelectorAll(".planet-project")) {
    const configuration = configurations[anchor.dataset.project];
    const group = new THREE.Group();
    group.rotation.z = configuration.tilt;
    const material = surfaceMaterial(configuration.kind, configuration.tint);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.y = 0.55;
    group.add(sphere);
    group.add(
      new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial(configuration.glow),
      ),
    );
    group.add(createProjectLandmarks(anchor.dataset.project));
    scene.add(group);
    planetEntries.push({
      anchor,
      target: anchor.querySelector(".planet-target"),
      group,
      sphere,
      material,
      radius: 1,
      scale: 1,
      textured: configuration.kind === "ocean",
    });
  }
  new THREE.TextureLoader().load("assets/planet-texture.webp", (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    for (const entry of planetEntries) {
      if (!entry.textured) continue;
      entry.material.map = texture;
      entry.material.needsUpdate = true;
    }
    renderer.render(scene, camera);
  });
  const sunlight = new THREE.DirectionalLight(0xe6eeff, 3.1);
  sunlight.position.set(-500, 700, 1000);
  scene.add(sunlight);
  const rimLight = new THREE.DirectionalLight(0x5b80d7, 0.8);
  rimLight.position.set(700, -200, -400);
  scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0x6e83aa, 0.7));
  document.documentElement.classList.add("webgl-ready");
  resizePlanetSystem();
  new ResizeObserver(resizePlanetSystem).observe(planetHost);
  document.fonts.ready.then(resizePlanetSystem);
  for (const entry of planetEntries) {
    for (const eventName of ["pointerenter", "pointerleave", "focus", "blur"]) {
      entry.anchor.addEventListener(eventName, () => {
        if (motionPreference.matches) renderPlanetSystem(0);
      });
    }
  }
}

function resizePlanetSystem() {
  if (!renderer) return;
  const box = planetHost.getBoundingClientRect();
  renderer.setSize(box.width, box.height);
  camera.left = -box.width / 2;
  camera.right = box.width / 2;
  camera.top = box.height / 2;
  camera.bottom = -box.height / 2;
  camera.updateProjectionMatrix();
  for (const entry of planetEntries) {
    const targetBox = entry.target.getBoundingClientRect();
    entry.radius = targetBox.width / 2;
    entry.group.position.set(
      targetBox.left - box.left + targetBox.width / 2 - box.width / 2,
      box.height / 2 - targetBox.top + box.top - targetBox.height / 2,
      0,
    );
    entry.group.scale.setScalar(entry.radius * entry.scale);
  }
  renderer.render(scene, camera);
}

function renderPlanetSystem(delta) {
  for (const entry of planetEntries) {
    const selected = entry.anchor.matches(":hover, :focus-visible");
    const targetScale = selected ? 1.065 : 1;
    entry.scale = motionPreference.matches
      ? targetScale
      : entry.scale + (targetScale - entry.scale) * 0.14;
    entry.sphere.rotation.y += delta * 0.06;
    entry.group.scale.setScalar(entry.radius * entry.scale);
  }
  renderer.render(scene, camera);
}

function drawFrame(time) {
  const delta = Math.min((time - lastFrame) / 1000, 0.05);
  lastFrame = time;
  elapsed += delta;
  drawStars();
  if (
    renderer &&
    heroVisible &&
    !document.body.classList.contains("dialog-open")
  ) {
    renderPlanetSystem(delta);
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
createPlanetSystem();
restartAnimation();
addEventListener("resize", () => {
  prepareStars();
  resizePlanetSystem();
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

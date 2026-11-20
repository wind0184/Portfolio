import * as THREE from "./vendor/three.module.js";
import {
  createProjectWorld,
  addWorldLighting,
} from "./lowpoly-worlds.js?v=eight-worlds-1";

function initializeSystem(system) {
  const host = system.querySelector(".world-scene");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const entries = [];
  let renderer;
  let scene;
  let camera;
  let frame = 0;
  let visible = true;

  function drawFrame() {
    frame = 0;
    if (
      document.hidden ||
      !visible ||
      document.body.classList.contains("dialog-open")
    )
      return;
    let moving = false;
    for (const entry of entries) {
      const active = entry.anchor.matches(":hover, :focus-visible");
      const targetTurn = active ? -0.24 : -0.4;
      const targetScale = active ? 1.045 : 1;
      entry.turn = reduceMotion.matches
        ? targetTurn
        : THREE.MathUtils.lerp(entry.turn, targetTurn, 0.16);
      entry.scale = reduceMotion.matches
        ? targetScale
        : THREE.MathUtils.lerp(entry.scale, targetScale, 0.16);
      entry.world.rotation.y = entry.turn;
      entry.holder.scale.setScalar(entry.fit * entry.scale);
      moving ||=
        Math.abs(entry.turn - targetTurn) > 0.0005 ||
        Math.abs(entry.scale - targetScale) > 0.0005;
    }
    renderer.render(scene, camera);
    if (moving && !reduceMotion.matches)
      frame = requestAnimationFrame(drawFrame);
  }

  function restart() {
    cancelAnimationFrame(frame);
    drawFrame();
  }

  function resize() {
    const box = host.getBoundingClientRect();
    renderer.setSize(box.width, box.height);
    camera.left = -box.width / 2;
    camera.right = box.width / 2;
    camera.top = box.height / 2;
    camera.bottom = -box.height / 2;
    camera.updateProjectionMatrix();
    for (const entry of entries) {
      const target = entry.target.getBoundingClientRect();
      entry.fit =
        Math.min(target.width / entry.size.x, target.height / entry.size.y) *
        0.94;
      entry.holder.position.set(
        target.left -
          box.left +
          target.width / 2 -
          box.width / 2 -
          entry.center.x * entry.fit,
        box.height / 2 -
          target.top +
          box.top -
          target.height / 2 -
          entry.center.y * entry.fit,
        0,
      );
    }
    restart();
  }

  function initialize() {
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0, 0);
    host.append(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 3000);
    camera.position.z = 1000;
    addWorldLighting(scene);
    for (const anchor of system.querySelectorAll(".planet-project")) {
      const world = createProjectWorld(anchor.dataset.project);
      world.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(world, true);
      const holder = new THREE.Group();
      holder.add(world);
      scene.add(holder);
      entries.push({
        anchor,
        target: anchor.querySelector(".planet-target"),
        holder,
        world,
        size: bounds.getSize(new THREE.Vector3()),
        center: bounds.getCenter(new THREE.Vector3()),
        fit: 1,
        turn: -0.4,
        scale: 1,
      });
      for (const event of ["pointerenter", "pointerleave", "focus", "blur"])
        anchor.addEventListener(event, restart);
    }
    resize();
    system.classList.add("lowpoly-ready");
    renderer.domElement.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      system.classList.remove("lowpoly-ready");
    });
    renderer.domElement.addEventListener("webglcontextrestored", () => {
      resize();
      system.classList.add("lowpoly-ready");
    });
    new ResizeObserver(resize).observe(host);
    document.fonts.ready.then(resize);
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", restart);
    reduceMotion.addEventListener("change", restart);
    new IntersectionObserver((items) => {
      visible = items[0].isIntersecting;
      restart();
    }).observe(host);
    new MutationObserver(restart).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  initialize();
}

document.querySelectorAll(".project-system").forEach(initializeSystem);

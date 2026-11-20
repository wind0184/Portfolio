import * as THREE from "./vendor/three.module.js";

function addBox(group, material, size, position) {
  const part = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  part.position.set(...position);
  group.add(part);
  return part;
}

function addSphere(group, material, radius, position, scale = [1, 1, 1]) {
  const part = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 16),
    material,
  );
  part.position.set(...position);
  part.scale.set(...scale);
  group.add(part);
  return part;
}

function addRod(group, material, from, to, radius = 0.02) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const direction = end.clone().sub(start);
  const part = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 10),
    material,
  );
  part.position.copy(start.add(end).multiplyScalar(0.5));
  part.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );
  group.add(part);
  return part;
}

function addSymbol(group, text, color, position, size) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.font = "bold 170px Georgia, serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 13;
  context.fillText(text, 128, 132);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const symbol = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    }),
  );
  symbol.position.set(...position);
  symbol.scale.set(size, size, 1);
  group.add(symbol);
}

function learningLandmarks() {
  const group = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({
    color: 0xd6f4e9,
    metalness: 0.55,
    roughness: 0.3,
  });
  const glow = new THREE.MeshBasicMaterial({ color: 0x62ffe2 });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x173d41,
    roughness: 0.8,
  });
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.065, 12, 56),
    frame,
  );
  ring.position.set(-0.03, 0.32, 1.02);
  group.add(ring);
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.33, 0.024, 8, 56),
    glow,
  );
  innerRing.position.set(-0.03, 0.32, 1.045);
  group.add(innerRing);
  const portal = new THREE.Mesh(
    new THREE.CircleGeometry(0.3, 48),
    new THREE.MeshBasicMaterial({
      color: 0x1dc6b5,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    }),
  );
  portal.position.set(-0.03, 0.32, 1.04);
  group.add(portal);
  addBox(group, dark, [0.72, 0.12, 0.24], [-0.03, -0.14, 1.01]);
  addBox(group, frame, [0.82, 0.065, 0.28], [-0.03, -0.08, 1.04]);
  for (const angle of [-0.75, 0.75, Math.PI]) {
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.12, 0.035),
      glow,
    );
    marker.position.set(
      -0.03 + Math.sin(angle) * 0.4,
      0.32 + Math.cos(angle) * 0.4,
      1.09,
    );
    marker.rotation.z = -angle;
    group.add(marker);
  }
  const cover = new THREE.MeshStandardMaterial({
    color: 0xf3c27b,
    roughness: 0.65,
  });
  const pages = new THREE.MeshStandardMaterial({
    color: 0xf2f5e8,
    roughness: 0.9,
  });
  const book = new THREE.Group();
  book.position.set(0.5, -0.25, 0.95);
  book.rotation.set(0.1, -0.2, -0.2);
  addBox(book, cover, [0.28, 0.38, 0.075], [0, 0, 0]);
  addBox(book, pages, [0.235, 0.335, 0.08], [0.005, 0, 0.02]);
  addBox(book, cover, [0.28, 0.38, 0.02], [0, 0, 0.07]);
  group.add(book);
  addSymbol(group, "∫", "#d7fff1", [-0.5, -0.32, 0.98], 0.46);
  addSymbol(group, "π", "#a4e6d2", [0.44, 0.5, 0.9], 0.3);
  return group;
}

function fishingLandmarks() {
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({
    color: 0xc99253,
    roughness: 0.65,
  });
  const rodMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd08c,
    roughness: 0.45,
  });
  const ropeMaterial = new THREE.LineBasicMaterial({ color: 0xd7f3ff });
  const hull = addBox(group, wood, [0.7, 0.18, 0.28], [-0.18, 0.02, 1.05]);
  hull.rotation.z = -0.12;
  addBox(
    group,
    new THREE.MeshStandardMaterial({ color: 0xf3cb87 }),
    [0.6, 0.04, 0.22],
    [-0.18, 0.13, 1.05],
  );
  addRod(group, rodMaterial, [-0.1, 0.16, 1.12], [0.35, 1.0, 0.95], 0.028);
  const line = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.35, 1.0, 0.95),
    new THREE.Vector3(0.77, 0.85, 1.08),
    new THREE.Vector3(0.6, 0.03, 1.18),
  );
  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(line.getPoints(32)),
      ropeMaterial,
    ),
  );
  const hook = new THREE.Mesh(
    new THREE.TorusGeometry(0.085, 0.014, 6, 22, Math.PI * 1.65),
    new THREE.MeshStandardMaterial({
      color: 0xd4eef6,
      metalness: 0.7,
      roughness: 0.2,
    }),
  );
  hook.position.set(0.55, -0.025, 1.18);
  hook.rotation.z = 0.7;
  group.add(hook);
  const fish = new THREE.Group();
  fish.position.set(0.23, -0.4, 1.02);
  fish.rotation.z = 0.18;
  const coral = new THREE.MeshStandardMaterial({
    color: 0xff996b,
    roughness: 0.55,
  });
  addSphere(fish, coral, 0.22, [0, 0, 0], [1.35, 0.62, 0.6]);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.24, 3), coral);
  tail.rotation.z = Math.PI / 2;
  tail.position.x = -0.32;
  fish.add(tail);
  addSphere(
    fish,
    new THREE.MeshBasicMaterial({ color: 0x102c43 }),
    0.025,
    [0.16, 0.035, 0.13],
  );
  group.add(fish);
  const rippleMaterial = new THREE.MeshBasicMaterial({
    color: 0x8adbe8,
    transparent: true,
    opacity: 0.4,
  });
  for (const radius of [0.38, 0.53]) {
    const ripple = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.012, 6, 50),
      rippleMaterial,
    );
    ripple.position.set(-0.16, -0.15, 0.95);
    ripple.scale.y = 0.5;
    group.add(ripple);
  }
  return group;
}

function weatherLandmarks() {
  const group = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({
    color: 0xf4f8ff,
    roughness: 0.9,
  });
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffc85b });
  addSphere(group, sunMaterial, 0.23, [0.43, 0.56, 0.89]);
  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2;
    addRod(
      group,
      sunMaterial,
      [0.43 + Math.cos(angle) * 0.29, 0.56 + Math.sin(angle) * 0.29, 0.9],
      [0.43 + Math.cos(angle) * 0.39, 0.56 + Math.sin(angle) * 0.39, 0.9],
      0.016,
    );
  }
  addSphere(group, white, 0.24, [-0.35, 0.4, 1.0], [1.1, 0.75, 0.7]);
  addSphere(group, white, 0.3, [-0.08, 0.5, 0.98], [1.0, 1.0, 0.8]);
  addSphere(group, white, 0.24, [0.18, 0.36, 1.02], [1.1, 0.8, 0.7]);
  const rain = new THREE.MeshBasicMaterial({ color: 0x74c9ff });
  for (const x of [-0.46, -0.22, 0.02]) {
    addRod(group, rain, [x, 0.05, 1.12], [x - 0.1, -0.21, 1.12], 0.018);
    addRod(group, rain, [x - 0.1, -0.29, 1.05], [x - 0.17, -0.46, 1.05], 0.014);
  }
  const bolt = new THREE.Shape();
  bolt.moveTo(0.08, 0.18);
  bolt.lineTo(-0.08, -0.1);
  bolt.lineTo(0.04, -0.1);
  bolt.lineTo(-0.04, -0.35);
  bolt.lineTo(0.22, -0.02);
  bolt.lineTo(0.1, -0.02);
  bolt.lineTo(0.21, 0.18);
  const lightning = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bolt, { depth: 0.035, bevelEnabled: false }),
    sunMaterial,
  );
  lightning.position.set(0.22, -0.02, 1.1);
  group.add(lightning);
  const ice = new THREE.MeshBasicMaterial({ color: 0xd9f4ff });
  for (let index = 0; index < 3; index++) {
    const angle = (index / 3) * Math.PI;
    addRod(
      group,
      ice,
      [0.48 - Math.cos(angle) * 0.13, -0.44 - Math.sin(angle) * 0.13, 1.01],
      [0.48 + Math.cos(angle) * 0.13, -0.44 + Math.sin(angle) * 0.13, 1.01],
      0.014,
    );
  }
  return group;
}

function robotLandmarks() {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({
    color: 0x9bafbf,
    metalness: 0.65,
    roughness: 0.35,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x263e50,
    metalness: 0.5,
    roughness: 0.4,
  });
  const orange = new THREE.MeshStandardMaterial({
    color: 0xffa15d,
    metalness: 0.25,
    roughness: 0.4,
  });
  const visor = new THREE.MeshStandardMaterial({
    color: 0x071a28,
    metalness: 0.5,
    roughness: 0.25,
  });
  const eye = new THREE.MeshBasicMaterial({ color: 0x74edff });
  const robot = new THREE.Group();
  robot.position.set(0.08, 0.28, 1.04);
  addBox(robot, steel, [0.44, 0.33, 0.25], [0, 0.38, 0]);
  addBox(robot, visor, [0.35, 0.13, 0.035], [0, 0.39, 0.145]);
  addBox(robot, eye, [0.08, 0.035, 0.02], [-0.085, 0.4, 0.17]);
  addBox(robot, eye, [0.08, 0.035, 0.02], [0.085, 0.4, 0.17]);
  addRod(robot, steel, [0, 0.55, 0], [0, 0.75, 0], 0.019);
  addSphere(robot, orange, 0.055, [0, 0.77, 0]);
  addBox(robot, dark, [0.5, 0.44, 0.27], [0, -0.04, 0]);
  addBox(robot, orange, [0.24, 0.16, 0.035], [0, -0.02, 0.155]);
  addBox(robot, steel, [0.14, 0.33, 0.17], [-0.35, -0.02, 0]).rotation.z =
    -0.17;
  addBox(robot, steel, [0.14, 0.33, 0.17], [0.35, -0.02, 0]).rotation.z = 0.17;
  addBox(robot, steel, [0.15, 0.26, 0.19], [-0.13, -0.4, 0]);
  addBox(robot, steel, [0.15, 0.26, 0.19], [0.13, -0.4, 0]);
  group.add(robot);
  const gear = new THREE.Group();
  gear.position.set(-0.48, -0.39, 0.94);
  gear.rotation.z = 0.2;
  gear.add(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.065, 10, 36), orange));
  for (let index = 0; index < 10; index++) {
    const angle = (index / 10) * Math.PI * 2;
    const tooth = addBox(
      gear,
      steel,
      [0.085, 0.11, 0.09],
      [Math.sin(angle) * 0.25, Math.cos(angle) * 0.25, 0],
    );
    tooth.rotation.z = -angle;
  }
  group.add(gear);
  return group;
}

export function createProjectLandmarks(projectId) {
  const builders = {
    "calculus-lab-escape": learningLandmarks,
    "vr-fishing": fishingLandmarks,
    "weather-simulation": weatherLandmarks,
    "interactive-robot": robotLandmarks,
  };
  return builders[projectId]();
}

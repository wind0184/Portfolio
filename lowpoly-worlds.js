import * as THREE from "./vendor/three.module.js";

const UP = new THREE.Vector3(0, 1, 0);

function material(color, metalness = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness: 0.9,
    flatShading: true,
  });
}

function mesh(group, geometry, surface, position = [0, 0, 0]) {
  const object = new THREE.Mesh(geometry, surface);
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  group.add(object);
  return object;
}

function box(group, surface, size, position) {
  return mesh(group, new THREE.BoxGeometry(...size), surface, position);
}

function rod(group, surface, start, end, radius = 0.02) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const object = mesh(
    group,
    new THREE.CylinderGeometry(radius, radius, direction.length(), 7),
    surface,
  );
  object.position.copy(a.add(b).multiplyScalar(0.5));
  object.quaternion.setFromUnitVectors(UP, direction.normalize());
  return object;
}

// Props are built with feet/foundations at local y=0 and aligned to the sphere normal.
function mount(world, object, x, z, elevation = 0.985) {
  const normal = new THREE.Vector3(x, Math.sqrt(1 - x * x - z * z), z);
  object.position.copy(normal.clone().multiplyScalar(elevation));
  object.quaternion.setFromUnitVectors(UP, normal);
  world.add(object);
  return object;
}

function globe(world, color) {
  const geometry = new THREE.IcosahedronGeometry(1, 2);
  const positions = geometry.getAttribute("position");
  const colors = [];
  const base = new THREE.Color(color);
  for (let index = 0; index < positions.count; index += 3) {
    const variation = 0.94 + Math.sin(index * 17.23) * 0.055;
    const face = base.clone().multiplyScalar(variation);
    for (let vertex = 0; vertex < 3; vertex++)
      colors.push(face.r, face.g, face.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const surface = material(0xffffff);
  surface.vertexColors = true;
  mesh(world, geometry, surface);
}

function pine(world, x, z, size = 1, snowy = false) {
  const tree = new THREE.Group();
  const bark = material("#75624d");
  const green = material(snowy ? "#d7e2e3" : "#426d59");
  mesh(
    tree,
    new THREE.CylinderGeometry(0.025, 0.035, 0.17, 5),
    bark,
    [0, 0.085, 0],
  );
  mesh(tree, new THREE.ConeGeometry(0.17, 0.35, 6), green, [0, 0.3, 0]);
  mesh(tree, new THREE.ConeGeometry(0.13, 0.28, 6), green, [0, 0.48, 0]);
  tree.scale.setScalar(size);
  mount(world, tree, x, z);
}

function learningWorld(world) {
  globe(world, "#476b59");
  const riverVertices = [];
  const riverIndices = [];
  for (let index = 0; index <= 22; index++) {
    const z = -0.65 + (index / 22) * 1.35;
    const center = 0.23 + Math.sin(z * 3) * 0.06;
    for (const offset of [-0.075, 0.075]) {
      const x = center + offset;
      riverVertices.push(x, Math.sqrt(1 - x * x - z * z) + 0.008, z);
    }
    if (index < 22) {
      const start = index * 2;
      riverIndices.push(
        start,
        start + 2,
        start + 1,
        start + 1,
        start + 2,
        start + 3,
      );
    }
  }
  const river = new THREE.BufferGeometry();
  river.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(riverVertices, 3),
  );
  river.setIndex(riverIndices);
  river.computeVertexNormals();
  mesh(
    world,
    river,
    new THREE.MeshStandardMaterial({
      color: "#4a98a2",
      roughness: 0.75,
      side: THREE.DoubleSide,
    }),
  );

  const portal = new THREE.Group();
  const concrete = material("#a6b9b7");
  const charcoal = material("#344d54");
  mesh(
    portal,
    new THREE.CylinderGeometry(0.41, 0.45, 0.1, 10),
    charcoal,
    [0, 0.05, 0],
  );
  const ring = mesh(
    portal,
    new THREE.TorusGeometry(0.32, 0.055, 6, 24),
    concrete,
    [0, 0.46, 0],
  );
  ring.rotation.y = -0.05;
  const energy = new THREE.MeshStandardMaterial({
    color: "#66bbc2",
    emissive: "#2d797d",
    emissiveIntensity: 0.45,
    roughness: 1,
    side: THREE.DoubleSide,
  });
  const portalFace = mesh(
    portal,
    new THREE.CircleGeometry(0.26, 24),
    energy,
    [0, 0.46, 0.01],
  );
  portalFace.castShadow = false;
  portalFace.receiveShadow = false;
  rod(portal, concrete, [-0.24, 0.09, 0], [-0.24, 0.26, 0], 0.035);
  rod(portal, concrete, [0.24, 0.09, 0], [0.24, 0.26, 0], 0.035);
  mount(world, portal, -0.17, -0.2);

  const bridge = new THREE.Group();
  const wood = material("#a28258");
  const rail = material("#725c45");
  for (let index = 0; index < 7; index++)
    box(bridge, wood, [0.085, 0.045, 0.3], [-0.27 + index * 0.09, 0.06, 0]);
  for (const x of [-0.27, 0.27]) {
    for (const z of [-0.15, 0.15])
      rod(bridge, rail, [x, -0.04, z], [x, 0.3, z], 0.023);
  }
  for (const z of [-0.15, 0.15])
    rod(bridge, wood, [-0.29, 0.28, z], [0.29, 0.28, z], 0.02);
  mount(world, bridge, 0.27, 0.4);
  pine(world, -0.56, 0.22, 0.9);
  pine(world, 0.51, -0.42, 0.8);
  pine(world, -0.46, -0.48, 0.65);
}

function fishingWorld(world) {
  globe(world, "#2e6885");
  mesh(
    world,
    new THREE.SphereGeometry(1.007, 24, 8, 0, Math.PI * 2, 0, 0.64),
    material("#45979c"),
  );
  mesh(
    world,
    new THREE.SphereGeometry(1.015, 24, 8, 0, Math.PI * 2, 0, 0.5),
    material("#bca681"),
  );
  const dock = new THREE.Group();
  const wood = material("#9a7953");
  for (let index = 0; index < 7; index++)
    box(dock, wood, [0.34, 0.035, 0.085], [0, 0.12, -0.25 + index * 0.085]);
  for (const x of [-0.13, 0.13]) {
    for (const z of [-0.2, 0.23])
      rod(dock, wood, [x, -0.12, z], [x, 0.2, z], 0.025);
  }
  const jacket = material("#bb805d");
  const trousers = material("#334553");
  const skin = material("#c7ae8c");
  box(dock, trousers, [0.055, 0.1, 0.075], [-0.045, 0.19, -0.03]);
  box(dock, trousers, [0.055, 0.1, 0.075], [0.045, 0.19, -0.03]);
  mesh(
    dock,
    new THREE.CylinderGeometry(0.09, 0.08, 0.2, 7),
    jacket,
    [0, 0.33, -0.03],
  );
  mesh(dock, new THREE.IcosahedronGeometry(0.09, 1), skin, [0, 0.49, -0.03]);
  rod(dock, jacket, [0.07, 0.38, -0.03], [0.16, 0.34, 0.08], 0.03);
  const pole = material("#615c4d");
  rod(dock, pole, [0.16, 0.34, 0.08], [0.49, 1.0, 0.14], 0.012);
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.49, 1.0, 0.14),
    new THREE.Vector3(0.74, 0.9, 0.3),
    new THREE.Vector3(0.7, 0.05, 0.48),
  );
  dock.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(30)),
      new THREE.LineBasicMaterial({ color: "#c5d8dc" }),
    ),
  );
  mount(world, dock, 0.2, 0.42);

  const palm = new THREE.Group();
  rod(palm, wood, [0, 0, 0], [-0.07, 0.6, 0], 0.035);
  const leaves = material("#4a785c");
  leaves.side = THREE.DoubleSide;
  for (let index = 0; index < 5; index++) {
    const angle = (index / 5) * Math.PI * 2;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        [
          -0.07,
          0.64,
          0,
          -0.07 + Math.cos(angle) * 0.35,
          0.49,
          Math.sin(angle) * 0.35,
          -0.07 + Math.cos(angle + 0.5) * 0.18,
          0.58,
          Math.sin(angle + 0.5) * 0.18,
        ],
        3,
      ),
    );
    geometry.computeVertexNormals();
    mesh(palm, geometry, leaves);
  }
  mount(world, palm, -0.32, -0.18);

  const fish = new THREE.Group();
  const coral = material("#bc8d6d");
  mesh(
    fish,
    new THREE.SphereGeometry(0.13, 8, 5),
    coral,
    [0, 0.07, 0],
  ).scale.set(1.6, 0.65, 0.6);
  const tail = mesh(
    fish,
    new THREE.ConeGeometry(0.09, 0.12, 3),
    coral,
    [-0.22, 0.07, 0],
  );
  tail.rotation.z = Math.PI / 2;
  mount(world, fish, 0.63, 0.35);
}

function weatherWorld(world) {
  globe(world, "#6b8590");
  mesh(
    world,
    new THREE.SphereGeometry(1.008, 24, 8, 0, Math.PI * 2, 0, 0.68),
    material("#aebcbd"),
  );
  const stone = material("#b6c2c1");
  const glass = material("#547c91");
  const roof = material("#d7e0dd");
  for (const [x, z, height] of [
    [-0.28, 0.15, 0.35],
    [0.12, -0.1, 0.64],
    [0.42, 0.28, 0.28],
  ]) {
    const building = new THREE.Group();
    box(building, stone, [0.2, height, 0.22], [0, height / 2, 0]);
    box(building, roof, [0.22, 0.035, 0.24], [0, height + 0.017, 0]);
    for (let index = 0; index < Math.floor(height / 0.1); index++)
      box(
        building,
        glass,
        [0.13, 0.035, 0.008],
        [0, 0.07 + index * 0.1, 0.115],
      );
    mount(world, building, x, z);
  }
  pine(world, -0.52, -0.18, 0.65, true);
  pine(world, 0.36, -0.42, 0.65);
  const cloud = new THREE.Group();
  const white = material("#c8d4d9");
  for (const [x, y, radius] of [
    [-0.25, 0, 0.2],
    [0, 0.07, 0.25],
    [0.23, 0, 0.19],
  ])
    mesh(cloud, new THREE.IcosahedronGeometry(radius, 1), white, [x, y, 0]);
  cloud.position.set(-0.12, 1.82, -0.06);
  world.add(cloud);
  mesh(
    world,
    new THREE.IcosahedronGeometry(0.17, 1),
    material("#c6a56b"),
    [0.38, 1.78, -0.22],
  );
  const rain = material("#6cadd0");
  for (const x of [-0.4, -0.22, -0.04])
    rod(world, rain, [x, 1.62, 0.1], [x - 0.05, 1.38, 0.1], 0.008);
}

function robotWorld(world) {
  globe(world, "#4b555f");
  const steel = material("#9aa7ae", 0.2);
  const dark = material("#2d343d", 0.15);
  const blue = material("#3e6685", 0.12);
  const red = material("#944b43");
  const robot = new THREE.Group();
  mesh(
    robot,
    new THREE.CylinderGeometry(0.36, 0.39, 0.08, 10),
    steel,
    [0, 0.04, 0],
  );
  for (const x of [-0.1, 0.1]) {
    box(robot, blue, [0.15, 0.09, 0.23], [x, 0.125, 0.03]);
    box(robot, dark, [0.1, 0.12, 0.12], [x, 0.23, 0]);
    box(robot, blue, [0.13, 0.22, 0.14], [x, 0.39, 0]);
  }
  box(robot, red, [0.32, 0.07, 0.2], [0, 0.51, 0]);
  box(robot, blue, [0.3, 0.28, 0.19], [0, 0.68, 0]);
  box(robot, dark, [0.43, 0.12, 0.21], [0, 0.85, 0]);
  for (const x of [-0.23, 0.23]) {
    box(robot, dark, [0.12, 0.13, 0.18], [x, 0.82, 0]);
    box(robot, blue, [0.09, 0.23, 0.12], [x, 0.64, 0]);
    box(robot, steel, [0.08, 0.12, 0.11], [x, 0.46, 0]);
  }
  mesh(
    robot,
    new THREE.IcosahedronGeometry(0.17, 0),
    steel,
    [0, 1.05, 0],
  ).scale.set(1, 0.85, 0.8);
  box(robot, dark, [0.18, 0.05, 0.025], [0, 1.05, 0.13]);
  const eyes = new THREE.MeshBasicMaterial({ color: "#bad2d6" });
  box(robot, eyes, [0.04, 0.018, 0.012], [-0.045, 1.05, 0.148]);
  box(robot, eyes, [0.04, 0.018, 0.012], [0.045, 1.05, 0.148]);
  mount(world, robot, 0.03, -0.02);

  const gear = new THREE.Group();
  const bronze = material("#9e825c", 0.15);
  mesh(gear, new THREE.TorusGeometry(0.16, 0.045, 5, 20), bronze, [0, 0.23, 0]);
  for (let index = 0; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2;
    const tooth = box(
      gear,
      steel,
      [0.07, 0.08, 0.07],
      [Math.sin(angle) * 0.2, 0.23 + Math.cos(angle) * 0.2, 0],
    );
    tooth.rotation.z = -angle;
  }
  rod(gear, dark, [0, 0, 0], [0, 0.22, 0], 0.025);
  mount(world, gear, -0.43, 0.32);
  for (const x of [-0.48, 0.48]) {
    const plate = new THREE.Group();
    box(plate, dark, [0.25, 0.025, 0.2], [0, 0.01, 0]);
    mount(world, plate, x, -0.4);
  }
}

function qoiWorld(world) {
  globe(world, "#825d48");
  const copper = material("#b98b64", 0.12);
  const dark = material("#353d43");
  const cream = material("#ddd6bc");
  const screen = new THREE.Group();
  for (const x of [-0.23, 0.23]) {
    box(screen, dark, [0.055, 0.26, 0.07], [x, 0.13, 0]);
    box(screen, copper, [0.15, 0.04, 0.2], [x, 0.02, 0]);
  }
  box(screen, dark, [0.87, 0.65, 0.09], [0, 0.58, 0]);
  box(screen, cream, [0.76, 0.54, 0.025], [0, 0.58, 0.059]);
  const pixelColors = ["#c6745e", "#e0b575", "#638b7b", "#5e859a"];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      box(
        screen,
        material(pixelColors[(row + col) % 4]),
        [0.127, 0.13, 0.012],
        [-0.28 + col * 0.14, 0.75 - row * 0.16, 0.079],
      );
    }
  }
  mount(world, screen, -0.05, -0.23);
  const chip = new THREE.Group();
  box(chip, copper, [0.46, 0.035, 0.43], [0, 0.017, 0]);
  box(chip, dark, [0.28, 0.075, 0.27], [0, 0.065, 0]);
  box(chip, cream, [0.16, 0.015, 0.16], [0, 0.11, 0]);
  for (let index = -1; index <= 1; index++) {
    for (const direction of [-1, 1]) {
      box(
        chip,
        cream,
        [0.07, 0.02, 0.025],
        [direction * 0.18, 0.06, index * 0.07],
      );
      box(
        chip,
        cream,
        [0.025, 0.02, 0.07],
        [index * 0.07, 0.06, direction * 0.18],
      );
    }
  }
  mount(world, chip, -0.28, 0.45);
  for (const x of [0.32, 0.55]) {
    const server = new THREE.Group();
    box(server, dark, [0.16, 0.34, 0.18], [0, 0.17, 0]);
    for (let index = 0; index < 3; index++)
      box(server, copper, [0.12, 0.035, 0.012], [0, 0.08 + index * 0.08, 0.1]);
    mount(world, server, x, 0.02);
  }
}

function flightWorld(world) {
  globe(world, "#6c5b76");
  const pale = material("#dddcd3");
  const dark = material("#41434e");
  const red = material("#ad655c");
  const rocket = new THREE.Group();
  mesh(
    rocket,
    new THREE.CylinderGeometry(0.39, 0.44, 0.075, 10),
    dark,
    [0, 0.037, 0],
  );
  const body = mesh(
    rocket,
    new THREE.CylinderGeometry(0.14, 0.16, 0.67, 10),
    pale,
    [0, 0.55, 0],
  );
  mesh(rocket, new THREE.ConeGeometry(0.14, 0.29, 10), red, [0, 1.03, 0]);
  mesh(
    rocket,
    new THREE.CylinderGeometry(0.105, 0.16, 0.14, 8),
    dark,
    [0, 0.15, 0],
  );
  const rim = mesh(
    rocket,
    new THREE.CylinderGeometry(0.088, 0.088, 0.035, 12),
    dark,
    [0, 0.67, 0.14],
  );
  rim.rotation.x = Math.PI / 2;
  const window = mesh(
    rocket,
    new THREE.CylinderGeometry(0.06, 0.06, 0.039, 12),
    material("#7aafc3"),
    [0, 0.67, 0.159],
  );
  window.rotation.x = Math.PI / 2;
  for (const angle of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const fin = mesh(rocket, new THREE.ConeGeometry(0.15, 0.4, 3), red, [
      Math.sin(angle) * 0.17,
      0.28,
      Math.cos(angle) * 0.17,
    ]);
    fin.rotation.y = angle;
    fin.scale.z = 0.35;
  }
  mount(world, rocket, -0.1, 0.02);
  const beacon = new THREE.Group();
  rod(beacon, pale, [0, 0, 0], [0, 0.52, 0], 0.018);
  const flag = box(
    beacon,
    material("#98b2a1"),
    [0.22, 0.13, 0.02],
    [0.1, 0.43, 0],
  );
  mount(world, beacon, 0.49, 0.18);
  for (const [x, z, radius] of [
    [-0.5, 0.3, 0.14],
    [0.35, -0.5, 0.12],
    [0.55, 0.42, 0.09],
  ]) {
    const rock = new THREE.Group();
    mesh(rock, new THREE.IcosahedronGeometry(radius, 0), material("#978a9e"), [
      0,
      radius * 0.6,
      0,
    ]);
    mount(world, rock, x, z);
  }
}

function envelope(group, color, position, scale = 1) {
  const letter = new THREE.Group();
  box(letter, material(color), [0.3, 0.21, 0.035], [0, 0.105, 0]);
  const seam = material("#768797");
  rod(letter, seam, [-0.14, 0.2, 0.022], [0, 0.09, 0.022], 0.007);
  rod(letter, seam, [0.14, 0.2, 0.022], [0, 0.09, 0.022], 0.007);
  letter.position.set(...position);
  letter.scale.setScalar(scale);
  group.add(letter);
  return letter;
}

function classifierWorld(world) {
  globe(world, "#4a5b88");
  const dark = material("#333e53");
  const steel = material("#a8b5c9");
  const station = new THREE.Group();
  box(station, dark, [0.95, 0.07, 0.39], [0, 0.1, 0]);
  for (const x of [-0.35, 0.35]) {
    box(station, steel, [0.045, 0.1, 0.25], [x, 0.05, 0]);
    box(station, steel, [0.06, 0.56, 0.08], [x * 0.6, 0.36, -0.08]);
  }
  box(station, steel, [0.48, 0.09, 0.13], [0, 0.67, -0.08]);
  const node = material("#b0c9d2");
  for (const [x, y] of [
    [0, 0.87],
    [-0.14, 0.74],
    [0.14, 0.74],
  ]) {
    mesh(station, new THREE.IcosahedronGeometry(0.055, 1), node, [x, y, -0.08]);
  }
  rod(station, steel, [0, 0.84, -0.08], [-0.14, 0.74, -0.08], 0.012);
  rod(station, steel, [0, 0.84, -0.08], [0.14, 0.74, -0.08], 0.012);
  envelope(station, "#d5d6ca", [-0.24, 0.14, 0.04]);
  envelope(station, "#d5d6ca", [0.2, 0.14, 0.04], 0.8);
  mount(world, station, -0.03, -0.12);
  for (const [x, color] of [
    [-0.46, "#789b88"],
    [0.46, "#b37977"],
  ]) {
    const tray = new THREE.Group();
    const surface = material(color);
    box(tray, surface, [0.33, 0.07, 0.28], [0, 0.035, 0]);
    for (const side of [-1, 1])
      box(tray, surface, [0.025, 0.14, 0.28], [side * 0.155, 0.09, 0]);
    envelope(tray, "#deded4", [0, 0.07, 0.02], 0.72);
    mount(world, tray, x, 0.38);
  }
}

function supportWorld(world) {
  globe(world, "#427f7b");
  const cream = material("#e0dfd2");
  const dark = material("#314a52");
  const mint = material("#8db6a4");
  const phone = new THREE.Group();
  box(phone, dark, [0.53, 1.02, 0.12], [0, 0.53, 0]);
  box(phone, material("#a8c5be"), [0.45, 0.83, 0.018], [0, 0.55, 0.07]);
  box(phone, cream, [0.29, 0.13, 0.02], [-0.035, 0.78, 0.09]);
  box(phone, dark, [0.23, 0.12, 0.02], [0.06, 0.57, 0.09]);
  box(phone, cream, [0.3, 0.13, 0.02], [-0.02, 0.36, 0.09]);
  box(phone, dark, [0.1, 0.016, 0.02], [0, 0.98, 0.066]);
  mesh(phone, new THREE.SphereGeometry(0.024, 7, 5), cream, [0, 0.085, 0.068]);
  mount(world, phone, -0.04, -0.18);
  const agent = new THREE.Group();
  for (const x of [-0.055, 0.055]) {
    box(agent, dark, [0.07, 0.12, 0.09], [x, 0.06, 0]);
  }
  box(agent, mint, [0.22, 0.24, 0.15], [0, 0.23, 0]);
  mesh(agent, new THREE.IcosahedronGeometry(0.115, 1), cream, [0, 0.47, 0]);
  const headset = mesh(
    agent,
    new THREE.TorusGeometry(0.125, 0.018, 5, 16, Math.PI),
    dark,
    [0, 0.47, 0],
  );
  for (const x of [-0.13, 0.13])
    box(agent, dark, [0.045, 0.09, 0.065], [x, 0.46, 0]);
  rod(agent, dark, [0.13, 0.43, 0], [0.09, 0.4, 0.12], 0.012);
  mount(world, agent, -0.43, 0.35);
  const antenna = new THREE.Group();
  mesh(
    antenna,
    new THREE.CylinderGeometry(0.12, 0.16, 0.06, 8),
    dark,
    [0, 0.03, 0],
  );
  rod(antenna, cream, [0, 0.05, 0], [0, 0.52, 0], 0.018);
  mesh(antenna, new THREE.IcosahedronGeometry(0.07, 1), mint, [0, 0.56, 0]);
  mount(world, antenna, 0.47, 0.05);
}

export function createProjectWorld(projectId) {
  const builders = {
    "calculus-lab-escape": learningWorld,
    "vr-fishing": fishingWorld,
    "weather-simulation": weatherWorld,
    "interactive-robot": robotWorld,
    "parallel-qoi": qoiWorld,
    "fly-me-to-the-earth": flightWorld,
    "spam-classifier": classifierWorld,
    "eoe-customer-support": supportWorld,
  };
  const world = new THREE.Group();
  builders[projectId](world);
  world.rotation.set(0.45, -0.4, 0);
  return world;
}

export function addWorldLighting(scene) {
  scene.add(new THREE.HemisphereLight(0xd9e6ee, 0x74818e, 1.45));
  const key = new THREE.DirectionalLight(0xfff3df, 2.3);
  key.position.set(-500, 800, 900);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1000;
  key.shadow.camera.right = 1000;
  key.shadow.camera.top = 900;
  key.shadow.camera.bottom = -900;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 3000;
  key.shadow.bias = -0.0001;
  key.shadow.normalBias = 0.3;
  scene.add(key);
}

import * as THREE from "./assets/vendor/three.module.min.js";
import { GLTFLoader } from "./assets/vendor/GLTFLoader.js";
import { cuts } from "./guide.js";

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const defaultYaw = 0.52,
  defaultPitch = 0.5;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Blend the roast skin in model space so it follows the separate cuts without UV seams.
function roastMaterial(texture, tint) {
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    color: tint,
    roughness: 0.52,
    metalness: 0,
  });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader =
      "varying vec3 roastPosition; varying vec3 roastNormal;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      roastPosition = position; roastNormal = normal;
    `,
    );
    shader.fragmentShader =
      "varying vec3 roastPosition; varying vec3 roastNormal;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
      vec3 w = pow(abs(normalize(roastNormal)),vec3(5.));
      w /= max(.0001,w.x+w.y+w.z);
      vec3 p = roastPosition * 5.8;
      vec3 skin = texture2D(map,p.zy).rgb*w.x + texture2D(map,p.xz).rgb*w.y + texture2D(map,p.xy).rgb*w.z;
      float crown = smoothstep(.065,.155,roastPosition.y);
      diffuseColor.rgb *= skin * mix(vec3(.96,.78,.62), vec3(.88,.73,.64),crown);
    `,
    );
  };
  return mat;
}

function boneTip(side) {
  const tip = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({
    color: 0xf6e4c3,
    roughness: 0.68,
  });
  const start = V(-0.178, 0.153, side * 0.034),
    end = V(-0.204, 0.172, side * 0.024);
  const axis = end.clone().sub(start);
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.008, axis.length(), 14),
    bone,
  );
  shaft.position.copy(start).lerp(end, 0.5);
  shaft.quaternion.setFromUnitVectors(V(0, 1, 0), axis.normalize());
  tip.add(shaft);
  for (const sign of [-1, 1]) {
    const knob = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), bone);
    knob.position.copy(end);
    knob.position.z += sign * 0.0045;
    knob.scale.set(0.008, 0.007, 0.006);
    tip.add(knob);
  }
  return tip;
}

function wingTip(side, material) {
  const curve = new THREE.CatmullRomCurve3([
    V(0.129, 0.094, side * 0.104),
    V(0.142, 0.078, side * 0.109),
    V(0.127, 0.061, side * 0.12),
    V(0.102, 0.051, side * 0.127),
    V(0.075, 0.048, side * 0.128),
  ]);
  const geo = new THREE.TubeGeometry(curve, 20, 0.012, 12, false);
  const positions = geo.getAttribute("position");
  const point = new THREE.Vector3();
  for (let i = 0; i <= 20; i++) {
    const t = i / 20,
      center = curve.getPointAt(t),
      radius = 1.16 * (1 - t * t) + 0.045;
    for (let j = 0; j <= 12; j++) {
      const index = i * 13 + j;
      point
        .fromBufferAttribute(positions, index)
        .sub(center)
        .multiplyScalar(radius)
        .add(center);
      positions.setXYZ(index, point.x, point.y, point.z);
    }
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

// Use grouped instances for the small rosemary needles and veined sage leaves.
function herbs() {
  const herbGroup = new THREE.Group(),
    leaves = [],
    stems = [];
  function sprig(origin, angle, length, sage) {
    const dir = V(Math.cos(angle), 0.07, Math.sin(angle));
    const tip = origin.clone().addScaledVector(dir, length);
    stems.push([origin, tip]);
    const count = sage ? 4 : 14;
    for (let j = 1; j <= count; j++) {
      const t = j / (count + 1);
      for (const side of [-1, 1]) {
        const point = origin.clone().lerp(tip, t);
        const spread =
          angle + side * (sage ? 0.85 : 0.7) + 0.12 * Math.sin(j * 3.8);
        const size = (sage ? 0.03 : 0.016) * (1 - 0.44 * t);
        const m = new THREE.Object3D();
        m.position.copy(point);
        m.rotation.order = "YXZ";
        m.rotation.y = -spread;
        m.rotation.z = 0.16 + 0.2 * Math.sin(j * 2 + side);
        m.rotation.x = 0.23 * side;
        m.scale.set(size, sage ? 0.004 : 0.0014, sage ? 0.0085 : 0.00135);
        m.updateMatrix();
        leaves.push({
          matrix: m.matrix.clone(),
          color: new THREE.Color().setHSL(
            sage ? 0.206 : 0.23,
            0.21 + 0.09 * (j % 2),
            0.23 + 0.07 * Math.sin(j + side),
          ),
        });
      }
    }
  }
  const locations = [
    [-0.211, 0.031, 0.065, 0.8, 0.103, false],
    [-0.155, 0.026, 0.112, 0.45, 0.095, false],
    [-0.171, 0.028, 0.114, 1.04, 0.064, true],
    [0.052, 0.021, 0.164, -0.25, 0.123, false],
    [0.154, 0.029, 0.102, -0.99, 0.075, true],
    [0.2, 0.033, -0.012, 1.51, 0.097, false],
    [0.129, 0.026, -0.123, 3.55, 0.082, true],
    [-0.148, 0.028, -0.093, 2.98, 0.1, false],
    [-0.007, 0.026, -0.156, -0.12, 0.089, false],
  ];
  for (const [x, y, z, angle, len, sage] of locations)
    sprig(V(x, y, z), angle, len, sage);
  const verts = [],
    indices = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8,
      w = Math.pow(Math.sin(t * Math.PI), 0.85);
    verts.push(
      t,
      0.25 * w,
      -w,
      t,
      w + 0.2 * Math.sin(2 * t * Math.PI),
      0,
      t,
      0,
      w,
    );
    if (i < 8) {
      const n = i * 3;
      indices.push(
        n,
        n + 1,
        n + 3,
        n + 3,
        n + 1,
        n + 4,
        n + 1,
        n + 2,
        n + 4,
        n + 4,
        n + 2,
        n + 5,
      );
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const leavesMesh = new THREE.InstancedMesh(
    geo,
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.76 }),
    leaves.length,
  );
  leaves.forEach(({ matrix, color }, i) => {
    leavesMesh.setMatrixAt(i, matrix);
    leavesMesh.setColorAt(i, color);
  });
  herbGroup.add(leavesMesh);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x696637,
    roughness: 0.72,
  });
  for (const [a, b] of stems) {
    const dir = b.clone().sub(a);
    const s = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0006, 0.0013, dir.length(), 6),
      stemMat,
    );
    s.position.copy(a).lerp(b, 0.5);
    s.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
    herbGroup.add(s);
  }
  return herbGroup;
}

function createFrame() {
  const frame = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({
    color: 0xd3b58c,
    roughness: 0.84,
  });
  function curve(points, radius) {
    const path = new THREE.CatmullRomCurve3(points);
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(path, 22, radius, 7, false),
      bone,
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    frame.add(mesh);
  }
  curve(
    [
      V(-0.119, 0.038, 0),
      V(-0.054, 0.05, 0),
      V(0.028, 0.053, 0),
      V(0.097, 0.057, 0),
      V(0.15, 0.052, 0),
    ],
    0.008,
  );
  for (let i = 0; i < 8; i++) {
    const x = -0.069 + i * 0.024;
    const width = 0.053 + 0.014 * Math.sin((i / 7) * Math.PI);
    for (const side of [-1, 1]) {
      curve(
        [
          V(x, 0.049, 0),
          V(x - 0.011, 0.065, side * width * 0.65),
          V(x - 0.008, 0.084, side * width),
          V(x + 0.006, 0.111, side * width * 0.78),
          V(x + 0.019, 0.125, side * 0.009),
        ],
        0.0035,
      );
    }
  }
  curve([V(-0.071, 0.118, 0), V(0.018, 0.132, 0), V(0.115, 0.119, 0)], 0.006);
  return frame;
}

export async function createBoard({ onCarve }) {
  const host = document.getElementById("scene"),
    stage = document.getElementById("stage");
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.02, 5);
  const [gltf, texture] = await Promise.all([
    new GLTFLoader().loadAsync(
      new URL("./assets/thanksgiving-turkey.glb", import.meta.url).href,
    ),
    new THREE.TextureLoader().loadAsync(
      new URL("./assets/roast-skin.webp", import.meta.url).href,
    ),
  ]);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  scene.add(new THREE.HemisphereLight(0xfff6e7, 0xc2a991, 1.7));
  const key = new THREE.DirectionalLight(0xfff5ec, 1.75);
  key.position.set(-0.44, 1.18, 0.43);
  key.castShadow = true;
  Object.assign(key.shadow.camera, {
    left: -0.48,
    right: 0.48,
    top: 0.48,
    bottom: -0.48,
    near: 0.1,
    far: 2.4,
  });
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.normalBias = 0.0004;
  key.shadow.bias = -0.00015;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffe4ba, 0.85);
  rim.position.set(0.7, 0.6, -0.65);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.ShadowMaterial({ opacity: 0.07 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.0015;
  ground.receiveShadow = true;
  scene.add(ground);
  // Soft contact shadow stays beneath the platter as it rotates.
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext("2d"),
    grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  grad.addColorStop(0, "rgba(72,44,25,.43)");
  grad.addColorStop(0.7, "rgba(72,44,25,.30)");
  grad.addColorStop(1, "rgba(72,44,25,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.67, 0.51),
    new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(shadowCanvas),
      transparent: true,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.001;
  scene.add(shadow);
  scene.add(herbs());

  const groups = Object.fromEntries(cuts.map((c) => [c.id, new THREE.Group()]));
  const carcass = createFrame();
  carcass.position.y = -0.027;
  groups.carcass.add(carcass);
  const pickables = [];
  for (const mesh of [...gltf.scene.children]) {
    if (mesh.name.startsWith("frill")) continue;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const id = cuts.find((c) => mesh.name.startsWith(c.id))?.id;
    if (id) {
      groups[id].add(mesh);
      mesh.scale.set(1.13, 1.13, 1.13);
      mesh.material = roastMaterial(
        texture,
        id === "wing" ? 0xe4be92 : id === "thigh" ? 0xf2d5b8 : 0xffefdc,
      );

      mesh.userData.cut = id;
    } else {
      if (mesh.name === "garnish") {
        mesh.material = mesh.material.clone();
        mesh.material.color.set(0xcbbdad);
        mesh.material.roughness = 0.72;
      }
      if (mesh.name === "platter")
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xf2e7d5,
          roughness: 0.3,
        });
      if (mesh.name === "rim")
        mesh.material = new THREE.MeshStandardMaterial({
          color: 0xb68c46,
          roughness: 0.43,
          metalness: 0.28,
        });
      scene.add(mesh);
    }
    pickables.push(mesh);
  }
  for (const side of [-1, 1]) {
    const bone = boneTip(side),
      fold = wingTip(side, groups.wing.children[0].material);
    for (const [id, part] of [
      ["drumstick", bone],
      ["wing", fold],
    ]) {
      part.scale.setScalar(1.13);
      groups[id].add(part);
      part.traverse((m) => {
        if (m.isMesh) {
          m.userData.cut = id;
          m.castShadow = true;
          m.receiveShadow = true;
          pickables.push(m);
        }
      });
    }
  }
  carcass.traverse((o) => {
    if (o.isMesh) {
      o.userData.cut = "carcass";
      pickables.push(o);
    }
  });
  Object.values(groups).forEach((g) => scene.add(g));

  // Each callout starts at a point on the corresponding surface. Numbers match the index.
  const anchors = {
    breast: V(0.044, 0.181, 0.028),
    thigh: V(0.015, 0.079, 0.151),
    drumstick: V(-0.148, 0.14, 0.081),
    wing: V(0.11, 0.095, 0.13),
    carcass: V(0.024, 0.106, 0),
  };
  const offsets = {
    breast: [48, -42],
    thigh: [-24, 52],
    drumstick: [-59, -38],
    wing: [60, 25],
    carcass: [33, -37],
  };
  const markers = new Map();
  for (const [i, cut] of cuts.entries()) {
    const el = document.createElement("div");
    el.className = "marker";
    el.innerHTML =
      '<i class="leader"></i><i class="anchor-dot"></i><button class="pin" aria-label="Carve ' +
      cut.name +
      '"><b>0' +
      (i + 1) +
      "</b>" +
      cut.name +
      "</button>";
    const pin = el.querySelector(".pin");
    pin.onclick = (e) => {
      if (e.detail === 0) onCarve(cut.id, true);
    };
    document.getElementById("markers").append(el);
    markers.set(cut.id, { el, pin, line: el.firstElementChild });
  }
  let width = 1,
    height = 1,
    yaw = defaultYaw,
    pitch = defaultPitch,
    zoomScale = 1,
    frameId = 0;
  const carved = new Set(),
    animations = new Map();
  const target = V(0, 0.066, 0),
    projected = new THREE.Vector3();
  function positionCamera() {
    const w = Math.max(0.745, (width / height) * 0.39) / zoomScale;
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = (w * height) / width / 2;
    camera.bottom = -camera.top;
    camera.position
      .set(
        Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        Math.cos(yaw) * Math.cos(pitch),
      )
      .add(target);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  function positionMarkers() {
    const scale = THREE.MathUtils.clamp(width / 720, 0.64, 1.12);
    for (const [id, { el, pin, line }] of markers) {
      el.hidden = carved.has(id) || (id === "carcass" && carved.size < 4);
      if (el.hidden) continue;
      projected.copy(anchors[id]);
      // Pick the near member of a left/right pair when looking from behind.
      if (!["breast", "carcass"].includes(id) && Math.cos(yaw) < 0)
        projected.z *= -1;
      projected.add(groups[id].position).project(camera);
      const x = (projected.x * 0.5 + 0.5) * width,
        y = (-projected.y * 0.5 + 0.5) * height;
      let dx = offsets[id][0] * scale,
        dy = offsets[id][1] * scale;
      if (Math.cos(yaw) < 0) dx *= -1;
      dx = THREE.MathUtils.clamp(x + dx, 44, width - 44) - x;
      dy = THREE.MathUtils.clamp(y + dy, 57, height - 47) - y;
      el.style.transform = "translate(" + x + "px," + y + "px)";
      pin.style.left = dx + "px";
      pin.style.top = dy + "px";
      line.style.width = Math.hypot(dx, dy) + "px";
      line.style.transform = "rotate(" + Math.atan2(dy, dx) + "rad)";
    }
  }
  function draw(now) {
    frameId = 0;
    for (const [id, a] of animations) {
      const t = Math.min(1, (now - a.start) / a.duration),
        g = groups[id];
      const ease = t * t * (3 - 2 * t);
      g.position.lerpVectors(a.from, a.to, ease);
      g.scale.setScalar(THREE.MathUtils.lerp(a.scaleFrom, a.scaleTo, ease));
      if (t >= 1) {
        g.visible = !carved.has(id);
        animations.delete(id);
      }
    }
    positionCamera();
    positionMarkers();
    renderer.render(scene, camera);
    if (animations.size) invalidate();
  }
  function invalidate() {
    if (!frameId) frameId = requestAnimationFrame(draw);
  }
  const lifts = {
    breast: V(0.01, 0.25, -0.08),
    thigh: V(-0.04, 0.14, 0.17),
    drumstick: V(-0.17, 0.16, 0.04),
    wing: V(0.16, 0.15, 0.05),
    carcass: V(0, 0.23, 0.02),
  };
  function setCarved(id, remove) {
    const g = groups[id];
    if (remove) carved.add(id);
    else carved.delete(id);
    if (!g.visible && !remove) {
      g.position.copy(lifts[id]);
      g.scale.setScalar(0.22);
    }
    g.visible = true;
    animations.set(id, {
      from: g.position.clone(),
      to: remove ? lifts[id] : V(0, 0, 0),
      scaleFrom: g.scale.x,
      scaleTo: remove ? 0.22 : 1,
      start: performance.now(),
      duration: reducedMotion ? 1 : 480,
    });
    invalidate();
  }
  function reset() {
    animations.clear();
    carved.clear();
    gesture = null;
    for (const g of Object.values(groups)) {
      g.visible = true;
      g.position.set(0, 0, 0);
      g.scale.setScalar(1);
    }
    yaw = defaultYaw;
    pitch = defaultPitch;
    zoomScale = 1;
    updateZoom();
    invalidate();
  }
  function updateZoom() {
    document.getElementById("zoom-in").disabled = zoomScale >= 1.35;
    document.getElementById("zoom-out").disabled = zoomScale <= 0.75;
  }
  function zoom(step) {
    zoomScale = THREE.MathUtils.clamp(zoomScale + step * 0.12, 0.75, 1.35);
    updateZoom();
    invalidate();
  }
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  function hit(e) {
    const r = host.getBoundingClientRect();
    pointer.set(
      ((e.clientX - r.left) / width) * 2 - 1,
      (-(e.clientY - r.top) / height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    const visible = pickables.filter(
      (m) => !m.userData.cut || !carved.has(m.userData.cut),
    );
    const nearest = ray.intersectObjects(visible, false)[0];
    const id = nearest?.object.userData.cut;
    return id === "carcass" && carved.size < 4 ? null : id;
  }
  let gesture = null;
  function begin(e, id) {
    if (e.button !== 0 || gesture) return;
    gesture = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      yaw,
      pitch,
      pointer: e.pointerId,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e) {
    if (!gesture || gesture.pointer !== e.pointerId) return;
    const dx = e.clientX - gesture.startX,
      dy = e.clientY - gesture.startY,
      id = gesture.id;
    if (id) {
      const worldPerPixel = (camera.right - camera.left) / width;
      const right = V(1, 0, 0).applyQuaternion(camera.quaternion),
        up = V(0, 1, 0).applyQuaternion(camera.quaternion);
      groups[id].position
        .copy(right.multiplyScalar(dx * worldPerPixel * 0.8))
        .addScaledVector(up, -dy * worldPerPixel * 0.8);
      groups[id].position.y = Math.max(0, groups[id].position.y);
    } else {
      yaw = gesture.yaw - dx * 0.009;
      pitch = THREE.MathUtils.clamp(gesture.pitch + dy * 0.006, 0.19, 1.12);
    }
    invalidate();
  }
  function finish(e, cancelled) {
    if (!gesture || gesture.pointer !== e.pointerId) return;
    const id = gesture.id;
    gesture = null;
    if (!id) return;
    if (cancelled) {
      groups[id].position.set(0, 0, 0);
      invalidate();
      return;
    }
    onCarve(id);
  }
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (e) => begin(e, hit(e)));
  for (const [id, { pin }] of markers) {
    pin.addEventListener("pointerdown", (e) => begin(e, id));
  }
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerup", (e) => finish(e, false));
  stage.addEventListener("pointercancel", (e) => finish(e, true));
  stage.addEventListener("lostpointercapture", (e) => finish(e, true));
  host.append(canvas);
  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setSize(width, height, false);
    invalidate();
  };
  new ResizeObserver(resize).observe(host);
  resize();
  return { setCarved, reset, zoom };
}

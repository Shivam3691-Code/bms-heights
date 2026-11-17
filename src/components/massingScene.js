// Lightweight Three.js "conceptual massing" model. Loaded on demand (code-split) only when
// the Architecture section approaches the viewport. Renders only while visible, caps DPR,
// and stops entirely when unmounted. This is an abstract study — NOT the actual building design.
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Mesh,
  BoxGeometry,
  PlaneGeometry,
  CylinderGeometry,
  SphereGeometry,
  MeshStandardMaterial,
  HemisphereLight,
  DirectionalLight,
  CanvasTexture,
  SRGBColorSpace,
  Color,
  Fog,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  PCFSoftShadowMap,
} from 'three';

const IVORY = 0xf3efe6;
const STONE = 0xe4ddce;
const CHARCOAL = 0x2e2c27;
const GOLD = 0xb9954b;
const GREEN = 0xa9b48f;

function facadeTexture(cols, floors) {
  const c = document.createElement('canvas');
  const cw = 64;
  const ch = 64;
  c.width = cols * cw;
  c.height = floors * ch;
  const g = c.getContext('2d');
  g.fillStyle = '#efe9dc';
  g.fillRect(0, 0, c.width, c.height);
  for (let f = 0; f < floors; f++) {
    // floor band
    g.fillStyle = '#d9cfbb';
    g.fillRect(0, f * ch + ch - 6, c.width, 6);
    if (f === floors - 1) continue; // stilt level stays open (drawn darker below)
    for (let i = 0; i < cols; i++) {
      const lit = (i * 7 + f * 3) % 5 === 0;
      g.fillStyle = lit ? '#e8c987' : '#3a3833';
      g.fillRect(i * cw + 12, f * ch + 12, cw - 24, ch - 26);
      g.fillStyle = 'rgba(255,255,255,0.18)';
      g.fillRect(i * cw + 12, f * ch + 12, (cw - 24) / 2, ch - 26);
    }
  }
  // Stilt level
  g.fillStyle = '#4a463f';
  g.fillRect(0, (floors - 1) * ch, c.width, ch - 6);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function tower({ w, d, floors, x, z }) {
  const group = new Group();
  const fh = 3;
  const h = floors * fh;
  const sideTexW = facadeTexture(Math.max(3, Math.round(w / 3)), floors);
  const sideTexD = facadeTexture(Math.max(2, Math.round(d / 3)), floors);
  const plain = new MeshStandardMaterial({ color: IVORY, roughness: 0.85 });
  const mats = [
    new MeshStandardMaterial({ map: sideTexD, roughness: 0.8 }),
    new MeshStandardMaterial({ map: sideTexD, roughness: 0.8 }),
    plain,
    plain,
    new MeshStandardMaterial({ map: sideTexW, roughness: 0.8 }),
    new MeshStandardMaterial({ map: sideTexW, roughness: 0.8 }),
  ];
  const body = new Mesh(new BoxGeometry(w, h, d), mats);
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Balcony slabs on the front face
  const slabMat = new MeshStandardMaterial({ color: STONE, roughness: 0.7 });
  const railMat = new MeshStandardMaterial({ color: CHARCOAL, roughness: 0.5, metalness: 0.3 });
  for (let f = 1; f < floors; f++) {
    const slab = new Mesh(new BoxGeometry(w * 0.86, 0.25, 1.4), slabMat);
    slab.position.set(0, f * fh, d / 2 + 0.7);
    slab.castShadow = true;
    group.add(slab);
    const rail = new Mesh(new BoxGeometry(w * 0.86, 0.9, 0.06), railMat);
    rail.position.set(0, f * fh + 0.55, d / 2 + 1.38);
    group.add(rail);
  }

  // Gold parapet line + terrace garden patches
  const parapet = new Mesh(new BoxGeometry(w + 0.3, 0.35, d + 0.3), new MeshStandardMaterial({ color: GOLD, metalness: 0.45, roughness: 0.35 }));
  parapet.position.y = h + 0.17;
  group.add(parapet);
  const green = new MeshStandardMaterial({ color: GREEN, roughness: 1 });
  for (let i = 0; i < 2; i++) {
    const p = new Mesh(new BoxGeometry(w * 0.3, 0.4, d * 0.5), green);
    p.position.set((i === 0 ? -1 : 1) * w * 0.22, h + 0.4, 0);
    group.add(p);
  }

  const edges = new LineSegments(new EdgesGeometry(new BoxGeometry(w, h, d)), new LineBasicMaterial({ color: 0xcbb98d, transparent: true, opacity: 0.6 }));
  edges.position.y = h / 2;
  group.add(edges);

  group.position.set(x, 0, z);
  return group;
}

function tree(x, z, s = 1) {
  const g = new Group();
  const trunk = new Mesh(new CylinderGeometry(0.15 * s, 0.2 * s, 1.6 * s, 6), new MeshStandardMaterial({ color: 0x6b5a45 }));
  trunk.position.y = 0.8 * s;
  const crown = new Mesh(new SphereGeometry(1.1 * s, 10, 8), new MeshStandardMaterial({ color: 0x8f9c74, roughness: 1, flatShading: true }));
  crown.position.y = 2.2 * s;
  crown.castShadow = true;
  g.add(trunk, crown);
  g.position.set(x, 0, z);
  return g;
}

export function createMassingScene(canvas, { reducedMotion = false, onFirstFrame } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  scene.fog = new Fog(new Color(0xf8f5ef), 90, 190);

  const camera = new PerspectiveCamera(32, 1, 1, 400);

  scene.add(new HemisphereLight(0xfff8ec, 0xc9bfa9, 1.1));
  const sun = new DirectionalLight(0xffe9c4, 2.2);
  sun.position.set(40, 60, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, near: 1, far: 200 });
  scene.add(sun);

  const site = new Group();
  scene.add(site);

  const ground = new Mesh(new PlaneGeometry(160, 160), new MeshStandardMaterial({ color: 0xeee8dc, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  site.add(ground);

  const lawn = new Mesh(new PlaneGeometry(34, 18), new MeshStandardMaterial({ color: 0xc3cba9, roughness: 1 }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.set(0, 0.02, 4);
  lawn.receiveShadow = true;
  site.add(lawn);

  const path = new Mesh(new PlaneGeometry(4, 40), new MeshStandardMaterial({ color: 0xd8cdb6 }));
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.03, 10);
  site.add(path);

  // Abstract arrangement of five low-rise blocks around a central green.
  site.add(tower({ w: 22, d: 12, floors: 6, x: 0, z: -14 }));
  site.add(tower({ w: 14, d: 11, floors: 6, x: -26, z: -4 }));
  site.add(tower({ w: 14, d: 11, floors: 6, x: 26, z: -4 }));
  site.add(tower({ w: 14, d: 11, floors: 6, x: -24, z: 20 }));
  site.add(tower({ w: 14, d: 11, floors: 6, x: 24, z: 20 }));
  [[-8, 8], [8, 8], [-12, 0], [12, 0], [-6, 16], [6, 16], [0, 24], [-40, 10], [40, 10]].forEach(([x, z], i) =>
    site.add(tree(x, z, 0.8 + (i % 3) * 0.15)),
  );

  // Interaction state
  let theta = 0.6;
  let phi = 0.95;
  let radius = 120;
  let targetTheta = theta;
  let targetPhi = phi;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let visible = false;
  let raf = 0;
  let autoRotate = !reducedMotion;
  let firstFrame = true;

  function placeCamera() {
    camera.position.set(radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(0, 6, 2);
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    radius = w < 600 ? 150 : 118;
    camera.updateProjectionMatrix();
    requestRender();
  }

  function frame() {
    raf = 0;
    if (autoRotate && !dragging) targetTheta += 0.0016;
    theta += (targetTheta - theta) * 0.08;
    phi += (targetPhi - phi) * 0.08;
    placeCamera();
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onFirstFrame?.();
    }
    const settling = Math.abs(targetTheta - theta) > 0.0005 || Math.abs(targetPhi - phi) > 0.0005;
    if (visible && (autoRotate || dragging || settling)) raf = requestAnimationFrame(frame);
  }

  function requestRender() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  const down = (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    requestRender();
  };
  const move = (e) => {
    if (!dragging) return;
    targetTheta -= (e.clientX - lastX) * 0.006;
    targetPhi = Math.min(1.35, Math.max(0.55, targetPhi - (e.clientY - lastY) * 0.004));
    lastX = e.clientX;
    lastY = e.clientY;
    requestRender();
  };
  const up = () => {
    dragging = false;
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    setVisible(v) {
      visible = v;
      if (v) requestRender();
    },
    setAutoRotate(v) {
      autoRotate = v;
      requestRender();
    },
    nudge(dir) {
      targetTheta += dir * 0.5;
      requestRender();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      scene.traverse((o) => {
        o.geometry?.dispose();
        const m = o.material;
        (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => {
          mm.map?.dispose();
          mm.dispose();
        });
      });
      renderer.dispose();
    },
  };
}

/**
 * DEV ONLY. Card material review harness.
 *
 * Nothing in the application imports this file and `vite build` does not emit
 * it: the build entry is index.html and this page is reached only through the
 * dev server. It exists so the printed face, the foil and the physical
 * construction can be reviewed under fixed studio lighting without depending on
 * src/scene, which this agent does not own.
 */

import * as THREE from 'three';
import type { AppContext, CardRecord, FrameTime } from '../core/types';
import { qualityFor } from '../core/quality';
import { splitmix32 } from '../core/rng';
import { CARDS } from '../data/cards';
import { CARD, createCardGeometry } from './cardGeometry';
import { cardMaterialStats, createCardMaterial, type CardMaterial } from './cardMaterial';

const params = new URLSearchParams(location.search);
const mode = params.get('mode') ?? 'grid';
const elapsed = Number.parseFloat(params.get('t') ?? '3.2');
const tierParam = (params.get('quality') ?? 'high') as 'ultra' | 'high' | 'medium' | 'low';

const canvas = document.getElementById('stage') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05060a);

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.05, 100);

// --- procedural studio probe ------------------------------------------------
// A softbox above, a cool bounce behind and a warm kicker in front. This stands
// in for the environment agent's vault probe so the foil has real incident
// radiance to reflect.
function studioEnvironment(): THREE.Texture {
  const W = 256;
  const H = 128;
  const data = new Float32Array(W * H * 4);
  const bars: { dir: THREE.Vector3; color: [number, number, number]; power: number; gain: number }[] = [
    { dir: new THREE.Vector3(0.35, 0.9, 0.3).normalize(), color: [1, 0.97, 0.92], power: 90, gain: 26 },
    { dir: new THREE.Vector3(-0.7, 0.4, -0.6).normalize(), color: [0.55, 0.72, 1], power: 40, gain: 9 },
    { dir: new THREE.Vector3(0.2, -0.15, 0.96).normalize(), color: [1, 0.7, 0.5], power: 28, gain: 4.5 },
    { dir: new THREE.Vector3(-0.9, 0.05, 0.42).normalize(), color: [0.8, 0.9, 1], power: 60, gain: 6 },
  ];
  const d = new THREE.Vector3();
  for (let y = 0; y < H; y++) {
    const theta = ((y + 0.5) / H) * Math.PI;
    for (let x = 0; x < W; x++) {
      const phi = ((x + 0.5) / W) * Math.PI * 2;
      d.set(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi));
      const up = d.y * 0.5 + 0.5;
      let r = 0.01 + 0.09 * up * up;
      let g = 0.013 + 0.11 * up * up;
      let b = 0.024 + 0.17 * up * up;
      for (const bar of bars) {
        const k = Math.pow(Math.max(d.dot(bar.dir), 0), bar.power) * bar.gain;
        r += bar.color[0] * k;
        g += bar.color[1] * k;
        b += bar.color[2] * k;
      }
      const i = (y * W + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 1;
    }
  }
  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}
scene.environment = studioEnvironment();
scene.environmentIntensity = 1.0;

// --- three point rig --------------------------------------------------------
const key = new THREE.DirectionalLight(0xfff2e0, 3.4);
key.position.set(2.6, 4.4, 3.2);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 14;
key.shadow.bias = -0.0006;
scene.add(key, key.target);

const fill = new THREE.DirectionalLight(0x5c7cff, 0.85);
fill.position.set(-3.4, 1.6, -1.2);
scene.add(fill);

const rim = new THREE.SpotLight(0x8fd4ff, 26, 20, Math.PI * 0.28, 0.6, 1.5);
rim.position.set(-1.6, 3.4, -2.6);
scene.add(rim, rim.target);

scene.add(new THREE.HemisphereLight(0x2a3350, 0x07080d, 0.5));

// --- context ---------------------------------------------------------------
const ctx: AppContext = {
  renderer,
  scene,
  camera,
  canvas,
  quality: qualityFor(tierParam),
  bus: {
    on: () => () => {},
    off: () => {},
    emit: () => {},
  },
  rng: splitmix32(1337),
  size: { width: window.innerWidth, height: window.innerHeight },
  deterministic: true,
};

// --- card selection --------------------------------------------------------
function bySpread(): CardRecord[] {
  const out: CardRecord[] = [];
  for (let rarity = 4; rarity >= 0; rarity--) {
    const pool = CARDS.filter((c) => c.rarity === rarity);
    const seen = new Set<number>();
    for (const c of pool) {
      if (out.filter((o) => o.rarity === rarity).length >= 2) break;
      if (seen.has(c.typeId)) continue;
      seen.add(c.typeId);
      out.push(c);
    }
  }
  // Guarantee a dead endpoint and a couple of distinct types are represented.
  const ghost = CARDS.find((c) => !c.alive && c.rarity >= 1);
  if (ghost && !out.includes(ghost)) out.push(ghost);
  const frost = CARDS.find((c) => c.typeId === 3);
  if (frost && !out.includes(frost)) out.push(frost);
  return out;
}

const picked = mode === 'hero' ? bySpread().slice(0, 3) : bySpread().slice(0, 12);
const faceRes = mode === 'hero' ? 1024 : 640;

const geometry = createCardGeometry({ height: CARD.defaultHeight, cornerSegments: 14, rollSegments: 4 });
const handles: CardMaterial[] = [];
const group = new THREE.Group();
scene.add(group);

const cols = mode === 'hero' ? 3 : 4;
const gapX = CARD.defaultHeight * CARD.aspect * 1.18;
const gapY = CARD.defaultHeight * 1.16;
const rows = Math.ceil(picked.length / cols);

picked.forEach((card, i) => {
  const mat = createCardMaterial(card, ctx, { faceResolution: faceRes, faceBudgetBytes: 1 << 30 });
  handles.push(mat);
  const mesh = new THREE.Mesh(geometry, mat.materials);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const col = i % cols;
  const row = Math.floor(i / cols);
  mesh.position.set((col - (cols - 1) / 2) * gapX, ((rows - 1) / 2 - row) * gapY, 0);
  // Fan the tilt across the grid so the interference is sampled over a wide
  // range of incidence angles in a single frame.
  const tiltX = ((row / Math.max(rows - 1, 1)) - 0.5) * 0.62;
  const tiltY = ((col / Math.max(cols - 1, 1)) - 0.5) * 0.9;
  mesh.rotation.set(tiltX, tiltY, (i % 3) * 0.02 - 0.02);
  mat.setReveal(card.rarity >= 3 ? 0.4 : 0.0);
  group.add(mesh);
});

// Backdrop so the cards are not floating in void and the cast shadow lands.
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshPhysicalMaterial({ color: 0x0a0c14, roughness: 0.42, metalness: 0.0 })
);
floor.position.z = -0.75;
floor.receiveShadow = true;
scene.add(floor);

const framedH = rows * gapY;
const framedW = cols * gapX;
const dist = Math.max(framedH / (2 * Math.tan((camera.fov * Math.PI) / 360)), framedW / (2 * Math.tan((camera.fov * Math.PI) / 360)) / camera.aspect) * 1.12;
camera.position.set(0, 0, dist);
camera.lookAt(0, 0, 0);
key.target.position.set(0, 0, 0);
rim.target.position.set(0, 0, 0);

const time: FrameTime = { dt: 1 / 60, elapsed, frame: 0 };
for (const h of handles) h.update(time);

renderer.compile(scene, camera);
renderer.render(scene, camera);

declare global {
  interface Window {
    __previewReady?: boolean;
    __previewStats?: unknown;
  }
}

window.__previewStats = {
  ...cardMaterialStats(),
  programs: renderer.info.programs?.length ?? 0,
  drawCalls: renderer.info.render.calls,
  triangles: renderer.info.render.triangles,
  cards: picked.map((c) => `${c.id} ${c.name} r${c.rarity} t${c.typeId} ${c.alive ? 'live' : 'dead'}`),
};
window.__previewReady = true;

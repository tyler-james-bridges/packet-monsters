import * as THREE from 'three';
import './ui/hud.css';
import { createBus } from './core/bus';
import { createRenderer } from './core/renderer';
import { detectQuality } from './core/quality';
import { hashSeed, splitmix32 } from './core/rng';
import type { AppContext, FrameTime, System } from './core/types';
import { createPipeline } from './post/pipeline';
import { createVault } from './scene/vault';
import { createLighting } from './scene/lighting';
import { createCardStage } from './scene/cardStage';
import { createParticles } from './scene/particles';
import { createCameraRig } from './anim/cameraRig';
import { createGachaMachine } from './gacha/machine';
import { createHud } from './ui/hud';
import { createAudio } from './audio/engine';
import { createAdaptiveQuality } from './core/adaptive';
import { createDebugHarness, harnessState } from './core/harness';

const canvas = document.getElementById('stage') as HTMLCanvasElement;
const uiRoot = document.getElementById('ui') as HTMLDivElement;

const params = new URLSearchParams(location.search);
const deterministic = params.has('shot') || params.has('seed');
const seed = params.has('seed') ? hashSeed(params.get('seed')!) : (Math.random() * 0xffffffff) >>> 0;

const quality = detectQuality();
const renderer = createRenderer(canvas, quality);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200);
camera.position.set(0, 1.35, 4.2);

const ctx: AppContext = {
  renderer,
  scene,
  camera,
  canvas,
  quality,
  bus: createBus(),
  rng: splitmix32(seed),
  size: { width: 1, height: 1 },
  deterministic,
};

const systems: System[] = [];
function add<T extends System>(s: T): T {
  systems.push(s);
  return s;
}

const lighting = add(createLighting(ctx));
const vault = add(createVault(ctx));
const cardStage = add(createCardStage(ctx));
const particles = add(createParticles(ctx));
const cameraRig = add(createCameraRig(ctx));
const audio = add(createAudio(ctx));
const machine = add(createGachaMachine(ctx));
// The HUD reads live protocol numbers from the machine; publish it before the
// HUD constructs so its first paint already has real price and odds.
(window as unknown as Record<string, unknown>).__machine = machine;
const hud = add(createHud(ctx, uiRoot));
const pipeline = createPipeline(ctx);
const adaptive = add(createAdaptiveQuality(ctx, pipeline));

void lighting;
void vault;
void cardStage;
void particles;
void cameraRig;
void audio;
void machine;
void hud;
void adaptive;

function resize(): void {
  const w = Math.max(1, window.innerWidth);
  const h = Math.max(1, window.innerHeight);
  ctx.size.width = w;
  ctx.size.height = h;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, ctx.quality.pixelRatio));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // Keep the vertical framing stable on wide displays and widen on portrait so
  // the altar never crops.
  camera.fov = h > w ? 52 : 38;
  camera.updateProjectionMatrix();
  pipeline.resize(w, h);
  for (const s of systems) s.resize?.(w, h);
}
window.addEventListener('resize', resize, { passive: true });
resize();

const clock = new THREE.Clock();
const time: FrameTime = { dt: 0, elapsed: 0, frame: 0 };

let running = false;

function frame(): void {
  // Frozen by the shot harness: stop scheduling entirely so the compositor goes
  // idle and the capture tool sees a genuinely stable surface. Without this the
  // screenshot call waits forever on a never settling animation loop.
  if (harnessState.frozen) {
    running = false;
    return;
  }
  requestAnimationFrame(frame);
  const raw = clock.getDelta();
  time.dt = ctx.deterministic ? 1 / 60 : Math.min(raw, 1 / 20);
  time.elapsed += time.dt;
  time.frame++;

  renderer.info.reset();
  for (const s of systems) s.update(time);
  pipeline.render(time);
}

harnessState.resume = () => {
  if (running) return;
  running = true;
  clock.getDelta(); // discard the paused interval
  requestAnimationFrame(frame);
};

ctx.bus.emit('scene:ready', {});
createDebugHarness(ctx, pipeline, time);
running = true;
frame();

if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__ctx = ctx;
}

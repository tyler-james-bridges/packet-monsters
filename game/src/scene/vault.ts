import * as THREE from 'three';
import type { AppContext, FrameTime, System } from '../core/types';
import { maxAnisotropy } from '../core/renderer';
import {
  ACCENT_COLOR,
  BEAM_AXIS,
  CHAMBER,
  FILL_COLOR,
  KEY_COLOR,
  KEY_DIR,
} from './env/layout';
import {
  buildInstanced,
  ceilingDisc,
  chamferedBox,
  floorDisc,
  floorRing,
  merge,
  revolve,
  revolveZ,
  ringPlacements,
  type InstancePlacement,
} from './env/geometry';
import {
  createConcreteMaterial,
  createEmissiveMaterial,
  createMetalMaterial,
  enableInstanceUvOffset,
  patchFloorReflection,
  scaleUv,
} from './env/materials';
import {
  createBlueNoiseTexture,
  createConcreteTextures,
  createMetalTextures,
  createStripRamp,
  type PbrTextureSet,
} from './env/textures';
import { generateBlueNoise } from './env/noise';
import { createFloorReflection } from './env/reflection';
import { createVolumetrics, type Volumetrics } from './env/volumetrics';
import { envSurge, surgeAccent } from './env/surge';

/**
 * The sealed vault chamber.
 *
 * A round precast concrete room 12.8 m across: floor slab, twenty four wall
 * panels with recessed light reveals, backlit pilasters, a cornice cove, a
 * ribbed ceiling, a stepped dais and the machined altar the card settles on.
 * Behind the altar sits the sealed portal, whose ring frames the hero.
 *
 * Everything here is generated. No texture, cubemap or mesh is loaded from
 * disk, and the whole chamber is under thirty draw calls.
 */
export function createVault(ctx: AppContext): System {
  const { scene, quality, renderer, rng } = ctx;
  const aniso = maxAnisotropy(renderer, quality);

  const group = new THREE.Group();
  group.name = 'vault';

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(t: T): T => {
    disposables.push(t);
    return t;
  };

  // ---------------------------------------------------------------- textures
  const texSize = quality.tier === 'low' ? 256 : quality.tier === 'medium' ? 384 : 512;

  const wallConcrete = track(
    createConcreteTextures({
      size: texSize,
      seed: 1301,
      base: [0.062, 0.067, 0.079],
      variation: 0.030,
      roughnessRange: [0.54, 0.95],
      normalStrength: 26,
      anisotropy: aniso,
    })
  );

  const floorConcrete = track(
    createConcreteTextures({
      size: texSize,
      seed: 5507,
      base: [0.028, 0.031, 0.038],
      variation: 0.014,
      // Ground and sealed: still concrete, but it holds a reflection.
      roughnessRange: [0.10, 0.40],
      normalStrength: 9,
      anisotropy: aniso,
    })
  );

  const brushed = track(
    createMetalTextures({
      size: texSize,
      seed: 907,
      base: [0.152, 0.163, 0.186],
      roughnessRange: [0.14, 0.42],
      mode: 'linear',
      normalStrength: 8,
      wear: 0.16,
      anisotropy: aniso,
    })
  );

  const turned = track(
    createMetalTextures({
      size: texSize,
      seed: 4409,
      base: [0.205, 0.213, 0.232],
      roughnessRange: [0.10, 0.34],
      mode: 'radial',
      normalStrength: 7,
      wear: 0.10,
      anisotropy: aniso,
    })
  );

  const stripRamp = track(createStripRamp(aniso));
  const blueNoiseSize = 64;
  const blueNoise = track(createBlueNoiseTexture(generateBlueNoise(blueNoiseSize, rng), blueNoiseSize));

  // --------------------------------------------------------------- materials
  const concreteWall = track(
    createConcreteMaterial(wallConcrete, { envMapIntensity: 1.0, normalScale: 1.0 })
  );
  const concretePanel = track(
    createConcreteMaterial(wallConcrete, { envMapIntensity: 1.0, normalScale: 1.0 })
  );
  enableInstanceUvOffset(concretePanel);

  const concreteFloor = track(
    createConcreteMaterial(floorConcrete, {
      envMapIntensity: 1.25,
      normalScale: 0.55,
      aoMapIntensity: 0.7,
    })
  );

  const metalDark = track(
    createMetalMaterial(brushed, {
      envMapIntensity: 1.3,
      anisotropy: 0.7,
      normalScale: 0.85,
    })
  );
  const metalPanel = track(
    createMetalMaterial(brushed, { envMapIntensity: 1.3, anisotropy: 0.7, normalScale: 0.85 })
  );
  enableInstanceUvOffset(metalPanel);

  const metalTurned = track(
    createMetalMaterial(turned, {
      envMapIntensity: 1.45,
      anisotropy: 0.85,
      normalScale: 0.7,
    })
  );

  const accent = ACCENT_COLOR.clone();
  const stripMaterial = track(createEmissiveMaterial(accent.clone().multiplyScalar(3.4), stripRamp));
  const coveMaterial = track(createEmissiveMaterial(accent.clone().multiplyScalar(2.2)));
  const seamMaterial = track(createEmissiveMaterial(accent.clone().multiplyScalar(5.0)));
  const conduitMaterial = track(createEmissiveMaterial(accent.clone().multiplyScalar(1.1)));
  const portalRingMaterial = track(createEmissiveMaterial(accent.clone().multiplyScalar(6.5)));
  const oculusMaterial = track(createEmissiveMaterial(KEY_COLOR.clone().multiplyScalar(7.0)));
  // Both of these are open cylinders read from inside the room.
  coveMaterial.side = THREE.DoubleSide;
  seamMaterial.side = THREE.DoubleSide;
  // Base radiance and how hard each fixture leads the surge. The altar seam is
  // closest to the reveal so it flares hardest; the floor conduits barely move.
  const emissives: { mat: THREE.MeshBasicMaterial; gain: number; lead: number }[] = [
    { mat: stripMaterial, gain: 3.4, lead: 0.6 },
    { mat: coveMaterial, gain: 2.2, lead: 0.45 },
    { mat: seamMaterial, gain: 5.0, lead: 1.0 },
    { mat: conduitMaterial, gain: 1.1, lead: 0.3 },
    { mat: portalRingMaterial, gain: 6.5, lead: 0.85 },
  ];

  // -------------------------------------------------------------- reflection
  const reflectionEnabled = quality.tier !== 'low';
  const reflection = reflectionEnabled
    ? track(
        createFloorReflection(renderer, {
          planeY: 0.0,
          scale: quality.tier === 'ultra' ? 0.5 : 0.4,
          maxWidth: quality.tier === 'ultra' ? 768 : 512,
        })
      )
    : null;

  // ------------------------------------------------------------------- floor
  const floorGeo = scaleUv(floorDisc(CHAMBER.floorRadius, 128), 9, 9);
  const floor = new THREE.Mesh(floorGeo, concreteFloor);
  floor.receiveShadow = true;
  floor.name = 'vault-floor';
  group.add(floor);

  const reflectionUniforms = reflection
    ? patchFloorReflection(
        concreteFloor,
        reflection,
        0.85,
        new THREE.Color(0.86, 0.90, 1.0)
      )
    : null;

  const inlay = merge([
    scaleUv(floorRing(2.58, 2.66, 128), 10, 1),
    scaleUv(floorRing(4.18, 4.26, 128), 14, 1),
    scaleUv(floorRing(5.78, 5.86, 128), 18, 1),
  ]);
  const inlayMesh = new THREE.Mesh(inlay, metalDark);
  inlayMesh.position.y = 0.004;
  group.add(inlayMesh);

  // Radial service conduits: a scale cue and the chamber's onchain tell.
  const conduitGeo = new THREE.PlaneGeometry(0.055, 3.7);
  conduitGeo.rotateX(-Math.PI / 2);
  conduitGeo.translate(0, 0, -(2.45 + 3.7 / 2));
  const conduitPlacements: InstancePlacement[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const m = new THREE.Matrix4().makeRotationY(a);
    m.setPosition(0, 0.007, 0);
    conduitPlacements.push({ matrix: m, uvOffset: new THREE.Vector2(0, 0) });
  }
  const conduits = buildInstanced(conduitGeo, conduitMaterial, conduitPlacements);
  group.add(conduits);

  // -------------------------------------------------------------------- dais
  const daisGeo = scaleUv(
    revolve(
      [
        [2.335, 0.0],
        [2.3, 0.036],
        [2.3, 0.115],
        [2.262, 0.15],
        [1.92, 0.15],
        [1.92, 0.262],
        [1.884, 0.3],
        [1.12, 0.3],
      ],
      96
    ),
    16,
    1
  );
  const dais = new THREE.Mesh(daisGeo, concreteWall);
  dais.castShadow = true;
  dais.receiveShadow = true;
  group.add(dais);

  const daisHalo = new THREE.Mesh(floorRing(2.36, 2.5, 96), conduitMaterial);
  daisHalo.position.y = 0.006;
  group.add(daisHalo);

  // ------------------------------------------------------------------ altar
  const plinthGeo = scaleUv(
    revolve(
      [
        [1.1, 0.3],
        [1.1, 0.35],
        [1.062, 0.39],
        [0.925, 0.44],
        [0.905, 0.8],
        [0.905, 0.86],
        [0.965, 0.9],
        [0.985, 0.955],
        [0.985, 0.985],
        [0.958, 1.02],
        [0.0, 1.02],
      ],
      96
    ),
    9,
    1
  );
  const plinth = new THREE.Mesh(plinthGeo, metalDark);
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Turned cap inlay so the surface directly under the card is machined, not
  // the same brushed grain as the shaft.
  const capGeo = scaleUv(floorRing(0.18, 0.94, 96), 1, 1);
  const cap = new THREE.Mesh(capGeo, metalTurned);
  cap.position.y = CHAMBER.plinthTopY + 0.002;
  cap.receiveShadow = true;
  group.add(cap);

  const seamGeo = new THREE.CylinderGeometry(0.913, 0.913, 0.045, 96, 1, true);
  const seam = new THREE.Mesh(seamGeo, seamMaterial);
  seam.position.y = 0.83;
  group.add(seam);

  // ------------------------------------------------------------------- walls
  const panelPitch = (Math.PI * 2) / CHAMBER.panels;
  const panelDepth = 0.34;
  const panelWidth = 2 * (CHAMBER.wallRadius + panelDepth / 2) * Math.sin(panelPitch / 2) - 0.115;
  const panelGeo = scaleUv(
    chamferedBox(panelWidth, CHAMBER.wallHeight, panelDepth, 0.035, 3),
    1.15,
    3.0
  );
  const panels = buildInstanced(
    panelGeo,
    concretePanel,
    ringPlacements(
      CHAMBER.panels,
      CHAMBER.wallRadius + panelDepth / 2,
      CHAMBER.skirtHeight + CHAMBER.wallHeight / 2,
      rng
    )
  );
  panels.receiveShadow = true;
  group.add(panels);

  // Recessed reveals between the panels.
  const revealGeo = new THREE.PlaneGeometry(0.07, 3.9);
  const reveals = buildInstanced(
    revealGeo,
    stripMaterial,
    ringPlacements(
      CHAMBER.panels,
      CHAMBER.wallRadius + 0.055,
      CHAMBER.skirtHeight + CHAMBER.wallHeight / 2,
      rng,
      panelPitch / 2
    ).map((p) => {
      // Faces of the reveal look inward.
      p.matrix.multiply(new THREE.Matrix4().makeRotationY(Math.PI));
      return p;
    })
  );
  group.add(reveals);

  // Backlit pilasters break the panel rhythm and catch the rim light.
  const pilasterGeo = scaleUv(chamferedBox(0.15, 4.14, 0.3, 0.022, 3), 0.4, 3.0);
  const pilasters = buildInstanced(
    pilasterGeo,
    metalPanel,
    ringPlacements(
      CHAMBER.pilasters,
      CHAMBER.wallRadius - 0.1,
      CHAMBER.skirtHeight + CHAMBER.wallHeight / 2,
      rng,
      panelPitch / 2
    )
  );
  pilasters.castShadow = false;
  group.add(pilasters);

  // Skirting: traversed inward then downward so the top face looks up and the
  // fascia looks into the room.
  const skirt = new THREE.Mesh(
    scaleUv(
      revolve(
        [
          [6.44, 0.3],
          [6.34, 0.3],
          [6.28, 0.244],
          [6.28, 0.0],
        ],
        128
      ),
      40,
      1
    ),
    metalDark
  );
  skirt.receiveShadow = true;
  group.add(skirt);

  // Cornice: inner-top to outer-bottom so the soffit faces down into the room.
  const cornice = new THREE.Mesh(
    scaleUv(
      revolve(
        [
          [6.06, 4.8],
          [6.2, 4.755],
          [6.3, 4.66],
          [6.3, 4.6],
          [6.44, 4.52],
        ],
        128
      ),
      40,
      1
    ),
    metalDark
  );
  group.add(cornice);

  // The cove sits on the cornice fascia, which faces straight into the room, so
  // it is unambiguously visible from the floor instead of hiding behind the lip.
  const cove = new THREE.Mesh(
    new THREE.CylinderGeometry(6.295, 6.295, 0.055, 128, 1, true),
    coveMaterial
  );
  cove.position.y = 4.632;
  group.add(cove);

  // ----------------------------------------------------------------- ceiling
  const ceiling = new THREE.Mesh(
    scaleUv(ceilingDisc(6.12, 96), 8, 8),
    concreteWall
  );
  ceiling.position.y = CHAMBER.ceilingY;
  group.add(ceiling);

  const ribGeo = scaleUv(chamferedBox(0.17, 0.15, 4.4, 0.02, 2), 0.5, 0.5);
  ribGeo.translate(0, 0, 3.85);
  const ribs = buildInstanced(
    ribGeo,
    metalPanel,
    ringPlacements(24, 0, CHAMBER.ceilingY - 0.075, rng, panelPitch / 2)
  );
  group.add(ribs);

  // Centred ceiling oculus. Barely in frame, but the floor reflects it and that
  // reflected pool is what stops the lower third going dead.
  const oculusHousing = new THREE.Mesh(
    scaleUv(
      revolve(
        [
          [1.5, 5.12],
          [1.5, 4.82],
          [1.66, 4.74],
        ],
        64
      ),
      12,
      1
    ),
    metalTurned
  );
  group.add(oculusHousing);

  const oculus = new THREE.Mesh(ceilingDisc(1.48, 64), oculusMaterial);
  oculus.position.y = 5.1;
  group.add(oculus);

  // ------------------------------------------------------------------ portal
  // The drum is set into the back panel so its outer rim is swallowed by the
  // wall rather than floating in front of it, and only the front 24 cm stands
  // proud. Traversed outer to inner so every front face looks at the camera.
  const portalGeo = scaleUv(
    revolveZ(
      [
        [CHAMBER.portalOuterRadius, 0.0],
        [CHAMBER.portalOuterRadius, 0.18],
        [1.94, 0.24],
        [1.62, 0.24],
        [1.55, 0.17],
        [1.55, 0.1],
        [1.46, 0.07],
        [1.36, 0.07],
        [1.3, 0.01],
        [1.3, -0.02],
        [0.0, 0.04],
      ],
      96
    ),
    8,
    1
  );
  const portal = new THREE.Mesh(portalGeo, metalDark);
  portal.position.set(0, CHAMBER.portalY, CHAMBER.portalZ);
  portal.receiveShadow = true;
  group.add(portal);

  const portalRings = merge([
    new THREE.RingGeometry(CHAMBER.portalRingRadius - 0.05, CHAMBER.portalRingRadius + 0.05, 96, 1),
    new THREE.RingGeometry(1.9, 1.925, 96, 1),
  ]);
  const portalRing = new THREE.Mesh(portalRings, portalRingMaterial);
  portalRing.position.set(0, CHAMBER.portalY, CHAMBER.portalZ + 0.08);
  group.add(portalRing);

  const boltGeo = scaleUv(
    revolve(
      [
        [0.0, 0.0],
        [0.075, 0.0],
        [0.075, 0.048],
        [0.055, 0.068],
        [0.0, 0.068],
      ],
      20
    ),
    1,
    1
  );
  boltGeo.rotateX(Math.PI / 2);
  const boltPlacements: InstancePlacement[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    const m = new THREE.Matrix4().makeTranslation(
      Math.cos(a) * 1.78,
      CHAMBER.portalY + Math.sin(a) * 1.78,
      CHAMBER.portalZ + 0.26
    );
    boltPlacements.push({ matrix: m, uvOffset: new THREE.Vector2(rng(), rng()) });
  }
  const bolts = buildInstanced(boltGeo, metalPanel, boltPlacements);
  group.add(bolts);

  // ------------------------------------------------------------- volumetrics
  let volumetrics: Volumetrics | null = null;
  if (quality.volumetrics) {
    volumetrics = createVolumetrics({
      lightDir: KEY_DIR.clone(),
      axisPoint: BEAM_AXIS.clone(),
      apertureRadius: CHAMBER.apertureRadius,
      ceilingY: CHAMBER.ceilingY,
      wallRadius: CHAMBER.wallRadius,
      daisRadius: CHAMBER.daisRadius,
      daisHeight: CHAMBER.daisHeight,
      plinthRadius: CHAMBER.plinthRadius,
      plinthHeight: CHAMBER.plinthTopY,
      color: KEY_COLOR.clone(),
      intensity: 0.62,
      density: 0.30,
      steps: quality.tier === 'ultra' ? 32 : quality.tier === 'high' ? 22 : 14,
      blueNoise,
      blueNoiseSize,
    });
    group.add(volumetrics.object);
    disposables.push(volumetrics);
  }

  scene.add(group);

  // Aerial perspective. The fog colour is a cold near-black so distance reads as
  // depth rather than as haze washing the frame out.
  scene.fog = new THREE.FogExp2(0x070a11, 0.052);
  scene.background = new THREE.Color(0x03050a);

  // ------------------------------------------------------------------ update
  const hideForReflection: THREE.Object3D[] = [floor, inlayMesh, conduits, daisHalo];
  if (volumetrics) hideForReflection.push(volumetrics.object);

  const accentColor = new THREE.Color();
  const tmpColor = new THREE.Color();

  return {
    name: 'vault',

    update(t: FrameTime) {
      const surge = envSurge();
      surgeAccent(accentColor);

      // The chamber itself reacts: strips ride the surge, the cove lifts, the
      // altar seam flares hardest because it is closest to the reveal.
      // `accentColor` is already peak-normalised (both ends of the lerp are),
      // so each fixture's radiance is exactly its gain and the hue never drifts
      // as it brightens.
      const pulse = 1 + Math.sin(t.elapsed * 0.55) * 0.05;
      for (const fixture of emissives) {
        const gain = fixture.gain * pulse * (1 + surge.value * 3.4 * fixture.lead);
        fixture.mat.color.copy(accentColor).multiplyScalar(gain);
      }
      tmpColor.copy(KEY_COLOR).lerp(accentColor, Math.min(0.5, surge.value * 0.6));
      oculusMaterial.color.copy(tmpColor).multiplyScalar(7.0 * (1 + surge.value * 1.8));

      if (volumetrics) volumetrics.update(t.elapsed, surge.value, accentColor);

      if (reflection && reflectionUniforms) {
        reflection.update(scene, ctx.camera, hideForReflection);
        reflectionUniforms.uReflectMap.value = reflection.texture;
        reflectionUniforms.uReflectMaxLod.value = reflection.maxLod;
      }
    },

    resize(width: number, height: number) {
      reflection?.resize(width, height);
    },

    dispose() {
      scene.remove(group);
      group.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
      for (const d of disposables) d.dispose();
    },
  };
}

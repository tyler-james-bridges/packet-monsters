import * as THREE from 'three';
import { hash2i } from './noise';

/**
 * Raymarched god rays for the key light.
 *
 * The beam is modelled as the light that survives a circular aperture in the
 * ceiling, so the shaft is an elliptical cylinder around the key axis rather
 * than a cone faked with a gradient. Sampling is dithered with a real blue
 * noise tile: a fixed step raymarch with no dither bands catastrophically once
 * bloom smears it, and that banding is the loudest amateur tell in the frame.
 *
 * Compositing does not need a depth prepass. The chamber's occluders are all
 * analytic (floor plane, wall cylinder, ceiling plane, dais and plinth
 * cylinders), so the march clamps against a closed form scene depth. That is
 * exact where it matters, costs nothing, and cannot tear the way a mesh
 * intersection would.
 */

export interface Volumetrics {
  object: THREE.Object3D;
  update(elapsed: number, surge: number, accent: THREE.Color): void;
  setQuality(steps: number): void;
  dispose(): void;
}

export interface VolumetricsOptions {
  /** Direction from the chamber toward the key light, normalised. */
  lightDir: THREE.Vector3;
  /** A point the beam axis passes through. */
  axisPoint: THREE.Vector3;
  apertureRadius: number;
  ceilingY: number;
  wallRadius: number;
  daisRadius: number;
  daisHeight: number;
  plinthRadius: number;
  plinthHeight: number;
  color: THREE.Color;
  intensity: number;
  density: number;
  steps: number;
  blueNoise: THREE.Texture;
  blueNoiseSize: number;
}

/** Tileable 3D value noise baked once into a small volume texture. */
function createHazeVolume(size: number): THREE.Data3DTexture {
  const data = new Uint8Array(size * size * size);
  const wrap = (i: number, n: number) => ((i % n) + n) % n;
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  const lattice = (period: number, seed: number, x: number, y: number, z: number): number => {
    const fx = x * period;
    const fy = y * period;
    const fz = z * period;
    const ix = Math.floor(fx);
    const iy = Math.floor(fy);
    const iz = Math.floor(fz);
    const ux = fade(fx - ix);
    const uy = fade(fy - iy);
    const uz = fade(fz - iz);
    let acc = 0;
    for (let dz = 0; dz < 2; dz++) {
      const wz = wrap(iz + dz, period);
      const kz = dz === 0 ? 1 - uz : uz;
      for (let dy = 0; dy < 2; dy++) {
        const wy = wrap(iy + dy, period);
        const ky = dy === 0 ? 1 - uy : uy;
        for (let dx = 0; dx < 2; dx++) {
          const wx = wrap(ix + dx, period);
          const kx = dx === 0 ? 1 - ux : ux;
          // Fold z into the 2D hash; the wrap keeps the volume seamless.
          acc += kx * ky * kz * hash2i(wx + wz * 8191, wy + wz * 131, seed);
        }
      }
    }
    return acc;
  };

  const inv = 1 / size;
  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (x + 0.5) * inv;
        const v = (y + 0.5) * inv;
        const w = (z + 0.5) * inv;
        const n =
          lattice(4, 5501, u, v, w) * 0.58 +
          lattice(8, 7717, u, v, w) * 0.28 +
          lattice(16, 9931, u, v, w) * 0.14;
        data[z * size * size + y * size + x] = Math.round(Math.min(1, Math.max(0, n)) * 255);
      }
    }
  }

  const tex = new THREE.Data3DTexture(data, size, size, size);
  tex.format = THREE.RedFormat;
  tex.type = THREE.UnsignedByteType;
  tex.colorSpace = THREE.NoColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.wrapR = THREE.RepeatWrapping;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return tex;
}

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  precision highp sampler3D;

  varying vec3 vWorld;

  uniform vec3 uLightDir;
  uniform vec3 uAxisPoint;
  uniform vec3 uApertureCenter;
  uniform vec3 uColor;
  uniform float uApertureRadius;
  uniform float uApertureY;
  uniform float uIntensity;
  uniform float uDensity;
  uniform float uExtinction;
  uniform float uHeightFalloff;
  uniform float uTime;
  uniform float uCeilY;
  uniform float uWallRadius;
  uniform float uDaisRadius;
  uniform float uDaisHeight;
  uniform float uPlinthRadius;
  uniform float uPlinthHeight;
  uniform sampler2D uBlueNoise;
  uniform vec2 uBlueNoiseScale;
  uniform sampler3D uHaze;

  const float INF = 1.0e9;

  // Nearest entry into a solid vertical cylinder standing on the floor.
  float cylinderEnter( vec3 ro, vec3 rd, float r, float h ) {
    vec2 o = ro.xz;
    vec2 d = rd.xz;
    float a = dot( d, d );
    if ( a < 1.0e-7 ) return INF;
    float b = dot( o, d );
    float c = dot( o, o ) - r * r;
    float disc = b * b - a * c;
    if ( disc < 0.0 ) return INF;
    float sq = sqrt( disc );
    float t0 = ( -b - sq ) / a;
    float t1 = ( -b + sq ) / a;
    if ( t1 < 0.0 ) return INF;

    float tyLo = -INF;
    float tyHi = INF;
    if ( abs( rd.y ) < 1.0e-6 ) {
      if ( ro.y < 0.0 || ro.y > h ) return INF;
    } else {
      float ta = ( 0.0 - ro.y ) / rd.y;
      float tb = ( h - ro.y ) / rd.y;
      tyLo = min( ta, tb );
      tyHi = max( ta, tb );
    }
    float tEnter = max( max( t0, tyLo ), 0.0 );
    float tExit = min( t1, tyHi );
    if ( tEnter > tExit ) return INF;
    return tEnter;
  }

  // Closed form depth of the chamber shell along a ray.
  float sceneDepth( vec3 ro, vec3 rd ) {
    float t = INF;
    if ( rd.y < -1.0e-5 ) {
      float tf = -ro.y / rd.y;
      if ( tf > 0.0 ) t = min( t, tf );
    }
    if ( rd.y > 1.0e-5 ) {
      float tc = ( uCeilY - ro.y ) / rd.y;
      if ( tc > 0.0 ) t = min( t, tc );
    }
    vec2 o = ro.xz;
    vec2 d = rd.xz;
    float a = dot( d, d );
    if ( a > 1.0e-7 ) {
      float b = dot( o, d );
      float c = dot( o, o ) - uWallRadius * uWallRadius;
      float disc = b * b - a * c;
      if ( disc > 0.0 ) {
        float tw = ( -b + sqrt( disc ) ) / a;
        if ( tw > 0.0 ) t = min( t, tw );
      }
    }
    t = min( t, cylinderEnter( ro, rd, uDaisRadius, uDaisHeight ) );
    t = min( t, cylinderEnter( ro, rd, uPlinthRadius, uPlinthHeight ) );
    return t;
  }

  // Soft analytic shadow of a vertical cylinder under a directional light.
  float cylinderShadow( vec3 p, float r, float h ) {
    if ( p.y >= h ) return 1.0;
    float tTop = ( h - p.y ) / max( 1.0e-4, uLightDir.y );
    vec2 o = p.xz;
    vec2 d = uLightDir.xz;
    float a = dot( d, d );
    if ( a < 1.0e-7 ) return length( o ) < r ? 0.0 : 1.0;
    float tc = clamp( -dot( o, d ) / a, 0.0, tTop );
    float dmin = length( o + d * tc );
    return smoothstep( r * 0.88, r * 1.30, dmin );
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize( vWorld - cameraPosition );

    // Bound the march to the beam: an infinite cylinder about the key axis.
    vec3 rel = ro - uAxisPoint;
    vec3 dPerp = rd - uLightDir * dot( rd, uLightDir );
    vec3 oPerp = rel - uLightDir * dot( rel, uLightDir );
    float a = dot( dPerp, dPerp );
    if ( a < 1.0e-7 ) discard;
    float b = dot( dPerp, oPerp );
    float c = dot( oPerp, oPerp ) - uApertureRadius * uApertureRadius;
    float disc = b * b - a * c;
    if ( disc <= 0.0 ) discard;
    float sq = sqrt( disc );
    float tNear = max( ( -b - sq ) / a, 0.0 );
    float tFar = ( -b + sq ) / a;
    if ( tFar <= tNear ) discard;

    tFar = min( tFar, sceneDepth( ro, rd ) );
    if ( tFar <= tNear ) discard;

    float span = tFar - tNear;
    float stepLen = span / float( VOLUME_STEPS );

    float dither = texture2D( uBlueNoise, gl_FragCoord.xy * uBlueNoiseScale ).r;
    float t = tNear + dither * stepLen;

    float acc = 0.0;
    float transmit = 1.0;

    for ( int i = 0; i < VOLUME_STEPS; i++ ) {
      vec3 p = ro + rd * t;

      // Aperture gate: trace back to the ceiling plane and test the hole.
      float tA = ( uApertureY - p.y ) / max( 1.0e-4, uLightDir.y );
      vec2 hit = ( p + uLightDir * tA ).xz - uApertureCenter.xz;
      float gate = 1.0 - smoothstep( uApertureRadius * 0.52, uApertureRadius, length( hit ) );

      if ( gate > 0.001 ) {
        float shadow = cylinderShadow( p, uPlinthRadius, uPlinthHeight );
        shadow = min( shadow, cylinderShadow( p, uDaisRadius, uDaisHeight ) );

        float drift = uTime * 0.035;
        float haze = texture( uHaze, p * 0.085 + vec3( drift * 0.4, -drift, drift * 0.7 ) ).r;
        float haze2 = texture( uHaze, p * 0.24 + vec3( -drift, drift * 0.5, drift ) ).r;
        float turbulence = 0.45 + haze * 0.85 + haze2 * 0.35;

        float dens = uDensity * exp( -max( 0.0, p.y ) * uHeightFalloff ) * turbulence;
        acc += gate * shadow * dens * stepLen * transmit;
        transmit *= exp( -dens * stepLen * uExtinction );
      }

      t += stepLen;
      if ( transmit < 0.02 ) break;
    }

    vec3 col = uColor * uIntensity * acc;
    gl_FragColor = vec4( col, 1.0 );
  }
`;

export function createVolumetrics(opts: VolumetricsOptions): Volumetrics {
  const dir = opts.lightDir.clone().normalize();
  const haze = createHazeVolume(32);

  const apertureCenter = opts.axisPoint
    .clone()
    .addScaledVector(dir, (opts.ceilingY - opts.axisPoint.y) / Math.max(1e-4, dir.y));

  const uniforms = {
    uLightDir: { value: dir },
    uAxisPoint: { value: opts.axisPoint.clone() },
    uApertureCenter: { value: apertureCenter },
    uColor: { value: opts.color.clone() },
    uApertureRadius: { value: opts.apertureRadius },
    uApertureY: { value: opts.ceilingY },
    uIntensity: { value: opts.intensity },
    uDensity: { value: opts.density },
    uExtinction: { value: 0.55 },
    uHeightFalloff: { value: 0.16 },
    uTime: { value: 0 },
    uCeilY: { value: opts.ceilingY },
    uWallRadius: { value: opts.wallRadius },
    uDaisRadius: { value: opts.daisRadius },
    uDaisHeight: { value: opts.daisHeight },
    uPlinthRadius: { value: opts.plinthRadius },
    uPlinthHeight: { value: opts.plinthHeight },
    uBlueNoise: { value: opts.blueNoise },
    uBlueNoiseScale: { value: new THREE.Vector2(1 / opts.blueNoiseSize, 1 / opts.blueNoiseSize) },
    uHaze: { value: haze },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    defines: { VOLUME_STEPS: Math.max(4, Math.round(opts.steps)) },
    transparent: true,
    blending: THREE.AdditiveBlending,
    // The march composites itself against analytic scene depth, so the proxy
    // hull must never be depth rejected or the beam would clip on the plinth.
    depthTest: false,
    depthWrite: false,
    side: THREE.BackSide,
    toneMapped: false,
    fog: false,
  });

  // Proxy hull: a capped cylinder around the beam. Rendering back faces gives
  // exactly one fragment per covered pixel whether or not the camera is inside.
  const geometry = new THREE.CylinderGeometry(
    opts.apertureRadius * 1.06,
    opts.apertureRadius * 1.06,
    13,
    28,
    1,
    false
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  mesh.position.copy(opts.axisPoint).addScaledVector(dir, 1.6);
  mesh.frustumCulled = false;
  mesh.renderOrder = 24;
  mesh.name = 'vault-godrays';

  const baseIntensity = opts.intensity;
  const baseDensity = opts.density;
  const tint = new THREE.Color();

  return {
    object: mesh,
    update(elapsed, surge, accent) {
      uniforms.uTime.value = elapsed;
      uniforms.uIntensity.value = baseIntensity * (1 + surge * 2.6);
      uniforms.uDensity.value = baseDensity * (1 + surge * 0.5);
      tint.copy(opts.color).lerp(accent, Math.min(1, surge * 0.9));
      uniforms.uColor.value.copy(tint);
    },
    setQuality(steps) {
      material.defines.VOLUME_STEPS = Math.max(4, Math.round(steps));
      material.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      haze.dispose();
    },
  };
}

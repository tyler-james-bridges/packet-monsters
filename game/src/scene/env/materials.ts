import * as THREE from 'three';
import type { FloorReflection } from './reflection';
import type { PbrTextureSet } from './textures';

/**
 * Material authoring for the chamber. Every architectural surface is a full PBR
 * stack: procedural albedo, tangent space normal and a packed ORM. Nothing in
 * the vault is a flat single colour standard material.
 */

export interface SurfaceOptions {
  color?: THREE.ColorRepresentation;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  aoMapIntensity?: number;
  normalScale?: number;
  anisotropy?: number;
  anisotropyRotation?: number;
  side?: THREE.Side;
}

function applyMaps(mat: THREE.MeshStandardMaterial, tex: PbrTextureSet, normalScale: number): void {
  mat.map = tex.map;
  mat.normalMap = tex.normalMap;
  mat.normalScale = new THREE.Vector2(normalScale, normalScale);
  mat.roughnessMap = tex.ormMap;
  mat.metalnessMap = tex.ormMap;
  mat.aoMap = tex.ormMap;
}

/** Cast concrete. Dielectric, high roughness, driven entirely by its maps. */
export function createConcreteMaterial(
  tex: PbrTextureSet,
  opts: SurfaceOptions = {}
): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: opts.color ?? 0xffffff,
    // Maps multiply these, so they stay at unity and the texture does the work.
    roughness: opts.roughness ?? 1,
    metalness: opts.metalness ?? 1,
    envMapIntensity: opts.envMapIntensity ?? 1,
    aoMapIntensity: opts.aoMapIntensity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    dithering: true,
  });
  applyMaps(mat, tex, opts.normalScale ?? 1);
  return mat;
}

/**
 * Dark anodised metal. MeshPhysicalMaterial so the brushed grain gets a real
 * anisotropic specular lobe; the tangent frame comes from UV derivatives, which
 * is why every metal part is built from lathes and boxes with sane UVs.
 */
export function createMetalMaterial(
  tex: PbrTextureSet,
  opts: SurfaceOptions = {}
): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: opts.color ?? 0xffffff,
    roughness: opts.roughness ?? 1,
    metalness: opts.metalness ?? 1,
    envMapIntensity: opts.envMapIntensity ?? 1.15,
    aoMapIntensity: opts.aoMapIntensity ?? 1,
    side: opts.side ?? THREE.FrontSide,
    dithering: true,
  });
  applyMaps(mat, tex, opts.normalScale ?? 1);
  mat.anisotropy = opts.anisotropy ?? 0.55;
  mat.anisotropyRotation = opts.anisotropyRotation ?? 0;
  return mat;
}

/**
 * A self lit strip. Values run well above 1 so the bloom in the post chain has
 * something real to pick up rather than a clipped white line.
 */
export function createEmissiveMaterial(
  color: THREE.Color,
  ramp?: THREE.Texture
): THREE.MeshBasicMaterial {
  const mat = new THREE.MeshBasicMaterial({
    color: color.clone(),
    toneMapped: false,
    fog: true,
  });
  if (ramp) mat.map = ramp;
  return mat;
}

/**
 * Lets one InstancedMesh break the tiling of a shared texture by shifting UVs
 * per instance. Without it, twenty four identical concrete panels announce
 * themselves immediately.
 */
export function enableInstanceUvOffset(mat: THREE.Material): void {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec2 aUvOffset;')
      .replace(
        '#include <uv_vertex>',
        /* glsl */ `
        #include <uv_vertex>
        #ifdef USE_MAP
          vMapUv += aUvOffset;
        #endif
        #ifdef USE_NORMALMAP
          vNormalMapUv += aUvOffset;
        #endif
        #ifdef USE_ROUGHNESSMAP
          vRoughnessMapUv += aUvOffset;
        #endif
        #ifdef USE_METALNESSMAP
          vMetalnessMapUv += aUvOffset;
        #endif
        #ifdef USE_AOMAP
          vAoMapUv += aUvOffset;
        #endif
        `
      );
  };
  mat.customProgramCacheKey = () => 'env-instance-uv-offset';
}

export interface ReflectiveFloorUniforms {
  uReflectMap: { value: THREE.Texture | null };
  uReflectMatrix: { value: THREE.Matrix4 };
  uReflectStrength: { value: number };
  uReflectMaxLod: { value: number };
  uReflectDistort: { value: number };
  uReflectTint: { value: THREE.Color };
}

/**
 * Injects the planar probe into a standard material as a roughness aware
 * reflection term. It is added after the PBR lighting so shadows, fog and the
 * IBL all still apply; the mip choice comes from the local roughness and the
 * reflected distance, which is what keeps it from looking like a mirror.
 */
export function patchFloorReflection(
  mat: THREE.MeshStandardMaterial,
  reflection: FloorReflection,
  strength: number,
  tint: THREE.Color
): ReflectiveFloorUniforms {
  const uniforms: ReflectiveFloorUniforms = {
    uReflectMap: { value: reflection.texture },
    uReflectMatrix: { value: reflection.textureMatrix },
    uReflectStrength: { value: strength },
    uReflectMaxLod: { value: reflection.maxLod },
    uReflectDistort: { value: 0.02 },
    uReflectTint: { value: tint.clone() },
  };

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vReflWorld;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvReflWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;'
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `
        #include <common>
        varying vec3 vReflWorld;
        uniform sampler2D uReflectMap;
        uniform mat4 uReflectMatrix;
        uniform float uReflectStrength;
        uniform float uReflectMaxLod;
        uniform float uReflectDistort;
        uniform vec3 uReflectTint;
        `
      )
      .replace(
        '#include <opaque_fragment>',
        /* glsl */ `
        {
          vec4 reflClip = uReflectMatrix * vec4( vReflWorld, 1.0 );
          vec2 reflUv = reflClip.xy / max( 1e-4, reflClip.w );

          // Ripple the lookup with the surface's own microdetail so the
          // reflection breaks up exactly where the slab is not perfectly flat.
          #ifdef USE_NORMALMAP
            vec3 reflPerturb = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
            reflUv += reflPerturb.xy * uReflectDistort;
          #endif

          float reflDist = length( vReflWorld - cameraPosition );
          float reflLod = uReflectMaxLod * clamp(
            roughnessFactor * 1.9 + reflDist * 0.030, 0.0, 0.95 );

          vec3 reflColor = textureLod( uReflectMap, reflUv, reflLod ).rgb;

          vec3 reflViewDir = normalize( vViewPosition );
          float reflNdotV = clamp( dot( normal, reflViewDir ), 0.0, 1.0 );
          float reflFresnel = pow( 1.0 - reflNdotV, 4.0 );
          float reflAmount = uReflectStrength * mix( 0.10, 1.0, reflFresnel );
          reflAmount *= 1.0 - clamp( roughnessFactor * 1.15, 0.0, 0.92 );

          // Keep it inside the buffer; anything sampling off the edge would
          // smear the border pixel across the whole floor.
          vec2 reflEdge = smoothstep( vec2( 0.0 ), vec2( 0.04 ), reflUv ) *
                          smoothstep( vec2( 0.0 ), vec2( 0.04 ), 1.0 - reflUv );
          reflAmount *= reflEdge.x * reflEdge.y;

          outgoingLight += reflColor * reflAmount * uReflectTint;
        }
        #include <opaque_fragment>
        `
      );
  };
  mat.customProgramCacheKey = () => 'env-floor-reflection';

  return uniforms;
}

/** Multiplies a geometry's UVs in place so one texture can tile at many scales. */
export function scaleUv(
  geometry: THREE.BufferGeometry,
  su: number,
  sv: number,
  ou = 0,
  ov = 0
): THREE.BufferGeometry {
  const uv = geometry.getAttribute('uv') as THREE.BufferAttribute | undefined;
  if (!uv) return geometry;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) * su + ou, uv.getY(i) * sv + ov);
  }
  uv.needsUpdate = true;
  return geometry;
}

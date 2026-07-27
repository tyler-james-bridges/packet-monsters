import * as THREE from 'three';

/**
 * Shared plumbing for the post chain: a fullscreen triangle runner, render
 * target construction and the GLSL snippets every pass needs.
 *
 * Every pass is a RawShaderMaterial on GLSL3 so nothing three injects can
 * silently apply a colour space conversion. The chain is linear-sRGB HDR from
 * the scene render all the way to the tone map in grade.ts, which performs the
 * one and only transfer function encode.
 */

export const FULLSCREEN_VERT = /* glsl */ `
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4( position.xy, 0.0, 1.0 );
}
`;

/** Shared helpers available to every fragment shader in the chain. */
export const GLSL_COMMON = /* glsl */ `
#ifndef PM_COMMON
#define PM_COMMON

float luma( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
float maxc( vec3 c ) { return max( c.r, max( c.g, c.b ) ); }
float sat1( float x ) { return clamp( x, 0.0, 1.0 ); }
vec3 sat3( vec3 x ) { return clamp( x, vec3( 0.0 ), vec3( 1.0 ) ); }

// Karis weight: suppresses fireflies by weighting a tap by its own brightness.
float karisWeight( vec3 c ) { return 1.0 / ( 1.0 + luma( c ) ); }

// Integer hash, exact in float32 for the ranges used here.
float hash13( vec3 p ) {
  p = fract( p * 0.1031 );
  p += dot( p, p.yzx + 33.33 );
  return fract( ( p.x + p.y ) * p.z );
}

// Depth buffer value (0..1, window space) to positive view space distance.
float linearDepth( float d, float near, float far ) {
  float z = d * 2.0 - 1.0;
  return ( 2.0 * near * far ) / ( far + near - z * ( far - near ) );
}

#endif
`;

export interface TargetOptions {
  type?: THREE.TextureDataType;
  format?: THREE.PixelFormat;
  depthBuffer?: boolean;
  /** Attach a sampleable depth texture. */
  depthTexture?: boolean;
  /** Multiple render targets. */
  count?: number;
  filter?: THREE.MagnificationTextureFilter;
  generateMipmaps?: boolean;
  wrap?: THREE.Wrapping;
}

export function makeTarget(w: number, h: number, o: TargetOptions = {}): THREE.WebGLRenderTarget {
  const width = Math.max(1, Math.round(w));
  const height = Math.max(1, Math.round(h));
  const filter = o.filter ?? THREE.LinearFilter;
  const target = new THREE.WebGLRenderTarget(width, height, {
    type: o.type ?? THREE.HalfFloatType,
    format: o.format ?? THREE.RGBAFormat,
    colorSpace: THREE.NoColorSpace,
    depthBuffer: o.depthBuffer ?? false,
    stencilBuffer: false,
    samples: 0,
    count: o.count ?? 1,
  });
  const wrap = o.wrap ?? THREE.ClampToEdgeWrapping;
  for (const tex of target.textures) {
    tex.minFilter = o.generateMipmaps ? THREE.LinearMipmapLinearFilter : filter;
    tex.magFilter = filter;
    tex.wrapS = wrap;
    tex.wrapT = wrap;
    tex.generateMipmaps = o.generateMipmaps ?? false;
    tex.anisotropy = 1;
  }
  if (o.depthTexture) {
    const depth = new THREE.DepthTexture(width, height, THREE.UnsignedIntType);
    depth.format = THREE.DepthFormat;
    depth.minFilter = THREE.NearestFilter;
    depth.magFilter = THREE.NearestFilter;
    depth.generateMipmaps = false;
    target.depthTexture = depth;
  }
  return target;
}

export function disposeTarget(t: THREE.WebGLRenderTarget | null | undefined): void {
  if (!t) return;
  if (t.depthTexture) t.depthTexture.dispose();
  t.dispose();
}

/** A single fullscreen shader stage. Owns only its material. */
export class ScreenPass {
  readonly material: THREE.RawShaderMaterial;

  constructor(
    fragmentShader: string,
    uniforms: Record<string, THREE.IUniform>,
    defines: Record<string, string | number> = {}
  ) {
    this.material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms,
      defines: { ...defines },
      vertexShader: FULLSCREEN_VERT,
      // GLSL ES 3.0 gives float and int a default precision in fragment shaders
      // but gives sampler3D none, so a pass that samples a 3D LUT fails to
      // compile unless it is declared here. Declaring all three centrally keeps
      // every pass from having to remember.
      fragmentShader:
        `precision highp float;\nprecision highp int;\nprecision highp sampler3D;\n${fragmentShader}`,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NoBlending,
      transparent: false,
    });
  }

  get uniforms(): Record<string, THREE.IUniform> {
    return this.material.uniforms;
  }

  set<T>(name: string, value: T): void {
    const u = this.material.uniforms[name];
    if (u) u.value = value;
  }

  /** Change a compile time constant and force a relink. */
  define(name: string, value: string | number): void {
    if (this.material.defines[name] === value) return;
    this.material.defines[name] = value;
    this.material.needsUpdate = true;
  }

  dispose(): void {
    this.material.dispose();
  }
}

/**
 * Draws fullscreen passes. One instance per pipeline so disposal is unambiguous
 * and no module level GPU state outlives the app.
 */
export class PassRunner {
  private readonly geometry: THREE.BufferGeometry;
  private readonly mesh: THREE.Mesh;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly placeholder: THREE.Material;

  constructor() {
    // A single oversized triangle: no diagonal seam, one fewer vertex than a
    // quad and, more importantly, no duplicated shading along the diagonal.
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3)
    );
    this.geometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2)
    );
    this.placeholder = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.placeholder);
    this.mesh.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  render(
    renderer: THREE.WebGLRenderer,
    pass: ScreenPass,
    target: THREE.WebGLRenderTarget | null
  ): void {
    this.mesh.material = pass.material;
    renderer.setRenderTarget(target);
    renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.geometry.dispose();
    this.placeholder.dispose();
    this.scene.clear();
  }
}

/** Radical inverse in an arbitrary base, for the Halton jitter sequence. */
export function radicalInverse(index: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

/** Halton(2,3) points centred on zero, in units of one pixel. */
export function haltonSequence(count: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 1; i <= count; i++) {
    out.push([radicalInverse(i, 2) - 0.5, radicalInverse(i, 3) - 0.5]);
  }
  return out;
}

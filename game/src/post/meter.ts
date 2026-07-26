import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass, disposeTarget, makeTarget } from './common';
import type { PassRunner } from './common';

/**
 * Scene metering: automatic exposure and automatic focus, both resolved
 * entirely on the GPU into a single one by one texture that the DOF and grade
 * passes sample. No readback, so no pipeline stall, and because adaptation is
 * driven by FrameTime.dt it converges identically under the shot harness.
 *
 * Stage one reduces the HDR frame to a nine by nine grid of clamped log2
 * luminance, each cell integrating a four by four stratified sample of its own
 * region, so the whole frame is covered. Stage two collapses that grid with a
 * centre weighted kernel, folds in a nine tap depth cluster at the frame centre
 * for focus, and blends the result into the previous frame's state with
 * separate attack and release rates. Real light meters are asymmetric: the eye
 * adapts to a brightening much faster than to a darkening.
 */

const GRID = 9;

const REDUCE_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform vec2 uCell;      // uv extent of one grid cell

void main() {
  vec2 base = floor( vUv * float( GRID ) ) * uCell;
  float acc = 0.0;
  for ( int y = 0; y < 4; y++ ) {
    for ( int x = 0; x < 4; x++ ) {
      vec2 uv = base + ( vec2( float( x ), float( y ) ) + 0.5 ) * 0.25 * uCell;
      vec3 c = max( texture( tSource, uv ).rgb, vec3( 0.0 ) );
      // Clamp before the log so a single specular pinprick cannot drag the
      // whole meter, and a pure black texel cannot drive it to negative
      // infinity.
      float l = clamp( luma( c ), 0.0005, 64.0 );
      acc += clamp( log2( l ), -11.0, 6.0 );
    }
  }
  acc /= 16.0;
  fragColor = vec4( ( acc + 11.0 ) / 17.0, 0.0, 0.0, 1.0 );
}
`;

const RESOLVE_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tGrid;
uniform sampler2D tDepth;
uniform sampler2D tPrev;
uniform vec2 uTexel;         // full resolution texel size, for the depth cluster
uniform float uNear;
uniform float uFar;
uniform float uDt;
uniform float uReset;
uniform float uAttack;
uniform float uRelease;
uniform float uFocusRate;
uniform float uManualFocus;  // > 0 overrides the metered distance
uniform float uExposureBase;
uniform float uExposureComp;
uniform float uAutoExposure;
uniform float uMinExposure;
uniform float uMaxExposure;

// The single source of truth for scene exposure. Both the bloom prefilter and
// the grade read this, so the bloom threshold is measured against the same
// exposed image the viewer sees rather than against raw scene radiance.
float exposureFor( float ev ) {
  float metered = clamp( 0.18 / exp2( ev ), uMinExposure, uMaxExposure );
  return uExposureBase * exp2( uExposureComp ) * pow( metered, uAutoExposure );
}

void main() {
  // Centre weighted average of the log luminance grid.
  float sum = 0.0;
  float wsum = 0.0;
  for ( int y = 0; y < GRID; y++ ) {
    for ( int x = 0; x < GRID; x++ ) {
      vec2 g = ( vec2( float( x ), float( y ) ) + 0.5 ) / float( GRID );
      float d = length( ( g - 0.5 ) * vec2( 1.0, 1.15 ) );
      float w = exp( -d * d * 5.0 ) + 0.25;
      float v = texture( tGrid, g ).r * 17.0 - 11.0;
      sum += v * w;
      wsum += w;
    }
  }
  float curEv = sum / max( wsum, 1e-5 );

  // Focus: nine tap cluster at the frame centre, biased toward the nearest
  // surface because the subject is what stands in front, not behind.
  float dsum = 0.0;
  float dmin = 1e9;
  for ( int y = -1; y <= 1; y++ ) {
    for ( int x = -1; x <= 1; x++ ) {
      vec2 uv = vec2( 0.5, 0.5 ) + vec2( float( x ), float( y ) ) * uTexel * 24.0;
      float z = linearDepth( texture( tDepth, uv ).x, uNear, uFar );
      dsum += z;
      dmin = min( dmin, z );
    }
  }
  float curFocus = mix( dsum / 9.0, dmin, 0.65 );
  if ( uManualFocus > 0.0 ) curFocus = uManualFocus;
  curFocus = clamp( curFocus, uNear * 4.0, uFar * 0.5 );

  vec4 prev = texture( tPrev, vec2( 0.5 ) );
  float prevEv = prev.r;
  float prevFocus = prev.g;

  float ev = curEv;
  float focus = curFocus;

  if ( uReset < 0.5 ) {
    // Exponential convergence, frame rate independent. Attack and release are
    // asymmetric because adaptation to light is not symmetric.
    float rate = curEv > prevEv ? uAttack : uRelease;
    ev = mix( prevEv, curEv, 1.0 - exp( -uDt * rate ) );
    focus = mix( prevFocus, curFocus, 1.0 - exp( -uDt * uFocusRate ) );
  }

  fragColor = vec4( ev, focus, exposureFor( ev ), 1.0 );
}
`;

export interface MeterOptions {
  attack: number;
  release: number;
  focusRate: number;
}

export class MeterPass {
  private reduce: ScreenPass;
  private resolve: ScreenPass;
  private grid: THREE.WebGLRenderTarget;
  private state: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private write = 0;
  private reset = true;
  private manualFocus = -1;

  constructor(options: MeterOptions) {
    this.reduce = new ScreenPass(
      REDUCE_FRAG,
      {
        tSource: { value: null },
        uCell: { value: new THREE.Vector2(1 / GRID, 1 / GRID) },
      },
      { GRID }
    );
    this.resolve = new ScreenPass(
      RESOLVE_FRAG,
      {
        tGrid: { value: null },
        tDepth: { value: null },
        tPrev: { value: null },
        uTexel: { value: new THREE.Vector2(1 / 1600, 1 / 1000) },
        uNear: { value: 0.05 },
        uFar: { value: 200 },
        uDt: { value: 1 / 60 },
        uReset: { value: 1 },
        uAttack: { value: options.attack },
        uRelease: { value: options.release },
        uFocusRate: { value: options.focusRate },
        uManualFocus: { value: -1 },
        uExposureBase: { value: 1 },
        uExposureComp: { value: 0 },
        uAutoExposure: { value: 0.6 },
        uMinExposure: { value: 0.5 },
        uMaxExposure: { value: 9 },
      },
      { GRID }
    );

    this.grid = makeTarget(GRID, GRID, {
      type: THREE.UnsignedByteType,
      filter: THREE.NearestFilter,
    });
    this.state = [
      makeTarget(1, 1, { type: THREE.FloatType, filter: THREE.NearestFilter }),
      makeTarget(1, 1, { type: THREE.FloatType, filter: THREE.NearestFilter }),
    ];
  }

  /**
   * One by one RGBA float. r is smoothed scene log2 luminance, g is the focus
   * distance in world units, b is the resolved exposure multiplier.
   */
  get texture(): THREE.Texture {
    return this.state[1 - this.write].texture;
  }

  /** Exposure policy. The meter owns it so every pass agrees on it. */
  setExposure(cfg: {
    base: number;
    comp: number;
    auto: number;
    min: number;
    max: number;
  }): void {
    this.resolve.set('uExposureBase', cfg.base);
    this.resolve.set('uExposureComp', cfg.comp);
    this.resolve.set('uAutoExposure', cfg.auto);
    this.resolve.set('uMinExposure', cfg.min);
    this.resolve.set('uMaxExposure', cfg.max);
  }

  setSize(width: number, height: number): void {
    (this.resolve.uniforms.uTexel.value as THREE.Vector2).set(1 / width, 1 / height);
  }

  setCamera(near: number, far: number): void {
    this.resolve.set('uNear', near);
    this.resolve.set('uFar', far);
  }

  /** Negative distance restores automatic focus. */
  setManualFocus(distance: number): void {
    this.manualFocus = distance;
    this.resolve.set('uManualFocus', distance);
  }

  get manualFocusDistance(): number {
    return this.manualFocus;
  }

  configure(options: MeterOptions): void {
    this.resolve.set('uAttack', options.attack);
    this.resolve.set('uRelease', options.release);
    this.resolve.set('uFocusRate', options.focusRate);
  }

  resetState(): void {
    this.reset = true;
  }

  render(
    renderer: THREE.WebGLRenderer,
    runner: PassRunner,
    color: THREE.Texture,
    depth: THREE.Texture,
    dt: number
  ): void {
    this.reduce.set('tSource', color);
    runner.render(renderer, this.reduce, this.grid);

    const dst = this.state[this.write];
    const prev = this.state[1 - this.write];
    this.resolve.set('tGrid', this.grid.texture);
    this.resolve.set('tDepth', depth);
    this.resolve.set('tPrev', prev.texture);
    this.resolve.set('uDt', Math.min(dt, 0.1));
    this.resolve.set('uReset', this.reset ? 1 : 0);
    runner.render(renderer, this.resolve, dst);

    this.write = 1 - this.write;
    this.reset = false;
  }

  dispose(): void {
    this.reduce.dispose();
    this.resolve.dispose();
    disposeTarget(this.grid);
    disposeTarget(this.state[0]);
    disposeTarget(this.state[1]);
  }
}

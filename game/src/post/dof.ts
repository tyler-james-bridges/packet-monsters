import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass, disposeTarget, makeTarget } from './common';
import type { PassRunner } from './common';

/**
 * Physically parameterised depth of field.
 *
 * The circle of confusion comes from the thin lens equation with real camera
 * numbers. Focal length is not a free parameter: it is derived from the render
 * camera's vertical field of view and the chosen sensor height, so the defocus
 * is consistent with the perspective actually being rendered. The artistic dial
 * is the f number, plus a bokeh scale that admits this is a game and a stop
 * faster than the lens can physically open sometimes reads better.
 *
 *   coc_diameter = f^2 * |z - S| / ( N * z * ( S - f ) )
 *
 * Near and far fields are gathered separately into two MRT attachments in one
 * half resolution pass, using scatter as gather with a fixed maximum radius so
 * every tap's own circle of confusion decides its coverage. Compositing puts
 * the far field under the sharp image, gated by the receiving pixel's own CoC,
 * and the near field over the top with its own coverage alpha. That ordering is
 * the occlusion rule: foreground spills across background, never the reverse.
 */

const COC_GLSL = /* glsl */ `
uniform float uFocalLength;   // metres
uniform float uFStop;
uniform float uSensorHeight;  // metres
uniform float uBokehScale;
uniform float uMaxRadius;     // full resolution pixels
uniform float uFocusRange;    // metres held in focus around the focal plane
uniform float uHeightPixels;
uniform float uNear;
uniform float uFar;

// Signed circle of confusion radius in full resolution pixels. Negative is in
// front of the focal plane.
float cocRadius( float z, float focus ) {
  float d = z - focus;
  float held = sign( d ) * max( abs( d ) - uFocusRange * 0.5, 0.0 );
  float zEff = focus + held;
  float f = uFocalLength;
  float denom = max( uFStop * max( zEff, 1e-3 ) * max( focus - f, 1e-4 ), 1e-9 );
  float diameter = f * f * abs( zEff - focus ) / denom;
  float px = diameter / uSensorHeight * uHeightPixels * uBokehScale * 0.5;
  return sign( held ) * min( px, uMaxRadius );
}
`;

const PREP_FRAG = /* glsl */ `
${GLSL_COMMON}
${COC_GLSL}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform sampler2D tMeter;
uniform vec2 uFullTexel;

void main() {
  // One bilinear tap at a half resolution texel centre is already the exact
  // two by two box average of the source, so no extra colour taps are needed.
  vec3 color = texture( tColor, vUv ).rgb;

  // Depth must not be filtered. Take the four covered texels and keep the
  // nearest, so a thin foreground silhouette survives the downsample instead of
  // being averaged into the background behind it.
  float d0 = texture( tDepth, vUv + uFullTexel * vec2( -0.5, -0.5 ) ).x;
  float d1 = texture( tDepth, vUv + uFullTexel * vec2(  0.5, -0.5 ) ).x;
  float d2 = texture( tDepth, vUv + uFullTexel * vec2( -0.5,  0.5 ) ).x;
  float d3 = texture( tDepth, vUv + uFullTexel * vec2(  0.5,  0.5 ) ).x;
  float d = min( min( d0, d1 ), min( d2, d3 ) );

  float focus = texture( tMeter, vec2( 0.5 ) ).g;
  float z = linearDepth( d, uNear, uFar );
  float coc = cocRadius( z, focus );

  // Firefly guard: an unclamped highlight scattered over a wide aperture turns
  // into a visible disc of pure white.
  color = min( color, vec3( 24.0 ) );

  fragColor = vec4( color, coc / max( uMaxRadius, 1e-4 ) );
}
`;

const GATHER_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
layout( location = 0 ) out vec4 outFar;
layout( location = 1 ) out vec4 outNear;

uniform sampler2D tPrep;
uniform vec2 uTexel;        // half resolution texel size
uniform float uMaxRadius;   // half resolution pixels
uniform float uAperture;    // 0 circular, 1 hexagonal

// A golden angle spiral gives an even, low discrepancy disc with none of the
// spoke structure a ring pattern shows on out of focus points.
const float GOLDEN = 2.39996323;

void main() {
  vec4 center = texture( tPrep, vUv );

  vec3 farAcc = vec3( 0.0 );
  float farW = 0.0;
  vec3 nearAcc = vec3( 0.0 );
  float nearW = 0.0;

  for ( int i = 0; i < TAPS; i++ ) {
    float fi = float( i ) + 0.5;
    float r = sqrt( fi / float( TAPS ) );
    float a = fi * GOLDEN;
    vec2 dir = vec2( cos( a ), sin( a ) );

    // Hexagonal aperture: push the unit disc out toward the six blade edges so
    // point highlights read as hex bokeh rather than perfect circles. The 0.93
    // renormalises the mean radius so changing aperture shape does not change
    // how much the image blurs.
    float hex = 0.93 / max( cos( mod( a, 1.0471976 ) - 0.5235988 ), 0.7 );
    float shape = mix( 1.0, hex, uAperture );
    vec2 offset = dir * r * shape * uMaxRadius;

    vec4 s = texture( tPrep, vUv + offset * uTexel );
    float sr = s.a * uMaxRadius;
    float dist = length( offset );

    // Coverage: this tap's own circle of confusion must reach the pixel being
    // shaded. That is scatter as gather, and it is what makes the blur
    // brightness independent of how many taps happen to be in range.
    float cover = sat1( abs( sr ) - dist + 1.0 );

    // Far field takes only samples at or behind the focal plane.
    float wf = cover * step( 0.0, sr );
    farAcc += s.rgb * wf;
    farW += wf;

    // Near field takes only samples in front of it.
    float wn = cover * step( sr, -1e-4 );
    nearAcc += s.rgb * wn;
    nearW += wn;
  }

  // The centre sample always belongs to the far buffer at unit weight so an in
  // focus pixel resolves to exactly itself.
  float centerW = step( -1e-4, center.a ) * 1.0;
  farAcc += center.rgb * centerW;
  farW += centerW;

  outFar = vec4( farAcc / max( farW, 1e-4 ), 1.0 );

  // Coverage alpha. A foreground with a small circle of confusion only reaches
  // a handful of taps, so the metered alpha is floored by the receiving pixel's
  // own CoC, which is what keeps a mildly defocused foreground from turning
  // semi transparent.
  float alpha = sat1( nearW * 2.0 / float( TAPS ) );
  alpha = max( alpha, sat1( -center.a * uMaxRadius * 0.6 ) );
  outNear = vec4( nearAcc / max( nearW, 1e-4 ), alpha );
}
`;

const COMPOSITE_FRAG = /* glsl */ `
${GLSL_COMMON}
${COC_GLSL}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tFar;
uniform sampler2D tNear;
uniform sampler2D tDepth;
uniform sampler2D tMeter;

void main() {
  vec3 sharp = texture( tColor, vUv ).rgb;
  float focus = texture( tMeter, vec2( 0.5 ) ).g;
  float z = linearDepth( texture( tDepth, vUv ).x, uNear, uFar );
  float coc = cocRadius( z, focus );

  vec3 far = texture( tFar, vUv ).rgb;
  vec4 near = texture( tNear, vUv );

  // Ramp the far field in over the first pixel and a half of defocus so the
  // transition out of critical focus is smooth rather than a visible band.
  float t = sat1( coc / max( uMaxRadius * 0.22, 1e-3 ) );
  float farBlend = t * t * ( 3.0 - 2.0 * t );

  vec3 color = mix( sharp, far, farBlend );
  color = mix( color, near.rgb, sat1( near.a ) );

  fragColor = vec4( color, 1.0 );
}
`;

export interface DofOptions {
  /** Sensor height in millimetres. 24 is a full frame stills sensor. */
  sensorHeight: number;
  fStop: number;
  bokehScale: number;
  /** Maximum blur radius in full resolution pixels. */
  maxRadius: number;
  taps: number;
  /** 0 circular aperture, 1 hexagonal. */
  aperture: number;
}

export class DofPass {
  private prep: ScreenPass;
  private gather: ScreenPass;
  private composite: ScreenPass;
  private prepTarget: THREE.WebGLRenderTarget | null = null;
  private gatherTarget: THREE.WebGLRenderTarget | null = null;
  private outTarget: THREE.WebGLRenderTarget | null = null;
  private width = 1;
  private height = 1;
  private focusRange = 0.6;

  constructor(private options: DofOptions) {
    const cocUniforms = (): Record<string, THREE.IUniform> => ({
      uFocalLength: { value: 0.035 },
      uFStop: { value: options.fStop },
      uSensorHeight: { value: options.sensorHeight / 1000 },
      uBokehScale: { value: options.bokehScale },
      uMaxRadius: { value: options.maxRadius },
      uFocusRange: { value: 0.6 },
      uHeightPixels: { value: 1000 },
      uNear: { value: 0.05 },
      uFar: { value: 200 },
    });

    this.prep = new ScreenPass(PREP_FRAG, {
      tColor: { value: null },
      tDepth: { value: null },
      tMeter: { value: null },
      uFullTexel: { value: new THREE.Vector2() },
      ...cocUniforms(),
    });
    this.gather = new ScreenPass(
      GATHER_FRAG,
      {
        tPrep: { value: null },
        uTexel: { value: new THREE.Vector2() },
        uMaxRadius: { value: options.maxRadius * 0.5 },
        uAperture: { value: options.aperture },
      },
      { TAPS: options.taps }
    );
    this.composite = new ScreenPass(COMPOSITE_FRAG, {
      tColor: { value: null },
      tFar: { value: null },
      tNear: { value: null },
      tDepth: { value: null },
      tMeter: { value: null },
      ...cocUniforms(),
    });
  }

  configure(options: DofOptions): void {
    const tapsChanged = options.taps !== this.options.taps;
    this.options = options;
    for (const p of [this.prep, this.composite]) {
      p.set('uFStop', options.fStop);
      p.set('uSensorHeight', options.sensorHeight / 1000);
      p.set('uBokehScale', options.bokehScale);
      p.set('uMaxRadius', options.maxRadius);
    }
    this.gather.set('uMaxRadius', options.maxRadius * 0.5);
    this.gather.set('uAperture', options.aperture);
    if (tapsChanged) this.gather.define('TAPS', options.taps);
  }

  /** Focal length follows the render camera so defocus matches the perspective. */
  setCamera(camera: THREE.PerspectiveCamera): void {
    const sensor = this.options.sensorHeight / 1000;
    const focal = sensor / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    for (const p of [this.prep, this.composite]) {
      p.set('uFocalLength', focal);
      p.set('uNear', camera.near);
      p.set('uFar', camera.far);
    }
  }

  /** The world space band held in critical focus, in metres. */
  setFocusRange(range: number): void {
    this.focusRange = Math.max(0, range);
    this.prep.set('uFocusRange', this.focusRange);
    this.composite.set('uFocusRange', this.focusRange);
  }

  /** Momentary aperture override, used by the surge response. */
  setFStop(fStop: number): void {
    this.prep.set('uFStop', fStop);
    this.composite.set('uFStop', fStop);
  }

  setSize(width: number, height: number): void {
    this.release();
    this.width = width;
    this.height = height;
    const hw = Math.max(1, Math.floor(width / 2));
    const hh = Math.max(1, Math.floor(height / 2));
    this.prepTarget = makeTarget(hw, hh, { type: THREE.HalfFloatType });
    this.gatherTarget = makeTarget(hw, hh, { type: THREE.HalfFloatType, count: 2 });
    this.outTarget = makeTarget(width, height, { type: THREE.HalfFloatType });

    (this.prep.uniforms.uFullTexel.value as THREE.Vector2).set(1 / width, 1 / height);
    (this.gather.uniforms.uTexel.value as THREE.Vector2).set(1 / hw, 1 / hh);
    this.prep.set('uHeightPixels', height);
    this.composite.set('uHeightPixels', height);
  }

  render(
    renderer: THREE.WebGLRenderer,
    runner: PassRunner,
    color: THREE.Texture,
    depth: THREE.Texture,
    meter: THREE.Texture
  ): THREE.Texture {
    if (!this.prepTarget || !this.gatherTarget || !this.outTarget) return color;

    this.prep.set('tColor', color);
    this.prep.set('tDepth', depth);
    this.prep.set('tMeter', meter);
    runner.render(renderer, this.prep, this.prepTarget);

    this.gather.set('tPrep', this.prepTarget.texture);
    runner.render(renderer, this.gather, this.gatherTarget);

    this.composite.set('tColor', color);
    this.composite.set('tFar', this.gatherTarget.textures[0]);
    this.composite.set('tNear', this.gatherTarget.textures[1]);
    this.composite.set('tDepth', depth);
    this.composite.set('tMeter', meter);
    runner.render(renderer, this.composite, this.outTarget);

    return this.outTarget.texture;
  }

  /** Frees the targets but keeps the materials, for a tier that turns DOF off. */
  release(): void {
    disposeTarget(this.prepTarget);
    disposeTarget(this.gatherTarget);
    disposeTarget(this.outTarget);
    this.prepTarget = null;
    this.gatherTarget = null;
    this.outTarget = null;
  }

  dispose(): void {
    this.release();
    this.prep.dispose();
    this.gather.dispose();
    this.composite.dispose();
  }
}

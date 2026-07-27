import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass } from './common';
import { COC_GLSL, cocUniforms } from './dof';
import type { DofOptions } from './dof';
import { buildGradeLut, lutScaleOffset, VAULT_LOOK } from './lut';

/**
 * Final composite: lens, tone map, print.
 *
 * Order matters and it is the order a real camera imposes.
 *
 *  1. Lens distortion and lateral chromatic aberration, because those happen in
 *     the glass, before anything reaches the sensor. Both are applied by
 *     offsetting the sample coordinate, so they cost nothing but fetches.
 *  2. Bloom added in scene linear. Bloom is scattered light inside the lens
 *     barrel, so it is additive energy on the sensor, not a screen blend.
 *  3. Optical vignette, still scene linear, so the falloff rolls through the
 *     tone curve and darkens the way an underexposed corner actually does
 *     rather than looking like a black overlay.
 *  4. Exposure, then the tone map.
 *  5. Transfer function encode. This is the only gamma applied anywhere in the
 *     chain.
 *  6. The 3D grade LUT, which is authored in display space like a real show
 *     LUT, then film grain and an ordered dither.
 *
 * Tone mapper: AgX.
 *
 * The alternative was the ACES RRT/ODT fit that ships with three. It was
 * rejected for this scene specifically. This vault is lit by saturated coloured
 * sources over near black, and it flashes hard on a legendary reveal. The ACES
 * fit shifts hue as it clips: a bright blue rim goes purple, a saturated red
 * goes orange, and the reveal flash blows out into a coloured plateau. AgX
 * encodes to log, rotates the primaries inward with the inset matrix, applies a
 * sigmoid per channel and rotates back out. The inward rotation means the
 * per-channel curve desaturates toward white as it approaches the shoulder,
 * so intense colour rolls off to white the way a film highlight does, with no
 * hue skew. It also has a much longer toe, which is what stops a dark scene
 * from crushing to a flat black mass. The cost is that AgX is desaturating by
 * construction, which is why the look block below adds saturation back in the
 * AgX base space and the grade LUT adds a little more on top.
 */

const GRADE_FRAG = /* glsl */ `
${GLSL_COMMON}
${COC_GLSL}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tColor;
uniform sampler2D tBloom;
uniform sampler2D tMeter;
uniform sampler3D tLut;
#ifdef DOF_ENABLED
uniform sampler2D tDofFar;
uniform sampler2D tDofNear;
uniform sampler2D tDepth;
#endif

uniform float uExposureScale;    // surge modulation on top of the metered value
uniform float uBloomStrength;
uniform float uCA;
uniform float uDistortion;
uniform float uVignette;
uniform float uGrain;
uniform float uGrainScale;
uniform float uGrainSeed;
uniform float uAspect;
uniform float uLutMix;
uniform vec2 uLutScaleOffset;
uniform vec3 uLookSlope;
uniform vec3 uLookOffset;
uniform vec3 uLookPower;
uniform float uLookSaturation;
uniform float uSurge;
uniform float uDither;

const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
  vec3( 0.6274, 0.0691, 0.0164 ),
  vec3( 0.3293, 0.9195, 0.0880 ),
  vec3( 0.0433, 0.0113, 0.8956 )
);

const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
  vec3( 1.6605, -0.1246, -0.0182 ),
  vec3( -0.5876, 1.1329, -0.1006 ),
  vec3( -0.0728, -0.0083, 1.1187 )
);

const mat3 AGX_INSET = mat3(
  vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
  vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
  vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
);

const mat3 AGX_OUTSET = mat3(
  vec3( 1.1271005818144368, -0.1413297634984383, -0.14132976349843826 ),
  vec3( -0.11060664309660323, 1.157823702216272, -0.11060664309660294 ),
  vec3( -0.016493938717834573, -0.016493938717834257, 1.2519364065950405 )
);

const float AGX_MIN_EV = -12.47393;
const float AGX_MAX_EV = 4.026069;

// Six order polynomial fit of the AgX sigmoid, mean squared error 3.7e-6.
vec3 agxContrast( vec3 x ) {
  vec3 x2 = x * x;
  vec3 x4 = x2 * x2;
  return 15.5 * x4 * x2
    - 40.14 * x4 * x
    + 31.96 * x4
    - 6.868 * x2 * x
    + 0.4298 * x2
    + 0.1191 * x
    - 0.00232;
}

// ASC CDL in the AgX base space, which is where Blender puts the look. Applied
// after the sigmoid and before the outset rotation so the saturation added back
// is measured against the already compressed image.
vec3 agxLook( vec3 v ) {
  float l = luma( v );
  v = pow( max( v * uLookSlope + uLookOffset, vec3( 0.0 ) ), uLookPower );
  return l + uLookSaturation * ( v - l );
}

vec3 agx( vec3 color ) {
  color = LINEAR_SRGB_TO_LINEAR_REC2020 * max( color, vec3( 0.0 ) );
  color = AGX_INSET * color;
  color = max( color, vec3( 1e-10 ) );
  color = log2( color );
  color = ( color - AGX_MIN_EV ) / ( AGX_MAX_EV - AGX_MIN_EV );
  color = clamp( color, 0.0, 1.0 );
  color = agxContrast( color );
  color = agxLook( color );
  color = AGX_OUTSET * color;
  color = pow( max( color, vec3( 0.0 ) ), vec3( 2.2 ) );
  color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
  return clamp( color, 0.0, 1.0 );
}

vec3 linearToSrgb( vec3 c ) {
  c = clamp( c, 0.0, 1.0 );
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow( c, vec3( 1.0 / 2.4 ) ) - 0.055;
  return mix( hi, lo, step( c, vec3( 0.0031308 ) ) );
}

void main() {
  vec2 d = vUv - 0.5;
  float r2 = dot( d, d );

  // Barrel distortion, kept very low. Above about two percent it reads as a
  // fisheye gag rather than as glass.
  vec2 dd = d * ( 1.0 + uDistortion * r2 + uDistortion * uDistortion * 6.0 * r2 * r2 );

  // Lateral chromatic aberration grows with field radius, which is the whole
  // point: a real lens is corrected on axis and fails at the edge.
  float ca = uCA * ( 0.15 + r2 * 4.0 );

  vec2 uvR = 0.5 + dd * ( 1.0 + ca );
  vec2 uvG = 0.5 + dd;
  vec2 uvB = 0.5 + dd * ( 1.0 - ca );

  vec3 color = vec3(
    texture( tColor, uvR ).r,
    texture( tColor, uvG ).g,
    texture( tColor, uvB ).b
  );

  #ifdef DOF_ENABLED
  // Full resolution defocus composite. The gather already produced a half
  // resolution version for the bloom chain to feed on; this is the sharp
  // resolution one, done here so the chain never pays for an extra full screen
  // target just to hand the result to the next pass.
  //
  // The two blurred fields are sampled on axis rather than per channel. Lateral
  // aberration on a layer whose finest detail is already tens of pixels across
  // is not resolvable, and skipping it saves four fullscreen fetches.
  {
    float focus = texture( tMeter, vec2( 0.5 ) ).g;
    float z = linearDepth( texture( tDepth, uvG ).x, uNear, uFar );
    float coc = cocRadius( z, focus );

    vec3 far = texture( tDofFar, uvG ).rgb;
    vec4 near = texture( tDofNear, uvG );

    // Ramp the far field in over the first fifth of the maximum radius so the
    // exit from critical focus is a gradient, not a visible contour.
    float ft = sat1( coc / max( uMaxRadius * 0.22, 1e-3 ) );
    float farBlend = ft * ft * ( 3.0 - 2.0 * ft );

    color = mix( color, far, farBlend );
    color = mix( color, near.rgb, sat1( near.a ) );
  }
  #endif

  // The bloom chain is a wide, low frequency field. Fringing a signal whose
  // finest detail is already tens of pixels across is invisible, so it is
  // sampled once and two fullscreen fetches are saved.
  vec3 bloom = texture( tBloom, uvG ).rgb;

  // Exposure is resolved once, by the meter, and shared. The bloom chain has
  // already been scaled by the same value, so it is added after exposure, not
  // before, and the threshold it was built against still means what it says.
  // Floored and ceilinged. If the metering target ever failed to resolve, an
  // unguarded multiply by its blue channel would hand back a completely black
  // frame with no other symptom, which is a miserable thing to debug.
  float exposure = clamp( texture( tMeter, vec2( 0.5 ) ).b, 0.05, 64.0 ) * uExposureScale;
  color = max( color, vec3( 0.0 ) ) * exposure + max( bloom, vec3( 0.0 ) ) * uBloomStrength;

  // Optical falloff. One over one plus k r squared, squared, is a cheap stand
  // in for the cos to the fourth law and has the same shape.
  float vr = length( d * vec2( uAspect, 1.0 ) );
  float f = 1.0 / ( 1.0 + uVignette * vr * vr );
  color *= f * f;

  color = agx( color );

  vec3 disp = linearToSrgb( color );

  // Show LUT, sampled at texel centres of the 33 cube.
  vec3 lutUv = disp * uLutScaleOffset.x + uLutScaleOffset.y;
  vec3 graded = texture( tLut, lutUv ).rgb;
  disp = mix( disp, graded, uLutMix );

  // Film grain: fixed cell count in a frame normalised space, so the grain is
  // the same physical size at every resolution and device pixel ratio. Two
  // hashes summed give a triangular distribution, which is what real grain
  // clumping looks like and what a single uniform hash never does.
  vec2 gcell = floor( vUv * vec2( uAspect, 1.0 ) * uGrainScale );
  float n1 = hash13( vec3( gcell, uGrainSeed ) );
  float n2 = hash13( vec3( gcell + 37.7, uGrainSeed + 11.3 ) );
  float g = n1 + n2 - 1.0;
  float l = luma( disp );
  // Silver halide density peaks in the midtones. Clean blacks, clean specular.
  float grainAmt = uGrain * ( 0.25 + 1.5 * ( 1.0 - abs( l * 2.0 - 1.0 ) ) );
  disp += g * grainAmt * ( 1.0 + uSurge * 0.8 );

  // Triangular dither at one code value. A near black scene banding across an
  // eight bit framebuffer is the most obvious tell of an amateur chain.
  float d1 = hash13( vec3( gl_FragCoord.xy, uGrainSeed * 0.61 ) );
  float d2 = hash13( vec3( gl_FragCoord.yx + 13.1, uGrainSeed * 0.61 + 7.7 ) );
  disp += ( d1 + d2 - 1.0 ) * uDither;

  fragColor = vec4( clamp( disp, 0.0, 1.0 ), 1.0 );
}
`;

export interface GradeOptions {
  exposure: number;
  exposureComp: number;
  autoExposure: number;
  minExposure: number;
  maxExposure: number;
  bloomStrength: number;
  chromaticAberration: number;
  distortion: number;
  vignette: number;
  grain: number;
  grainScale: number;
  lutMix: number;
  lookSlope: [number, number, number];
  lookOffset: [number, number, number];
  lookPower: [number, number, number];
  lookSaturation: number;
}

export const DEFAULT_GRADE: GradeOptions = {
  exposure: 1.0,
  exposureComp: 0.35,
  autoExposure: 0.62,
  minExposure: 0.5,
  maxExposure: 9.0,
  bloomStrength: 0.055,
  chromaticAberration: 0.0016,
  distortion: 0.012,
  vignette: 0.62,
  grain: 0.022,
  grainScale: 760,
  lutMix: 1.0,
  // Punchy AgX look: a touch of slope, a lifted power for contrast and the
  // saturation AgX gives away in the inset rotation put back.
  lookSlope: [1.02, 1.0, 1.01],
  lookOffset: [0, 0, 0],
  lookPower: [1.16, 1.16, 1.16],
  lookSaturation: 1.24,
};

export class GradePass {
  readonly pass: ScreenPass;
  private lut: THREE.Data3DTexture;
  private options: GradeOptions;
  private dofOn = false;

  constructor(options: GradeOptions = DEFAULT_GRADE, dofDefaults: DofOptions) {
    this.options = { ...options };
    const lutSize = 33;
    this.lut = buildGradeLut(VAULT_LOOK, lutSize);
    const so = lutScaleOffset(lutSize);

    this.pass = new ScreenPass(GRADE_FRAG, {
      tColor: { value: null },
      tBloom: { value: null },
      tMeter: { value: null },
      tLut: { value: this.lut },
      tDofFar: { value: null },
      tDofNear: { value: null },
      tDepth: { value: null },
      ...cocUniforms(dofDefaults),
      uExposureScale: { value: 1 },
      uBloomStrength: { value: options.bloomStrength },
      uCA: { value: options.chromaticAberration },
      uDistortion: { value: options.distortion },
      uVignette: { value: options.vignette },
      uGrain: { value: options.grain },
      uGrainScale: { value: options.grainScale },
      uGrainSeed: { value: 0 },
      uAspect: { value: 1.6 },
      uLutMix: { value: options.lutMix },
      uLutScaleOffset: { value: new THREE.Vector2(so.scale, so.offset) },
      uLookSlope: { value: new THREE.Vector3(...options.lookSlope) },
      uLookOffset: { value: new THREE.Vector3(...options.lookOffset) },
      uLookPower: { value: new THREE.Vector3(...options.lookPower) },
      uLookSaturation: { value: options.lookSaturation },
      uSurge: { value: 0 },
      uDither: { value: 1 / 255 },
    });
  }

  configure(options: Partial<GradeOptions>): void {
    this.options = { ...this.options, ...options };
    const o = this.options;
    this.pass.set('uBloomStrength', o.bloomStrength);
    this.pass.set('uCA', o.chromaticAberration);
    this.pass.set('uDistortion', o.distortion);
    this.pass.set('uVignette', o.vignette);
    this.pass.set('uGrain', o.grain);
    this.pass.set('uGrainScale', o.grainScale);
    this.pass.set('uLutMix', o.lutMix);
    (this.pass.uniforms.uLookSlope.value as THREE.Vector3).set(...o.lookSlope);
    (this.pass.uniforms.uLookOffset.value as THREE.Vector3).set(...o.lookOffset);
    (this.pass.uniforms.uLookPower.value as THREE.Vector3).set(...o.lookPower);
    this.pass.set('uLookSaturation', o.lookSaturation);
  }

  get base(): GradeOptions {
    return this.options;
  }

  setAspect(aspect: number): void {
    this.pass.set('uAspect', aspect);
  }

  /**
   * Mirrors the DOF pass state so the inline composite uses exactly the same
   * circle of confusion the gather was built with. Toggling recompiles, which
   * only ever happens on a quality tier change.
   */
  setDof(enabled: boolean): void {
    if (enabled === this.dofOn) return;
    this.dofOn = enabled;
    if (enabled) {
      this.pass.define('DOF_ENABLED', 1);
    } else {
      delete this.pass.material.defines.DOF_ENABLED;
      this.pass.material.needsUpdate = true;
    }
  }

  /** Keeps the grade's copy of the lens parameters in step with the DOF pass. */
  syncLens(o: {
    focal: number;
    fStop: number;
    sensorHeight: number;
    bokehScale: number;
    maxRadius: number;
    focusRange: number;
    heightPixels: number;
    near: number;
    far: number;
  }): void {
    this.pass.set('uFocalLength', o.focal);
    this.pass.set('uFStop', o.fStop);
    this.pass.set('uSensorHeight', o.sensorHeight / 1000);
    this.pass.set('uBokehScale', o.bokehScale);
    this.pass.set('uMaxRadius', o.maxRadius);
    this.pass.set('uFocusRange', o.focusRange);
    this.pass.set('uHeightPixels', o.heightPixels);
    this.pass.set('uNear', o.near);
    this.pass.set('uFar', o.far);
  }

  dispose(): void {
    this.pass.dispose();
    this.lut.dispose();
  }
}

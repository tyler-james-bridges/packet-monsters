import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass, disposeTarget, makeTarget } from './common';
import type { PassRunner } from './common';

/**
 * Progressive mip chain bloom, the Call of Duty / Jimenez construction.
 *
 * Downsample with a thirteen tap filter whose five overlapping two by two
 * groups are Karis averaged on the first step, which is what actually kills
 * fireflies: a single 5000 nit specular texel is weighted by its own inverse
 * brightness before it can smear across a whole mip. Upsample with a nine tap
 * tent and add into the next larger mip, so the final kernel is a wide, smooth,
 * energy preserving falloff rather than a stack of visible gaussians.
 *
 * The threshold is a quadratic soft knee. A hard cutoff makes bloom pop on and
 * off as a highlight crosses the line, which reads as a bug.
 */

const PREFILTER_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform sampler2D tMeter;
uniform vec2 uTexel;
uniform vec4 uCurve;   // x: threshold, y: threshold - knee, z: 2 * knee, w: 0.25 / knee
uniform float uClamp;
uniform float uExposureScale;

vec3 fetch( vec2 uv ) {
  // Exposure first. The threshold below is stated in exposed scene linear, so
  // it means the same thing whether the metered gain is one stop or five.
  float exposure = texture( tMeter, vec2( 0.5 ) ).b * uExposureScale;
  vec3 c = texture( tSource, uv ).rgb * exposure;
  // Hard clamp after exposure. Values above this are not light, they are a
  // sampling accident, and they would alias for the whole chain.
  return min( max( c, vec3( 0.0 ) ), vec3( uClamp ) );
}

vec3 knee( vec3 c ) {
  float br = maxc( c );
  float rq = clamp( br - uCurve.y, 0.0, uCurve.z );
  rq = uCurve.w * rq * rq;
  float contribution = max( rq, br - uCurve.x ) / max( br, 1e-5 );
  return c * contribution;
}

void main() {
  vec2 t = uTexel;

  vec3 a = fetch( vUv + t * vec2( -2.0,  2.0 ) );
  vec3 b = fetch( vUv + t * vec2(  0.0,  2.0 ) );
  vec3 c = fetch( vUv + t * vec2(  2.0,  2.0 ) );
  vec3 d = fetch( vUv + t * vec2( -2.0,  0.0 ) );
  vec3 e = fetch( vUv );
  vec3 f = fetch( vUv + t * vec2(  2.0,  0.0 ) );
  vec3 g = fetch( vUv + t * vec2( -2.0, -2.0 ) );
  vec3 h = fetch( vUv + t * vec2(  0.0, -2.0 ) );
  vec3 i = fetch( vUv + t * vec2(  2.0, -2.0 ) );
  vec3 j = fetch( vUv + t * vec2( -1.0,  1.0 ) );
  vec3 k = fetch( vUv + t * vec2(  1.0,  1.0 ) );
  vec3 l = fetch( vUv + t * vec2( -1.0, -1.0 ) );
  vec3 m = fetch( vUv + t * vec2(  1.0, -1.0 ) );

  vec3 g0 = ( j + k + l + m ) * 0.25;
  vec3 g1 = ( a + b + d + e ) * 0.25;
  vec3 g2 = ( b + c + e + f ) * 0.25;
  vec3 g3 = ( d + e + g + h ) * 0.25;
  vec3 g4 = ( e + f + h + i ) * 0.25;

  // Karis average over the groups: weight each two by two block by its own
  // inverse luminance so one blown texel cannot dominate the block.
  float w0 = karisWeight( g0 ) * 0.5;
  float w1 = karisWeight( g1 ) * 0.125;
  float w2 = karisWeight( g2 ) * 0.125;
  float w3 = karisWeight( g3 ) * 0.125;
  float w4 = karisWeight( g4 ) * 0.125;
  vec3 sum = g0 * w0 + g1 * w1 + g2 * w2 + g3 * w3 + g4 * w4;
  vec3 color = sum / max( w0 + w1 + w2 + w3 + w4, 1e-5 );

  fragColor = vec4( knee( color ), 1.0 );
}
`;

const DOWNSAMPLE_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;
uniform vec2 uTexel;

vec3 fetch( vec2 uv ) { return texture( tSource, uv ).rgb; }

void main() {
  vec2 t = uTexel;

  vec3 a = fetch( vUv + t * vec2( -2.0,  2.0 ) );
  vec3 b = fetch( vUv + t * vec2(  0.0,  2.0 ) );
  vec3 c = fetch( vUv + t * vec2(  2.0,  2.0 ) );
  vec3 d = fetch( vUv + t * vec2( -2.0,  0.0 ) );
  vec3 e = fetch( vUv );
  vec3 f = fetch( vUv + t * vec2(  2.0,  0.0 ) );
  vec3 g = fetch( vUv + t * vec2( -2.0, -2.0 ) );
  vec3 h = fetch( vUv + t * vec2(  0.0, -2.0 ) );
  vec3 i = fetch( vUv + t * vec2(  2.0, -2.0 ) );
  vec3 j = fetch( vUv + t * vec2( -1.0,  1.0 ) );
  vec3 k = fetch( vUv + t * vec2(  1.0,  1.0 ) );
  vec3 l = fetch( vUv + t * vec2( -1.0, -1.0 ) );
  vec3 m = fetch( vUv + t * vec2(  1.0, -1.0 ) );

  vec3 color = e * 0.125;
  color += ( a + c + g + i ) * 0.03125;
  color += ( b + d + f + h ) * 0.0625;
  color += ( j + k + l + m ) * 0.125;

  fragColor = vec4( color, 1.0 );
}
`;

const UPSAMPLE_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tSource;   // smaller mip, already accumulated
uniform sampler2D tTarget;   // same size mip from the downsample chain
uniform vec2 uTexel;         // texel size of tSource
uniform float uRadius;
uniform vec3 uTint;

vec3 tent( vec2 uv ) {
  vec2 r = uTexel * uRadius;
  vec3 s = texture( tSource, uv + vec2( -r.x,  r.y ) ).rgb;
  s += texture( tSource, uv + vec2( 0.0,  r.y ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2(  r.x,  r.y ) ).rgb;
  s += texture( tSource, uv + vec2( -r.x, 0.0 ) ).rgb * 2.0;
  s += texture( tSource, uv ).rgb * 4.0;
  s += texture( tSource, uv + vec2(  r.x, 0.0 ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2( -r.x, -r.y ) ).rgb;
  s += texture( tSource, uv + vec2( 0.0, -r.y ) ).rgb * 2.0;
  s += texture( tSource, uv + vec2(  r.x, -r.y ) ).rgb;
  return s * ( 1.0 / 16.0 );
}

void main() {
  vec3 lower = tent( vUv ) * uTint;
  vec3 here = texture( tTarget, vUv ).rgb;
  fragColor = vec4( here + lower, 1.0 );
}
`;

export interface BloomOptions {
  mips: number;
  /** Scene linear luminance where the knee starts to open. */
  threshold: number;
  /** Width of the soft knee, as a fraction of the threshold. */
  knee: number;
  /** Tent filter radius in texels of the smaller mip. */
  radius: number;
  /** Firefly clamp applied before thresholding. */
  clamp: number;
}

export class BloomChain {
  private prefilter: ScreenPass;
  private downsample: ScreenPass;
  private upsample: ScreenPass;
  private down: THREE.WebGLRenderTarget[] = [];
  private up: THREE.WebGLRenderTarget[] = [];
  private width = 1;
  private height = 1;

  constructor(private options: BloomOptions) {
    this.prefilter = new ScreenPass(PREFILTER_FRAG, {
      tSource: { value: null },
      tMeter: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uCurve: { value: new THREE.Vector4() },
      uClamp: { value: options.clamp },
      uExposureScale: { value: 1 },
    });
    this.downsample = new ScreenPass(DOWNSAMPLE_FRAG, {
      tSource: { value: null },
      uTexel: { value: new THREE.Vector2() },
    });
    this.upsample = new ScreenPass(UPSAMPLE_FRAG, {
      tSource: { value: null },
      tTarget: { value: null },
      uTexel: { value: new THREE.Vector2() },
      uRadius: { value: options.radius },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
    });
    this.updateCurve();
  }

  private updateCurve(): void {
    const t = Math.max(1e-4, this.options.threshold);
    const k = Math.max(1e-4, t * this.options.knee);
    (this.prefilter.uniforms.uCurve.value as THREE.Vector4).set(t, t - k, 2 * k, 0.25 / k);
    this.prefilter.set('uClamp', this.options.clamp);
    this.upsample.set('uRadius', this.options.radius);
  }

  /** Runtime tweakables that do not require reallocation. */
  setThreshold(threshold: number, knee = this.options.knee): void {
    this.options.threshold = threshold;
    this.options.knee = knee;
    this.updateCurve();
  }

  configure(options: BloomOptions): void {
    const mipsChanged = options.mips !== this.options.mips;
    this.options = options;
    this.updateCurve();
    if (mipsChanged) this.setSize(this.width, this.height);
  }

  get texture(): THREE.Texture | null {
    return this.up.length ? this.up[0].texture : null;
  }

  setSize(width: number, height: number): void {
    this.releaseTargets();
    this.width = width;
    this.height = height;

    // Cap the chain so the smallest mip never collapses below four texels,
    // where the tent filter would start sampling the clamped border.
    const maxMips = Math.max(
      1,
      Math.floor(Math.log2(Math.max(4, Math.min(width, height)))) - 1
    );
    const mips = Math.max(1, Math.min(this.options.mips, maxMips));

    let w = Math.max(1, Math.floor(width / 2));
    let h = Math.max(1, Math.floor(height / 2));
    for (let i = 0; i < mips; i++) {
      this.down.push(makeTarget(w, h, { type: THREE.HalfFloatType }));
      this.up.push(makeTarget(w, h, { type: THREE.HalfFloatType }));
      w = Math.max(1, Math.floor(w / 2));
      h = Math.max(1, Math.floor(h / 2));
    }
  }

  /** Exposure state shared with the grade, plus the surge modulation on top. */
  setExposure(meter: THREE.Texture, scale: number): void {
    this.prefilter.set('tMeter', meter);
    this.prefilter.set('uExposureScale', scale);
  }

  /**
   * The source may be the full resolution frame or, when DOF is on, the half
   * resolution defocus composite. The prefilter needs the source's own texel
   * size for its thirteen tap footprint, so it is passed in rather than assumed.
   */
  render(
    renderer: THREE.WebGLRenderer,
    runner: PassRunner,
    source: THREE.Texture,
    sourceWidth: number,
    sourceHeight: number
  ): void {
    if (!this.down.length) return;
    const n = this.down.length;

    this.prefilter.set('tSource', source);
    (this.prefilter.uniforms.uTexel.value as THREE.Vector2).set(
      1 / Math.max(1, sourceWidth),
      1 / Math.max(1, sourceHeight)
    );
    runner.render(renderer, this.prefilter, this.down[0]);

    for (let i = 1; i < n; i++) {
      const src = this.down[i - 1];
      this.downsample.set('tSource', src.texture);
      (this.downsample.uniforms.uTexel.value as THREE.Vector2).set(
        1 / src.width,
        1 / src.height
      );
      runner.render(renderer, this.downsample, this.down[i]);
    }

    if (n === 1) {
      // Degenerate chain: the single mip is the result. Copy through the
      // upsample shader with a zero radius so the output texture is stable.
      this.upsample.set('tSource', this.down[0].texture);
      this.upsample.set('tTarget', this.down[0].texture);
      (this.upsample.uniforms.uTexel.value as THREE.Vector2).set(0, 0);
      (this.upsample.uniforms.uTint.value as THREE.Vector3).set(0, 0, 0);
      runner.render(renderer, this.upsample, this.up[0]);
      (this.upsample.uniforms.uTint.value as THREE.Vector3).set(1, 1, 1);
      return;
    }

    // Seed the accumulator with the smallest mip, then walk back up adding the
    // matching downsample at each level.
    this.upsample.set('tSource', this.down[n - 1].texture);
    this.upsample.set('tTarget', this.down[n - 1].texture);
    (this.upsample.uniforms.uTexel.value as THREE.Vector2).set(0, 0);
    (this.upsample.uniforms.uTint.value as THREE.Vector3).set(0, 0, 0);
    runner.render(renderer, this.upsample, this.up[n - 1]);

    for (let i = n - 2; i >= 0; i--) {
      const src = this.up[i + 1];
      this.upsample.set('tSource', src.texture);
      this.upsample.set('tTarget', this.down[i].texture);
      (this.upsample.uniforms.uTexel.value as THREE.Vector2).set(1 / src.width, 1 / src.height);
      // A faint spectral drift across the chain: the wide, low frequency halo
      // runs a touch cooler than the tight core, which is what a real coated
      // lens does and what stops the glare reading as flat white paint.
      const t = i / Math.max(1, n - 1);
      (this.upsample.uniforms.uTint.value as THREE.Vector3).set(
        1.0 + 0.05 * (1.0 - t),
        1.0,
        1.0 + 0.09 * t
      );
      runner.render(renderer, this.upsample, this.up[i]);
    }
    (this.upsample.uniforms.uTint.value as THREE.Vector3).set(1, 1, 1);
  }

  private releaseTargets(): void {
    for (const t of this.down) disposeTarget(t);
    for (const t of this.up) disposeTarget(t);
    this.down = [];
    this.up = [];
  }

  dispose(): void {
    this.releaseTargets();
    this.prefilter.dispose();
    this.downsample.dispose();
    this.upsample.dispose();
  }
}

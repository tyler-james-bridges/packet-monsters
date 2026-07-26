import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass, disposeTarget, haltonSequence, makeTarget } from './common';
import type { PassRunner } from './common';

/**
 * Temporal antialiasing.
 *
 * Subpixel jitter comes from a Halton(2,3) sequence of quality.taaSamples
 * points applied to the projection matrix. Reprojection is depth based: the
 * current depth buffer is unprojected with the unjittered inverse view
 * projection and reprojected through the previous frame's view projection, so
 * camera motion is exact and object motion is left to the neighbourhood clamp.
 * That trade is deliberate. A velocity buffer would need an MRT override on
 * every material in the scene, and materials belong to another agent.
 *
 * History is resampled with a five tap Catmull-Rom filter rather than plain
 * bilinear, which is the single biggest lever on TAA softness, and clipped
 * against a variance box built in YCoCg. YCoCg because chroma ghosting is far
 * more visible than luma ghosting and an axis aligned box in YCoCg bounds the
 * perceptually important axis much more tightly than one in RGB.
 */

const TAA_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tCurrent;
uniform sampler2D tHistory;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform vec2 uResolution;
uniform mat4 uInvViewProj;
uniform mat4 uPrevViewProj;
uniform float uFeedback;
uniform float uReset;
uniform float uClampScale;
uniform float uSharpen;

vec3 rgbToYCoCg( vec3 c ) {
  return vec3(
    0.25 * c.r + 0.5 * c.g + 0.25 * c.b,
    0.5 * c.r - 0.5 * c.b,
    -0.25 * c.r + 0.5 * c.g - 0.25 * c.b
  );
}

vec3 yCoCgToRgb( vec3 c ) {
  float t = c.x - c.z;
  return vec3( t + c.y, c.x + c.z, t - c.y );
}

// Tone weighting during the blend keeps a single very bright sample from
// dominating the average and flickering. Undone after the mix.
vec3 toneIn( vec3 c ) { return c / ( 1.0 + maxc( max( c, vec3( 0.0 ) ) ) ); }
// Exact inverse of toneIn. The 0.99 ceiling caps the expansion at a hundred to
// one: without it a resolved value that lands a hair under one divides by
// nearly zero and the filter manufactures a firefly out of rounding error.
vec3 toneOut( vec3 c ) { return c / max( 0.01, 1.0 - maxc( min( c, vec3( 0.99 ) ) ) ); }

// Five tap Catmull-Rom: nine texel support from five bilinear fetches.
vec3 sampleHistory( vec2 uv ) {
  vec2 pos = uv * uResolution;
  vec2 tc1 = floor( pos - 0.5 ) + 0.5;
  vec2 f = pos - tc1;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;

  vec2 w0 = -0.5 * f3 + f2 - 0.5 * f;
  vec2 w1 = 1.5 * f3 - 2.5 * f2 + 1.0;
  vec2 w2 = -1.5 * f3 + 2.0 * f2 + 0.5 * f;
  vec2 w3 = 0.5 * f3 - 0.5 * f2;

  vec2 w12 = w1 + w2;
  vec2 off12 = w2 / max( w12, vec2( 1e-5 ) );

  vec2 p0 = ( tc1 - 1.0 ) * uTexel;
  vec2 p3 = ( tc1 + 2.0 ) * uTexel;
  vec2 p12 = ( tc1 + off12 ) * uTexel;

  vec3 acc = vec3( 0.0 );
  float wsum = 0.0;

  float w;
  w = w12.x * w0.y;  acc += texture( tHistory, vec2( p12.x, p0.y ) ).rgb * w;  wsum += w;
  w = w0.x * w12.y;  acc += texture( tHistory, vec2( p0.x, p12.y ) ).rgb * w;  wsum += w;
  w = w12.x * w12.y; acc += texture( tHistory, vec2( p12.x, p12.y ) ).rgb * w; wsum += w;
  w = w3.x * w12.y;  acc += texture( tHistory, vec2( p3.x, p12.y ) ).rgb * w;  wsum += w;
  w = w12.x * w3.y;  acc += texture( tHistory, vec2( p12.x, p3.y ) ).rgb * w;  wsum += w;

  return max( acc / max( wsum, 1e-5 ), vec3( 0.0 ) );
}

// Clip toward the box centre rather than clamping per axis: clamping snaps the
// history onto a face of the box and shows up as a hard edge crawl.
vec3 clipToBox( vec3 boxMin, vec3 boxMax, vec3 history, vec3 center ) {
  vec3 c = 0.5 * ( boxMax + boxMin );
  vec3 e = 0.5 * ( boxMax - boxMin ) + 1e-5;
  vec3 d = history - c;
  vec3 unit = d / e;
  float m = maxc( abs( unit ) );
  return m > 1.0 ? c + d / m : history;
}

void main() {
  vec3 current = texture( tCurrent, vUv ).rgb;

  // Closest fragment in a small cross: reprojecting the nearest depth keeps
  // silhouettes from smearing against the background behind them.
  float depth = texture( tDepth, vUv ).x;
  vec2 bestUv = vUv;
  #ifdef DILATE_DEPTH
  {
    vec2 offs[ 4 ];
    offs[ 0 ] = vec2( -1.0, -1.0 );
    offs[ 1 ] = vec2( 1.0, -1.0 );
    offs[ 2 ] = vec2( -1.0, 1.0 );
    offs[ 3 ] = vec2( 1.0, 1.0 );
    for ( int i = 0; i < 4; i++ ) {
      vec2 uv = vUv + offs[ i ] * uTexel;
      float d = texture( tDepth, uv ).x;
      if ( d < depth ) { depth = d; bestUv = uv; }
    }
  }
  #endif

  vec4 ndc = vec4( bestUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0 );
  vec4 world = uInvViewProj * ndc;
  world /= world.w;
  vec4 prevClip = uPrevViewProj * world;
  bool behind = prevClip.w <= 1e-6;
  vec2 prevUv = ( prevClip.xy / max( prevClip.w, 1e-6 ) ) * 0.5 + 0.5;
  vec2 velocity = vUv - prevUv;
  vec2 historyUv = vUv - velocity;

  // Three by three neighbourhood in YCoCg, first and second moments.
  vec3 m1 = vec3( 0.0 );
  vec3 m2 = vec3( 0.0 );
  vec3 nmin = vec3( 1e9 );
  vec3 nmax = vec3( -1e9 );
  vec3 centerY = vec3( 0.0 );
  vec3 crossSum = vec3( 0.0 );

  for ( int y = -1; y <= 1; y++ ) {
    for ( int x = -1; x <= 1; x++ ) {
      vec3 c = texture( tCurrent, vUv + vec2( float( x ), float( y ) ) * uTexel ).rgb;
      vec3 y3 = rgbToYCoCg( toneIn( c ) );
      m1 += y3;
      m2 += y3 * y3;
      nmin = min( nmin, y3 );
      nmax = max( nmax, y3 );
      if ( x == 0 && y == 0 ) centerY = y3;
      if ( x == 0 || y == 0 ) crossSum += y3;
    }
  }

  vec3 mean = m1 / 9.0;
  vec3 sigma = sqrt( max( vec3( 0.0 ), m2 / 9.0 - mean * mean ) );
  vec3 boxMin = max( mean - uClampScale * sigma, nmin );
  vec3 boxMax = min( mean + uClampScale * sigma, nmax );

  vec3 historyRgb = sampleHistory( historyUv );
  vec3 historyY = rgbToYCoCg( toneIn( historyRgb ) );
  vec3 clipped = clipToBox( boxMin, boxMax, historyY, centerY );

  // Feedback drops off with screen space motion so fast pans resolve quickly
  // instead of dragging a tail, and collapses entirely off screen.
  float speed = length( velocity * uResolution );
  float blend = uFeedback * exp( -speed * 0.09 );
  bool offscreen = any( lessThan( historyUv, vec2( 0.0 ) ) ) || any( greaterThan( historyUv, vec2( 1.0 ) ) );
  if ( offscreen || behind || uReset > 0.5 ) blend = 0.0;

  // Luminance weighted average, the Karis trick, applied inside the tone
  // weighted domain where both samples are already range compressed.
  float wc = ( 1.0 - blend ) / ( 1.0 + centerY.x );
  float wh = blend / ( 1.0 + clipped.x );
  vec3 resolvedY = ( centerY * wc + clipped * wh ) / max( wc + wh, 1e-5 );

  vec3 resolved = toneOut( yCoCgToRgb( resolvedY ) );

  // Light sharpen recovers the sub texel energy the temporal filter removes.
  if ( uSharpen > 0.0 ) {
    vec3 blurY = crossSum / 5.0;
    vec3 blurRgb = toneOut( yCoCgToRgb( blurY ) );
    resolved += ( resolved - blurRgb ) * uSharpen;
  }

  fragColor = vec4( max( resolved, vec3( 0.0 ) ), 1.0 );
}
`;

export interface TaaOptions {
  samples: number;
  feedback: number;
  clampScale: number;
  sharpen: number;
  dilateDepth: boolean;
}

export class TaaPass {
  private pass: ScreenPass;
  private history: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget] | null = null;
  private write = 0;
  private jitter: Array<[number, number]>;
  private frame = 0;
  private reset = true;
  private width = 1;
  private height = 1;

  private readonly prevViewProj = new THREE.Matrix4();
  private readonly curViewProj = new THREE.Matrix4();
  private readonly prevCamPos = new THREE.Vector3();
  private readonly prevCamDir = new THREE.Vector3();
  private readonly tmpDir = new THREE.Vector3();

  constructor(private options: TaaOptions) {
    this.jitter = haltonSequence(Math.max(1, options.samples));
    this.pass = new ScreenPass(
      TAA_FRAG,
      {
        tCurrent: { value: null },
        tHistory: { value: null },
        tDepth: { value: null },
        uTexel: { value: new THREE.Vector2() },
        uResolution: { value: new THREE.Vector2() },
        uInvViewProj: { value: new THREE.Matrix4() },
        uPrevViewProj: { value: new THREE.Matrix4() },
        uFeedback: { value: options.feedback },
        uReset: { value: 1 },
        uClampScale: { value: options.clampScale },
        uSharpen: { value: options.sharpen },
      },
      options.dilateDepth ? { DILATE_DEPTH: 1 } : {}
    );
  }

  get enabled(): boolean {
    return this.options.samples > 1;
  }

  configure(options: TaaOptions): void {
    const rebuildDefines = options.dilateDepth !== this.options.dilateDepth;
    this.options = options;
    this.jitter = haltonSequence(Math.max(1, options.samples));
    this.pass.set('uFeedback', options.feedback);
    this.pass.set('uClampScale', options.clampScale);
    this.pass.set('uSharpen', options.sharpen);
    if (rebuildDefines) {
      if (options.dilateDepth) this.pass.define('DILATE_DEPTH', 1);
      else {
        delete this.pass.material.defines.DILATE_DEPTH;
        this.pass.material.needsUpdate = true;
      }
    }
    this.resetHistory();
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    if (this.history) {
      disposeTarget(this.history[0]);
      disposeTarget(this.history[1]);
    }
    this.history = [
      makeTarget(width, height, { type: THREE.HalfFloatType }),
      makeTarget(width, height, { type: THREE.HalfFloatType }),
    ];
    this.pass.set('uTexel', new THREE.Vector2(1 / width, 1 / height));
    this.pass.set('uResolution', new THREE.Vector2(width, height));
    this.resetHistory();
  }

  resetHistory(): void {
    this.reset = true;
  }

  /**
   * Applies this frame's subpixel offset to the projection matrix. Returns a
   * restore function so the unjittered matrix is back in place before any other
   * system reads it.
   */
  applyJitter(camera: THREE.PerspectiveCamera): () => void {
    // three only refreshes matrixWorldInverse inside render(), so at this point
    // it still holds the previous frame's view transform. Reprojecting against
    // a one frame stale "current" matrix would make every pixel carry a phantom
    // velocity equal to the camera's last step, which reads as a permanent
    // smear. Refresh it here, exactly as the renderer is about to.
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    // Snapshot the unjittered clip transform first: reprojection must never see
    // the jitter or every pixel would carry a bogus subpixel velocity.
    this.curViewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    if (!this.enabled) return () => {};

    const [jx, jy] = this.jitter[this.frame % this.jitter.length];
    const e = camera.projectionMatrix.elements;
    const ox = e[8];
    const oy = e[9];
    e[8] = ox + (jx * 2) / this.width;
    e[9] = oy + (jy * 2) / this.height;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    return () => {
      e[8] = ox;
      e[9] = oy;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    };
  }

  /** Detects a hard camera cut so the history is dropped instead of smeared. */
  checkCameraCut(camera: THREE.PerspectiveCamera, dt: number): void {
    this.tmpDir.set(0, 0, -1).applyQuaternion(camera.quaternion);
    if (this.frame > 0) {
      const moved = camera.position.distanceTo(this.prevCamPos);
      const turned = this.tmpDir.dot(this.prevCamDir);
      // Roughly a metre in one frame at 60 fps, or a fifteen degree swing.
      if (moved > Math.max(0.5, 30 * dt) || turned < 0.966) this.resetHistory();
    }
    this.prevCamPos.copy(camera.position);
    this.prevCamDir.copy(this.tmpDir);
  }

  render(
    renderer: THREE.WebGLRenderer,
    runner: PassRunner,
    color: THREE.Texture,
    depth: THREE.Texture
  ): THREE.Texture {
    if (!this.history) throw new Error('TaaPass.setSize was never called');
    const read = this.history[1 - this.write];
    const dst = this.history[this.write];

    this.pass.set('tCurrent', color);
    this.pass.set('tHistory', read.texture);
    this.pass.set('tDepth', depth);
    (this.pass.uniforms.uInvViewProj.value as THREE.Matrix4).copy(this.curViewProj).invert();
    (this.pass.uniforms.uPrevViewProj.value as THREE.Matrix4).copy(
      this.frame === 0 || this.reset ? this.curViewProj : this.prevViewProj
    );
    this.pass.set('uReset', this.reset ? 1 : 0);

    runner.render(renderer, this.pass, dst);

    // The resolved frame is both the history for the next pass and the input to
    // the rest of the chain, so it is copied out by reference, not re-rendered.
    this.prevViewProj.copy(this.curViewProj);
    this.write = 1 - this.write;
    this.reset = false;
    this.frame++;
    return dst.texture;
  }

  /** Advances the jitter index for a frame where TAA itself did not run. */
  step(): void {
    this.prevViewProj.copy(this.curViewProj);
    this.frame++;
  }

  dispose(): void {
    this.pass.dispose();
    if (this.history) {
      disposeTarget(this.history[0]);
      disposeTarget(this.history[1]);
      this.history = null;
    }
  }
}

import * as THREE from 'three';
import { GLSL_COMMON, ScreenPass } from './common';

/**
 * FXAA 3.11 console quality subset, run on the display encoded image.
 *
 * This is the fallback for quality.taaSamples === 1, where TAA is off. SMAA
 * would be the better edge filter but its search and area lookups are a fixed
 * 160 KB dataset that cannot be generated procedurally from first principles,
 * and this build ships with no external assets, so FXAA it is.
 *
 * It runs after the tone map on purpose: edge detection needs perceptual luma,
 * and an HDR luma gradient is dominated by highlight magnitude rather than by
 * the visible edge.
 */
const FXAA_FRAG = /* glsl */ `
${GLSL_COMMON}

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D tDiffuse;
uniform vec2 uTexel;

#define EDGE_THRESHOLD_MIN 0.0312
#define EDGE_THRESHOLD_MAX 0.125
#define SUBPIXEL_QUALITY 0.75
#define ITERATIONS 12

float lumaOf( vec3 c ) { return sqrt( dot( c, vec3( 0.299, 0.587, 0.114 ) ) ); }

float quality( int i ) {
  if ( i < 5 ) return 1.0;
  if ( i == 5 ) return 1.5;
  if ( i < 10 ) return 2.0;
  if ( i == 10 ) return 4.0;
  return 8.0;
}

void main() {
  vec3 rgbM = texture( tDiffuse, vUv ).rgb;
  float lM = lumaOf( rgbM );
  float lN = lumaOf( texture( tDiffuse, vUv + vec2( 0.0, uTexel.y ) ).rgb );
  float lS = lumaOf( texture( tDiffuse, vUv - vec2( 0.0, uTexel.y ) ).rgb );
  float lE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, 0.0 ) ).rgb );
  float lW = lumaOf( texture( tDiffuse, vUv - vec2( uTexel.x, 0.0 ) ).rgb );

  float lMin = min( lM, min( min( lN, lS ), min( lE, lW ) ) );
  float lMax = max( lM, max( max( lN, lS ), max( lE, lW ) ) );
  float range = lMax - lMin;

  if ( range < max( EDGE_THRESHOLD_MIN, lMax * EDGE_THRESHOLD_MAX ) ) {
    fragColor = vec4( rgbM, 1.0 );
    return;
  }

  float lNW = lumaOf( texture( tDiffuse, vUv + vec2( -uTexel.x, uTexel.y ) ).rgb );
  float lNE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, uTexel.y ) ).rgb );
  float lSW = lumaOf( texture( tDiffuse, vUv + vec2( -uTexel.x, -uTexel.y ) ).rgb );
  float lSE = lumaOf( texture( tDiffuse, vUv + vec2( uTexel.x, -uTexel.y ) ).rgb );

  float lNS = lN + lS;
  float lWE = lW + lE;
  float lNWSW = lNW + lSW;
  float lNESE = lNE + lSE;
  float lNWNE = lNW + lNE;
  float lSWSE = lSW + lSE;

  float edgeH = abs( -2.0 * lW + lNWSW ) + abs( -2.0 * lM + lNS ) * 2.0 + abs( -2.0 * lE + lNESE );
  float edgeV = abs( -2.0 * lN + lNWNE ) + abs( -2.0 * lM + lWE ) * 2.0 + abs( -2.0 * lS + lSWSE );
  bool isHorizontal = edgeH >= edgeV;

  float l1 = isHorizontal ? lS : lW;
  float l2 = isHorizontal ? lN : lE;
  float g1 = abs( l1 - lM );
  float g2 = abs( l2 - lM );
  bool is1Steepest = g1 >= g2;
  float gradientScaled = 0.25 * max( g1, g2 );

  float stepLength = isHorizontal ? uTexel.y : uTexel.x;
  float lLocalAvg = 0.0;
  if ( is1Steepest ) {
    stepLength = -stepLength;
    lLocalAvg = 0.5 * ( l1 + lM );
  } else {
    lLocalAvg = 0.5 * ( l2 + lM );
  }

  vec2 currentUv = vUv;
  if ( isHorizontal ) currentUv.y += stepLength * 0.5;
  else currentUv.x += stepLength * 0.5;

  vec2 offset = isHorizontal ? vec2( uTexel.x, 0.0 ) : vec2( 0.0, uTexel.y );
  vec2 uv1 = currentUv - offset;
  vec2 uv2 = currentUv + offset;

  float lEnd1 = lumaOf( texture( tDiffuse, uv1 ).rgb ) - lLocalAvg;
  float lEnd2 = lumaOf( texture( tDiffuse, uv2 ).rgb ) - lLocalAvg;
  bool reached1 = abs( lEnd1 ) >= gradientScaled;
  bool reached2 = abs( lEnd2 ) >= gradientScaled;

  if ( !reached1 ) uv1 -= offset;
  if ( !reached2 ) uv2 += offset;

  if ( !reached1 || !reached2 ) {
    for ( int i = 2; i < ITERATIONS; i++ ) {
      if ( !reached1 ) lEnd1 = lumaOf( texture( tDiffuse, uv1 ).rgb ) - lLocalAvg;
      if ( !reached2 ) lEnd2 = lumaOf( texture( tDiffuse, uv2 ).rgb ) - lLocalAvg;
      reached1 = reached1 || abs( lEnd1 ) >= gradientScaled;
      reached2 = reached2 || abs( lEnd2 ) >= gradientScaled;
      if ( reached1 && reached2 ) break;
      if ( !reached1 ) uv1 -= offset * quality( i );
      if ( !reached2 ) uv2 += offset * quality( i );
    }
  }

  float dist1 = isHorizontal ? ( vUv.x - uv1.x ) : ( vUv.y - uv1.y );
  float dist2 = isHorizontal ? ( uv2.x - vUv.x ) : ( uv2.y - vUv.y );
  bool isDirection1 = dist1 < dist2;
  float distFinal = min( dist1, dist2 );
  float edgeThickness = dist1 + dist2;
  float pixelOffset = -distFinal / max( edgeThickness, 1e-5 ) + 0.5;

  bool isLumaCenterSmaller = lM < lLocalAvg;
  bool correctVariation =
    ( ( isDirection1 ? lEnd1 : lEnd2 ) < 0.0 ) != isLumaCenterSmaller;
  float finalOffset = correctVariation ? pixelOffset : 0.0;

  // Subpixel aliasing: a lone bright texel has no directional edge, so blend
  // toward the neighbourhood average instead.
  float lAvg = ( 1.0 / 12.0 ) * ( 2.0 * ( lNS + lWE ) + lNWSW + lNESE );
  float subShift = sat1( abs( lAvg - lM ) / max( range, 1e-5 ) );
  float subShift2 = ( -2.0 * subShift + 3.0 ) * subShift * subShift;
  float subPixelOffset = subShift2 * subShift2 * SUBPIXEL_QUALITY;
  finalOffset = max( finalOffset, subPixelOffset );

  vec2 finalUv = vUv;
  if ( isHorizontal ) finalUv.y += finalOffset * stepLength;
  else finalUv.x += finalOffset * stepLength;

  fragColor = vec4( texture( tDiffuse, finalUv ).rgb, 1.0 );
}
`;

export class FxaaPass {
  readonly pass: ScreenPass;

  constructor() {
    this.pass = new ScreenPass(FXAA_FRAG, {
      tDiffuse: { value: null },
      uTexel: { value: new THREE.Vector2(1 / 1600, 1 / 1000) },
    });
  }

  setSize(width: number, height: number): void {
    (this.pass.uniforms.uTexel.value as THREE.Vector2).set(1 / width, 1 / height);
  }

  dispose(): void {
    this.pass.dispose();
  }
}

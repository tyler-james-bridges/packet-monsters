import * as THREE from 'three';

/**
 * The holographic foil.
 *
 * This is a real thin-film interference model, not a rainbow texture. For every
 * shaded fragment it:
 *
 *  1. Builds the film thickness at that point from an embossed grating relief
 *     plus a cellular thickness field, both procedural and seeded per card.
 *  2. Solves the Airy summation for a single dielectric film on a substrate at
 *     the actual incidence angle, per wavelength, for both polarisations.
 *  3. Integrates that spectral reflectance against the CIE 1931 observer and
 *     converts XYZ to linear Rec.709. The colour you see is what the film does
 *     to a flat white spectrum at that angle, which is why it sweeps through
 *     the spectrum in the right order as the card tilts and why it goes
 *     achromatic at normal incidence on a thin film.
 *  4. Uses that spectral response to tint three separate light paths: the
 *     environment reflection through the grating, a chromatically split prism
 *     refraction, and an anisotropic streak lobe evaluated against the real
 *     scene lights.
 *
 * The base laminate additionally drives three's own Belcour-Barla iridescence
 * on the specular lobe, so the foil is correct under both IBL and direct light
 * before any of the above is added.
 *
 * Every card shares one shader program. Everything that varies per card is a
 * uniform.
 */

export interface FoilUniforms {
  /** Shared grating/thickness/scratch/sparkle detail. */
  uFoilTex: { value: THREE.Texture | null };
  /** x: cos(rot), y: sin(rot), z: uv scale, w: phase. Per card. */
  uFoilSeed: { value: THREE.Vector4 };
  /** x: gain, y: emboss, z: prism, w: sparkle. Per rarity. */
  uFoilParams: { value: THREE.Vector4 };
  /** x: base thickness nm, y: thickness range nm, z: film IOR, w: substrate IOR. */
  uFilm: { value: THREE.Vector4 };
  /** x: elapsed, y: reveal 0..1, z: surge 0..1, w: ghost 0..1. */
  uFoilDyn: { value: THREE.Vector4 };
  /** Spectral bias tint, keeps a FROST foil cold without killing the rainbow. */
  uFoilTint: { value: THREE.Color };
  /** x: streak sharpness, y: streak gain, z: env roughness, w: fresnel power. */
  uStreak: { value: THREE.Vector4 };
  /** x: metalness under the foil plate, y: plate weight, z: roughness multiplier. */
  uFoilMetal: { value: THREE.Vector4 };
}

export function makeFoilUniforms(): FoilUniforms {
  return {
    uFoilTex: { value: null },
    uFoilSeed: { value: new THREE.Vector4(1, 0, 1, 0) },
    uFoilParams: { value: new THREE.Vector4(0, 0, 0, 0) },
    uFilm: { value: new THREE.Vector4(420, 260, 1.42, 2.1) },
    uFoilDyn: { value: new THREE.Vector4(0, 0, 0, 0) },
    uFoilTint: { value: new THREE.Color(1, 1, 1) },
    uStreak: { value: new THREE.Vector4(180, 1, 0.16, 4) },
    uFoilMetal: { value: new THREE.Vector4(0.9, 0, 0.75, 0) },
  };
}

const PARS = /* glsl */ `
uniform sampler2D uFoilTex;
uniform vec4 uFoilSeed;
uniform vec4 uFoilParams;
uniform vec4 uFilm;
uniform vec4 uFoilDyn;
uniform vec3 uFoilTint;
uniform vec4 uStreak;
uniform vec4 uFoilMetal;

#ifndef FOIL_SPECTRAL_SAMPLES
  #define FOIL_SPECTRAL_SAMPLES 16
#endif

const mat3 FOIL_XYZ_TO_RGB = mat3(
   3.2404542, -0.9692660,  0.0556434,
  -1.5371385,  1.8760108, -0.2040259,
  -0.4985314,  0.0415560,  1.0572252
);

float foilLobe( const in float x, const in float a, const in float mu, const in float s1, const in float s2 ) {
  float t = ( x - mu ) * ( x < mu ? 1.0 / s1 : 1.0 / s2 );
  return a * exp( -0.5 * t * t );
}

// CIE 1931 colour matching functions, multi-lobe Gaussian fit.
// Wyman, Sloan and Shirley, JCGT 2013. Within about 1% of the tabulated data.
vec3 foilCIE( const in float w ) {
  float x = foilLobe( w,  1.056, 599.8, 37.9, 31.0 )
          + foilLobe( w,  0.362, 442.0, 16.0, 26.7 )
          + foilLobe( w, -0.065, 501.1, 20.4, 26.2 );
  float y = foilLobe( w,  0.821, 568.8, 46.9, 40.5 )
          + foilLobe( w,  0.286, 530.9, 16.3, 31.1 );
  float z = foilLobe( w,  1.217, 437.0, 11.8, 36.0 )
          + foilLobe( w,  0.681, 459.0, 26.0, 13.8 );
  return vec3( x, y, z );
}

// Reflectance of a single film of index n1 and thickness d (nm) on a substrate
// of index n2, in air, at incidence cosine cosT0, for wavelength w (nm).
// Airy summation, unpolarised: R = ( Rs + Rp ) / 2.
float foilFilmR( const in float w, const in float d, const in float cosT0, const in float n1, const in float n2 ) {
  float sin0sq = max( 0.0, 1.0 - cosT0 * cosT0 );
  float cos1sq = 1.0 - sin0sq / ( n1 * n1 );
  float cos2sq = 1.0 - sin0sq / ( n2 * n2 );
  if ( cos1sq <= 0.0 ) return 1.0;            // total internal reflection
  float cos1 = sqrt( cos1sq );
  float cos2 = sqrt( max( cos2sq, 0.0 ) );

  // Fresnel amplitude coefficients at both interfaces.
  float r01s = ( cosT0 - n1 * cos1 ) / ( cosT0 + n1 * cos1 );
  float r12s = ( n1 * cos1 - n2 * cos2 ) / ( n1 * cos1 + n2 * cos2 );
  float r01p = ( n1 * cosT0 - cos1 ) / ( n1 * cosT0 + cos1 );
  float r12p = ( n2 * cos1 - n1 * cos2 ) / ( n2 * cos1 + n1 * cos2 );

  // Round trip phase through the film.
  float delta = 4.0 * PI * n1 * d * cos1 / w;
  float cd = cos( delta );
  float sd = sin( delta );

  float nsr = r01s + r12s * cd;
  float nsi = -r12s * sd;
  float dsr = 1.0 + r01s * r12s * cd;
  float dsi = -r01s * r12s * sd;
  float Rs = ( nsr * nsr + nsi * nsi ) / max( dsr * dsr + dsi * dsi, 1e-6 );

  float npr = r01p + r12p * cd;
  float npi = -r12p * sd;
  float dpr = 1.0 + r01p * r12p * cd;
  float dpi = -r01p * r12p * sd;
  float Rp = ( npr * npr + npi * npi ) / max( dpr * dpr + dpi * dpi, 1e-6 );

  return 0.5 * ( Rs + Rp );
}

// Spectral integral of the film response against the standard observer.
vec3 foilSpectrum( const in float d, const in float cosT0, const in float n1, const in float n2 ) {
  vec3 xyz = vec3( 0.0 );
  float norm = 0.0;
  for ( int i = 0; i < FOIL_SPECTRAL_SAMPLES; i ++ ) {
    float t = ( float( i ) + 0.5 ) / float( FOIL_SPECTRAL_SAMPLES );
    float w = 400.0 + 300.0 * t;
    vec3 cmf = foilCIE( w );
    xyz += cmf * foilFilmR( w, d, cosT0, n1, n2 );
    norm += cmf.y;
  }
  xyz /= max( norm, 1e-4 );
  return max( FOIL_XYZ_TO_RGB * xyz, vec3( 0.0 ) );
}

vec2 foilRotate( const in vec2 p ) {
  return vec2( p.x * uFoilSeed.x - p.y * uFoilSeed.y, p.x * uFoilSeed.y + p.y * uFoilSeed.x );
}

// Analytic studio environment. Used only until a real probe is bound, so the
// foil still reads as light physics on a bare scene instead of going flat.
vec3 foilFallbackEnv( const in vec3 dirView ) {
  vec3 d = normalize( inverseTransformDirection( dirView, viewMatrix ) );
  float up = d.y * 0.5 + 0.5;
  vec3 e = mix( vec3( 0.012, 0.016, 0.028 ), vec3( 0.16, 0.2, 0.3 ), up * up );
  e += vec3( 1.0, 0.95, 0.88 ) * pow( max( dot( d, normalize( vec3( 0.42, 0.82, 0.38 ) ) ), 0.0 ), 240.0 ) * 9.0;
  e += vec3( 0.58, 0.76, 1.0 ) * pow( max( dot( d, normalize( vec3( -0.72, 0.36, -0.58 ) ) ), 0.0 ), 90.0 ) * 4.0;
  e += vec3( 1.0, 0.62, 0.42 ) * pow( max( dot( d, normalize( vec3( 0.18, -0.24, 0.95 ) ) ), 0.0 ), 46.0 ) * 1.4;
  return e;
}

#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
  #define FOIL_HAS_ENV
  vec3 foilEnv( const in vec3 dirView, const in float rough ) {
    vec3 d = inverseTransformDirection( dirView, viewMatrix );
    return textureCubeUV( envMap, envMapRotation * d, rough ).rgb * envMapIntensity;
  }
#else
  vec3 foilEnv( const in vec3 dirView, const in float rough ) {
    return foilFallbackEnv( dirView ) * ( 1.0 - rough * 0.65 );
  }
#endif

// Anisotropic GGX NDF, Filament's formulation. Drives the brushed streaks.
float foilAnisoD( const in float NoH, const in float ToH, const in float BoH, const in float at, const in float ab ) {
  float a2 = at * ab;
  vec3 v = vec3( ab * ToH, at * BoH, a2 * NoH );
  float v2 = dot( v, v );
  float w2 = a2 / max( v2, 1e-8 );
  return a2 * w2 * w2 * RECIPROCAL_PI;
}
`;

/** Sampled once at map time; the plate mask lives in the base colour's alpha. */
const INJECT_MAP = /* glsl */ `
float foilPlate = 1.0;
#ifdef USE_MAP
  foilPlate = diffuseColor.a;
  diffuseColor.a = opacity;
#endif
`;

/**
 * A foiled region is a metal layer, not printed ink. Driving metalness from the
 * plate makes the frame and the seal tint their own specular the way cold foil
 * does, while the unfoiled stock stays a dielectric.
 */
const INJECT_METALNESS = /* glsl */ `
// Only a solid hit of foil becomes metal. Ramping metalness linearly with the
// plate turns the whole card into a mirror and bleaches the printed art, since
// a metal has no diffuse albedo. The threshold keeps the frame and the seal
// metallic while the art window stays ink under a holographic layer.
float foilMetalW = smoothstep( 0.72, 0.97, foilPlate ) * uFoilMetal.y;
metalnessFactor = mix( metalnessFactor, uFoilMetal.x, foilMetalW );
roughnessFactor = mix( roughnessFactor, roughnessFactor * uFoilMetal.z, foilMetalW );
`;

/**
 * Runs before three computes its own iridescence, so the film thickness the
 * engine integrates is the same procedural field the explicit layer uses.
 */
const INJECT_MATERIAL = /* glsl */ `
#ifdef USE_MAP
  vec2 foilBaseUv = vMapUv;
#else
  vec2 foilBaseUv = vec2( 0.5 );
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
  mat3 foilFrame = tbn;
#else
  mat3 foilFrame = getTangentFrame( - vViewPosition, normal, foilBaseUv );
#endif
vec2 foilUv = foilRotate( foilBaseUv - 0.5 ) * uFoilSeed.z + 0.5;
vec4 foilDet = texture2D( uFoilTex, foilUv );

// Broad travelling sweep. A diagonal wave, not a bullseye: a stamped foil is
// ruled, so the low frequency thickness drift runs across the sheet.
float foilSweep = sin( dot( foilUv - 0.5, vec2( 4.1, -2.9 ) ) - uFoilDyn.x * 0.28 + uFoilSeed.w );

// Film thickness in nanometres. The spatial variation is deliberately under
// half an interference order: what sweeps the spectrum is the view angle, not
// the texture. A wide spatial range is what turns a holo into an oil slick.
// The spatial term is dominated by the smooth diagonal sweep. Texture-driven
// mottle is kept small on purpose: a premium foil shows broad clean bands, and
// high frequency thickness noise is exactly what turns one into an oil slick.
float foilThickness = uFilm.x
  + uFilm.y * ( foilDet.g - 0.5 ) * 0.42
  + uFilm.y * 0.16 * ( foilDet.r - 0.5 )
  + uFilm.y * 1.05 * foilSweep;
foilThickness = max( foilThickness, 60.0 );

// Embossed grating relief. A stamped hologram is a physical corrugation, so it
// tilts the normal along the ruling.
float foilRelief = ( foilDet.r - 0.5 ) * uFoilParams.y;
vec3 foilNormal = normalize(
  normal
  + foilFrame[ 0 ] * foilRelief * 0.16
  + foilFrame[ 1 ] * ( foilDet.b - 0.5 ) * uFoilParams.y * 0.07
);

float foilStrength = uFoilParams.x * foilPlate;

#ifdef USE_IRIDESCENCE
  material.iridescence *= foilPlate * ( 0.35 + 0.65 * foilDet.g );
  material.iridescenceThickness = foilThickness;
#endif
`;

const INJECT_LIGHTS = /* glsl */ `
if ( foilStrength > 0.001 ) {
  vec3 V = geometryViewDir;
  vec3 Nf = foilNormal;
  float NoV = clamp( dot( Nf, V ), 1e-3, 1.0 );

  // 1. Spectral response of the film at this incidence.
  vec3 film = foilSpectrum( foilThickness, NoV, uFilm.z, uFilm.w ) * uFoilTint;

  // 2. Environment reflected through the grating.
  vec3 R = reflect( -V, Nf );
  vec3 envSpec = foilEnv( R, uStreak.z );

  // 3. Prism split. Refracting each primary at a slightly different index is
  //    what a real dispersive layer does; sampling the probe three times gives
  //    the smeared spectrum you see on a tilted foil edge.
  vec3 prism = vec3( 0.0 );
  if ( uFoilParams.z > 0.001 ) {
    float n = uFilm.z;
    float spreadIor = 0.055 * uFoilParams.z;
    vec3 dr = refract( -V, Nf, 1.0 / max( n - spreadIor, 1.02 ) );
    vec3 dg = refract( -V, Nf, 1.0 / n );
    vec3 db = refract( -V, Nf, 1.0 / ( n + spreadIor ) );
    prism = vec3(
      foilEnv( dr, uStreak.z * 1.6 ).r,
      foilEnv( dg, uStreak.z * 1.6 ).g,
      foilEnv( db, uStreak.z * 1.6 ).b
    ) * uFoilParams.z;
  }

  // 4. Anisotropic streaks against the real lights. The ruling direction is the
  //    tangent, so the highlight stretches across the ruling, not along it.
  vec3 foilT = normalize( foilFrame[ 0 ] * uFoilSeed.x + foilFrame[ 1 ] * uFoilSeed.y );
  vec3 foilB = normalize( cross( Nf, foilT ) );
  float foilAt = max( 0.0012, uStreak.z * uStreak.z * 0.35 );
  float foilAb = max( 0.00008, foilAt / max( uStreak.x, 1.0 ) );
  vec3 streak = vec3( 0.0 );
  vec3 foilH;
  vec3 foilL;

  #if NUM_DIR_LIGHTS > 0
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      foilL = directionalLights[ i ].direction;
      foilH = normalize( foilL + V );
      streak += directionalLights[ i ].color
        * foilAnisoD( saturate( dot( Nf, foilH ) ), dot( foilT, foilH ), dot( foilB, foilH ), foilAt, foilAb )
        * saturate( dot( Nf, foilL ) );
    }
  #endif

  #if NUM_SPOT_LIGHTS > 0
    IncidentLight foilIncident;
    SpotLight foilSpot;
    for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
      foilSpot = spotLights[ i ];
      getSpotLightInfo( foilSpot, geometryPosition, foilIncident );
      foilH = normalize( foilIncident.direction + V );
      streak += foilIncident.color
        * foilAnisoD( saturate( dot( Nf, foilH ) ), dot( foilT, foilH ), dot( foilB, foilH ), foilAt, foilAb )
        * saturate( dot( Nf, foilIncident.direction ) );
    }
  #endif

  #if NUM_POINT_LIGHTS > 0
    IncidentLight foilPointIncident;
    PointLight foilPoint;
    for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
      foilPoint = pointLights[ i ];
      getPointLightInfo( foilPoint, geometryPosition, foilPointIncident );
      foilH = normalize( foilPointIncident.direction + V );
      streak += foilPointIncident.color
        * foilAnisoD( saturate( dot( Nf, foilH ) ), dot( foilT, foilH ), dot( foilB, foilH ), foilAt, foilAb )
        * saturate( dot( Nf, foilPointIncident.direction ) );
    }
  #endif

  streak *= uStreak.y;

  // 5. Facet sparkle: individual grains of the stamped layer catching a light.
  float sparkle = pow( foilDet.a, 3.0 ) * pow( saturate( dot( reflect( -V, Nf ), normalize( vec3( 0.3, 0.7, 0.6 ) ) ) ), 32.0 );

  // Grazing angles see far more of the film. This is the tilt reveal.
  float fres = pow( 1.0 - NoV, uStreak.w );
  float gain = foilStrength * ( 0.3 + 0.42 * fres + uFoilDyn.y * 0.45 ) * ( 1.0 + uFoilDyn.z * 2.5 );

  // The clearcoat already reflects the room. What this layer contributes is the
  // spectral tint of that reflection plus the diffracted lobes, so the mirror
  // term is deliberately soft and the printed layer stays legible through it.
  vec3 foil = film * ( min( envSpec, vec3( 6.0 ) ) * 0.2 + streak * 2.4 )
            + prism * film * 0.4
            + film * sparkle * uFoilParams.w * 2.5;

  // Dead endpoints: the foil has delaminated. What is left flickers and has
  // lost most of its long wavelengths.
  if ( uFoilDyn.w > 0.001 ) {
    float rot = fract( sin( foilUv.x * 91.7 + foilUv.y * 47.3 ) * 43758.5453 );
    float flick = 0.55 + 0.45 * sin( uFoilDyn.x * 2.3 + rot * 12.0 );
    vec3 sick = vec3( dot( foil, vec3( 0.2126, 0.7152, 0.0722 ) ) );
    foil = mix( foil, mix( sick, sick * vec3( 0.45, 1.15, 0.95 ), 0.85 ) * flick, uFoilDyn.w );
  }

  reflectedLight.directSpecular += foil * gain;
}
`;

export interface FoilPatchOptions {
  /** Spectral integration samples. Tied to the quality tier. */
  spectralSamples: number;
  /** Cache-key discriminator; materials with the same tag share one program. */
  tag: string;
}

/**
 * Attach the foil to a MeshPhysicalMaterial. The uniform bag is shared by
 * reference so the caller can animate it without touching the shader.
 */
export function patchFoil(
  material: THREE.MeshPhysicalMaterial,
  uniforms: FoilUniforms,
  opts: FoilPatchOptions
): void {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.defines = shader.defines ?? {};
    let fs = shader.fragmentShader;
    fs = fs.replace(
      '#include <clipping_planes_pars_fragment>',
      `#include <clipping_planes_pars_fragment>\n#define FOIL_SPECTRAL_SAMPLES ${opts.spectralSamples}\n${PARS}`
    );
    fs = fs.replace('#include <map_fragment>', `#include <map_fragment>\n${INJECT_MAP}`);
    fs = fs.replace(
      '#include <metalnessmap_fragment>',
      `#include <metalnessmap_fragment>\n${INJECT_METALNESS}`
    );
    fs = fs.replace(
      '#include <lights_physical_fragment>',
      `#include <lights_physical_fragment>\n${INJECT_MATERIAL}`
    );
    fs = fs.replace('#include <lights_fragment_end>', `#include <lights_fragment_end>\n${INJECT_LIGHTS}`);
    shader.fragmentShader = fs;
  };
  material.customProgramCacheKey = () => `pm-foil:2:${opts.tag}:${opts.spectralSamples}`;
}

/** Spectral samples per quality tier. One value per run, so one program. */
export function spectralSamplesFor(tier: string): number {
  switch (tier) {
    case 'ultra':
      return 24;
    case 'high':
      return 16;
    case 'medium':
      return 10;
    default:
      return 6;
  }
}

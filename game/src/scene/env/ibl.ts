import * as THREE from 'three';

/**
 * Procedural image based lighting.
 *
 * A miniature "studio" is built in HDR: a graded sky dome carrying the chamber's
 * bounce, plus real emissive area sources standing in for the ceiling aperture,
 * the cool fill wall and the warm cove strips. That scene is rendered into a
 * WebGLCubeRenderTarget and pushed through PMREMGenerator, which is what makes
 * the anodised metal in the chamber read as metal instead of as grey plastic.
 *
 * No HDRI is downloaded. The whole probe is a shader and four quads.
 */

export interface EnvProbe {
  /** PMREM filtered radiance, assign to scene.environment. */
  texture: THREE.Texture;
  /** Unfiltered cube, useful as a very dim background. */
  background: THREE.CubeTexture;
  dispose(): void;
}

export interface EnvProbeOptions {
  /** Direction the key light travels from, normalised, in world space. */
  keyDir: THREE.Vector3;
  fillDir: THREE.Vector3;
  keyColor: THREE.Color;
  fillColor: THREE.Color;
  coveColor: THREE.Color;
  size?: number;
}

const domeVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const domeFrag = /* glsl */ `
  precision highp float;
  varying vec3 vDir;
  uniform vec3 uKeyDir;
  uniform vec3 uFillDir;
  uniform vec3 uKeyColor;
  uniform vec3 uFillColor;
  uniform vec3 uCoveColor;

  void main() {
    vec3 d = normalize( vDir );
    float up = d.y;

    // Sealed room: almost nothing above, a dead floor below, and a lift where
    // the cove strips wash the top of the wall.
    vec3 ceilingTone = vec3( 0.016, 0.021, 0.033 );
    vec3 wallTone = vec3( 0.030, 0.036, 0.052 );
    vec3 floorTone = vec3( 0.006, 0.007, 0.010 );
    vec3 col = mix( floorTone, wallTone, smoothstep( -0.55, 0.05, up ) );
    col = mix( col, ceilingTone, smoothstep( 0.35, 0.95, up ) );

    // Continuous warm cove where wall meets ceiling.
    float band = exp( -pow( ( up - 0.40 ) / 0.15, 2.0 ) );
    col += uCoveColor * band * 0.42;

    // Vertical reveal strips repeating around the chamber.
    float az = atan( d.z, d.x );
    float bars = pow( max( 0.0, cos( az * 12.0 ) ), 90.0 );
    bars *= exp( -pow( ( up - 0.10 ) / 0.34, 2.0 ) );
    col += uCoveColor * bars * 0.85;

    // Ceiling aperture: a hard core for crisp specular plus a soft halo.
    float kd = max( 0.0, dot( d, uKeyDir ) );
    col += uKeyColor * pow( kd, 800.0 ) * 20.0;
    col += uKeyColor * pow( kd, 22.0 ) * 0.85;

    // Cool fill from the opposite wall wash.
    float fd = max( 0.0, dot( d, uFillDir ) );
    col += uFillColor * pow( fd, 6.0 ) * 0.42;

    gl_FragColor = vec4( col, 1.0 );
  }
`;

function areaSource(
  width: number,
  height: number,
  position: THREE.Vector3,
  color: THREE.Color
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({ color, toneMapped: false, side: THREE.DoubleSide })
  );
  mesh.position.copy(position);
  mesh.lookAt(0, 0, 0);
  return mesh;
}

export function createEnvProbe(
  renderer: THREE.WebGLRenderer,
  opts: EnvProbeOptions
): EnvProbe {
  const size = opts.size ?? 256;

  const envScene = new THREE.Scene();

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(50, 48, 32),
    new THREE.ShaderMaterial({
      uniforms: {
        uKeyDir: { value: opts.keyDir.clone().normalize() },
        uFillDir: { value: opts.fillDir.clone().normalize() },
        uKeyColor: { value: opts.keyColor.clone() },
        uFillColor: { value: opts.fillColor.clone() },
        uCoveColor: { value: opts.coveColor.clone() },
      },
      vertexShader: domeVert,
      fragmentShader: domeFrag,
      side: THREE.BackSide,
      depthWrite: false,
      toneMapped: false,
      fog: false,
    })
  );
  envScene.add(dome);

  // Shaped sources. Rectangular highlights sliding across brushed metal are the
  // single clearest signal that a surface is a real reflector.
  const key = opts.keyDir.clone().normalize().multiplyScalar(11);
  envScene.add(areaSource(7, 4.5, key, opts.keyColor.clone().multiplyScalar(6.0)));
  const fill = opts.fillDir.clone().normalize().multiplyScalar(11);
  envScene.add(areaSource(2.2, 9, fill, opts.fillColor.clone().multiplyScalar(2.2)));
  envScene.add(
    areaSource(14, 0.55, new THREE.Vector3(0, 3.4, -11), opts.coveColor.clone().multiplyScalar(3.0))
  );
  envScene.add(
    areaSource(14, 0.55, new THREE.Vector3(0, 3.4, 11), opts.coveColor.clone().multiplyScalar(2.0))
  );
  envScene.add(
    areaSource(0.6, 7, new THREE.Vector3(9.5, 1.2, -6), opts.fillColor.clone().multiplyScalar(1.6))
  );

  const cubeTarget = new THREE.WebGLCubeRenderTarget(size, {
    type: THREE.HalfFloatType,
    colorSpace: THREE.LinearSRGBColorSpace,
    generateMipmaps: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const cubeCamera = new THREE.CubeCamera(0.5, 120, cubeTarget);

  const previousTarget = renderer.getRenderTarget();
  cubeCamera.update(renderer, envScene);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileCubemapShader();
  const filtered = pmrem.fromCubemap(cubeTarget.texture);
  pmrem.dispose();
  renderer.setRenderTarget(previousTarget);

  dome.geometry.dispose();
  (dome.material as THREE.Material).dispose();
  envScene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && m !== dome) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  });

  return {
    texture: filtered.texture,
    background: cubeTarget.texture,
    dispose() {
      filtered.dispose();
      cubeTarget.dispose();
    },
  };
}

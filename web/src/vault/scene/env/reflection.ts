import * as THREE from 'three';

/**
 * Planar reflection probe for the vault floor.
 *
 * A mirror is wrong for polished concrete, so the probe renders the chamber
 * from the mirrored camera into a low resolution mip chain and the floor shader
 * picks the mip by surface roughness and by reflected distance. Near the camera
 * the reflection is tight, far away it smears out, which is how a real damp
 * polished slab behaves.
 *
 * The maths is the standard mirrored-camera construction with an oblique near
 * plane so nothing below the floor leaks into the reflection.
 */

export interface FloorReflection {
  texture: THREE.Texture;
  /** Maps world position to reflection UV. Feed to the floor material. */
  textureMatrix: THREE.Matrix4;
  /** Highest usable mip index, for roughness driven blur. */
  maxLod: number;
  update(scene: THREE.Scene, camera: THREE.PerspectiveCamera, hide: THREE.Object3D[]): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

export interface FloorReflectionOptions {
  /** World height of the mirror plane. */
  planeY: number;
  /** Fraction of the viewport used for the reflection buffer. */
  scale: number;
  /** Hard cap on the reflection buffer width. */
  maxWidth: number;
}

export function createFloorReflection(
  renderer: THREE.WebGLRenderer,
  opts: FloorReflectionOptions
): FloorReflection {
  const reflectorMatrix = new THREE.Matrix4()
    .makeRotationX(-Math.PI / 2)
    .setPosition(0, opts.planeY, 0);

  const reflectorPlane = new THREE.Plane();
  const normal = new THREE.Vector3();
  const reflectorWorldPosition = new THREE.Vector3();
  const cameraWorldPosition = new THREE.Vector3();
  const rotationMatrix = new THREE.Matrix4();
  const lookAtPosition = new THREE.Vector3();
  const clipPlane = new THREE.Vector4();
  const view = new THREE.Vector3();
  const target = new THREE.Vector3();
  const q = new THREE.Vector4();
  const textureMatrix = new THREE.Matrix4();
  const virtualCamera = new THREE.PerspectiveCamera();

  let width = 2;
  let height = 2;
  let rt = makeTarget(width, height);
  let frames = 0;

  function makeTarget(w: number, h: number): THREE.WebGLRenderTarget {
    const t = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      colorSpace: THREE.LinearSRGBColorSpace,
      depthBuffer: true,
      stencilBuffer: false,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
    });
    t.texture.wrapS = THREE.ClampToEdgeWrapping;
    t.texture.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }

  const api: FloorReflection = {
    texture: rt.texture,
    textureMatrix,
    maxLod: 1,

    resize(w: number, h: number) {
      const targetW = Math.max(64, Math.min(opts.maxWidth, Math.round(w * opts.scale)));
      const targetH = Math.max(64, Math.round(targetW * (h / Math.max(1, w))));
      if (targetW === width && targetH === height) return;
      width = targetW;
      height = targetH;
      rt.dispose();
      rt = makeTarget(width, height);
      api.texture = rt.texture;
      // Capped: past six mips the buffer is a single smear and the roughness
      // ramp below has nothing left to resolve.
      api.maxLod = Math.min(6, Math.floor(Math.log2(Math.max(width, height))));
    },

    update(scene, camera, hide) {
      // The first frame has no shadow maps yet; let the main pass build them so
      // the reflection never bakes in an empty shadow atlas.
      frames++;
      if (frames < 2) return;

      reflectorWorldPosition.setFromMatrixPosition(reflectorMatrix);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

      rotationMatrix.extractRotation(reflectorMatrix);
      normal.set(0, 0, 1).applyMatrix4(rotationMatrix);

      view.subVectors(reflectorWorldPosition, cameraWorldPosition);
      if (view.dot(normal) > 0) return; // camera is under the floor

      view.reflect(normal).negate().add(reflectorWorldPosition);

      rotationMatrix.extractRotation(camera.matrixWorld);
      lookAtPosition.set(0, 0, -1).applyMatrix4(rotationMatrix).add(cameraWorldPosition);

      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate().add(reflectorWorldPosition);

      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0).applyMatrix4(rotationMatrix).reflect(normal);
      virtualCamera.lookAt(target);
      virtualCamera.far = camera.far;
      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

      // World position -> reflection UV, with the 0.5 bias baked in.
      textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);

      // Oblique near plane clipping (Lengyel): push the near plane onto the
      // mirror so geometry behind the floor cannot bleed through.
      reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
      clipPlane.set(
        reflectorPlane.normal.x,
        reflectorPlane.normal.y,
        reflectorPlane.normal.z,
        reflectorPlane.constant
      );

      const projection = virtualCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + projection.elements[8]) / projection.elements[0];
      q.y = (Math.sign(clipPlane.y) + projection.elements[9]) / projection.elements[5];
      q.z = -1.0;
      q.w = (1.0 + projection.elements[10]) / projection.elements[14];

      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

      projection.elements[2] = clipPlane.x;
      projection.elements[6] = clipPlane.y;
      projection.elements[10] = clipPlane.z + 1.0 - 0.0035;
      projection.elements[14] = clipPlane.w;

      const restore: THREE.Object3D[] = [];
      for (const o of hide) {
        if (o.visible) {
          o.visible = false;
          restore.push(o);
        }
      }

      const prevTarget = renderer.getRenderTarget();
      const prevShadowAuto = renderer.shadowMap.autoUpdate;
      const prevXr = renderer.xr.enabled;
      renderer.xr.enabled = false;
      renderer.shadowMap.autoUpdate = false;

      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, virtualCamera);

      renderer.setRenderTarget(prevTarget);
      renderer.shadowMap.autoUpdate = prevShadowAuto;
      renderer.xr.enabled = prevXr;

      for (const o of restore) o.visible = true;
    },

    dispose() {
      rt.dispose();
    },
  };

  return api;
}

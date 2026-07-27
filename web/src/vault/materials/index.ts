/**
 * Card materials, public surface.
 *
 * Intended use from the card stage:
 *
 * ```ts
 * import { createCardGeometry, createCardMaterial, CARD } from '../materials';
 *
 * const geometry = createCardGeometry();               // build once, share
 * const mat = createCardMaterial(position.card, ctx);  // per card, refcounted
 * const mesh = new THREE.Mesh(geometry, mat.materials);
 * mesh.castShadow = true;
 * mesh.receiveShadow = true;
 *
 * // each frame
 * mat.update(t);
 *
 * // choreography hooks
 * mat.setReveal(0..1);      // charge the foil as the card turns over
 * mat.setSurge(0..1);       // impact punch
 * mat.setGloss(0..1);       // dull the laminate, for the sealed packet state
 * mat.setFaceDetail(1024);  // 1024 for the hero, 512 for cards in a fan
 *
 * // teardown
 * mat.release();
 * geometry.dispose();
 * ```
 *
 * `mat.boxMaterials` gives the same three materials in BoxGeometry group order
 * if the stage has not moved to `createCardGeometry` yet.
 *
 * Every card surface shares one shader program. The only per-card texture is
 * the printed face, and it is reference counted: released cards fall into a
 * warm pool that is trimmed to `setFaceTextureBudget`. Referenced cards are
 * never evicted, so the stage decides the peak by how many it holds.
 */

export { createCardGeometry, CARD, type CardGeometryOptions } from './cardGeometry';
export {
  createCardMaterial,
  prewarmCardMaterials,
  cardMaterialStats,
  setFaceTextureBudget,
  disposeCardMaterials,
  type CardMaterial,
  type CardMaterialOptions,
  type CardMaterialStats,
} from './cardMaterial';
export { composeFace, cardSeed, FACE_ASPECT } from './faceTexture';
export { composeBack } from './backTexture';
export {
  RARITY_STYLES,
  TYPE_STYLES,
  rarityStyle,
  typeStyle,
  isGhost,
  rarityLabel,
  type RarityStyle,
  type TypeStyle,
} from './palette';

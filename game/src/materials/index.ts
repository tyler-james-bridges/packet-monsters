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
 * mat.setReveal(0..1);   // charge the foil as the card turns over
 * mat.setSurge(0..1);    // impact punch
 * mat.setGloss(0..1);    // dull the laminate, for the sealed packet state
 *
 * // teardown
 * mat.release();
 * geometry.dispose();
 * ```
 */

export { createCardGeometry, CARD, type CardGeometryOptions } from './cardGeometry';
export {
  createCardMaterial,
  prewarmCardMaterials,
  cardMaterialStats,
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

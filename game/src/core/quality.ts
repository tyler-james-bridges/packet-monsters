import type { QualitySettings, QualityTier } from './types';

const TIERS: Record<QualityTier, QualitySettings> = {
  ultra: {
    tier: 'ultra',
    pixelRatio: 2,
    shadowMapSize: 2048,
    softShadows: true,
    taaSamples: 16,
    bloomMips: 6,
    dof: true,
    ssr: true,
    volumetrics: true,
    maxParticles: 24000,
    anisotropy: 16,
  },
  high: {
    tier: 'high',
    pixelRatio: 1.75,
    shadowMapSize: 2048,
    softShadows: true,
    taaSamples: 8,
    bloomMips: 5,
    dof: true,
    ssr: true,
    volumetrics: true,
    maxParticles: 14000,
    anisotropy: 8,
  },
  medium: {
    tier: 'medium',
    pixelRatio: 1.5,
    shadowMapSize: 1024,
    softShadows: true,
    taaSamples: 4,
    bloomMips: 4,
    dof: false,
    ssr: false,
    volumetrics: true,
    maxParticles: 7000,
    anisotropy: 4,
  },
  low: {
    tier: 'low',
    pixelRatio: 1,
    shadowMapSize: 512,
    softShadows: false,
    taaSamples: 1,
    bloomMips: 3,
    dof: false,
    ssr: false,
    volumetrics: false,
    maxParticles: 2500,
    anisotropy: 2,
  },
};

export function qualityFor(tier: QualityTier): QualitySettings {
  return { ...TIERS[tier] };
}

/**
 * Pick a starting tier from device signals. The adaptive manager refines this
 * from measured frame time once the scene is live.
 */
export function detectQuality(): QualitySettings {
  const forced = new URLSearchParams(location.search).get('quality') as QualityTier | null;
  if (forced && forced in TIERS) return qualityFor(forced);

  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = matchMedia('(pointer: coarse)').matches;

  if (coarse) return qualityFor(mem >= 6 && cores >= 6 ? 'medium' : 'low');
  if (mem >= 8 && cores >= 8) return qualityFor('ultra');
  if (mem >= 6 && cores >= 4) return qualityFor('high');
  return qualityFor('medium');
}

export const QUALITY_ORDER: QualityTier[] = ['low', 'medium', 'high', 'ultra'];

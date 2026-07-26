import type { GachaMachine } from '../gacha/machine';
import type { VaultPosition } from '../core/types';
import {
  PROTOCOL,
  accumulate,
  acquisitionPrice,
  backingWei,
  quote,
  rarityOdds,
} from '../gacha/protocol';

/**
 * The one and only place the UI touches `window.__machine`.
 *
 * That global is a temporary hook the lead added because the machine is
 * constructed before the HUD and systems are forbidden from importing each
 * other. It is isolated here so replacing it costs a single edit: give the HUD
 * a `machine` handle on AppContext, or add a `vault:ready` bus event carrying
 * the positions, and only `resolveMachine` below changes. Nothing else in
 * src/ui knows the global exists.
 */
interface MachineCarrier {
  __machine?: GachaMachine;
}

function resolveMachine(): GachaMachine | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as MachineCarrier).__machine ?? null;
}

/**
 * Resolves the machine now if it is already published, otherwise on the next
 * microtask, otherwise on the next few frames. Construction order is guaranteed
 * by main.ts today; the retry exists so a reorder degrades into a late paint
 * instead of a blank HUD.
 */
export function whenMachine(callback: (machine: GachaMachine) => void): () => void {
  const immediate = resolveMachine();
  if (immediate) {
    callback(immediate);
    return () => {};
  }
  let cancelled = false;
  let attempts = 0;
  const tick = (): void => {
    if (cancelled) return;
    const m = resolveMachine();
    if (m) {
      callback(m);
      return;
    }
    if (attempts++ > 120) return;
    requestAnimationFrame(tick);
  };
  queueMicrotask(tick);
  return () => {
    cancelled = true;
  };
}

/** Per-rarity aggregation, derived rather than tabulated. */
export interface RarityStat {
  rarity: number;
  positions: number;
  /** Pooled backing for the tier, in wei. */
  backing: bigint;
  /** Probability of drawing this tier, straight from position weights. */
  probability: number;
}

/**
 * Everything the UI publishes about vault economics, computed from the same
 * protocol functions the machine uses. No number in the HUD is authored here;
 * each one is either read off the machine or recomputed with an exported
 * protocol function over the machine's own positions.
 */
export interface VaultEconomics {
  positions: VaultPosition[];
  count: number;
  /** Total committed backing, wei. */
  totalBacking: bigint;
  /** The harmonic mean n / sum(1/B_i), wei. The expected payout of one draw. */
  expectedValue: bigint;
  /** Acquisition price, wei. Read from the machine so it is authoritative. */
  price: bigint;
  /** price - expectedValue. The entire house edge. */
  fee: bigint;
  feeBps: bigint;
  maxFeeBps: bigint;
  /** Fee as a fraction of price, for the stacked bar. */
  feeShare: number;
  odds: number[];
  rarities: RarityStat[];
  /** Highest single-position weight, i.e. vault concentration. */
  topWeight: number;
  topPosition: VaultPosition | null;
}

export function readEconomics(machine: GachaMachine): VaultEconomics {
  const positions = machine.positions;
  const acc = accumulate(positions.map(backingWei));
  const price = machine.price();
  // The contract splits the quote itself, so take both legs from it rather than
  // subtracting. Base and fee each round up independently, and base + fee is the
  // total by construction, so deriving fee by subtraction would drift by a wei.
  const { base: expectedValue, fee } = quote(acc);
  const odds = machine.odds();

  // The accumulator now carries the sum of reciprocal WEIGHTS, which is the
  // quantity pricing needs and is not denominated in ETH. Total value locked is
  // a separate sum over the positions themselves.
  let totalBackingWei = 0n;
  for (const p of positions) totalBackingWei += backingWei(p);

  const rarities: RarityStat[] = [0, 1, 2, 3, 4].map((rarity) => ({
    rarity,
    positions: 0,
    backing: 0n,
    probability: odds[rarity] ?? 0,
  }));
  for (const p of positions) {
    const bucket = rarities[p.card.rarity];
    if (!bucket) continue;
    bucket.positions += 1;
    bucket.backing += backingWei(p);
  }

  let topPosition: VaultPosition | null = null;
  for (const p of positions) {
    if (!topPosition || p.weight > topPosition.weight) topPosition = p;
  }

  return {
    positions,
    count: positions.length,
    totalBacking: totalBackingWei,
    expectedValue,
    price,
    fee,
    feeBps: PROTOCOL.FEE_BPS,
    maxFeeBps: PROTOCOL.MAX_FEE_BPS,
    feeShare: price > 0n ? Number(fee) / Number(price) : 0,
    odds,
    rarities,
    topWeight: topPosition ? topPosition.weight : 0,
    topPosition,
  };
}

/** Re-exported so components read tier odds without importing the machine. */
export { rarityOdds, acquisitionPrice, PROTOCOL };

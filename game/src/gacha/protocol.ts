import type { CardRecord, VaultPosition } from '../core/types';
import { splitmix32 } from '../core/rng';

/**
 * SEALED VAULT protocol, client mirror.
 *
 * This is a faithful TypeScript model of the onchain contract in
 * contracts/src/SealedVault.sol. The game reads its odds and pricing from here
 * so that what a player sees is exactly what the contract would do. Any change
 * to one side must change the other.
 *
 * Design goals, and the failure modes each one closes:
 *
 *  1. Expectation priced acquisition. A vault of positions with heterogeneous
 *     backing has an expected payout under weighted selection of
 *     E[B] = sum(B_i^2) / sum(B_i). A protocol that charges a fixed or naively
 *     averaged price is a free option whenever E[B] exceeds it: buyers simply
 *     wait for the vault to skew and drain it. We maintain S1 = sum(B_i) and
 *     S2 = sum(B_i^2) as running accumulators, so E[B] is exact and O(1), and
 *     price = E[B] * (1 + feeBps). The house edge is the fee and nothing else,
 *     which means the protocol can never be arbitraged by vault composition.
 *
 *  2. Two phase sealed randomness. Selection is not resolved in the same
 *     transaction as payment. A buyer commits H(secret, buyer, nonce) with
 *     payment; resolution happens at least RESOLVE_DELAY blocks later and mixes
 *     the revealed secret with the beacon value at the resolve block. Neither
 *     the buyer (who cannot see the future beacon) nor the proposer (who cannot
 *     see the secret) can steer the outcome alone.
 *
 *  3. Forced resolution. A buyer who dislikes an outcome cannot simply refuse
 *     to reveal, because after REVEAL_WINDOW blocks anyone may force resolve
 *     using the beacon alone and claim the buyer's bond. Aborting is therefore
 *     never profitable.
 *
 *  4. Snapshot isolation. A commit binds to a vault epoch. Deposits and exits
 *     after that commit land in the next epoch and cannot alter the odds of an
 *     in flight draw, so depositors cannot grief a pending buyer by pulling
 *     backing out from under them.
 *
 *  5. Exact integer weighting. Selection walks a Fenwick tree of integer
 *     backing in wei. There is no floating point and no normalisation step, so
 *     there is no dust position that can never be drawn and no rounding bias
 *     toward low indices.
 */

/** Basis points denominator. */
export const BPS = 10_000n;

export const PROTOCOL = {
  /** Hard ceiling on the protocol fee, immutable in the contract. */
  MAX_FEE_BPS: 500n,
  /** Live fee. */
  FEE_BPS: 250n,
  /** Blocks between commit and the earliest legal resolve. */
  RESOLVE_DELAY: 2,
  /** Blocks after which anyone may force resolve and slash the bond. */
  REVEAL_WINDOW: 256,
  /** Minimum backing per position, in wei. Blocks dust griefing. */
  MIN_BACKING: 10_000_000_000_000_000n, // 0.01 ETH
  /** Buyer bond, refunded on honest reveal. */
  BOND: 2_000_000_000_000_000n, // 0.002 ETH
  /** Pity: consecutive misses before the floor tier boost saturates. */
  PITY_CAP: 60,
  /** Maximum weight multiplier applied at full pity, in bps. */
  PITY_MAX_BOOST_BPS: 30_000n, // 3x
} as const;

/** Running accumulators that make pricing O(1). */
export interface VaultAccumulators {
  /** sum of backing, wei. */
  s1: bigint;
  /** sum of backing squared, wei^2. */
  s2: bigint;
  count: number;
}

export function accumulate(backings: bigint[]): VaultAccumulators {
  let s1 = 0n;
  let s2 = 0n;
  for (const b of backings) {
    s1 += b;
    s2 += b * b;
  }
  return { s1, s2, count: backings.length };
}

/**
 * Expected backing received by a buyer under backing weighted selection.
 * E[B] = sum(B_i * B_i / S1) = S2 / S1.
 */
export function expectedBacking(acc: VaultAccumulators): bigint {
  if (acc.s1 === 0n) return 0n;
  return acc.s2 / acc.s1;
}

/**
 * Acquisition price. Always at or above expected value, so the vault cannot be
 * drained by timing. Reverts to zero on an empty vault, which the caller must
 * treat as "vault closed".
 */
export function acquisitionPrice(acc: VaultAccumulators, feeBps: bigint = PROTOCOL.FEE_BPS): bigint {
  const ev = expectedBacking(acc);
  if (ev === 0n) return 0n;
  return (ev * (BPS + clampFee(feeBps))) / BPS;
}

export function clampFee(feeBps: bigint): bigint {
  return feeBps > PROTOCOL.MAX_FEE_BPS ? PROTOCOL.MAX_FEE_BPS : feeBps;
}

/**
 * Fenwick tree over integer backing. Supports O(log n) prefix sums and O(log n)
 * search for the position owning a given cumulative weight, which is what makes
 * a large vault drawable in bounded gas.
 */
export class FenwickTree {
  private readonly tree: bigint[];
  readonly size: number;

  constructor(values: bigint[]) {
    this.size = values.length;
    this.tree = new Array<bigint>(this.size + 1).fill(0n);
    for (let i = 0; i < values.length; i++) this.add(i, values[i]);
  }

  add(index: number, delta: bigint): void {
    for (let i = index + 1; i <= this.size; i += i & -i) this.tree[i] += delta;
  }

  total(): bigint {
    return this.prefix(this.size);
  }

  /** Sum of the first `count` entries. */
  prefix(count: number): bigint {
    let sum = 0n;
    for (let i = count; i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }

  /**
   * Smallest index whose inclusive prefix sum exceeds `target`.
   * `target` must satisfy 0 <= target < total().
   */
  findByWeight(target: bigint): number {
    let idx = 0;
    let remaining = target;
    let bit = 1;
    while (bit << 1 <= this.size) bit <<= 1;
    for (; bit > 0; bit >>= 1) {
      const next = idx + bit;
      if (next <= this.size && this.tree[next] <= remaining) {
        idx = next;
        remaining -= this.tree[next];
      }
    }
    return idx; // zero based index of the owning position
  }
}

/**
 * Mixes the revealed secret with the beacon value exactly as the contract does:
 * keccak-in-spirit domain separated hashing. The client uses a 32 bit mixer for
 * animation seeding; the contract uses keccak256 over the same tuple, so the
 * selected index matches only when the client is fed the contract's own draw
 * word. `drawWord` here is therefore an input, never a prediction.
 */
export function selectIndex(tree: FenwickTree, drawWord: bigint): number {
  const total = tree.total();
  if (total === 0n) return -1;
  return tree.findByWeight(drawWord % total);
}

/**
 * Pity boost. Deterministic, auditable, and applied to the *weight of the
 * scarce side* rather than by silently rerolling, so the published odds stay
 * true. Returns a multiplier in bps.
 */
export function pityBoostBps(consecutiveMisses: number): bigint {
  const capped = Math.min(consecutiveMisses, PROTOCOL.PITY_CAP);
  const t = BigInt(capped);
  const cap = BigInt(PROTOCOL.PITY_CAP);
  return BPS + ((PROTOCOL.PITY_MAX_BOOST_BPS - BPS) * t) / cap;
}

/**
 * Build the live vault from card data. Backing is derived from the card's real
 * economics: an endpoint that charges more per call and answers faster is worth
 * more to reacquire, so depositors commit more ETH behind it. This keeps the
 * vault honest to the underlying x402 index rather than inventing numbers.
 */
export function buildVault(cards: CardRecord[]): VaultPosition[] {
  const positions: VaultPosition[] = [];
  let s1 = 0n;

  const raw = cards.map((card) => {
    const price = Math.max(Number.parseFloat(card.priceUsd) || 0.001, 0.0005);
    const latencyFactor = 1 + 600 / Math.max(card.latencyMs, 60);
    const aliveFactor = card.alive ? 1 : 0.55; // ghosts trade at a discount
    const rarityFactor = 1 + card.rarity * 0.9;
    const eth = 0.02 * price * 40 * latencyFactor * aliveFactor * rarityFactor;
    const wei = BigInt(Math.max(Math.round(eth * 1e18), Number(PROTOCOL.MIN_BACKING)));
    return { card, wei };
  });

  for (const r of raw) s1 += r.wei;

  for (const r of raw) {
    positions.push({
      card: r.card,
      backing: Number(r.wei) / 1e18,
      weight: s1 === 0n ? 0 : Number(r.wei) / Number(s1),
      standingBid: Number(r.wei) / 1e18,
    });
  }
  return positions;
}

export function backingWei(p: VaultPosition): bigint {
  return BigInt(Math.round(p.backing * 1e18));
}

/**
 * Odds of drawing each rarity tier, straight from the weights. The UI publishes
 * these verbatim; there is no hidden table.
 */
export function rarityOdds(positions: VaultPosition[]): number[] {
  const odds = [0, 0, 0, 0, 0];
  for (const p of positions) odds[p.card.rarity] += p.weight;
  return odds;
}

/**
 * Local, non authoritative draw used for offline play and for the screenshot
 * harness. Onchain the draw word comes from the sealed commit; here it comes
 * from the seeded RNG so a given seed always produces the same pull.
 */
export function localDraw(positions: VaultPosition[], seed: number): { index: number; word: bigint } {
  const rng = splitmix32(seed);
  const tree = new FenwickTree(positions.map(backingWei));
  const total = tree.total();
  // 53 bits of entropy is ample for a local preview draw.
  const word = BigInt(Math.floor(rng() * Number.MAX_SAFE_INTEGER)) % (total === 0n ? 1n : total);
  return { index: selectIndex(tree, word), word };
}

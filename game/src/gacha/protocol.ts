import type { CardRecord, VaultPosition } from '../core/types';
import { splitmix32 } from '../core/rng';

/**
 * SEALED VAULT protocol, client mirror.
 *
 * A faithful TypeScript model of contracts/src/SealedVault.sol. The game reads
 * its odds and its price from here, so what a player sees is exactly what the
 * contract would do. Any change to one side must change the other.
 *
 * The two things this protocol fixes relative to Fake World Assets:
 *
 *  1. RECIPROCAL WEIGHTING. FWA selects with probability proportional to
 *     backing, which makes the most valuable position the most likely pull.
 *     That is not a gacha. Here the weight is proportional to the RECIPROCAL of
 *     backing, so scarcity and value agree: the heavily backed legendary is the
 *     rarest draw and also the largest payout.
 *
 *         w_i   = (1 / B_i) / sum_j (1 / B_j)
 *         E[B]  = n / sum_j (1 / B_j)                    the harmonic mean
 *
 *  2. EXPECTATION PRICING. Every draw is priced at exactly the expected payout
 *     plus a bounded fee, maintained in O(1) from one running accumulator, so
 *     the vault cannot be timed or arbitraged by composition. The house edge is
 *     the fee and nothing else.
 *
 * Fixed point. Weights are integers, W_i = floor(WEIGHT_NUM / B_i) with
 * WEIGHT_NUM = 2**192. Backing is clamped to [0.01, 1000] ETH, so the smallest
 * legal weight is about 2**122: enormous, which means no dust position is ever
 * unreachable and truncation costs at most 1 part in 2**122. Because
 * W_i * B_i <= WEIGHT_NUM for every i, the exact expected payout
 * sum(W_i B_i) / sum(W_i) is always at most ceilDiv(n * WEIGHT_NUM, sum(W_i)),
 * which is the base price. Both the base and the fee round UP, so every
 * rounding error in the system accrues to the vault and never to the buyer.
 *
 * Randomness, forced resolution and epoch isolation live onchain and are
 * described in contracts/SEALED_VAULT.md; the client models only the parts a
 * player can see, which are the odds and the price.
 */

/** Basis points denominator. Mirrors SealedVault.BPS. */
export const BPS = 10_000n;

/** Fixed point numerator for reciprocal weights. Mirrors SealedVault.WEIGHT_NUM. */
export const WEIGHT_NUM = 1n << 192n;

export const PROTOCOL = {
  /** Hard ceiling on the protocol fee. Immutable in the contract. */
  MAX_FEE_BPS: 500n,
  /** Live fee. */
  FEE_BPS: 250n,
  /** Share of the fee paid through to depositors. */
  LP_FEE_SHARE_BPS: 5_000n,
  /** Blocks from commit to the pinned beacon block. */
  RESOLVE_DELAY: 2,
  /** Blocks after commit within which the buyer must reveal. */
  REVEAL_WINDOW: 200,
  /** Minimum backing per position, in wei. Blocks dust griefing. */
  MIN_BACKING: 10_000_000_000_000_000n, // 0.01 ETH
  /** Maximum backing per position, in wei. Bounds the weight dynamic range. */
  MAX_BACKING: 1_000_000_000_000_000_000_000n, // 1000 ETH
  /** Buyer bond, refunded on an honest reveal, paid to the forcer on a void. */
  BOND: 2_000_000_000_000_000n, // 0.002 ETH
  /** Fenwick tree capacity. Power of two, mirrors SealedVault.MAX_POSITIONS. */
  MAX_POSITIONS: 4096,

  // ---------------------------------------------------------------------
  // There is NO pity system, deliberately. A pity multiplier reweights the
  // vault per buyer, which means the odds a player is shown are not the odds
  // they face, and it also breaks expectation pricing: the price would have to
  // become a function of who is asking. `rarityOdds` is the whole truth.
  // These two constants exist only so the odds panel keeps compiling; they
  // encode "disabled" (zero misses to saturation, 1.0x maximum boost) and the
  // two rows that render them should be deleted from src/ui/components/oddsView.ts.
  // ---------------------------------------------------------------------
  /** @deprecated No pity system exists. Always 0. */
  PITY_CAP: 0,
  /** @deprecated No pity system exists. Always 1.0x (10000 bps). */
  PITY_MAX_BOOST_BPS: 10_000n,
} as const;

/** Integer selection weight of a backing amount. Mirrors SealedVault.weightOf. */
export function weightOf(backing: bigint): bigint {
  if (backing <= 0n) return 0n;
  return WEIGHT_NUM / backing;
}

export function clampBacking(backing: bigint): bigint {
  if (backing < PROTOCOL.MIN_BACKING) return PROTOCOL.MIN_BACKING;
  if (backing > PROTOCOL.MAX_BACKING) return PROTOCOL.MAX_BACKING;
  return backing;
}

export function clampFee(feeBps: bigint): bigint {
  return feeBps > PROTOCOL.MAX_FEE_BPS ? PROTOCOL.MAX_FEE_BPS : feeBps;
}

/** Divide rounding up. Every price leg uses this, so rounding favours the vault. */
export function ceilDiv(a: bigint, b: bigint): bigint {
  if (b === 0n) return 0n;
  return a === 0n ? 0n : (a - 1n) / b + 1n;
}

/**
 * The single running accumulator that makes pricing O(1). `sumWeight` is the
 * Fenwick total the contract already maintains, so no extra state is needed on
 * either side.
 */
export interface VaultAccumulators {
  /** sum of floor(WEIGHT_NUM / B_i) over active positions. Drives pricing. */
  sumWeight: bigint;
  /** sum of backing in wei. Reporting only; pricing never reads it. */
  sumBacking: bigint;
  /** Alias of `sumBacking`, kept for the odds panel. */
  s1: bigint;
  count: number;
}

export function accumulate(backings: bigint[]): VaultAccumulators {
  let sumWeight = 0n;
  let sumBacking = 0n;
  for (const b of backings) {
    const clamped = clampBacking(b);
    sumWeight += weightOf(clamped);
    sumBacking += clamped;
  }
  return { sumWeight, sumBacking, s1: sumBacking, count: backings.length };
}

/**
 * Expected payout of one draw: the harmonic mean of the active backings,
 * evaluated over the exact integer weights the selector actually uses.
 * Rounded down, so quoting it can never overstate value.
 */
export function expectedPayout(acc: VaultAccumulators): bigint {
  if (acc.sumWeight === 0n || acc.count === 0) return 0n;
  return (BigInt(acc.count) * WEIGHT_NUM) / acc.sumWeight;
}

/**
 * Previous name for {@link expectedPayout}. Kept so the odds panel keeps
 * compiling. Under reciprocal weighting this is the harmonic mean, not the
 * `S2 / S1` of backing-proportional selection that the old name implied.
 */
export const expectedBacking = expectedPayout;

/**
 * Acquisition price, split the way the contract splits it. `base` is the seller
 * proceeds and is provably at or above expected value; `fee` is the entire
 * house edge. Both round up.
 */
export function quote(
  acc: VaultAccumulators,
  feeBps: bigint = PROTOCOL.FEE_BPS,
): { base: bigint; fee: bigint; total: bigint } {
  if (acc.sumWeight === 0n || acc.count === 0) return { base: 0n, fee: 0n, total: 0n };
  const base = ceilDiv(BigInt(acc.count) * WEIGHT_NUM, acc.sumWeight);
  const fee = ceilDiv(base * clampFee(feeBps), BPS);
  return { base, fee, total: base + fee };
}

/**
 * Total a buyer pays for one draw, excluding the refundable bond. Zero on an
 * empty vault, which the caller must treat as "vault closed".
 */
export function acquisitionPrice(acc: VaultAccumulators, feeBps: bigint = PROTOCOL.FEE_BPS): bigint {
  return quote(acc, feeBps).total;
}

/** What a buyer must actually send, including the refundable bond. */
export function commitValue(acc: VaultAccumulators, feeBps: bigint = PROTOCOL.FEE_BPS): bigint {
  const total = acquisitionPrice(acc, feeBps);
  return total === 0n ? 0n : total + PROTOCOL.BOND;
}

/**
 * Fenwick tree over integer selection weights. O(log n) update and O(log n)
 * search for the position owning a given cumulative weight, which is what makes
 * a large vault drawable in bounded gas onchain.
 *
 * Note this is a tree of WEIGHTS, not of backing. Feed it `weightOf(backing)`.
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
   * Zero based index of the position owning cumulative weight `target`, which
   * must satisfy 0 <= target < total(). Identical walk to the contract's
   * `_select`: it lands on the largest prefix that does not exceed the target,
   * so a zero weight entry can never be selected and there is no bias toward
   * low indices.
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
    return idx;
  }
}

/**
 * Select with a draw word. The contract derives that word from the revealed
 * secret and the pinned beacon block; here it is always an input, never a
 * prediction, so the client can never claim to know an outcome early.
 */
export function selectIndex(tree: FenwickTree, drawWord: bigint): number {
  const total = tree.total();
  if (total === 0n) return -1;
  return tree.findByWeight(((drawWord % total) + total) % total);
}

/**
 * Calibration of the backing ladder.
 *
 * Backing is not invented: it is derived from the card's real x402 economics.
 * An endpoint that charges more per call, answers faster and is still alive is
 * worth more to hold, so a depositor commits more ETH behind it and is
 * correspondingly less willing to let it go. Under reciprocal weighting that
 * makes it the rarer pull.
 *
 * BACKING_EXPONENT is the one calibration constant, and it is deliberately
 * visible rather than buried in a table. It sets how steep the ladder is:
 * higher means a bigger ETH jackpot on a legendary and longer odds against it.
 * At 0.30 the published odds land on a conventional gacha ladder (roughly
 * 55 / 37 / 5.8 / 1.5 / 0.7 percent) with the top position backed about 16x a
 * floor position. Whatever value is chosen, `rarityOdds` still reports the
 * exact odds the weights produce. There is no second table anywhere.
 */
export const BACKING_EXPONENT = 0.3;

/** Real economic worth signal for a card, from the x402 index data. */
function cardValue(card: CardRecord): number {
  const price = Math.max(Number.parseFloat(card.priceUsd) || 0.001, 0.0005);
  const latencyFactor = 1 + 400 / Math.max(card.latencyMs, 60);
  const aliveFactor = card.alive ? 1 : 0.55; // ghosts trade at a discount
  return price * latencyFactor * aliveFactor;
}

/**
 * Build the live vault from card data. Weights and odds are computed exactly
 * the way the contract computes them, from integer weights over wei.
 */
export function buildVault(cards: CardRecord[]): VaultPosition[] {
  if (cards.length === 0) return [];

  const values = cards.map(cardValue);
  let floor = Number.POSITIVE_INFINITY;
  for (const v of values) if (v < floor) floor = v;
  if (!Number.isFinite(floor) || floor <= 0) floor = 1;

  const backings = values.map((v) => {
    const scaled = Number(PROTOCOL.MIN_BACKING) * Math.pow(v / floor, BACKING_EXPONENT);
    return clampBacking(BigInt(Math.round(scaled)));
  });

  const weights = backings.map(weightOf);
  let sumWeight = 0n;
  for (const w of weights) sumWeight += w;

  const positions: VaultPosition[] = [];
  for (let i = 0; i < cards.length; i++) {
    const backingEth = Number(backings[i]) / 1e18;
    positions.push({
      card: cards[i],
      backing: backingEth,
      // Reciprocal weight, normalised. This is the true draw probability.
      weight: sumWeight === 0n ? 0 : Number(weights[i]) / Number(sumWeight),
      // The buyer of this position receives the backing along with the card,
      // so the backing is also the depositor's effective standing bid.
      standingBid: backingEth,
    });
  }
  return positions;
}

/** Backing of a position in wei, clamped exactly as the contract clamps it. */
export function backingWei(p: VaultPosition): bigint {
  return clampBacking(BigInt(Math.round(p.backing * 1e18)));
}

/**
 * Odds of drawing each rarity tier, summed straight from the real weights. The
 * UI publishes these verbatim. There is no hidden table and no pity multiplier:
 * a pity system would mean the published odds were not the true odds.
 */
export function rarityOdds(positions: VaultPosition[]): number[] {
  const odds = [0, 0, 0, 0, 0];
  for (const p of positions) {
    if (p.card.rarity >= 0 && p.card.rarity < odds.length) odds[p.card.rarity] += p.weight;
  }
  return odds;
}

/**
 * Local, non authoritative draw used for offline play and for the screenshot
 * harness. Onchain the draw word comes from the sealed commit; here it comes
 * from the seeded RNG, so a given seed always produces the same pull.
 */
export function localDraw(positions: VaultPosition[], seed: number): { index: number; word: bigint } {
  const rng = splitmix32(seed);
  const tree = new FenwickTree(positions.map((p) => weightOf(backingWei(p))));
  const total = tree.total();
  if (total === 0n) return { index: -1, word: 0n };
  // Build a full width word from four 32 bit draws so the reduction mod a
  // ~2**151 weight total is not visibly biased, matching the contract's use of
  // a 256 bit keccak output.
  let word = 0n;
  for (let i = 0; i < 8; i++) word = (word << 32n) | BigInt(Math.floor(rng() * 0x1_0000_0000));
  return { index: selectIndex(tree, word), word };
}

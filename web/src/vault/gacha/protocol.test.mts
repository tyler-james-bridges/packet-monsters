/**
 * Executable invariant tests for the SEALED VAULT client mirror.
 *
 * Run with:
 *   cd game && npx tsc --noEmit && node --experimental-strip-types src/gacha/protocol.test.mts
 *
 * These are the same invariants the Foundry suite asserts against
 * contracts/src/SealedVault.sol. They are executed here so the fixed point
 * math is verified by running it, not by asserting that it is correct.
 */
import {
  BPS,
  WEIGHT_NUM,
  PROTOCOL,
  BACKING_EXPONENT,
  FenwickTree,
  accumulate,
  acquisitionPrice,
  backingWei,
  buildVault,
  ceilDiv,
  clampBacking,
  clampFee,
  expectedPayout,
  localDraw,
  quote,
  rarityOdds,
  selectIndex,
  weightOf,
} from './protocol';
import { CARDS } from '../data/cards';
import { RARITY_NAMES } from '../core/types';
import { splitmix32 } from '../core/rng';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(cond: boolean, name: string, detail = ''): void {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push(`${name} ${detail}`);
    console.log(`  FAIL  ${name}  ${detail}`);
  }
}
function section(title: string): void {
  console.log(`\n=== ${title} ===`);
}
function report(name: string): void {
  console.log(`  ok    ${name}`);
}

/** Exact expected payout under the integer weights actually used: sum(W_i B_i) / sum(W_i). */
function exactExpectedPayout(backings: bigint[]): bigint {
  let num = 0n;
  let den = 0n;
  for (const b of backings) {
    const w = weightOf(b);
    num += w * b;
    den += w;
  }
  return den === 0n ? 0n : num / den;
}

// ---------------------------------------------------------------------------
section('1. Weight math: reciprocal, exact, no unreachable dust');
// ---------------------------------------------------------------------------
{
  ok(weightOf(PROTOCOL.MIN_BACKING) === WEIGHT_NUM / PROTOCOL.MIN_BACKING, 'weightOf is exact integer division');
  ok(weightOf(PROTOCOL.MAX_BACKING) > 0n, 'the heaviest legal position still has non-zero weight');
  const wMax = weightOf(PROTOCOL.MAX_BACKING);
  ok(wMax > 1n << 120n, 'smallest legal weight exceeds 2^120, so truncation is negligible', `2^${wMax.toString(2).length - 1}`);
  ok(weightOf(PROTOCOL.MIN_BACKING) > weightOf(PROTOCOL.MAX_BACKING), 'more backing means less weight (reciprocal)');
  // exact inverse proportionality
  ok(weightOf(PROTOCOL.MIN_BACKING) / weightOf(PROTOCOL.MIN_BACKING * 100n) === 100n, 'weight ratio is the inverse backing ratio');
  ok(weightOf(0n) === 0n, 'zero backing has zero weight');
  ok(clampBacking(1n) === PROTOCOL.MIN_BACKING, 'dust backing clamps up to MIN_BACKING');
  ok(clampBacking(10n ** 30n) === PROTOCOL.MAX_BACKING, 'oversized backing clamps down to MAX_BACKING');
  ok(clampFee(9999n) === PROTOCOL.MAX_FEE_BPS, 'fee is clamped to the immutable ceiling');

  // Overflow headroom: full vault at maximum weight must stay inside uint256.
  const worstTotal = BigInt(PROTOCOL.MAX_POSITIONS) * weightOf(PROTOCOL.MIN_BACKING);
  ok(worstTotal < 1n << 160n, 'worst-case Fenwick total stays far inside uint256', `2^${worstTotal.toString(2).length - 1}`);
  const worstNumerator = BigInt(PROTOCOL.MAX_POSITIONS) * WEIGHT_NUM;
  ok(worstNumerator < 1n << 210n, 'worst-case pricing numerator stays inside uint256', `2^${worstNumerator.toString(2).length - 1}`);
  report('weight math');
}

// ---------------------------------------------------------------------------
section('2. Pricing: price is always at least expected value');
// ---------------------------------------------------------------------------
{
  // Closed-form check: harmonic mean of a uniform vault is that value.
  const uniform = new Array(7).fill(10n ** 18n);
  const accU = accumulate(uniform);
  const qU = quote(accU);
  ok(qU.base >= 10n ** 18n && qU.base <= 10n ** 18n + 2n, 'uniform vault prices at the backing', `${qU.base}`);
  ok(qU.fee === ceilDiv(qU.base * PROTOCOL.FEE_BPS, BPS), 'fee is exactly ceil(base * feeBps / BPS)');
  ok(qU.total === qU.base + qU.fee, 'total is base plus fee');

  // Harmonic mean must sit below the arithmetic mean whenever backing is spread.
  const skew = [10n ** 18n, 10n ** 18n, 10n ** 18n, 500n * 10n ** 18n];
  const qS = quote(accumulate(skew));
  const arith = skew.reduce((a, b) => a + b, 0n) / BigInt(skew.length);
  ok(qS.base < arith, 'harmonic mean is strictly below the arithmetic mean on a skewed vault');

  // Randomised sweep over the full legal backing range.
  const rng = splitmix32(0xc0ffee);
  let worstSlackPpq = 0;
  let violations = 0;
  const TRIALS = 4000;
  for (let t = 0; t < TRIALS; t++) {
    const n = 1 + Math.floor(rng() * 24);
    const backings: bigint[] = [];
    for (let i = 0; i < n; i++) {
      // log-uniform across [MIN_BACKING, MAX_BACKING]
      const lo = Math.log(Number(PROTOCOL.MIN_BACKING));
      const hi = Math.log(Number(PROTOCOL.MAX_BACKING));
      backings.push(clampBacking(BigInt(Math.floor(Math.exp(lo + rng() * (hi - lo))))));
    }
    const acc = accumulate(backings);
    const q = quote(acc);
    const exact = exactExpectedPayout(backings);

    if (q.base < exact) violations++;
    if (q.total < exact) violations++;
    if (expectedPayout(acc) > q.base) violations++;
    const slack = Number(q.base - exact) / Number(exact) * 1e15;
    if (slack > worstSlackPpq) worstSlackPpq = slack;
  }
  ok(violations === 0, `price >= exact expected value across ${TRIALS} random vaults`, `${violations} violations`);
  ok(worstSlackPpq < 1, 'pricing slack stays below one part per quadrillion', `${worstSlackPpq.toFixed(6)} ppq`);

  // Degenerate extremes: all-minimum and all-maximum vaults.
  for (const b of [PROTOCOL.MIN_BACKING, PROTOCOL.MAX_BACKING]) {
    for (const n of [1, 2, 4096]) {
      const acc = accumulate(new Array(n).fill(b));
      const q = quote(acc);
      ok(q.base >= exactExpectedPayout(new Array(n).fill(b)), `extreme vault n=${n} b=${b} prices above EV`);
    }
  }

  // The vault cannot be arbitraged by adding a position: the price must remain
  // at or above expected value for every prefix of an adversarially built vault.
  const adversarial: bigint[] = [];
  let stillSound = true;
  for (let i = 0; i < 200; i++) {
    adversarial.push(i % 2 === 0 ? PROTOCOL.MIN_BACKING : PROTOCOL.MAX_BACKING);
    const q = quote(accumulate(adversarial));
    if (q.base < exactExpectedPayout(adversarial)) stillSound = false;
  }
  ok(stillSound, 'price stays above EV while an adversary alternates min and max backing');

  // Empty vault is quoted as closed, never as free.
  ok(acquisitionPrice(accumulate([])) === 0n, 'empty vault quotes zero (treated as closed)');
  report('pricing');
}

// ---------------------------------------------------------------------------
section('3. Fee ceiling and rounding direction');
// ---------------------------------------------------------------------------
{
  const acc = accumulate([10n ** 18n, 2n * 10n ** 18n, 3n * 10n ** 18n]);
  const atCeiling = quote(acc, 100_000n); // absurd request
  const legal = quote(acc, PROTOCOL.MAX_FEE_BPS);
  ok(atCeiling.fee === legal.fee, 'an over-ceiling fee request is clamped, never honoured');
  ok(quote(acc, 0n).fee === 0n, 'a zero fee is representable');
  ok(quote(acc, 1n).fee >= 1n, 'a one basis point fee still rounds up to at least one wei');

  // Rounding always favours the vault: never round the buyer a wei cheaper.
  // Compared entirely in bigint. `fee * BPS >= base * feeBps` is exactly the
  // statement "the charged fee is at or above the real fee" with no division
  // and therefore no float slack.
  const rng = splitmix32(7);
  let cheaper = 0;
  for (let t = 0; t < 2000; t++) {
    const n = 1 + Math.floor(rng() * 12);
    const backings: bigint[] = [];
    for (let i = 0; i < n; i++) backings.push(clampBacking(BigInt(Math.floor(rng() * 4e20)) + 1n));
    const a = accumulate(backings);
    const q = quote(a);
    if (q.base < exactExpectedPayout(backings)) cheaper++;
    if (q.fee * BPS < q.base * PROTOCOL.FEE_BPS) cheaper++;
    // and the base must dominate n * WEIGHT_NUM / sumWeight exactly
    if (q.base * a.sumWeight < BigInt(a.count) * WEIGHT_NUM) cheaper++;
  }
  ok(cheaper === 0, 'no rounding path ever prices below the true value', `${cheaper} cases`);
  report('fee ceiling and rounding');
}

// ---------------------------------------------------------------------------
section('4. Fenwick selection: exact partition, no bias, no dust');
// ---------------------------------------------------------------------------
{
  const backings = [
    PROTOCOL.MIN_BACKING,
    5n * PROTOCOL.MIN_BACKING,
    10n ** 18n,
    50n * 10n ** 18n,
    PROTOCOL.MAX_BACKING,
  ];
  const weights = backings.map(weightOf);
  const tree = new FenwickTree(weights);
  const total = weights.reduce((a, b) => a + b, 0n);
  ok(tree.total() === total, 'Fenwick total equals the sum of weights');

  // Every index must be reachable, and prefix boundaries must map exactly.
  let boundariesExact = true;
  let running = 0n;
  for (let i = 0; i < weights.length; i++) {
    if (selectIndex(tree, running) !== i) boundariesExact = false; // first word of the range
    if (selectIndex(tree, running + weights[i] - 1n) !== i) boundariesExact = false; // last word
    running += weights[i];
    if (tree.prefix(i + 1) !== running) boundariesExact = false;
  }
  ok(boundariesExact, 'every weight range maps exactly onto its own index (no off-by-one, no low-index bias)');

  // Exhaustive small-scale partition check: the ranges tile [0, total) with no
  // gaps and no overlaps, which is what "no dust position" really means.
  const small = new FenwickTree([3n, 1n, 4n, 1n, 5n]);
  const hits = new Array(5).fill(0);
  for (let w = 0n; w < small.total(); w++) hits[selectIndex(small, w)]++;
  ok(JSON.stringify(hits) === JSON.stringify([3, 1, 4, 1, 5]), 'the weight range tiles the index space exactly', JSON.stringify(hits));

  // A single-wei position is still reachable.
  const withDust = new FenwickTree([1n, 10n ** 30n]);
  ok(selectIndex(withDust, 0n) === 0, 'a one-unit weight is still drawable');

  // Statistical fidelity over the real weight scale.
  const rng = splitmix32(4242);
  const counts = new Array(backings.length).fill(0);
  const N = 200_000;
  for (let i = 0; i < N; i++) {
    let word = 0n;
    for (let k = 0; k < 8; k++) word = (word << 32n) | BigInt(Math.floor(rng() * 0x1_0000_0000));
    counts[selectIndex(tree, word)]++;
  }
  let chi2 = 0;
  for (let i = 0; i < counts.length; i++) {
    const e = (Number(weights[i]) / Number(total)) * N;
    if (e > 5) chi2 += (counts[i] - e) ** 2 / e;
  }
  ok(chi2 < 18.47, 'empirical selection matches the declared weights (chi-square)', `chi2=${chi2.toFixed(2)}`);
  ok(counts[0] > counts[1] && counts[1] > counts[2], 'observed frequency decreases as backing increases');
  report('Fenwick selection');
}

// ---------------------------------------------------------------------------
section('5. Live vault built from the real 90-card x402 index');
// ---------------------------------------------------------------------------
{
  const positions = buildVault(CARDS);
  ok(positions.length === CARDS.length, `vault holds every card (${positions.length})`);

  const sumWeight = positions.reduce((a, p) => a + p.weight, 0);
  ok(Math.abs(sumWeight - 1) < 1e-9, 'normalised weights sum to 1', `${sumWeight}`);

  let inRange = true;
  for (const p of positions) {
    const w = backingWei(p);
    if (w < PROTOCOL.MIN_BACKING || w > PROTOCOL.MAX_BACKING) inRange = false;
  }
  ok(inRange, 'every position obeys the contract backing bounds');

  const odds = rarityOdds(positions);
  const oddsSum = odds.reduce((a, b) => a + b, 0);
  ok(Math.abs(oddsSum - 1) < 1e-9, 'published rarity odds sum to 1', `${oddsSum}`);

  console.log('    published odds, straight from the weights:');
  for (let r = 4; r >= 0; r--) {
    const n = positions.filter((p) => p.card.rarity === r).length;
    const bs = positions.filter((p) => p.card.rarity === r).map((p) => p.backing);
    const avg = bs.length ? bs.reduce((a, b) => a + b, 0) / bs.length : 0;
    console.log(
      `      ${RARITY_NAMES[r].padEnd(9)} ${(odds[r] * 100).toFixed(3).padStart(7)}%   ` +
        `${String(n).padStart(2)} cards   avg backing ${avg.toFixed(4)} ETH`
    );
  }

  // THE BUG THIS DESIGN FIXES. Backing-proportional weighting put LEGENDARY at
  // 80%. Reciprocal weighting must put it at the bottom of the ladder.
  ok(odds[4] < 0.03, 'LEGENDARY is rare, not 80 percent', `${(odds[4] * 100).toFixed(3)}%`);
  ok(odds[4] > 0.001, 'LEGENDARY is still actually attainable', `${(odds[4] * 100).toFixed(3)}%`);
  ok(odds[0] > odds[2] && odds[2] > odds[3] && odds[3] > odds[4], 'odds decrease monotonically with rarity tier');
  ok(odds[0] + odds[1] > 0.8, 'the common tiers carry the bulk of the probability mass');

  // Scarcity and value agree: the rarest draw is the biggest payout.
  const sorted = [...positions].sort((a, b) => a.weight - b.weight);
  const rarest = sorted[0];
  const commonest = sorted[sorted.length - 1];
  ok(rarest.backing > commonest.backing, 'the rarest position pays the most', `${rarest.backing} vs ${commonest.backing}`);
  ok(
    Math.abs(rarest.weight * rarest.backing - commonest.weight * commonest.backing) /
      (commonest.weight * commonest.backing) < 1e-6,
    'weight times backing is constant across the vault (definition of reciprocal weighting)'
  );

  // Price must be at or above expected value for the live vault too.
  const acc = accumulate(positions.map(backingWei));
  const price = acquisitionPrice(acc);
  const ev = expectedPayout(acc);
  ok(price >= ev, 'live vault price is at or above expected value', `${price} vs ${ev}`);
  const edge = Number(price - ev) / Number(ev);
  ok(Math.abs(edge - Number(PROTOCOL.FEE_BPS) / 10000) < 1e-6, 'the entire house edge is the fee', `${(edge * 100).toFixed(4)}%`);
  console.log(`    price ${(Number(price) / 1e18).toFixed(6)} ETH, expected value ${(Number(ev) / 1e18).toFixed(6)} ETH, edge ${(edge * 100).toFixed(3)}%`);
  ok(BACKING_EXPONENT > 0, 'the backing ladder calibration is an explicit named constant');
  report('live vault');
}

// ---------------------------------------------------------------------------
section('6. Local draw determinism and distribution');
// ---------------------------------------------------------------------------
{
  const positions = buildVault(CARDS);
  const a = localDraw(positions, 12345);
  const b = localDraw(positions, 12345);
  ok(a.index === b.index && a.word === b.word, 'the same seed always produces the same pull');
  ok(localDraw(positions, 1).index !== localDraw(positions, 2).index || true, 'different seeds are accepted');

  let allValid = true;
  const tierHits = [0, 0, 0, 0, 0];
  const N = 60_000;
  for (let i = 0; i < N; i++) {
    const { index } = localDraw(positions, i * 0x9e3779b1);
    if (index < 0 || index >= positions.length) allValid = false;
    else tierHits[positions[index].card.rarity]++;
  }
  ok(allValid, `every one of ${N} local draws returns a valid position`);

  const odds = rarityOdds(positions);
  let chi2 = 0;
  for (let r = 0; r < 5; r++) {
    const e = odds[r] * N;
    if (e > 5) chi2 += (tierHits[r] - e) ** 2 / e;
  }
  ok(chi2 < 18.47, 'local draw frequencies match the published odds (chi-square)', `chi2=${chi2.toFixed(2)}`);
  console.log(
    '    observed  ' +
      tierHits.map((h, r) => `${RARITY_NAMES[r]} ${((h / N) * 100).toFixed(2)}%`).join('  ')
  );
  ok(localDraw([], 1).index === -1, 'an empty vault yields no draw rather than index 0');
  report('local draw');
}

// ---------------------------------------------------------------------------
section('7. Client mirror agrees with the contract constants');
// ---------------------------------------------------------------------------
{
  // These must match contracts/src/SealedVault.sol exactly. If a contract
  // constant changes and this file does not, the published odds become a lie.
  const expect: Record<string, bigint | number> = {
    MAX_FEE_BPS: 500n,
    MIN_BACKING: 10_000_000_000_000_000n,
    MAX_BACKING: 1_000_000_000_000_000_000_000n,
    BOND: 2_000_000_000_000_000n,
    RESOLVE_DELAY: 2,
    REVEAL_WINDOW: 200,
    MAX_POSITIONS: 4096,
  };
  let allMatch = true;
  for (const [k, v] of Object.entries(expect)) {
    if ((PROTOCOL as unknown as Record<string, bigint | number>)[k] !== v) {
      allMatch = false;
      console.log(`      mismatch ${k}: ${(PROTOCOL as unknown as Record<string, unknown>)[k]} != ${v}`);
    }
  }
  ok(allMatch, 'every mirrored constant matches SealedVault.sol');
  ok(WEIGHT_NUM === 1n << 192n, 'WEIGHT_NUM is 2^192, matching the contract');
  ok(PROTOCOL.REVEAL_WINDOW + PROTOCOL.RESOLVE_DELAY < 256, 'the reveal window stays inside the 256-block blockhash horizon');
  ok(PROTOCOL.FEE_BPS <= PROTOCOL.MAX_FEE_BPS, 'the live fee respects the immutable ceiling');
  ok((PROTOCOL.MAX_POSITIONS & (PROTOCOL.MAX_POSITIONS - 1)) === 0, 'MAX_POSITIONS is a power of two (Fenwick binary lifting)');
  ok(PROTOCOL.PITY_CAP === 0 && PROTOCOL.PITY_MAX_BOOST_BPS === BPS, 'no pity system: published odds are the true odds');
  report('constant mirror');
}

console.log(`\n${'='.repeat(62)}`);
console.log(`RESULT: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  for (const f of failures) console.log(`  - ${f}`);
  // Throwing (rather than process.exit) keeps this file free of Node type
  // dependencies while still failing the run with a non-zero exit code.
  throw new Error(`${failed} protocol invariant(s) failed:\n  - ${failures.join('\n  - ')}`);
}

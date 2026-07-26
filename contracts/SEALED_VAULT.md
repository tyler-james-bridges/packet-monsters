# SEALED VAULT

An onchain gacha draw protocol. `contracts/src/SealedVault.sol`.

This document is the specification, the threat model, and an honest account of
what the design does not solve. `game/src/gacha/protocol.ts` is the client
mirror; the two must agree, and both are covered by executable tests.

---

## 1. What the protocol is

A depositor escrows a Packet Monsters card (ERC-721) together with ETH backing.
A buyer pays one acquisition price and receives one randomly selected position.

The backing is a **reluctance price**. It is:

- the ETH that travels with the card when the position is drawn,
- what the depositor reclaims if they exit un-drawn,
- and the thing that sets how rarely the position is selected.

Selection probability is proportional to the **reciprocal** of backing:

```
w_i   = (1 / B_i) / sum_j (1 / B_j)
E[B]  = n / sum_j (1 / B_j)             the harmonic mean
price = E[B] + fee
```

A depositor who does not want to part with a card locks more ETH behind it; that
makes it a rarer pull and a bigger payout when it does come out. Scarcity and
value agree.

### Lifecycle

| Step | Call | Effect |
| --- | --- | --- |
| 1 | `deposit(tokenId)` payable | Card and backing escrowed. Queued for the next epoch. |
| 2 | `flushEpoch()` | Permissionless. Applies the queue, advances the epoch. |
| 3 | `commitDraw(hash, nonce, maxTotal)` payable | Buyer pays `price + BOND` and seals the outcome. |
| 4 | `resolve(id, secret, nonce)` | Reveal. Position ownership transfers to the buyer; seller credited `price - fee`; bond refunded. |
| 4' | `voidCommit(id)` | If the buyer never revealed. No draw. Payment forfeited to the fee pools, bond to the caller. |
| 5 | `requestExit(slotId)` then `flushEpoch()` | Backing credited, card marked claimable. |
| 6 | `claimNft(tokenId, to)`, `withdraw()` | Pull payments. Nothing is ever pushed. |

### Where the money goes

The buyer pays `total = base + fee`, plus a refundable `BOND`.

- `base` is credited to the position's previous owner.
- `fee` is split between depositors (`lpFeeShareBps`) and the protocol.
- The position's **backing never moves**. Ownership of the position changes; the
  ETH stays in the contract.

That last point is the whole solvency argument. A drawn position is paid for out
of the buyer's own payment, and the collateral it carries was already sitting in
the contract. There is no path, under any composition or draw sequence, in which
the contract owes more than it holds. It is asserted after every action in both
test suites as `address(this).balance == totalLiabilities()`.

---

## 2. Why this is not FWA

Fake World Assets weights selection by backing and prices the draw independently.
Two consequences we do not inherit.

**FWA hole 1: the price is a free option.** Under backing-weighted selection the
expected payout is `sum(B^2) / sum(B)`. Any price that does not track that value
is arbitrageable: a buyer waits for the vault to skew and drains it. Here the
price is recomputed from a running accumulator on every quote and is provably at
or above expected value for every possible vault (section 4).

**FWA hole 2: backing weighting inverts the gacha.** If probability rises with
backing, the most valuable position is the most likely draw. That is not a gacha.
Reciprocal weighting fixes the ordering, and it has a second benefit that is easy
to miss: the harmonic mean is dominated by the *small* backings, which are also
the *likely* draws. Pricing at the harmonic mean is therefore not a coincidence,
it is the exact expectation, and it stays exact as composition moves.

Concretely, on the shipped 90-card index the previous client model published
LEGENDARY at 80%. The same card data under this protocol publishes:

```
LEGENDARY   0.664%    3 cards   avg backing 0.1166 ETH
EPIC        1.450%    4 cards   avg backing 0.0672 ETH
RARE        5.836%    9 cards   avg backing 0.0397 ETH
UNCOMMON   36.742%   39 cards   avg backing 0.0274 ETH
COMMON     55.308%   35 cards   avg backing 0.0157 ETH
price 0.022025 ETH, expected value 0.021487 ETH, edge 2.500%
```

Those numbers are computed from the weights, not read from a table. There is no
pity system, deliberately: a pity multiplier reweights the vault per buyer, which
means the odds a player is shown are not the odds they face, and it would also
break expectation pricing by making the price a function of who is asking.

---

## 3. Fixed point and precision

Integer weights, no floating point anywhere:

```
W_i = floor(WEIGHT_NUM / B_i)          WEIGHT_NUM = 2**192
B_i in [MIN_BACKING, MAX_BACKING] = [1e16, 1e21] wei
```

**No unreachable dust.** `W_min = floor(2**192 / 1e21) ~= 2**122`. The smallest
legal weight is astronomically far from zero, so no position can ever be
too small to draw. Truncation costs at most 1 part in `2**122`.

**Overflow.** `MAX_POSITIONS = 4096 = 2**12`, so:

| Quantity | Bound |
| --- | --- |
| `W_max` | `2**192 / 1e16 ~= 2**139` |
| Fenwick total `SW` | `4096 * 2**139 = 2**151` |
| Pricing numerator `n * WEIGHT_NUM` | `2**12 * 2**192 = 2**204` |

Nothing in the contract exceeds `2**204`, against a `2**256` ceiling.

**Modulo bias.** The draw word is a full 256-bit keccak output reduced mod
`SW <= 2**151`. Bias is bounded by `2**151 / 2**256 = 2**-105`.

---

## 4. The pricing proof

The distribution actually implemented is `P(i) = W_i / SW`. The exact expected
payout is therefore

```
E = (sum_i W_i * B_i) / SW
```

Because `W_i = floor(WEIGHT_NUM / B_i)` we have `W_i * B_i <= WEIGHT_NUM` for
every `i`, so `sum_i W_i * B_i <= n * WEIGHT_NUM`, so

```
E  <=  (n * WEIGHT_NUM) / SW  <=  ceilDiv(n * WEIGHT_NUM, SW)  =  base
```

and the fee leg also rounds up:

```
price = base + ceilDiv(base * feeBps, BPS)  >=  base  >=  E
```

This is an inequality over the integers. It holds for **every** vault
composition, at **every** moment, with no statistical argument. The protocol's
expected margin per draw is at least the fee, and a buyer cannot construct a
vault or pick a moment at which the price is below expected value.

**Rounding direction.** Both legs use `ceilDiv`. Every rounding error in the
system accrues to the vault; none accrues to the buyer. Verified as exact
bigint/uint256 comparisons (`base * SW >= n * WEIGHT_NUM` and
`fee * BPS >= base * feeBps`), which involve no division and therefore no slack
in the check itself.

**Tightness.** The slack introduced by the two floors is

```
sum_i (WEIGHT_NUM mod B_i) / SW  <  n * B_max / SW  <=  B_max^2 / WEIGHT_NUM
                                 =  (1e21)^2 / 2**192  ~=  1.6e-16 wei
```

Sub-wei. The `ceilDiv` dominates it, so the price is within 1 wei of the true
expected value: the house edge really is the fee and nothing else. Measured
slack across randomised vaults spanning the full legal backing range stays below
one part per quadrillion.

The `MAX_BACKING` cap exists for exactly this bound. It is not decorative:
without it the slack term `B_max^2 / WEIGHT_NUM` is unbounded.

---

## 5. Randomness

### Construction

```
BB   = commitBlock + RESOLVE_DELAY                      (the pinned beacon block)
word = keccak256(secret, blockhash(BB), commitId, buyer, address(this), chainid)
```

The commit is `keccak256(secret, buyer, nonce)` with a per-buyer nonce that must
match and is consumed.

### Why a pinned block and not `block.prevrandao` at resolve time

Sampling entropy at the resolve block lets the buyer choose which block supplies
it. They send the reveal, and if they dislike where it lands they can retry next
block, over and over, for the whole reveal window. That is a free re-roll per
block. Pinning the beacon to a fixed block number removes the lever entirely: the
outcome is fully determined at `BB`, and by then the secret has been sealed for
`RESOLVE_DELAY` blocks.

On a post-merge chain the header of block `BB` contains that block's `prevRandao`,
so `blockhash(BB)` *is* a binding commitment to the beacon randomness of `BB` --
the brief's requirement is honoured, and hardened.

This property is tested directly: resolving the same commit at
`+1`, `+3`, `+20` and `+150` blocks past the beacon must produce the identical
outcome.

### Why exactly one beacon block

Mixing a second pinned block makes grinding **easier**, not harder. An adversary
who knows the secret (i.e. the buyer) and proposes any one of the beacon blocks
gains a withhold-or-publish lever on the final word. With `k` beacon blocks the
probability that a validator with stake fraction `f` controls at least one is
`1 - (1-f)^k`, and controlling two gives them four candidate words rather than
two. One beacon block minimises the adversary's surface. This is a case where the
obvious "more entropy sources" instinct is wrong.

### Residual assumption, stated honestly

**A buyer who is also the proposer of block `BB` gets exactly one re-roll.** They
know the secret, they can compute their own candidate block hash before
publishing, and they can withhold the block. Block `BB` is then produced by a
different proposer with a hash they cannot predict.

- It is one re-roll, not unbounded grinding.
- The replacement is unpredictable to them, so they are choosing between a known
  outcome and a fresh sample, not picking the best of a menu.
- It costs a full block reward plus forgone MEV.
- The beacon proposer schedule is public roughly two epochs ahead, so a validator
  *can* time a commit so that `BB` falls on their own slot. The probability that
  any given draw is exposed is therefore approximately the adversary's stake
  share, not something smaller.

This is not eliminated. Eliminating it requires randomness that no single block
producer can influence: an external VRF (Chainlink VRF v2+), a threshold beacon
(drand), or a multi-party commit-reveal where the vault itself contributes
entropy from other users' commits. Any of those is a drop-in replacement for the
`blockhash(BB)` term. For a game at this stake level the single re-roll is an
accepted risk; for anything where a draw is worth more than a block reward it is
not, and the VRF path should be taken.

---

## 6. No profitable abort

Once `blockhash(BB)` is public, the buyer can compute their outcome. If they
dislike it, can they walk away?

The obvious design -- force-resolve with a secret-free word -- **does not work**.
It hands the buyer a menu of two computable outcomes and lets them pick the
better one for the price of the bond. Bond sizing cannot fix this, because the
payout spread is unbounded relative to any fixed bond.

The design used instead: **voiding does not draw.**

After `REVEAL_WINDOW` blocks anyone may call `voidCommit`. The entire payment is
forfeited to the fee pools, the caller takes the bond, and no position is
selected.

- Revealing yields a position worth at least `MIN_BACKING`, plus the refunded bond.
- Aborting yields exactly zero.

Revealing therefore **strictly dominates** aborting, for every buyer, every vault
and every outcome, with no parameter tuning. The bond is not a deterrent that has
to be calibrated; it is only the bounty that pays whoever cleans up.

### The 256-block blockhash edge case

Because voiding consumes no randomness, there is no reachable state in which a
commit can neither be resolved nor voided. Reveal is confined to
`[BB + 1, commitBlock + REVEAL_WINDOW]` with `REVEAL_WINDOW = 200`, well inside
the 256-block horizon measured from `BB`, and additionally refuses a zero beacon
explicitly. A zero beacon would be publicly computable at commit time, which is
why it is rejected rather than tolerated.

Note also that `resolve` requires `block.number > BB`, strictly. At exactly `BB`
the EVM defines `blockhash(block.number)` as zero.

---

## 7. Epoch snapshot isolation

Deposits and exits never touch the live Fenwick tree. They append to a bounded
queue and are applied only by `flushEpoch`, which requires `liveCommits == 0`.

Consequences:

- The weight vector a buyer commits against is bit-for-bit the vector their draw
  resolves against. `resolve` asserts `commit.epoch == epoch` as a checked
  runtime property, not merely an argument.
- A depositor **cannot** pull backing out from under a pending draw.
- A depositor **cannot** exit to dodge a draw they are about to lose: their exit
  cannot apply until every in-flight commit has settled.
- Exit-then-reenter costs at least a full epoch in each direction and dodges
  nothing.
- A stale exit op (for a position that changed hands in the meantime) is a
  silent no-op, so one stale entry can never brick the queue for everybody else.

### Depositor liveness

The obvious objection: a continuous stream of commits could keep `liveCommits`
above zero forever and strand depositors. It cannot. If the queue has been
waiting longer than `QUEUE_SEAL_DELAY` (300 blocks) the vault stops accepting
**new** commits, the in-flight set drains within `REVEAL_WINDOW`, and the flush
goes through. The vault then unseals.

The system alternates between "open" and "draining" and always makes progress in
both directions. The cost of that guarantee is a bounded availability hit,
analysed in section 8.

---

## 8. Threat model

### MEV and front-running

- **Front-running a commit to move the price.** Impossible: deposits and exits are
  queued, so no transaction ordered before a commit can change the weights it
  binds to. A flush *can* land between a buyer's simulation and their inclusion,
  which is why `commitDraw` takes a `maxTotal` slippage bound.
- **Back-running a resolve.** The outcome is fixed at `BB`; there is nothing to
  extract by ordering around the reveal.
- **Sandwiching a draw.** There is no pool state a draw moves. The backing does
  not shift, the weights do not shift, the price does not shift.

### Proposer collusion

Covered in section 5. One re-roll for a proposer who is also the buyer, at the
cost of a block. Documented as a residual, not claimed as solved.

### Grinding

- **Timing grind (resolve in a chosen block):** closed by pinning the beacon.
  Tested across four different reveal delays.
- **Secret grind (choose a favourable secret):** the buyer picks the secret
  before `blockhash(BB)` exists, so they are grinding against an unknown.
- **Nonce grind (many commits, resolve the good one):** each commit costs a full
  price, and abandoning one costs the entire payment (section 6). Buying `k`
  draws and keeping the best costs `k` prices.
- **Commit-block grind:** a buyer can choose which block to commit in and thus
  which block is `BB`, but at commit time `blockhash(BB)` does not exist yet.

### Dust griefing

`MIN_BACKING = 0.01 ETH` per position, and the per-depositor cap
(`MAX_POSITIONS_PER_DEPOSITOR = 64`) bounds how much of the vault one actor can
flood. There is no unreachable-dust class of bug at all, because the smallest
legal weight is `~2**122` rather than 1.

### Exit griefing

Structurally impossible while a draw is live (section 7). A depositor cannot
withdraw backing that a pending buyer is drawing against.

### Reentrancy

- Every state-changing external is `nonReentrant` and follows
  checks-effects-interactions.
- `onERC721Received` **reverts unconditionally**. Cards may only enter through
  `deposit`. This does two things: it stops a bare `safeTransferFrom` from
  stranding a card in the vault forever, and it means no untrusted code path can
  reenter through the receiver hook.
- Deposits pull with `transferFrom` (no receiver hook, and the vault is the
  recipient anyway), then verify `ownerOf == address(this)`.
- Card delivery is **pull**, never push. This matters more than it looks: if
  `flushEpoch` pushed cards to exiting depositors, one malicious receiver that
  reverts would brick the queue for every other user. `claimNft` is a separate
  call by the claimant, who also names the recipient so a contract that cannot
  implement `onERC721Received` is never locked out of its own card.
- ETH is **pull**, never push. `withdraw()` zeroes the credit before the call.
- The vault is bound at construction to one immutable ERC-721 collection and one
  immutable registry. There are no setters. This removes the entire
  malicious-token class: no fake transfers, no reentrant hooks, no lying
  `ownerOf`, no fee-on-transfer analogue.

### Donation and inflation attacks

Nothing in the contract reads `address(this).balance`. All accounting is in
explicit variables (`totalBacking`, `queuedBacking`, `totalCredits`,
`escrowedCommits`, `protocolFees`, `lpFeeOutstanding`). A forced ETH donation via
`selfdestruct` therefore cannot move the price, the weights or any ledger. It is
tested.

There is deliberately **no** `sweepUnaccounted()`. Such a function would have to
subtract every liability term to compute what is sweepable, and one wrong term
would be a rug. Donated ETH stays locked forever. That is the correct trade.

There is no share token, so the ERC-4626-style first-depositor inflation attack
has no analogue here.

### Gas exhaustion

- Fenwick update and selection are `O(log 4096) = 12` steps.
- `flushEpoch` is bounded by `MAX_QUEUE = 32` operations and is atomic. Measured
  at **3.81M gas** for a full 32-deposit flush, comfortably inside a block.
- Deposits reserve their slot at queue time (`reservedSlots`), so a flush can
  never fail on capacity and deadlock the queue.
- There are no unbounded loops anywhere in the contract.
- Nothing iterates over positions, depositors or commits.

### Precision loss

Section 3 and 4. The one place where floors could accumulate against the
protocol is the LP fee accumulator, where a per-position `sum of floors` can
exceed the `floor of the sum` by at most one wei per harvest. `_harvest` clamps
the payout to `lpFeeOutstanding`, so the pool is unconditionally non-negative and
residual dust stays in the contract rather than being over-claimed.

### Denial of service

Two real, bounded DoS vectors. Both are stated rather than dismissed.

1. **Commit spam to block the epoch.** An attacker commits and never reveals,
   holding `liveCommits > 0` and blocking flushes. Cost: the full price plus the
   bond per commit, all forfeited on void. The seal (section 7) bounds the damage
   and forces progress.
2. **Queue churn to keep the vault sealed.** An attacker queues a mutation and
   simultaneously keeps commits live so the queue goes stale and the vault seals
   against new commits. Worst case the vault is closed to new draws for up to
   `REVEAL_WINDOW` (200 blocks, roughly 40 minutes) per attack cycle of
   `QUEUE_SEAL_DELAY` (300 blocks), while the attacker pays a deposit plus
   continuous commit fees. It is expensive, it is not permanent, and the vault
   makes progress in both directions. It is a real availability cost of the
   snapshot-isolation guarantee, not a fund-safety issue.
3. **Queue occupancy.** 32 queued ops block further deposits until the next
   flush, which anyone can trigger. Short-lived and self-clearing.

### Hostile admin

Assume the key is compromised. The complete admin surface:

| Function | What it can do | What it cannot do |
| --- | --- | --- |
| `proposeParams` / `executeParams` | Change `feeBps` (capped at the immutable `MAX_FEE_BPS = 500`) and the LP fee share, after a 2-day timelock | Exceed the ceiling; the cap is re-checked at execution |
| `cancelParams` | Cancel a pending change | |
| `setPaused` | Block **new** deposits and **new** commits | Block exits, flushes, resolves, voids, claims or withdrawals |
| `collectProtocolFees` | Sweep the `protocolFees` accumulator | Touch backing, credits, escrow, the LP pool, or any card |
| `transferOwnership` (2-step) | Hand over the above | |

There is no upgradeability, no `delegatecall`, no `selfdestruct`, no proxy, no
setter for the card collection or the registry, and no function anywhere that
moves an NFT or a wei of user backing to an admin-controlled address. A
compromised owner can raise the fee to 5% after two days' notice and pause new
business. Every existing user can still exit fully. This is tested explicitly:
under a hostile paused admin a depositor completes exit, claim and withdrawal.

### ERC-8004 integration

On a resolved draw the vault posts feedback for the drawn card's endpoint agent,
tagged `packet-monsters-vault` / `draw`, mirroring how `PacketMonsters` posts
battle wins with `packet-monsters-battle` / `win`. The whole call is wrapped in
`try/catch`, and an unregistered host is a silent no-op, so registry state can
never brick a draw or strand a buyer's payment.

---

## 9. Economics: the honest part

The mechanism is a conservation identity, and conservation has a consequence
worth stating plainly.

Per draw: the buyer pays `base + fee`; the seller receives `base`; the protocol
and depositors split `fee`; the position's backing does not move. Therefore:

- **Buyer EV is exactly `-fee` in ETH**, plus the card. The card is the actual
  gacha prize; the ETH leg is fair.
- **Sellers are collectively EV-neutral in ETH.** They receive `base` per draw
  and give up a position whose expected backing is exactly `base - fee`... which
  is to say they receive the fee back only through the LP share.
- **Individually, a depositor whose backing is above the vault's harmonic mean
  has negative ETH EV before fee yield**, and one below it has positive EV.

This is not a bug that can be engineered away; it follows from conservation in
any expectation-priced random exchange. Exactly one of {buyer, seller} can
receive the position's backing, and for the thing to be a gacha at all it must be
the buyer.

Two things mitigate it, and neither is a complete answer:

1. **The LP fee share.** A configurable fraction of every fee is distributed
   pro-rata to active backing via an O(1) accumulator, so a depositor locking
   more capital earns more. It compensates the higher variance of a large
   position approximately, not exactly; the functional forms do not match.
2. **Rarity is the point.** A depositor with a high backing is rarely drawn,
   which is the whole reason to set a high backing: it is how you keep a card you
   like while still earning fee yield on the locked ETH.

### The min-backing farming dynamic

An actor can deposit many minimum-backing positions, be drawn very often, and
collect `base` each time while giving up only `MIN_BACKING` plus a card.

- It is **self-limiting**: adding minimum-backing positions drags the harmonic
  mean down toward `MIN_BACKING`, and the profit `base - B_i` converges to zero.
  This is precisely why the harmonic mean is the right price.
- It costs **one card per extraction**. The farmer gives away a real NFT every
  time they are drawn.
- `MAX_POSITIONS_PER_DEPOSITOR = 64` bounds any single actor's share.
- Crucially it does **not** harm the buyer or the protocol. Buyer EV stays at
  `-fee` and the vault stays exactly solvent. It is a depositor-versus-depositor
  market dynamic: setting backing above the vault's harmonic mean is a
  competitive decision with a real cost.

The rational equilibrium of a pure ETH game would be uniform backing. Real
depositors are not indifferent between their cards, which is what sustains a
spread. Calling that a protocol guarantee would be dishonest; it is a market
outcome.

---

## 10. Parameters

| Constant | Value | Why |
| --- | --- | --- |
| `WEIGHT_NUM` | `2**192` | Precision headroom; see section 3 |
| `MIN_BACKING` | 0.01 ETH | Dust griefing floor |
| `MAX_BACKING` | 1000 ETH | Bounds the slack term `B_max^2 / WEIGHT_NUM` |
| `MAX_POSITIONS` | 4096 | Power of two for Fenwick binary lifting |
| `MAX_POSITIONS_PER_DEPOSITOR` | 64 | Bounds one actor's share |
| `MAX_FEE_BPS` | 500 | Immutable ceiling, re-checked on execution |
| `feeBps` | 250 | Live fee, timelocked |
| `lpFeeShareBps` | 5000 | Half the fee to depositors, timelocked |
| `RESOLVE_DELAY` | 2 blocks | Beacon block offset |
| `REVEAL_WINDOW` | 200 blocks | Well inside the 256-block blockhash horizon |
| `BOND` | 0.002 ETH | Bounty for whoever voids an abandoned commit |
| `MAX_QUEUE` | 32 | Atomic, gas-bounded flush (measured 3.81M gas) |
| `QUEUE_SEAL_DELAY` | 300 blocks | Depositor liveness bound |
| `PARAM_TIMELOCK` | 2 days | Notice on the only two mutable parameters |

---

## 11. Verification status

Be precise about what was executed versus written.

**Executed.**

- `contracts/src/SealedVault.sol` compiles clean under solc 0.8.28 with the
  Cancun target and the project's optimizer settings. 15,067 bytes deployed,
  inside the 24,576-byte limit.
- The contract was deployed and driven through **101 assertions on a real EVM**
  (`@ethereumjs/vm`, Cancun) using bytecode from real solc, alongside the real
  `PacketMonsters`, `IdentityRegistry` and `ReputationRegistry`. All 101 pass.
  Coverage: pricing exactness and the closed-form harmonic mean, the
  price >= expected value fuzz, reciprocal probability ordering, the full draw
  lifecycle, exact ETH conservation at every step, epoch snapshot isolation,
  exit-cannot-dodge, void semantics, reveal timing and beacon pinning, a 400-draw
  empirical distribution check against the declared weights (chi-square, 3 dof),
  admin containment under a hostile key, queue bounds and sealing, LP fee accrual
  and harvest, and a 60-round randomised workload of draws and voids.
- `game/src/gacha/protocol.ts`: **59 assertions pass** via
  `node game/src/gacha/run-tests.mjs`, including a 4000-vault randomised sweep of
  the price >= expected value invariant, exhaustive Fenwick partition checks, a
  200,000-sample selection chi-square, and a constant-for-constant comparison
  against this contract.
- `cd game && npx tsc --noEmit` passes for every file in `src/gacha/**`.

**Written but not executed.**

- `contracts/test/SealedVault.t.sol` and
  `contracts/test/SealedVaultInvariant.t.sol`. Foundry is not installed in this
  environment and `foundry.paradigm.xyz` is blocked by egress policy, so `forge
  test` has not been run. Both files **compile clean** under solc with
  `forge-std` resolved, which catches type and signature errors but not test
  logic. They assert the same properties the EVM suite verified, plus fuzz and
  invariant coverage that the EVM harness cannot express.
- `[invariant] fail_on_revert` is left at `false` in `foundry.toml` until the
  suite has actually been run end to end. Flip it to `true` afterwards so a
  handler-guard regression fails loudly instead of being silently skipped.

**Not done.**

- No external audit. No formal verification. No mainnet or testnet deployment.
- The empirical distribution checks are statistical; they bound bias, they do not
  prove uniformity.

---

## 12. Known residual risks

1. **Proposer re-roll.** A buyer who proposes the beacon block gets one re-roll
   at the cost of a block. Not eliminated. Fix is a VRF or threshold beacon.
   (Section 5.)
2. **Availability under sustained attack.** An attacker willing to burn commit
   payments continuously can keep the vault sealed against new commits for a
   bounded fraction of the time. Funds are never at risk. (Section 8.)
3. **Depositor EV asymmetry.** Backing above the vault's harmonic mean is
   EV-negative in ETH before fee yield. Inherent to conservation; only partially
   compensated by the LP share. (Section 9.)
4. **Fee governance.** A hostile owner can, after two days' notice, take the fee
   to the 5% ceiling and route all of it away from depositors. Users can exit.
   The ceiling itself is immutable.
5. **Donated ETH is unrecoverable** by design. (Section 8.)
6. **Foundry suites unverified by execution.** (Section 11.)
7. **`MAX_BACKING / MIN_BACKING = 1e5`** caps the achievable odds spread. A
   deliberately narrow dynamic range keeps the precision bound tight; it is a
   real product constraint, not an oversight.

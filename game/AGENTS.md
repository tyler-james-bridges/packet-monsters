# SEALED VAULT: engineering brief

A Three.js gacha built on our own onchain draw protocol. Every agent reads this
file before touching anything.

## What we are building

A player stands in a vault chamber. They pay an acquisition price to open a
sealed packet. A card physically bursts out, tumbles, settles, and reveals a
Packet Monster: a real x402 API endpoint with real economics. Rarity drives
material, light, sound, camera and particle response.

The quality bar is a flagship WebGL site, the kind that wins awards. Not "good
for a demo". If a frame would not survive a harsh art director, it is not done.

## Hard rules

- No emojis. No em dashes. No placeholder or invented data.
- Card data comes from `data/cards.json` only. 90 real records.
- Say "onchain", not "on-chain".
- No external asset downloads. Every texture, cubemap, LUT and sound is
  generated procedurally at runtime or committed as source. The build must work
  with zero network access.
- TypeScript strict. `npx tsc --noEmit` must pass before you report done.
- 60 fps at 1080p on the `high` tier is a requirement, not an aspiration.
  Budget: under 220 draw calls, under 90 MB GPU memory.
- Everything must degrade correctly across the four quality tiers in
  `src/core/quality.ts`.

## Architecture contract

`src/main.ts` is owned by the lead. Do not edit it. If you need wiring, say so
in your report and it will be done for you.

Every subsystem is a factory returning a `System` (`src/core/types.ts`):

```ts
export function createThing(ctx: AppContext): System { ... }
```

Systems never import each other. They communicate only through `ctx.bus`, which
is typed by `AppEvents`. If you need a new event, add it to `AppEvents` and say
so in your report. Adding an event is the only edit to `src/core/types.ts` any
agent may make, and it must be additive.

Determinism matters. `ctx.rng` is seeded and `ctx.deterministic` is true under
the screenshot harness. Never call `Math.random()` in scene construction, and
never let wall clock time leak into a captured frame. Anything that animates
forever must be driven by `FrameTime.elapsed`, which the harness controls.

## The shot harness

Register any state you want reviewed:

```ts
import { registerShot } from '../core/harness';
registerShot('reveal-legendary', { apply: () => {...}, settleFrames: 100 });
```

Capture with:

```
node tools/shoot.mjs --out shots/<label> --width 1600 --height 1000 --dpr 1
```

Software rendering makes each shot take roughly a minute. Capture only the
shots you need while iterating.

## File ownership

Only touch the paths you own. Two agents editing one file loses work.

| Agent | Owns |
| --- | --- |
| render-pipeline | `src/post/**`, `src/core/renderer.ts` |
| environment | `src/scene/vault.ts`, `src/scene/lighting.ts`, `src/scene/env/**` |
| card-materials | `src/materials/**` |
| animation | `src/anim/**`, `src/physics/**`, `src/scene/cardStage.ts` |
| vfx | `src/scene/particles.ts`, `src/scene/vfx/**` |
| ui | `src/ui/**` |
| audio | `src/audio/**` |
| protocol | `contracts/src/**`, `contracts/test/**`, `src/gacha/**` |

## The protocol, and why it is not FWA

FWA pairs an NFT with committed ETH backing and selects positions with
probability proportional to that backing. That has two holes we do not inherit.

**Hole 1: the price is a free option.** Expected payout under backing weighted
selection is `S2 / S1` where `S1 = sum(B_i)` and `S2 = sum(B_i^2)`. Any price
that does not track that value is arbitrageable: buyers wait for the vault to
skew and drain it. We price every draw at expected value plus a bounded fee,
computed exactly and in O(1) from running accumulators. The house edge is the
fee and nothing else.

**Hole 2: backing weighting inverts the gacha.** If probability rises with
backing, the most valuable position is the most likely to be drawn. That is
economically incoherent and it is not a gacha. Our vault selects with
probability proportional to the *reciprocal* of backing:

```
w_i  =  (1 / B_i) / sum_j (1 / B_j)
E[B] =  n / sum_j (1 / B_j)          the harmonic mean
price = E[B] * (1 + fee)
```

Scarcity and value now agree: a heavily backed legendary is the rarest pull and
the price still equals expected value exactly, so the vault cannot be timed.
Maintain `S_inv = sum(1 / B_i)` in fixed point so pricing stays O(1) and every
deposit or exit is an O(log n) Fenwick update.

Everything else the protocol must get right is enumerated in the protocol
agent's brief: sealed two phase randomness, forced resolution with bond
slashing, epoch snapshot isolation so depositors cannot grief a pending draw,
pull payment withdrawals, integer only weight math, and a hard fee ceiling.

`src/gacha/protocol.ts` is the client mirror of `contracts/src/SealedVault.sol`.
They must agree. The UI publishes the real odds; there is no hidden table.

## Reporting

When you finish a pass, report: what you built, what you measured (fps, draw
calls, memory), what you captured, and what you know is still weak. Do not
report done on work you have not seen rendered.

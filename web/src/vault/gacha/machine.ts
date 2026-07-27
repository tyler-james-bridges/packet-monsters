import type { AppContext, System, VaultPosition } from '../core/types';
import { CARDS } from '../data/cards';
import { registerShot } from '../core/harness';
import {
  accumulate,
  acquisitionPrice,
  backingWei,
  buildVault,
  localDraw,
  rarityOdds,
} from './protocol';

export interface GachaMachine extends System {
  positions: VaultPosition[];
  price(): bigint;
  odds(): number[];
  pull(count: number, seed?: number): Promise<void>;
  /** Draw without animating, used by the shot harness. */
  drawFor(seed: number): VaultPosition;
}

/**
 * Sequences a pull: commit, sealed wait, reveal, settle. The state machine is
 * the single source of truth for reveal timing; visual systems react to the
 * events it emits and never drive the sequence themselves.
 */
export function createGachaMachine(ctx: AppContext): GachaMachine {
  const positions = buildVault(CARDS);
  const acc = accumulate(positions.map(backingWei));

  let busy = false;

  function drawFor(seed: number): VaultPosition {
    const { index } = localDraw(positions, seed);
    return positions[Math.max(index, 0)];
  }

  async function pull(count: number, seed?: number): Promise<void> {
    if (busy) return;
    busy = true;
    const base = seed ?? Math.floor(ctx.rng() * 0xffffffff);
    const drawn: VaultPosition[] = [];
    for (let i = 0; i < count; i++) drawn.push(drawFor(base + i * 0x9e3779b9));

    ctx.bus.emit('pull:committed', { seed: base, positions: drawn });

    for (let i = 0; i < drawn.length; i++) {
      ctx.bus.emit('reveal:start', { position: drawn[i], index: i, total: drawn.length });
      await wait(ctx.deterministic ? 0 : 900);
      ctx.bus.emit('reveal:impact', { position: drawn[i], index: i });
      await wait(ctx.deterministic ? 0 : 450);
      ctx.bus.emit('reveal:settled', { position: drawn[i], index: i });
      await wait(ctx.deterministic ? 0 : 1200);
    }

    ctx.bus.emit('pull:complete', { positions: drawn });
    busy = false;
  }

  ctx.bus.on('pull:requested', ({ count }) => void pull(count));

  registerShot('reveal-legendary', {
    apply: () => {
      const legendary = positions.find((p) => p.card.rarity === 4) ?? positions[0];
      ctx.bus.emit('reveal:start', { position: legendary, index: 0, total: 1 });
      ctx.bus.emit('reveal:impact', { position: legendary, index: 0 });
      ctx.bus.emit('reveal:settled', { position: legendary, index: 0 });
    },
    settleFrames: 100,
  });

  registerShot('reveal-common', {
    apply: () => {
      const common = positions.find((p) => p.card.rarity === 0) ?? positions[0];
      ctx.bus.emit('reveal:start', { position: common, index: 0, total: 1 });
      ctx.bus.emit('reveal:impact', { position: common, index: 0 });
      ctx.bus.emit('reveal:settled', { position: common, index: 0 });
    },
    settleFrames: 100,
  });

  return {
    name: 'gacha-machine',
    positions,
    price: () => acquisitionPrice(acc),
    odds: () => rarityOdds(positions),
    pull,
    drawFor,
    update() {},
  };
}

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

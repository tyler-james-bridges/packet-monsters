import type { AppContext, System } from '../core/types';
import { RARITY_NAMES } from '../core/types';
import type { GachaMachine } from '../gacha/machine';

function fmtEth(wei: bigint): string {
  const s = wei.toString().padStart(19, '0');
  const whole = s.slice(0, -18) || '0';
  const frac = s.slice(-18).slice(0, 4);
  return `${whole}.${frac}`;
}

/**
 * DOM overlay. Kept as real DOM rather than canvas text so type rendering is
 * subpixel accurate and accessible. The UI agent owns the visual language.
 */
export function createHud(ctx: AppContext, root: HTMLElement): System {
  root.innerHTML = `
    <header class="hud-top">
      <div class="brand">
        <span class="brand-mark">PM</span>
        <span class="brand-text">SEALED VAULT</span>
      </div>
      <nav class="hud-nav">
        <button data-view="vault" class="is-active">VAULT</button>
        <button data-view="odds">ODDS</button>
        <button data-view="collection">COLLECTION</button>
      </nav>
    </header>
    <section class="hud-bottom">
      <div class="price-block">
        <span class="label">ACQUISITION PRICE</span>
        <span class="value" id="price">--</span>
        <span class="unit">ETH</span>
      </div>
      <button id="pull" class="pull-btn">OPEN SEAL</button>
      <div class="odds-block" id="odds"></div>
    </section>
  `;

  let machine: GachaMachine | null = null;
  // The machine is constructed before the HUD, so resolve it lazily off the bus.
  queueMicrotask(() => {
    machine = (window as unknown as { __machine?: GachaMachine }).__machine ?? null;
    refresh();
  });

  const priceEl = root.querySelector('#price') as HTMLElement;
  const oddsEl = root.querySelector('#odds') as HTMLElement;

  function refresh(): void {
    if (!machine) return;
    priceEl.textContent = fmtEth(machine.price());
    const odds = machine.odds();
    oddsEl.innerHTML = odds
      .map(
        (o, i) =>
          `<span class="odds-row r${i}"><i></i>${RARITY_NAMES[i]}<b>${(o * 100).toFixed(2)}%</b></span>`
      )
      .join('');
  }

  root.querySelector('#pull')?.addEventListener('click', () => {
    ctx.bus.emit('pull:requested', { count: 1 });
  });

  root.querySelectorAll<HTMLButtonElement>('.hud-nav button').forEach((b) => {
    b.addEventListener('click', () => {
      root.querySelectorAll('.hud-nav button').forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
      ctx.bus.emit('ui:navigate', { view: b.dataset.view as 'vault' | 'odds' | 'collection' });
    });
  });

  return {
    name: 'hud',
    update() {},
  };
}

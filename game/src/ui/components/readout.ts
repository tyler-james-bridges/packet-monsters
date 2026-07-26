import type { VaultPosition } from '../../core/types';
import { RARITY_NAMES } from '../../core/types';
import { CARDS, networkLabel, priceOf, typeNameOf } from '../../data/cards';
import { esc, h, qs, qsa } from '../dom';
import { Dur, Ease, enter, exit, stagger, tweenVar } from '../motion';
import { eth, ms, pct, shortHex, shortHost, usd } from '../format';

/**
 * Stat bars are normalised against the real extremes of the 90 card index, not
 * a round number, so a 116 hp monster genuinely fills the bar and nothing is
 * scaled against an invented ceiling.
 */
const STAT_MAX = {
  hp: Math.max(...CARDS.map((c) => c.hp)),
  attack: Math.max(...CARDS.map((c) => c.attack)),
  speed: Math.max(...CARDS.map((c) => c.speed)),
};

export interface Readout {
  root: HTMLElement;
  show(position: VaultPosition, drawIndex: number, total: number): void;
  hide(): void;
}

export function createReadout(): Readout {
  const root = h(`
    <aside class="readout" data-rarity="0" aria-labelledby="readout-name" hidden>
      <span class="readout-aura" aria-hidden="true"></span>
      <div class="readout-body">
        <header class="rr-head" data-anim>
          <span class="rr-tier"><i class="rr-tier-dot" aria-hidden="true"></i><span class="tk" data-field="tier">--</span></span>
          <span class="rr-seq num tk" data-field="seq">--</span>
        </header>

        <div class="rr-identity" data-anim>
          <h2 class="rr-name" id="readout-name" data-field="name">--</h2>
          <p class="rr-host mono" data-field="host" title="">--</p>
        </div>

        <ul class="rr-chips" data-anim>
          <li class="chip" data-field="network">--</li>
          <li class="chip chip-type" data-field="type">--</li>
          <li class="chip chip-state" data-field="alive">--</li>
        </ul>

        <div class="rr-stats" data-anim>
          <div class="stat" data-stat="hp">
            <span class="stat-name tk">HP</span>
            <span class="stat-track"><b style="--w:0"></b></span>
            <span class="stat-value num">--</span>
          </div>
          <div class="stat" data-stat="attack">
            <span class="stat-name tk">ATTACK</span>
            <span class="stat-track"><b style="--w:0"></b></span>
            <span class="stat-value num">--</span>
          </div>
          <div class="stat" data-stat="speed">
            <span class="stat-name tk">SPEED</span>
            <span class="stat-track"><b style="--w:0"></b></span>
            <span class="stat-value num">--</span>
          </div>
        </div>

        <dl class="rr-econ">
          <div class="econ-row" data-anim><dt class="tk">CALL PRICE</dt><dd class="num" data-field="price">--</dd></div>
          <div class="econ-row" data-anim><dt class="tk">LATENCY</dt><dd class="num" data-field="latency">--</dd></div>
          <div class="econ-row" data-anim><dt class="tk">ETH BACKING</dt><dd class="num" data-field="backing">--</dd></div>
          <div class="econ-row" data-anim><dt class="tk">STANDING BID</dt><dd class="num" data-field="bid">--</dd></div>
          <div class="econ-row econ-accent" data-anim><dt class="tk">DRAW WEIGHT</dt><dd class="num" data-field="weight">--</dd></div>
        </dl>

        <footer class="rr-foot" data-anim>
          <span class="tk">URL HASH</span>
          <span class="mono" data-field="hash">--</span>
        </footer>
      </div>
    </aside>
  `);

  const field = (name: string): HTMLElement => qs<HTMLElement>(root, `[data-field="${name}"]`);
  const fields = {
    tier: field('tier'),
    seq: field('seq'),
    name: field('name'),
    host: field('host'),
    network: field('network'),
    type: field('type'),
    alive: field('alive'),
    price: field('price'),
    latency: field('latency'),
    backing: field('backing'),
    bid: field('bid'),
    weight: field('weight'),
    hash: field('hash'),
  };
  const statRows = qsa<HTMLElement>(root, '.stat');
  const animated = qsa<HTMLElement>(root, '[data-anim]');

  let visible = false;

  function paint(position: VaultPosition, drawIndex: number, total: number): void {
    const card = position.card;
    root.dataset.rarity = String(card.rarity);
    root.dataset.alive = card.alive ? 'true' : 'false';

    fields.tier.textContent = RARITY_NAMES[card.rarity] ?? 'UNKNOWN';
    fields.seq.textContent =
      total > 1
        ? `DRAW ${drawIndex + 1}/${total} · ID ${String(card.id).padStart(3, '0')}`
        : `ID ${String(card.id).padStart(3, '0')} / ${CARDS.length}`;
    fields.name.textContent = card.name;
    fields.host.textContent = shortHost(card.host, 38);
    fields.host.title = card.host;
    fields.network.textContent = networkLabel(card.network);
    fields.type.textContent = typeNameOf(card);
    fields.alive.textContent = card.alive ? 'LIVE ENDPOINT' : 'GHOST';

    fields.price.innerHTML = `${esc(usd(priceOf(card)))}<span class="unit">USD</span>`;
    fields.latency.textContent = ms(card.latencyMs);
    fields.backing.innerHTML = `${eth(position.backing, 4)}<span class="unit">ETH</span>`;
    fields.bid.innerHTML = `${eth(position.standingBid, 4)}<span class="unit">ETH</span>`;
    fields.weight.textContent = pct(position.weight, 3);
    fields.hash.textContent = shortHex(card.urlHash, 10, 8);

    const values: Record<string, { v: number; max: number }> = {
      hp: { v: card.hp, max: STAT_MAX.hp },
      attack: { v: card.attack, max: STAT_MAX.attack },
      speed: { v: card.speed, max: STAT_MAX.speed },
    };
    statRows.forEach((row, i) => {
      const key = row.dataset.stat ?? 'hp';
      const spec = values[key];
      const bar = qs<HTMLElement>(row, 'b');
      const label = qs<HTMLElement>(row, '.stat-value');
      label.textContent = String(spec.v);
      row.setAttribute('role', 'img');
      row.setAttribute('aria-label', `${key} ${spec.v} of ${spec.max}`);
      // Bars fill last, after the identity has landed, so the panel resolves
      // top to bottom instead of everything arriving at once.
      tweenVar(bar, '--w', 0, (spec.v / spec.max) * 100, {
        duration: Dur.reveal,
        delay: 240 + i * 80,
        easing: Ease.outExpo,
        precision: 2,
      });
    });
  }

  function show(position: VaultPosition, drawIndex: number, total: number): void {
    paint(position, drawIndex, total);
    root.hidden = false;
    if (!visible) {
      visible = true;
      enter(root, { x: 26, y: 0, duration: Dur.entrance, easing: Ease.outExpo });
    }
    // Staggered arrival tied to reveal:settled. Head first, then identity, then
    // the measured facts, so the eye lands on what it was drawn before it lands
    // on the economics.
    stagger(animated, { y: 14, gap: 46, maxTotal: 460, duration: Dur.entrance, delay: 60 });
  }

  function hide(): void {
    if (!visible) return;
    visible = false;
    exit(root, {
      y: 0,
      duration: Dur.base,
      easing: Ease.inCubic,
      onComplete: () => {
        root.hidden = true;
        root.style.opacity = '';
        root.style.transform = '';
      },
    });
  }

  return { root, show, hide };
}

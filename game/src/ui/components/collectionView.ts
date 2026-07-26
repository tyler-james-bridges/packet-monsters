import type { VaultPosition } from '../../core/types';
import { RARITY_NAMES, TYPE_NAMES } from '../../core/types';
import { networkLabel, priceOf, typeNameOf } from '../../data/cards';
import { esc, h, on, qs, qsa } from '../dom';
import { Dur, Ease, stagger } from '../motion';
import { eth, ms, pct, shortHost, usd } from '../format';
import type { VaultEconomics } from '../vaultAccess';

type SortKey = 'rarity' | 'backing' | 'price' | 'latency' | 'name' | 'id';

const SORTS: readonly { id: SortKey; label: string }[] = [
  { id: 'rarity', label: 'RARITY' },
  { id: 'backing', label: 'ETH BACKING' },
  { id: 'price', label: 'CALL PRICE' },
  { id: 'latency', label: 'LATENCY' },
  { id: 'name', label: 'NAME' },
  { id: 'id', label: 'INDEX' },
];

/** Only tiles near the top of the grid animate; the rest would be noise. */
const ANIMATED_TILES = 22;

export interface CollectionView {
  root: HTMLElement;
  render(econ: VaultEconomics): void;
  animateIn(): void;
}

export function createCollectionView(): CollectionView {
  const root = h(`
    <section class="view view-collection" id="panel-collection" role="tabpanel" aria-labelledby="tab-collection" tabindex="-1" hidden>
      <div class="view-scroll">
        <div class="view-inner">
          <header class="view-head" data-anim>
            <p class="eyebrow tk">VAULT INDEX</p>
            <h1 class="view-title">Collection</h1>
            <p class="view-lede">Every position currently held by the vault. Each one is a live x402 endpoint
              with committed ETH behind it, and the backing shown is the same number the draw walks.</p>
          </header>

          <div class="filters" data-anim>
            <div class="filter-group" role="group" aria-label="Filter by rarity">
              <span class="filter-label tk">RARITY</span>
              <div class="chips" data-field="rarity-chips"></div>
            </div>
            <div class="filter-group" role="group" aria-label="Filter by type">
              <span class="filter-label tk">TYPE</span>
              <div class="chips" data-field="type-chips"></div>
            </div>
            <div class="filter-group" role="group" aria-label="Filter by endpoint status">
              <span class="filter-label tk">STATUS</span>
              <div class="chips" data-field="status-chips"></div>
            </div>
            <div class="filter-group filter-tools">
              <label class="field">
                <span class="filter-label tk">SEARCH</span>
                <input class="text-input" type="search" data-field="search" placeholder="name or host"
                       autocomplete="off" spellcheck="false" aria-label="Search collection by name or host" />
              </label>
              <label class="field">
                <span class="filter-label tk">SORT</span>
                <select class="select-input" data-field="sort" aria-label="Sort collection">
                  ${SORTS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('')}
                </select>
              </label>
            </div>
          </div>

          <p class="result-line" role="status" aria-live="polite" data-field="count">--</p>

          <div class="grid" data-field="grid"></div>
          <p class="empty-state" data-field="empty" hidden>No position matches that filter.</p>
        </div>
      </div>
    </section>
  `);

  const field = (name: string): HTMLElement => qs<HTMLElement>(root, `[data-field="${name}"]`);
  const grid = field('grid');
  const countLine = field('count');
  const emptyState = field('empty');
  const searchInput = field('search') as HTMLInputElement;
  const sortSelect = field('sort') as HTMLSelectElement;
  const animated = qsa<HTMLElement>(root, '[data-anim]');

  let positions: VaultPosition[] = [];
  let rarityFilter: number | 'all' = 'all';
  let typeFilter: number | 'all' = 'all';
  let statusFilter: 'all' | 'live' | 'ghost' = 'all';
  let query = '';
  let sortKey: SortKey = 'rarity';

  function chip(
    label: string,
    value: string,
    count: number | null,
    pressed: boolean,
    extraClass = ''
  ): string {
    return `<button type="button" class="chip-btn ${extraClass}" data-value="${esc(value)}"
      aria-pressed="${pressed ? 'true' : 'false'}"><span class="tk">${esc(label)}</span>${
      count === null ? '' : `<span class="chip-count num">${count}</span>`
    }</button>`;
  }

  function buildChips(): void {
    const rarityCounts = new Map<number, number>();
    const typeCounts = new Map<number, number>();
    let live = 0;
    for (const p of positions) {
      rarityCounts.set(p.card.rarity, (rarityCounts.get(p.card.rarity) ?? 0) + 1);
      typeCounts.set(p.card.typeId, (typeCounts.get(p.card.typeId) ?? 0) + 1);
      if (p.card.alive) live += 1;
    }

    field('rarity-chips').innerHTML = [
      chip('ALL', 'all', positions.length, rarityFilter === 'all'),
      ...[...rarityCounts.keys()]
        .sort((a, b) => b - a)
        .map((r) =>
          chip(RARITY_NAMES[r] ?? `TIER ${r}`, String(r), rarityCounts.get(r) ?? 0, rarityFilter === r, `r${r}`)
        ),
    ].join('');

    field('type-chips').innerHTML = [
      chip('ALL', 'all', null, typeFilter === 'all'),
      ...[...typeCounts.keys()]
        .sort((a, b) => (typeCounts.get(b) ?? 0) - (typeCounts.get(a) ?? 0))
        .map((t) => chip(TYPE_NAMES[t] ?? `TYPE ${t}`, String(t), typeCounts.get(t) ?? 0, typeFilter === t)),
    ].join('');

    field('status-chips').innerHTML = [
      chip('ALL', 'all', positions.length, statusFilter === 'all'),
      chip('LIVE', 'live', live, statusFilter === 'live'),
      chip('GHOST', 'ghost', positions.length - live, statusFilter === 'ghost'),
    ].join('');
  }

  function matches(p: VaultPosition): boolean {
    if (rarityFilter !== 'all' && p.card.rarity !== rarityFilter) return false;
    if (typeFilter !== 'all' && p.card.typeId !== typeFilter) return false;
    if (statusFilter === 'live' && !p.card.alive) return false;
    if (statusFilter === 'ghost' && p.card.alive) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!p.card.name.toLowerCase().includes(q) && !p.card.host.toLowerCase().includes(q)) return false;
    }
    return true;
  }

  function sorted(list: VaultPosition[]): VaultPosition[] {
    const copy = [...list];
    switch (sortKey) {
      case 'rarity':
        return copy.sort((a, b) => b.card.rarity - a.card.rarity || b.backing - a.backing);
      case 'backing':
        return copy.sort((a, b) => b.backing - a.backing);
      case 'price':
        return copy.sort((a, b) => priceOf(b.card) - priceOf(a.card));
      case 'latency':
        return copy.sort((a, b) => a.card.latencyMs - b.card.latencyMs);
      case 'name':
        return copy.sort((a, b) => a.card.name.localeCompare(b.card.name));
      case 'id':
      default:
        return copy.sort((a, b) => a.card.id - b.card.id);
    }
  }

  function tile(p: VaultPosition): string {
    const c = p.card;
    return `
    <article class="ctile r${c.rarity}" data-alive="${c.alive}">
      <span class="ctile-edge" aria-hidden="true"></span>
      <header class="ctile-head">
        <span class="ctile-id num">${String(c.id).padStart(3, '0')}</span>
        <span class="ctile-tier tk"><i aria-hidden="true"></i>${esc(RARITY_NAMES[c.rarity] ?? '')}</span>
      </header>
      <h3 class="ctile-name">${esc(c.name)}</h3>
      <p class="ctile-host mono" title="${esc(c.host)}">${esc(shortHost(c.host, 30))}</p>
      <dl class="ctile-stats">
        <div><dt class="tk">HP</dt><dd class="num">${c.hp}</dd></div>
        <div><dt class="tk">ATK</dt><dd class="num">${c.attack}</dd></div>
        <div><dt class="tk">SPD</dt><dd class="num">${c.speed}</dd></div>
      </dl>
      <dl class="ctile-meta">
        <div><dt class="tk">TYPE</dt><dd>${esc(typeNameOf(c))}</dd></div>
        <div><dt class="tk">NETWORK</dt><dd>${esc(networkLabel(c.network))}</dd></div>
        <div><dt class="tk">CALL</dt><dd class="num">${esc(usd(priceOf(c)))}</dd></div>
        <div><dt class="tk">LATENCY</dt><dd class="num">${esc(ms(c.latencyMs))}</dd></div>
      </dl>
      <footer class="ctile-foot">
        <span class="ctile-backing num">${eth(p.backing, 4)}<span class="unit">ETH</span></span>
        <span class="ctile-weight num">${pct(p.weight, 3)}</span>
      </footer>
    </article>`;
  }

  function apply(animateTiles: boolean): void {
    const list = sorted(positions.filter(matches));
    grid.innerHTML = list.map(tile).join('');
    emptyState.hidden = list.length > 0;
    const totalBacking = list.reduce((s, p) => s + p.backing, 0);
    const totalWeight = list.reduce((s, p) => s + p.weight, 0);
    countLine.innerHTML =
      list.length === 0
        ? `<span class="tk">0 OF ${positions.length} POSITIONS</span>`
        : `<span class="tk">${list.length} OF ${positions.length} POSITIONS</span>
           <span class="result-sep" aria-hidden="true"></span>
           <span class="tk">${eth(totalBacking, 3)} ETH BACKING</span>
           <span class="result-sep" aria-hidden="true"></span>
           <span class="tk">${pct(totalWeight, 2)} OF DRAW WEIGHT</span>`;

    if (animateTiles) {
      const tiles = qsa<HTMLElement>(grid, '.ctile').slice(0, ANIMATED_TILES);
      stagger(tiles, { y: 14, scale: 0.985, gap: 26, maxTotal: 380, duration: Dur.base + 120, easing: Ease.outExpo });
    }
  }

  function bindChips(container: HTMLElement, onPick: (value: string) => void): void {
    on(container, 'click', (ev) => {
      const btn = (ev.target as HTMLElement).closest<HTMLButtonElement>('.chip-btn');
      if (!btn) return;
      onPick(btn.dataset.value ?? 'all');
      buildChips();
      apply(true);
    });
  }

  bindChips(field('rarity-chips'), (v) => {
    rarityFilter = v === 'all' ? 'all' : Number(v);
  });
  bindChips(field('type-chips'), (v) => {
    typeFilter = v === 'all' ? 'all' : Number(v);
  });
  bindChips(field('status-chips'), (v) => {
    statusFilter = v === 'live' || v === 'ghost' ? v : 'all';
  });

  let searchTimer = 0;
  on(searchInput, 'input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      query = searchInput.value.trim();
      apply(true);
    }, 110);
  });
  on(sortSelect, 'change', () => {
    sortKey = sortSelect.value as SortKey;
    apply(true);
  });

  function render(econ: VaultEconomics): void {
    positions = econ.positions;
    buildChips();
    apply(false);
  }

  function animateIn(): void {
    stagger(animated, { y: 18, gap: 70, maxTotal: 240, duration: Dur.entrance, easing: Ease.outExpo });
    const tiles = qsa<HTMLElement>(grid, '.ctile').slice(0, ANIMATED_TILES);
    stagger(tiles, {
      y: 18,
      scale: 0.985,
      gap: 26,
      maxTotal: 420,
      delay: 120,
      duration: Dur.entrance,
      easing: Ease.outExpo,
    });
  }

  return { root, render, animateIn };
}

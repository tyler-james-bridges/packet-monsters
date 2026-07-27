import { h, on, qs, qsa } from '../dom';
import { Dur, Ease, animate, claim } from '../motion';
import { bps, ethFromWei, ethScale, groupInt } from '../format';
import type { VaultEconomics } from '../vaultAccess';

export type ViewId = 'vault' | 'odds' | 'collection';

export const VIEWS: readonly { id: ViewId; label: string }[] = [
  { id: 'vault', label: 'VAULT' },
  { id: 'odds', label: 'ODDS' },
  { id: 'collection', label: 'COLLECTION' },
];

export interface TopBar {
  root: HTMLElement;
  setView(view: ViewId): void;
  setEconomics(econ: VaultEconomics): void;
  /** Re-measures the sliding indicator. Called on resize. */
  measure(): void;
}

/**
 * Brand mark. A vault seal: hexagonal shell, inset chamber, committed core.
 * Drawn as geometry rather than an icon font so it stays crisp at every dpr and
 * ships with zero downloads.
 */
const MARK = `
<svg class="brand-mark" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
  <path class="mark-shell" d="M14 2.4 24.1 8.2v11.6L14 25.6 3.9 19.8V8.2Z" />
  <path class="mark-chamber" d="M14 8.35 19.15 11.3v5.9L14 20.15 8.85 17.2v-5.9Z" />
  <circle class="mark-core" cx="14" cy="14" r="1.85" />
</svg>`;

export function createTopBar(options: { onNavigate(view: ViewId): void }): TopBar {
  const root = h(`
    <header class="topbar" role="banner">
      <a class="brand" href="#vault" aria-label="Packet Monsters, Sealed Vault, return to vault">
        ${MARK}
        <span class="brand-lockup">
          <span class="brand-name">PACKET MONSTERS</span>
          <span class="brand-sub tk">SEALED VAULT</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <div class="nav-track" role="tablist" aria-label="Vault sections">
          <span class="nav-indicator" aria-hidden="true"></span>
          ${VIEWS.map(
            (v, i) => `
          <button class="nav-tab" type="button" role="tab" id="tab-${v.id}"
                  aria-controls="panel-${v.id}" data-view="${v.id}"
                  aria-selected="${i === 0 ? 'true' : 'false'}"
                  tabindex="${i === 0 ? '0' : '-1'}"><span class="tk">${v.label}</span></button>`
          ).join('')}
        </div>
      </nav>

      <div class="status" aria-label="Vault status">
        <span class="status-live"><i class="live-dot" aria-hidden="true"></i><span class="tk">VAULT OPEN</span></span>
        <dl class="status-figures">
          <div class="sf"><dt class="tk">POSITIONS</dt><dd class="num" data-field="count">--</dd></div>
          <div class="sf"><dt class="tk">BACKING</dt><dd class="num" data-field="tvl">--<span class="unit">ETH</span></dd></div>
          <div class="sf"><dt class="tk">FEE</dt><dd class="num" data-field="fee">--</dd></div>
        </dl>
      </div>
    </header>
  `);

  const track = qs<HTMLElement>(root, '.nav-track');
  const indicator = qs<HTMLElement>(root, '.nav-indicator');
  const tabs = qsa<HTMLButtonElement>(root, '.nav-tab');
  const fieldCount = qs<HTMLElement>(root, '[data-field="count"]');
  const fieldTvl = qs<HTMLElement>(root, '[data-field="tvl"]');
  const fieldFee = qs<HTMLElement>(root, '[data-field="fee"]');

  let current: ViewId = 'vault';
  let placed = false;

  function activeTab(): HTMLButtonElement {
    return tabs.find((t) => t.dataset.view === current) ?? tabs[0];
  }

  /**
   * The indicator slides between tabs on its own tween rather than a CSS
   * transition, so an interrupted navigation retargets from where it actually
   * is instead of snapping back to the last committed position.
   */
  function moveIndicator(animated: boolean): void {
    const tab = activeTab();
    const trackBox = track.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    if (trackBox.width === 0) return;
    const targetX = tabBox.left - trackBox.left;
    const targetW = tabBox.width;
    const fromX = Number.parseFloat(indicator.dataset.x ?? '') || targetX;
    const fromW = Number.parseFloat(indicator.dataset.w ?? '') || targetW;

    const apply = (x: number, w: number): void => {
      indicator.dataset.x = String(x);
      indicator.dataset.w = String(w);
      indicator.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      indicator.style.width = `${w.toFixed(2)}px`;
    };

    if (!animated || !placed) {
      apply(targetX, targetW);
      placed = true;
      return;
    }
    claim(
      indicator,
      'slide',
      animate({
        duration: Dur.slow,
        easing: Ease.outQuint,
        onUpdate: (v) => apply(fromX + (targetX - fromX) * v, fromW + (targetW - fromW) * v),
      })
    );
  }

  function setView(view: ViewId): void {
    if (!VIEWS.some((v) => v.id === view)) return;
    const changed = view !== current;
    current = view;
    for (const tab of tabs) {
      const selected = tab.dataset.view === view;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    }
    moveIndicator(changed);
  }

  for (const tab of tabs) {
    on(tab, 'click', () => options.onNavigate(tab.dataset.view as ViewId));
  }

  // Roving tabindex. A tablist that cannot be driven with arrow keys is not a
  // tablist, it is three buttons wearing a costume.
  on(track, 'keydown', (ev) => {
    const idx = tabs.findIndex((t) => t === document.activeElement);
    if (idx < 0) return;
    let next = -1;
    if (ev.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (ev.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (ev.key === 'Home') next = 0;
    else if (ev.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    ev.preventDefault();
    tabs[next].focus();
    options.onNavigate(tabs[next].dataset.view as ViewId);
  });

  on(qs<HTMLElement>(root, '.brand'), 'click', (ev) => {
    ev.preventDefault();
    options.onNavigate('vault');
  });

  function setEconomics(econ: VaultEconomics): void {
    fieldCount.textContent = groupInt(String(econ.count));
    fieldTvl.innerHTML = `${ethFromWei(econ.totalBacking, Math.min(ethScale(econ.totalBacking), 4))}<span class="unit">ETH</span>`;
    fieldFee.textContent = bps(econ.feeBps);
  }

  return { root, setView, setEconomics, measure: () => moveIndicator(false) };
}

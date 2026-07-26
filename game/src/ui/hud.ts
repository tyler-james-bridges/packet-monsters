import type { AppContext, System, VaultPosition } from '../core/types';
import { RARITY_NAMES } from '../core/types';
import { registerShot } from '../core/harness';
import { networkLabel, typeNameOf } from '../data/cards';
import { h, on, onDoc, qs } from './dom';
import { Dur, Ease, enter, exit, setInstant, stopAll } from './motion';
import { readEconomics, whenMachine, type VaultEconomics } from './vaultAccess';
import { createTopBar, VIEWS, type ViewId } from './components/topbar';
import { createActionBar } from './components/actionBar';
import { createReadout } from './components/readout';
import { createOddsView } from './components/oddsView';
import { createCollectionView } from './components/collectionView';
import { eth, pct, seedHex, usd } from './format';
import { priceOf } from '../data/cards';

/**
 * DOM overlay for the vault.
 *
 * Kept as real DOM rather than canvas text so type rendering is subpixel
 * accurate, selectable and reachable by assistive technology. The layer is
 * pointer-transparent by default and only the controls opt back in, so the 3D
 * scene keeps every drag and every click that is not aimed at a control.
 *
 * Composition, top to bottom in z order:
 *   scrim   a pair of gradients that guarantee legibility over both a near
 *           black vault frame and a blown out legendary flash
 *   dock    price, the primary action, published odds
 *   views   full surface panels for odds and collection
 *   topbar  brand, section nav, live vault status
 */
export function createHud(ctx: AppContext, root: HTMLElement): System {
  // A captured frame must never depend on how long the software rasteriser took
  // to reach it, so under the harness every tween resolves in the tick it is
  // requested. The end state is identical, only the travel is skipped.
  setInstant(ctx.deterministic);

  root.innerHTML = '';
  root.classList.add('hud-root');

  const shell = h(`
    <div class="hud" data-view="vault">
      <div class="scrim scrim-top" aria-hidden="true"></div>
      <div class="scrim scrim-bottom" aria-hidden="true"></div>
      <div class="stage-layer"></div>
      <div class="view-layer"></div>
      <p class="sr-only" role="status" aria-live="polite" data-field="announce"></p>
    </div>
  `);

  const stageLayer = qs<HTMLElement>(shell, '.stage-layer');
  const viewLayer = qs<HTMLElement>(shell, '.view-layer');
  const announce = qs<HTMLElement>(shell, '[data-field="announce"]');

  const topbar = createTopBar({ onNavigate: (view) => navigate(view) });
  const dock = createActionBar({
    onPull: () => {
      dock.setState('committing');
      ctx.bus.emit('pull:requested', { count: 1 });
    },
  });
  const readout = createReadout();

  // Flex order matters: header, then the free stage area that the readout docks
  // into, then the action bar. The view layer and the scrims are out of flow.
  shell.insertBefore(topbar.root, stageLayer);
  stageLayer.appendChild(readout.root);
  shell.insertBefore(dock.root, viewLayer);
  root.appendChild(shell);

  // ---------------------------------------------------------------- economics

  // Declared ahead of the economics subscription on purpose. whenMachine may
  // invoke its callback synchronously when the machine is already published, and
  // that callback renders both panels, so hoisting these out of the temporal
  // dead zone is what keeps the first paint from throwing.
  let oddsView: ReturnType<typeof createOddsView> | null = null;
  let collectionView: ReturnType<typeof createCollectionView> | null = null;

  let econ: VaultEconomics | null = null;

  const cancelMachine = whenMachine((machine) => {
    econ = readEconomics(machine);
    topbar.setEconomics(econ);
    dock.setEconomics(econ);
    if (econ.count === 0) dock.setState('disabled');
    oddsView?.render(econ);
    collectionView?.render(econ);
    // First paint of the HUD chrome. Nothing before this point has real
    // numbers in it, so the entrance is deliberately gated on the data.
    enter(topbar.root, { y: -14, duration: Dur.entrance, easing: Ease.outExpo, delay: 40 });
    enter(dock.root, { y: 22, duration: Dur.entrance, easing: Ease.outExpo, delay: 110 });
  });

  // -------------------------------------------------------------------- views

  let currentView: ViewId = 'vault';
  let lastFocus: HTMLElement | null = null;

  function ensureOdds(): NonNullable<typeof oddsView> {
    if (!oddsView) {
      oddsView = createOddsView();
      viewLayer.appendChild(oddsView.root);
      if (econ) oddsView.render(econ);
    }
    return oddsView;
  }

  function ensureCollection(): NonNullable<typeof collectionView> {
    if (!collectionView) {
      collectionView = createCollectionView();
      viewLayer.appendChild(collectionView.root);
      if (econ) collectionView.render(econ);
    }
    return collectionView;
  }

  function panelFor(view: ViewId): HTMLElement | null {
    if (view === 'odds') return ensureOdds().root;
    if (view === 'collection') return ensureCollection().root;
    return null;
  }

  function closePanel(view: ViewId): void {
    const panel = view === 'odds' ? oddsView?.root : view === 'collection' ? collectionView?.root : null;
    if (!panel || panel.hidden) return;
    exit(panel, {
      y: 10,
      duration: Dur.fast,
      easing: Ease.inCubic,
      onComplete: () => {
        panel.hidden = true;
        panel.style.opacity = '';
        panel.style.transform = '';
      },
    });
  }

  function setView(view: ViewId, moveFocus: boolean): void {
    if (view === currentView) return;
    const previous = currentView;
    currentView = view;
    shell.dataset.view = view;
    topbar.setView(view);
    closePanel(previous);

    if (view === 'vault') {
      enter(dock.root, { y: 16, duration: Dur.base, easing: Ease.outExpo });
      enter(stageLayer, { y: 10, duration: Dur.base, easing: Ease.outExpo });
      if (moveFocus && lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
      lastFocus = null;
      return;
    }

    // The dock and the reveal readout belong to the vault view. Leaving them
    // lit under a translucent overlay reads as a rendering mistake.
    exit(dock.root, { y: 14, duration: Dur.fast, easing: Ease.inCubic });
    exit(stageLayer, { y: 8, duration: Dur.fast, easing: Ease.inCubic });
    const panel = panelFor(view);
    if (!panel) return;
    panel.hidden = false;
    enter(panel, { y: 14, duration: Dur.entrance, easing: Ease.outExpo });
    if (view === 'odds') oddsView?.animateIn();
    else collectionView?.animateIn();
    if (moveFocus) {
      lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      panel.focus({ preventScroll: true });
    }
  }

  let suppressBus = false;
  function navigate(view: ViewId): void {
    if (view === currentView) return;
    setView(view, true);
    suppressBus = true;
    ctx.bus.emit('ui:navigate', { view });
    suppressBus = false;
  }

  ctx.bus.on('ui:navigate', ({ view }) => {
    if (suppressBus) return;
    if (!VIEWS.some((v) => v.id === view)) return;
    setView(view, false);
  });

  // ------------------------------------------------------------- pull machine

  let revealTotal = 1;
  let idleTimer = 0;

  function scheduleIdle(delay: number): void {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => dock.setState('idle'), delay);
  }

  ctx.bus.on('pull:committed', ({ seed, positions }) => {
    window.clearTimeout(idleTimer);
    revealTotal = positions.length;
    readout.hide();
    dock.setState('sealed', { seed });
    announce.textContent = `Commitment ${seedHex(seed)} sealed. Awaiting beacon.`;
  });

  ctx.bus.on('reveal:start', ({ total }) => {
    revealTotal = total;
    dock.setState('resolving');
  });

  ctx.bus.on('reveal:settled', ({ position, index }) => {
    dock.setState('revealed', {
      name: position.card.name,
      rarity: position.card.rarity,
    });
    readout.show(position, index, revealTotal);
    announce.textContent = describe(position);
  });

  ctx.bus.on('pull:complete', () => {
    scheduleIdle(ctx.deterministic ? 0 : 1600);
  });

  function describe(position: VaultPosition): string {
    const c = position.card;
    return [
      `${RARITY_NAMES[c.rarity]} position revealed.`,
      `${c.name}, hosted at ${c.host}.`,
      `${typeNameOf(c)} type on ${networkLabel(c.network)}.`,
      `HP ${c.hp}, attack ${c.attack}, speed ${c.speed}.`,
      `Call price ${usd(priceOf(c))}, latency ${c.latencyMs} milliseconds.`,
      `Backed by ${eth(position.backing, 4)} ETH with a standing bid of ${eth(position.standingBid, 4)} ETH.`,
      `Draw weight ${pct(position.weight, 3)}.`,
    ].join(' ');
  }

  // ---------------------------------------------------------------- keyboard

  const offKeys = onDoc('keydown', (ev) => {
    if (ev.key === 'Escape' && currentView !== 'vault') {
      ev.preventDefault();
      navigate('vault');
    }
  });

  // ------------------------------------------------------------------- shots

  registerShot('ui-odds', {
    apply: () => setView('odds', false),
    settleFrames: 30,
  });
  registerShot('ui-collection', {
    apply: () => setView('collection', false),
    settleFrames: 30,
  });
  registerShot('ui-sealed', {
    apply: () => {
      dock.setState('sealed', { seed: 0x9e3779b9 });
    },
    settleFrames: 30,
  });

  // ------------------------------------------------------------------ system

  // The nav indicator is measured from live layout, so it has to wait for the
  // first paint. main.ts drives every later remeasure through System.resize.
  requestAnimationFrame(() => topbar.measure());

  return {
    name: 'hud',
    update() {},
    resize() {
      topbar.measure();
    },
    dispose() {
      cancelMachine();
      offKeys();
      window.clearTimeout(idleTimer);
      stopAll();
      root.innerHTML = '';
    },
  };
}

import { RARITY_NAMES } from '../../core/types';
import { h, on, qs, qsa } from '../dom';
import { Dur, Ease, animate, claim, readVar, tweenVar } from '../motion';
import { bps, ethFromWei, ethScale, oneIn, pct, seedHex } from '../format';
import { PROTOCOL, type VaultEconomics } from '../vaultAccess';

/**
 * The pull lifecycle, as the protocol actually runs it.
 *
 * `committing` is the moment the browser has the intent but the commitment is
 * not acknowledged. `sealed` is the honest waiting state: the commitment exists
 * and nothing on earth can steer the outcome until the beacon lands
 * RESOLVE_DELAY blocks later. `resolving` is the mix of the revealed secret
 * with that beacon. `revealed` is the settled position. We never show a spinner
 * that implies work is happening locally; the wait is a consensus wait.
 */
export type PullState =
  | 'idle'
  | 'committing'
  | 'sealed'
  | 'resolving'
  | 'revealed'
  | 'disabled';

const PHASES = [
  { id: 'commit', label: 'COMMIT' },
  { id: 'beacon', label: 'BEACON' },
  { id: 'resolve', label: 'RESOLVE' },
  { id: 'reveal', label: 'REVEAL' },
] as const;

/** How far the phase rail has advanced for each state, 0 to 1. */
const RAIL: Record<PullState, number> = {
  idle: 0,
  committing: 0.14,
  sealed: 0.39,
  resolving: 0.66,
  revealed: 1,
  disabled: 0,
};

const ACTIVE_PHASE: Record<PullState, number> = {
  idle: -1,
  committing: 0,
  sealed: 1,
  resolving: 2,
  revealed: 3,
  disabled: -1,
};

export interface ActionBar {
  root: HTMLElement;
  setEconomics(econ: VaultEconomics): void;
  setState(state: PullState, detail?: { seed?: number; name?: string; rarity?: number }): void;
  state(): PullState;
}

export function createActionBar(options: { onPull(): void }): ActionBar {
  const root = h(`
    <footer class="dock">
      <div class="dock-grid">

        <section class="dock-cell dock-price" aria-label="Acquisition price">
          <h2 class="cell-label tk">ACQUISITION PRICE</h2>
          <p class="price-line">
            <span class="price-value num" data-field="price">--</span>
            <span class="price-unit tk">ETH</span>
          </p>
          <div class="price-split" role="img" data-field="splitlabel" aria-label="Price composition">
            <span class="split-ev"></span><span class="split-fee"></span>
          </div>
          <dl class="price-breakdown">
            <div class="pb"><dt class="tk">EXPECTED VALUE</dt><dd class="num" data-field="ev">--</dd></div>
            <div class="pb"><dt class="tk">PROTOCOL FEE</dt><dd class="num" data-field="fee">--</dd></div>
          </dl>
          <p class="price-claim">Priced at exact expected value. The fee is the entire edge.</p>
        </section>

        <section class="dock-cell dock-action">
          <ol class="phases" data-active="-1">
            <span class="phase-rail" aria-hidden="true"><span class="phase-rail-fill"></span></span>
            ${PHASES.map(
              (p, i) => `
            <li class="phase" data-phase="${p.id}" data-index="${i}">
              <span class="phase-pip" aria-hidden="true"></span>
              <span class="phase-name tk">${p.label}</span>
            </li>`
            ).join('')}
          </ol>

          <button class="pull" type="button" data-state="idle" id="pull-action"
                  aria-describedby="pull-status">
            <span class="pull-fill" aria-hidden="true"></span>
            <span class="pull-sheen" aria-hidden="true"></span>
            <span class="pull-content">
              <span class="pull-label tk" data-field="pull-label">OPEN SEAL</span>
              <span class="pull-cost num" data-field="pull-cost">--<span class="unit">ETH</span></span>
            </span>
          </button>

          <p class="pull-status" id="pull-status" role="status" aria-live="polite" data-tone="idle">
            <span data-field="status">--</span>
          </p>
        </section>

        <section class="dock-cell dock-odds" aria-label="Published draw odds">
          <h2 class="cell-label tk">DRAW ODDS<span class="cell-note tk">LIVE FROM VAULT</span></h2>
          <ul class="odds-list" data-field="odds"></ul>
          <p class="odds-foot"><span data-field="odds-foot">--</span></p>
        </section>

      </div>
    </footer>
  `);

  const priceEl = qs<HTMLElement>(root, '[data-field="price"]');
  const evEl = qs<HTMLElement>(root, '[data-field="ev"]');
  const feeEl = qs<HTMLElement>(root, '[data-field="fee"]');
  const splitEv = qs<HTMLElement>(root, '.split-ev');
  const splitFee = qs<HTMLElement>(root, '.split-fee');
  const splitWrap = qs<HTMLElement>(root, '.price-split');
  const oddsList = qs<HTMLElement>(root, '[data-field="odds"]');
  const oddsFoot = qs<HTMLElement>(root, '[data-field="odds-foot"]');
  const button = qs<HTMLButtonElement>(root, '.pull');
  const pullLabel = qs<HTMLElement>(root, '[data-field="pull-label"]');
  const pullCost = qs<HTMLElement>(root, '[data-field="pull-cost"]');
  const statusEl = qs<HTMLElement>(root, '.pull-status');
  const statusText = qs<HTMLElement>(root, '[data-field="status"]');
  const phasesEl = qs<HTMLElement>(root, '.phases');
  const railFill = qs<HTMLElement>(root, '.phase-rail-fill');

  let state: PullState = 'idle';
  // setState short-circuits on a no-op transition, so the very first paint has
  // to be allowed through or the button ships with placeholder copy in it.
  let painted = false;

  on(button, 'click', () => {
    if (state !== 'idle') return;
    options.onPull();
  });

  function setEconomics(econ: VaultEconomics): void {
    // One scale, taken from the headline, shared by every figure in the cell so
    // the decimal points line up under each other.
    const dp = ethScale(econ.price);
    priceEl.textContent = ethFromWei(econ.price, dp);
    evEl.textContent = ethFromWei(econ.expectedValue, dp);
    feeEl.textContent = ethFromWei(econ.fee, dp);
    pullCost.innerHTML = `${ethFromWei(econ.price, dp)}<span class="unit">ETH</span>`;

    const feePct = econ.feeShare;
    splitWrap.setAttribute(
      'aria-label',
      `Acquisition price is ${pct(1 - feePct, 2)} expected value and ${pct(feePct, 2)} protocol fee`
    );
    // The fee is a couple of percent by design, so give it a floor width or the
    // honest ratio renders as an invisible sliver and reads as a bug.
    const feeWidth = Math.max(feePct * 100, 2.4);
    tweenVar(splitEv, '--w', readVar(splitEv, '--w', 0), 100 - feeWidth, {
      duration: Dur.reveal,
      easing: Ease.outExpo,
      precision: 3,
    });
    tweenVar(splitFee, '--w', readVar(splitFee, '--w', 0), feeWidth, {
      duration: Dur.reveal,
      easing: Ease.outExpo,
      precision: 3,
    });

    const ordered = [...econ.rarities].sort((a, b) => b.rarity - a.rarity);
    oddsList.innerHTML = ordered
      .map((r) => {
        const chance = oneIn(r.probability);
        return `
      <li class="odds-row r${r.rarity}">
        <i class="odds-dot" aria-hidden="true"></i>
        <span class="odds-name tk">${RARITY_NAMES[r.rarity]}</span>
        <span class="odds-bar" aria-hidden="true"><b style="--w:0"></b></span>
        <span class="odds-value num">${pct(r.probability, 2)}</span>
        <span class="odds-alt num">${chance ?? '—'}</span>
      </li>`;
      })
      .join('');

    // Absolute scale, not normalised against the largest tier. A bar that fills
    // the track at 55 percent would imply 55 percent is the ceiling; the track
    // is the whole probability space and a 0.66 percent tier should look like
    // 0.66 percent. CSS gives the fill a minimum width so it never vanishes.
    qsa<HTMLElement>(oddsList, '.odds-bar b').forEach((bar, i) => {
      tweenVar(bar, '--w', 0, ordered[i].probability * 100, {
        duration: Dur.reveal,
        delay: 60 + i * 45,
        easing: Ease.outExpo,
        precision: 2,
      });
    });

    oddsFoot.textContent = `${econ.count} positions · ${ethFromWei(econ.totalBacking, 3)} ETH backed · fee ${bps(econ.feeBps)}`;
  }

  const LABELS: Record<PullState, string> = {
    idle: 'OPEN SEAL',
    committing: 'COMMITTING',
    sealed: 'SEALED',
    resolving: 'RESOLVING',
    revealed: 'REVEALED',
    disabled: 'VAULT CLOSED',
  };

  function statusFor(next: PullState, detail?: { seed?: number; name?: string; rarity?: number }): string {
    switch (next) {
      case 'idle':
        return `Two-phase sealed draw. Bond ${ethFromWei(PROTOCOL.BOND, 4)} ETH, refunded on reveal.`;
      case 'committing':
        return 'Submitting commitment hash with payment.';
      case 'sealed':
        return detail?.seed !== undefined
          ? `Commitment ${seedHex(detail.seed)} sealed. Awaiting beacon, ${PROTOCOL.RESOLVE_DELAY} blocks.`
          : `Commitment sealed. Awaiting beacon, ${PROTOCOL.RESOLVE_DELAY} blocks.`;
      case 'resolving':
        return `Mixing revealed secret with beacon. Force-resolvable after ${PROTOCOL.REVEAL_WINDOW} blocks.`;
      case 'revealed':
        return detail?.name
          ? `${RARITY_NAMES[detail.rarity ?? 0]} position drawn. ${detail.name}.`
          : 'Position drawn and settled.';
      case 'disabled':
        return 'Vault holds no positions. Acquisition is closed.';
    }
  }

  function setState(next: PullState, detail?: { seed?: number; name?: string; rarity?: number }): void {
    if (painted && next === state && next !== 'revealed') return;
    painted = true;
    state = next;
    button.dataset.state = next;
    button.disabled = next !== 'idle';
    button.setAttribute('aria-busy', next === 'idle' || next === 'disabled' ? 'false' : 'true');
    pullLabel.textContent = LABELS[next];
    statusEl.dataset.tone = next;
    if (detail?.rarity !== undefined) statusEl.dataset.rarity = String(detail.rarity);
    else statusEl.removeAttribute('data-rarity');

    // Retype the status line with a short cross-fade so a state change reads as
    // an event rather than a silent text swap.
    const text = statusFor(next, detail);
    claim(
      statusText,
      'swap',
      animate({
        duration: Dur.fast,
        easing: Ease.outCubic,
        onUpdate: (v) => {
          statusText.style.opacity = String(Math.abs(v - 0.5) * 2);
          if (v >= 0.5 && statusText.textContent !== text) statusText.textContent = text;
        },
        onComplete: () => {
          statusText.textContent = text;
          statusText.style.opacity = '';
        },
      })
    );

    phasesEl.dataset.active = String(ACTIVE_PHASE[next]);
    const railDuration = next === 'idle' ? Dur.slow : Dur.reveal;
    const railEase = next === 'idle' ? Ease.inOutCubic : Ease.outExpo;
    // The phase rail and the fill inside the button run off the same value, so
    // the button reads as the same progress object the stepper is describing.
    tweenVar(railFill, '--p', readVar(railFill, '--p', 0), RAIL[next], {
      duration: railDuration,
      easing: railEase,
      precision: 4,
    });
    tweenVar(button, '--p', readVar(button, '--p', 0), RAIL[next], {
      duration: railDuration,
      easing: railEase,
      precision: 4,
    });

    const activeIndex = ACTIVE_PHASE[next];
    qsa<HTMLElement>(phasesEl, '.phase').forEach((phase, i) => {
      phase.dataset.status = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending';
    });
  }

  setState('idle');

  return { root, setEconomics, setState, state: () => state };
}

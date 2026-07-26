import { RARITY_NAMES } from '../../core/types';
import { esc, h, qs, qsa } from '../dom';
import { Dur, Ease, stagger, tweenVar } from '../motion';
import { bps, ethFromWei, oneIn, pct, weiToEth } from '../format';
import { PROTOCOL, type VaultEconomics } from '../vaultAccess';

export interface OddsView {
  root: HTMLElement;
  render(econ: VaultEconomics): void;
  animateIn(): void;
}

/**
 * The odds page. Everything here is recomputed from the live vault through the
 * protocol's own exported functions; there is no authored table. If the vault
 * composition changes, this page changes with it, which is the point of
 * publishing odds at all.
 */
export function createOddsView(): OddsView {
  const root = h(`
    <section class="view view-odds" id="panel-odds" role="tabpanel" aria-labelledby="tab-odds" tabindex="-1" hidden>
      <div class="view-scroll">
        <div class="view-inner">

          <header class="view-head" data-anim>
            <p class="eyebrow tk">PROTOCOL DISCLOSURE</p>
            <h1 class="view-title">Published draw odds</h1>
            <p class="view-lede">Selection weight is committed backing over total backing, walked on an
              integer Fenwick tree in wei. These figures are read out of the live vault at render time.
              There is no second table.</p>
          </header>

          <section class="panel panel-table" data-anim aria-labelledby="odds-table-h">
            <h2 class="panel-title tk" id="odds-table-h">ODDS BY RARITY</h2>
            <table class="dtable">
              <thead>
                <tr>
                  <th scope="col" class="tk">TIER</th>
                  <th scope="col" class="tk num-h">POSITIONS</th>
                  <th scope="col" class="tk num-h">POOLED BACKING</th>
                  <th scope="col" class="tk num-h">PROBABILITY</th>
                  <th scope="col" class="tk num-h">FREQUENCY</th>
                  <th scope="col" class="tk col-bar">DISTRIBUTION</th>
                </tr>
              </thead>
              <tbody data-field="rows"></tbody>
              <tfoot>
                <tr>
                  <th scope="row" class="tk">TOTAL</th>
                  <td class="num" data-field="t-count">--</td>
                  <td class="num" data-field="t-backing">--</td>
                  <td class="num" data-field="t-prob">--</td>
                  <td class="num">—</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </section>

          <div class="view-cols">
            <section class="panel panel-price" data-anim aria-labelledby="price-h">
              <h2 class="panel-title tk" id="price-h">ACQUISITION PRICE</h2>
              <p class="panel-lede">A vault priced below its expected payout is a free option. We price at
                exact expected value plus a bounded fee, so composition can never be timed.</p>

              <div class="formula mono">
                <span>E[B]</span><span class="op">=</span><span>S2 / S1</span>
                <span class="op">·</span>
                <span>price</span><span class="op">=</span><span>E[B] × (1 + fee)</span>
              </div>

              <div class="stack" role="img" data-field="stack-label">
                <span class="stack-ev" data-field="stack-ev"></span>
                <span class="stack-fee" data-field="stack-fee"></span>
              </div>

              <dl class="ledger">
                <div class="ledger-row"><dt class="tk">EXPECTED VALUE<span class="sub">E[B], the payout you are buying</span></dt>
                  <dd class="num" data-field="ev">--</dd><dd class="num pctcol" data-field="ev-pct">--</dd></div>
                <div class="ledger-row"><dt class="tk">PROTOCOL FEE<span class="sub" data-field="fee-sub">--</span></dt>
                  <dd class="num" data-field="fee">--</dd><dd class="num pctcol" data-field="fee-pct">--</dd></div>
                <div class="ledger-row ledger-total"><dt class="tk">ACQUISITION PRICE</dt>
                  <dd class="num" data-field="price">--</dd><dd class="num pctcol">100.00%</dd></div>
              </dl>
            </section>

            <section class="panel panel-params" data-anim aria-labelledby="params-h">
              <h2 class="panel-title tk" id="params-h">PROTOCOL PARAMETERS</h2>
              <dl class="params" data-field="params"></dl>
            </section>
          </div>

          <section class="panel panel-notes" data-anim aria-labelledby="notes-h">
            <h2 class="panel-title tk" id="notes-h">HOW A DRAW RESOLVES</h2>
            <ol class="notes">
              <li><span class="note-k tk">COMMIT</span><p>Payment lands with a commitment to a secret. The
                selected position is not decided in this transaction.</p></li>
              <li><span class="note-k tk">BEACON</span><p>Resolution is legal no earlier than
                <b data-field="n-delay">--</b> blocks later. The buyer cannot see the future beacon and the
                proposer cannot see the secret, so neither steers the draw alone.</p></li>
              <li><span class="note-k tk">RESOLVE</span><p>The revealed secret is mixed with the beacon at the
                resolve block and walked against the Fenwick tree of integer backing.</p></li>
              <li><span class="note-k tk">FORCED</span><p>After <b data-field="n-window">--</b> blocks anyone may
                force resolution from the beacon alone and claim the buyer's
                <b data-field="n-bond">--</b> ETH bond. Refusing to reveal is never profitable.</p></li>
              <li><span class="note-k tk">ISOLATION</span><p>A commit binds to a vault epoch. Deposits and exits
                after it land in the next epoch and cannot move the odds of a draw already in flight.</p></li>
            </ol>
          </section>

        </div>
      </div>
    </section>
  `);

  const rows = qs<HTMLElement>(root, '[data-field="rows"]');
  const animated = qsa<HTMLElement>(root, '[data-anim]');
  let bars: HTMLElement[] = [];

  const field = (name: string): HTMLElement => qs<HTMLElement>(root, `[data-field="${name}"]`);

  function render(econ: VaultEconomics): void {
    const ordered = [...econ.rarities].sort((a, b) => b.rarity - a.rarity);
    const maxProb = Math.max(...ordered.map((r) => r.probability), 0.0001);

    rows.innerHTML = ordered
      .map((r) => {
        const freq = oneIn(r.probability);
        return `
        <tr class="r${r.rarity}">
          <th scope="row" class="tier-cell"><i class="tier-dot" aria-hidden="true"></i><span class="tk">${esc(RARITY_NAMES[r.rarity])}</span></th>
          <td class="num">${r.positions}</td>
          <td class="num">${ethFromWei(r.backing, 4)}<span class="unit">ETH</span></td>
          <td class="num strong">${pct(r.probability, 4)}</td>
          <td class="num muted">${freq ?? '—'}</td>
          <td class="col-bar"><span class="tbar"><b style="--w:0"></b></span></td>
        </tr>`;
      })
      .join('');

    bars = qsa<HTMLElement>(rows, '.tbar b');
    bars.forEach((bar, i) => {
      bar.dataset.target = ((ordered[i].probability / maxProb) * 100).toFixed(2);
    });

    field('t-count').textContent = String(econ.count);
    field('t-backing').innerHTML = `${ethFromWei(econ.totalBacking, 4)}<span class="unit">ETH</span>`;
    const totalProb = econ.rarities.reduce((s, r) => s + r.probability, 0);
    field('t-prob').textContent = pct(totalProb, 4);

    const feeShare = econ.feeShare;
    field('ev').innerHTML = `${ethFromWei(econ.expectedValue, 6)}<span class="unit">ETH</span>`;
    field('fee').innerHTML = `${ethFromWei(econ.fee, 6)}<span class="unit">ETH</span>`;
    field('price').innerHTML = `${ethFromWei(econ.price, 6)}<span class="unit">ETH</span>`;
    field('ev-pct').textContent = pct(1 - feeShare, 2);
    field('fee-pct').textContent = pct(feeShare, 2);
    field('fee-sub').textContent = `${bps(econ.feeBps)} of expected value, ceiling ${bps(econ.maxFeeBps)}`;
    field('stack-label').setAttribute(
      'aria-label',
      `Price composition: ${pct(1 - feeShare, 2)} expected value, ${pct(feeShare, 2)} protocol fee`
    );
    field('stack-ev').style.setProperty('--w', ((1 - feeShare) * 100).toFixed(3));
    field('stack-fee').style.setProperty('--w', Math.max(feeShare * 100, 1.6).toFixed(3));

    field('n-delay').textContent = String(PROTOCOL.RESOLVE_DELAY);
    field('n-window').textContent = String(PROTOCOL.REVEAL_WINDOW);
    field('n-bond').textContent = ethFromWei(PROTOCOL.BOND, 4);

    const params: [string, string, string][] = [
      ['FEE', bps(PROTOCOL.FEE_BPS), `${PROTOCOL.FEE_BPS} bps`],
      ['FEE CEILING', bps(PROTOCOL.MAX_FEE_BPS), 'immutable in the contract'],
      ['RESOLVE DELAY', `${PROTOCOL.RESOLVE_DELAY}`, 'blocks before resolution is legal'],
      ['REVEAL WINDOW', `${PROTOCOL.REVEAL_WINDOW}`, 'blocks before anyone may force resolve'],
      ['MIN BACKING', ethFromWei(PROTOCOL.MIN_BACKING, 4), 'ETH per position, blocks dust griefing'],
      ['BUYER BOND', ethFromWei(PROTOCOL.BOND, 4), 'ETH, refunded on honest reveal'],
      ['PITY CAP', `${PROTOCOL.PITY_CAP}`, 'consecutive misses to saturation'],
      ['PITY BOOST', `${(Number(PROTOCOL.PITY_MAX_BOOST_BPS) / 10000).toFixed(1)}×`, 'maximum weight multiplier'],
      ['VAULT BACKING', ethFromWei(econ.totalBacking, 4), 'ETH committed across all positions'],
      [
        'TOP POSITION',
        pct(econ.topWeight, 3),
        econ.topPosition
          ? `${econ.topPosition.card.name}, ${weiToEth(BigInt(Math.round(econ.topPosition.backing * 1e18))).toFixed(2)} ETH`
          : 'none',
      ],
    ];
    field('params').innerHTML = params
      .map(
        ([k, v, note]) => `
      <div class="param">
        <dt class="tk">${esc(k)}</dt>
        <dd class="num">${esc(v)}</dd>
        <dd class="param-note">${esc(note)}</dd>
      </div>`
      )
      .join('');
  }

  function animateIn(): void {
    stagger(animated, { y: 18, gap: 64, maxTotal: 340, duration: Dur.entrance, easing: Ease.outExpo });
    bars.forEach((bar, i) => {
      tweenVar(bar, '--w', 0, Number(bar.dataset.target ?? '0'), {
        duration: Dur.reveal,
        delay: 180 + i * 55,
        easing: Ease.outExpo,
        precision: 2,
      });
    });
  }

  return { root, render, animateIn };
}

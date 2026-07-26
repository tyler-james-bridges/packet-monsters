/**
 * Number formatting for the HUD.
 *
 * Every figure the player sees is a protocol figure, so formatting is exact
 * rather than pretty: wei is divided as an integer, never through a float, and
 * nothing is rounded up into a number the contract would not agree with.
 */

/** wei -> fixed decimal ETH string, truncated (never rounded up) to `dp` places. */
export function ethFromWei(wei: bigint, dp = 4): string {
  const negative = wei < 0n;
  const abs = negative ? -wei : wei;
  const digits = abs.toString().padStart(19, '0');
  const whole = digits.slice(0, -18);
  const frac = digits.slice(-18).slice(0, dp);
  const body = dp > 0 ? `${groupInt(whole)}.${frac}` : groupInt(whole);
  return negative ? `-${body}` : body;
}

/** wei -> float ETH. Only for chart geometry, never for a displayed figure. */
export function weiToEth(wei: bigint): number {
  return Number(wei) / 1e18;
}

export function groupInt(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function eth(value: number, dp = 4): string {
  const fixed = value.toFixed(dp);
  const [w, f] = fixed.split('.');
  return f ? `${groupInt(w)}.${f}` : groupInt(w);
}

export function pct(fraction: number, dp = 2): string {
  return `${(fraction * 100).toFixed(dp)}%`;
}

/** "1 in 24" style odds. Returns null when the probability is zero. */
export function oneIn(fraction: number): string | null {
  if (fraction <= 0) return null;
  const n = 1 / fraction;
  if (n < 10) return `1 in ${n.toFixed(1)}`;
  return `1 in ${groupInt(String(Math.round(n)))}`;
}

export function usd(value: number): string {
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(4)}`;
}

export function ms(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`;
  return `${Math.round(value)} ms`;
}

export function bps(value: bigint): string {
  const n = Number(value) / 100;
  return `${n.toFixed(2)}%`;
}

/** Truncates a long hex string to head/tail with a real ellipsis character. */
export function shortHex(value: string, head = 6, tail = 4): string {
  const body = value.startsWith('0x') ? value.slice(2) : value;
  if (body.length <= head + tail) return `0x${body}`;
  return `0x${body.slice(0, head)}…${body.slice(-tail)}`;
}

/** A 32 bit seed rendered the way the contract would log it. */
export function seedHex(seed: number): string {
  return `0x${(seed >>> 0).toString(16).padStart(8, '0')}`;
}

/** Host names run to 74 characters in the index. Middle-truncate, never clip. */
export function shortHost(host: string, max = 34): string {
  if (host.length <= max) return host;
  const head = Math.ceil((max - 1) * 0.62);
  const tail = max - 1 - head;
  return `${host.slice(0, head)}…${host.slice(-tail)}`;
}

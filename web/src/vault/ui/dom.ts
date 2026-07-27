/**
 * Minimal DOM helpers. No framework, by project rule, so these exist to keep
 * component files readable and to make escaping non-optional: every string that
 * originates in data/cards.json passes through `esc` before it reaches innerHTML.
 */

export function esc(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Builds a detached element tree from markup. */
export function frag(html: string): DocumentFragment {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl.content;
}

/** Builds a single root element from markup. */
export function h<T extends HTMLElement = HTMLElement>(html: string): T {
  const first = frag(html).firstElementChild;
  if (!first) throw new Error('h(): markup produced no element');
  return first as T;
}

/** Querying that fails loudly. A missing node is a bug, not a runtime branch. */
export function qs<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const node = root.querySelector(selector);
  if (!node) throw new Error(`qs(): no match for ${selector}`);
  return node as T;
}

export function qsa<T extends Element = HTMLElement>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(type, handler as EventListener, options);
  return () => target.removeEventListener(type, handler as EventListener, options);
}

export function onDoc<K extends keyof DocumentEventMap>(
  type: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  document.addEventListener(type, handler as EventListener, options);
  return () => document.removeEventListener(type, handler as EventListener, options);
}

/** Focusable descendants, in document order, for lightweight focus containment. */
export function focusables(root: ParentNode): HTMLElement[] {
  return qsa<HTMLElement>(
    root,
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
}

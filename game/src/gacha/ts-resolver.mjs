/**
 * Node resolve hook: retry extensionless relative specifiers with a TypeScript
 * extension, so the game's bundler-style imports load under
 * `node --experimental-strip-types`. Used only by src/gacha/run-tests.mjs.
 */
const CANDIDATES = ['.ts', '.mts', '/index.ts'];

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      for (const ext of CANDIDATES) {
        try {
          return await nextResolve(specifier + ext, context);
        } catch {
          /* try the next candidate */
        }
      }
    }
    throw err;
  }
}

/**
 * Vite imports JSON without an import attribute; Node requires one. Supply it
 * so `src/data/cards.ts` loads the real 90-record data set unchanged.
 */
export async function load(url, context, nextLoad) {
  if (url.endsWith('.json')) {
    return nextLoad(url, { ...context, importAttributes: { type: 'json' } });
  }
  return nextLoad(url, context);
}

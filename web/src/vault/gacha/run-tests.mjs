/**
 * Test runner for the SEALED VAULT client mirror.
 *
 *   cd game && node src/gacha/run-tests.mjs
 *
 * The game's sources use extensionless relative imports (Vite/bundler
 * resolution). Node's own resolver requires explicit extensions, so this
 * registers a tiny resolve hook that retries with `.ts` before importing the
 * test module. Nothing else in the project is affected.
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(new URL('./ts-resolver.mjs', import.meta.url), pathToFileURL('./'));

await import('./protocol.test.mts');

import {
  generatePrivateKey,
  privateKeyToAccount,
  type PrivateKeyAccount,
} from "viem/accounts";

const STORAGE_KEY = "packet-monsters-burner-key";

// Local burner wallet: generated client-side, persisted in localStorage.
// Local dev chain only; never use this pattern with real funds.
export function loadBurnerAccount(): PrivateKeyAccount {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && stored.startsWith("0x") && stored.length === 66) {
    try {
      return privateKeyToAccount(stored as `0x${string}`);
    } catch {
      // fall through and regenerate
    }
  }
  const key = generatePrivateKey();
  window.localStorage.setItem(STORAGE_KEY, key);
  return privateKeyToAccount(key);
}

import "server-only";

// In-memory replay-protection set for the "transfer" payment path (a tx hash
// can only pay for one pack). Fine for local dev; a real deployment would use
// a persistent store.
const usedTxHashes = new Set<string>();

export function isPaymentUsed(txHash: string): boolean {
  return usedTxHashes.has(txHash.toLowerCase());
}

export function markPaymentUsed(txHash: string): void {
  usedTxHashes.add(txHash.toLowerCase());
}

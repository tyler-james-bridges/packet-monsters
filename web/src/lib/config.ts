import { defineChain, zeroAddress, type Address } from "viem";
import deployment from "./deployment.json";

// At integration the orchestrator overwrites src/lib/deployment.json with the
// addresses written by the contracts deploy script. Until then the placeholder
// file ships empty addresses and the UI shows a "contracts not deployed"
// banner. We tolerate both a flat shape and an { addresses: { ... } } wrapper.
function readAddress(keys: string[]): Address {
  const raw = deployment as Record<string, unknown>;
  const sources: Record<string, unknown>[] = [raw];
  for (const wrapper of ["addresses", "contracts"]) {
    const nested = raw[wrapper];
    if (nested && typeof nested === "object") {
      sources.push(nested as Record<string, unknown>);
    }
  }
  for (const source of sources) {
    for (const key of keys) {
      const value = source[key];
      if (
        typeof value === "string" &&
        value.startsWith("0x") &&
        value.length === 42
      ) {
        return value as Address;
      }
    }
  }
  return zeroAddress;
}

export const addresses = {
  packetMonsters: readAddress(["packetMonsters", "PacketMonsters"]),
  mockUsdc: readAddress(["mockUsdc", "MockUSDC", "mockUSDC", "usdc"]),
  identityRegistry: readAddress(["identityRegistry", "IdentityRegistry"]),
  reputationRegistry: readAddress(["reputationRegistry", "ReputationRegistry"]),
} as const;

export const contractsDeployed =
  addresses.packetMonsters !== zeroAddress && addresses.mockUsdc !== zeroAddress;

export const RPC_URL = "http://127.0.0.1:8545";
export const POLL_INTERVAL_MS = 3000;

export const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
  testnet: true,
});

export const USDC_DECIMALS = 6;
export const PACK_PRICE_UNITS = 50000n; // $0.05 in MockUSDC base units
export const X402_NETWORK = "eip155:31337";
export const FEEDBACK_TAG = "packet-monsters-battle";

// x402 payment path:
//  "transfer": client sends a direct USDC transfer tx and proves it with the
//              tx hash in the PAYMENT header (default; works with any ERC-20).
//  "eip3009":  client signs an EIP-3009 transferWithAuthorization and the
//              server submits it. Flip at integration if MockUSDC shipped
//              with EIP-3009 support.
export const PAYMENT_PATH: "transfer" | "eip3009" = "transfer";

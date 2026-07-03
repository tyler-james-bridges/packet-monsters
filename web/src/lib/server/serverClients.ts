import "server-only";
import { createWalletClient, http, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil, RPC_URL } from "@/lib/config";

// Well-known, publicly documented anvil default dev private keys. Local chain
// only (chain id 31337) -- never use these outside a throwaway local anvil.
const FAUCET_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" as const;
const PACK_SELLER_PRIVATE_KEY =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" as const;

export const faucetAccount = privateKeyToAccount(FAUCET_PRIVATE_KEY);
export const packSellerAccount = privateKeyToAccount(PACK_SELLER_PRIVATE_KEY);

export const faucetWalletClient = createWalletClient({
  account: faucetAccount,
  chain: anvil,
  transport: http(RPC_URL),
});

export const packSellerWalletClient = createWalletClient({
  account: packSellerAccount,
  chain: anvil,
  transport: http(RPC_URL),
});

export const packSellerAddress: Address = packSellerAccount.address;

import {
  createPublicClient,
  createWalletClient,
  http,
  type Account,
} from "viem";
import { anvil, POLL_INTERVAL_MS, RPC_URL } from "./config";

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(RPC_URL),
  pollingInterval: POLL_INTERVAL_MS,
});

export function walletClientFor(account: Account) {
  return createWalletClient({
    account,
    chain: anvil,
    transport: http(RPC_URL),
  });
}

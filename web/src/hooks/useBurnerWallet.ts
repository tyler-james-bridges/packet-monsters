"use client";

import { useCallback, useEffect, useState } from "react";
import type { PrivateKeyAccount } from "viem/accounts";
import { mockUsdcAbi } from "@/lib/abi";
import { publicClient } from "@/lib/clients";
import { addresses, contractsDeployed, POLL_INTERVAL_MS } from "@/lib/config";
import { loadBurnerAccount } from "@/lib/burner";

export interface BurnerWalletState {
  account: PrivateKeyAccount | null;
  address: `0x${string}` | null;
  ethBalance: bigint;
  usdcBalance: bigint;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

export function useBurnerWallet(): BurnerWalletState {
  const [account, setAccount] = useState<PrivateKeyAccount | null>(null);
  const [ethBalance, setEthBalance] = useState(0n);
  const [usdcBalance, setUsdcBalance] = useState(0n);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Syncing from localStorage, an external system -- must run client-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccount(loadBurnerAccount());
  }, []);

  const refresh = useCallback(async () => {
    if (!account) return;
    setRefreshing(true);
    try {
      const eth = await publicClient.getBalance({ address: account.address });
      setEthBalance(eth);
      if (contractsDeployed) {
        const usdc = await publicClient.readContract({
          address: addresses.mockUsdc,
          abi: mockUsdcAbi,
          functionName: "balanceOf",
          args: [account.address],
        });
        setUsdcBalance(usdc);
      }
    } catch {
      // RPC unreachable (anvil not running) -- leave last known balances.
    } finally {
      setRefreshing(false);
    }
  }, [account]);

  useEffect(() => {
    if (!account) return;
    // Subscribing to chain state via polling -- an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [account, refresh]);

  return {
    account,
    address: account?.address ?? null,
    ethBalance,
    usdcBalance,
    refreshing,
    refresh,
  };
}

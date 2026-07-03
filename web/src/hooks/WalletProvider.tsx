"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useBurnerWallet, type BurnerWalletState } from "./useBurnerWallet";

const WalletContext = createContext<BurnerWalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useBurnerWallet();
  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): BurnerWalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

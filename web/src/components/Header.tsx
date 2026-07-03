"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "./CopyButton";
import { useWallet } from "@/hooks/WalletProvider";
import { formatEth, formatUsdc, truncateAddress } from "@/lib/format";
import { parseContractError } from "@/lib/errors";

const NAV = [
  { href: "/", label: "shop" },
  { href: "/collection", label: "collection" },
  { href: "/battle", label: "battle" },
  { href: "/leaderboard", label: "leaderboard" },
];

export function Header() {
  const { address, ethBalance, usdcBalance, refresh } = useWallet();
  const [funding, setFunding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFaucet() {
    if (!address || funding) return;
    setFunding(true);
    setError(null);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Faucet request failed");
      }
      await refresh();
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setFunding(false);
    }
  }

  return (
    <header className="border-b border-line bg-panel/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold tracking-widest text-surge text-glow">
            PACKET MONSTERS
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-xs uppercase tracking-wider text-muted">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-[11px]">
          {address ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-ink">{formatEth(ethBalance)}</span>
                <span className="text-muted">{formatUsdc(usdcBalance)} USDC</span>
              </div>
              <div className="flex items-center gap-1 rounded border border-line bg-panel-2 px-2 py-1">
                <span className="text-ink">{truncateAddress(address)}</span>
                <CopyButton value={address} />
              </div>
              <button
                type="button"
                onClick={handleFaucet}
                disabled={funding}
                className="rounded border border-surge/50 bg-surge/10 px-2 py-1 text-surge disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surge/20 transition-colors cursor-pointer"
              >
                {funding ? "funding..." : "faucet"}
              </button>
            </>
          ) : (
            <span className="text-muted">initializing burner...</span>
          )}
        </div>
      </div>
      {error && (
        <div className="mx-auto max-w-5xl px-4 pb-2 text-[11px] text-plasma">{error}</div>
      )}
      <nav className="md:hidden flex items-center gap-4 px-4 pb-2 text-xs uppercase tracking-wider text-muted overflow-x-auto">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-ink transition-colors shrink-0">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

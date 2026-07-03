"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackOpening } from "@/components/PackOpening";
import { useWallet } from "@/hooks/WalletProvider";
import { buyPack } from "@/lib/payClient";
import { fetchCardInstance } from "@/lib/onchain";
import { parseContractError } from "@/lib/errors";
import { contractsDeployed } from "@/lib/config";
import type { CardDef } from "@/lib/cards";

interface Revealed {
  tokenId: bigint;
  def: CardDef;
}

export default function ShopPage() {
  const { account } = useWallet();
  const router = useRouter();
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<Revealed[] | null>(null);

  async function handleBuy() {
    if (!account || buying) return;
    setBuying(true);
    setError(null);
    try {
      const result = await buyPack(account);
      const resolved = await Promise.all(
        result.tokenIds.map(async (tokenId) => {
          const instance = await fetchCardInstance(tokenId);
          return instance ? { tokenId, def: instance.def } : null;
        }),
      );
      const clean = resolved.filter((r): r is Revealed => r !== null);
      if (clean.length === 0) {
        throw new Error("Pack minted but card data could not be read from chain");
      }
      setPack(clean);
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setBuying(false);
    }
  }

  if (pack) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <PackOpening cards={pack} onDone={() => router.push("/collection")} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-12 text-center">
      <div>
        <h1 className="text-xl font-bold tracking-widest text-ink">BOOSTER PACK</h1>
        <p className="mt-1 text-xs text-muted">gotta cache &apos;em all</p>
      </div>

      <div className="relative flex h-72 w-48 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-surge/50 bg-panel shadow-[0_0_40px_rgba(59,130,246,0.25)]">
        <div className="holo-foil" />
        <span className="text-sm uppercase tracking-widest text-surge">packet monsters</span>
        <span className="mt-3 text-3xl font-bold text-ink">$0.05</span>
        <span className="mt-1 text-[10px] uppercase tracking-wider text-muted">3 random cards</span>
      </div>

      <p className="max-w-xs text-[11px] leading-relaxed text-muted">
        Every card is a real x402 API endpoint pulled from the live bazaar
        index. Rarity is priced: common under $0.01/call up to legendary at
        $1+.
      </p>

      <button
        type="button"
        onClick={handleBuy}
        disabled={buying || !account || !contractsDeployed}
        className="w-full rounded border border-surge bg-surge/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-surge disabled:cursor-not-allowed disabled:opacity-40 hover:bg-surge/20 transition-colors cursor-pointer"
      >
        {buying ? "paying + minting..." : "buy booster pack"}
      </button>

      {!contractsDeployed && (
        <p className="text-[10px] text-exotic">Contracts not deployed -- purchase disabled.</p>
      )}
      {error && <p className="text-[11px] text-plasma">{error}</p>}
    </div>
  );
}

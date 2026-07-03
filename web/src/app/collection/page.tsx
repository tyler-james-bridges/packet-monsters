"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { CardDetail } from "@/components/CardDetail";
import { useWallet } from "@/hooks/WalletProvider";
import { fetchOwnedCards, type OwnedCard } from "@/lib/onchain";
import { contractsDeployed } from "@/lib/config";
import { TYPES, RARITIES } from "@/lib/cards";
import { parseContractError } from "@/lib/errors";

export default function CollectionPage() {
  const { address } = useWallet();
  const [cards, setCards] = useState<OwnedCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<number | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<number | "all">("all");
  const [selected, setSelected] = useState<OwnedCard | null>(null);

  const load = useCallback(async () => {
    if (!address || !contractsDeployed) return;
    setLoading(true);
    setError(null);
    try {
      const owned = await fetchOwnedCards(address);
      setCards(owned);
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    // Loading owned cards from chain on mount / wallet change -- external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const filtered = cards.filter((c) => {
    if (typeFilter !== "all" && c.def.typeId !== typeFilter) return false;
    if (rarityFilter !== "all" && c.def.rarity !== rarityFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-sm font-bold uppercase tracking-widest text-ink">Collection</h1>
        <button
          type="button"
          onClick={load}
          disabled={loading || !contractsDeployed}
          className="rounded border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-muted hover:text-ink disabled:opacity-40 cursor-pointer"
        >
          {loading ? "refreshing..." : "refresh"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded border border-line bg-panel-2 px-2 py-1 text-ink"
        >
          <option value="all">all types</option>
          {TYPES.map((t, i) => (
            <option key={t.name} value={i}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded border border-line bg-panel-2 px-2 py-1 text-ink"
        >
          <option value="all">all rarities</option>
          {RARITIES.map((r, i) => (
            <option key={r.name} value={i}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {!contractsDeployed && (
        <p className="text-[11px] text-exotic">Contracts not deployed -- nothing to show yet.</p>
      )}
      {error && <p className="text-[11px] text-plasma">{error}</p>}
      {contractsDeployed && !loading && filtered.length === 0 && (
        <p className="text-[11px] text-muted">No cards yet. Buy a booster pack to get started.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((c) => (
          <Card key={c.tokenId.toString()} def={c.def} level={c.level} onClick={() => setSelected(c)} />
        ))}
      </div>

      {selected && <CardDetail card={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

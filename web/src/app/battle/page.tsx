"use client";

import { useCallback, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { Card } from "@/components/Card";
import { BattleReplayView } from "@/components/BattleReplay";
import { useWallet } from "@/hooks/WalletProvider";
import { fetchCardInstance, fetchOwnedCards, type OwnedCard } from "@/lib/onchain";
import { packetMonstersAbi } from "@/lib/abi";
import { publicClient, walletClientFor } from "@/lib/clients";
import { addresses, anvil, contractsDeployed } from "@/lib/config";
import { parseContractError } from "@/lib/errors";
import { simulateBattle, type BattleReplay, type Combatant } from "@/lib/battle";

export default function BattlePage() {
  const { account, address } = useWallet();
  const [owned, setOwned] = useState<OwnedCard[]>([]);
  const [loadingOwned, setLoadingOwned] = useState(false);
  const [yourCard, setYourCard] = useState<OwnedCard | null>(null);

  const [opponentInput, setOpponentInput] = useState("");
  const [opponent, setOpponent] = useState<{ tokenId: bigint; def: OwnedCard["def"]; level: number } | null>(null);
  const [loadingOpponent, setLoadingOpponent] = useState(false);
  const [opponentError, setOpponentError] = useState<string | null>(null);

  const [battling, setBattling] = useState(false);
  const [battleError, setBattleError] = useState<string | null>(null);
  const [result, setResult] = useState<{ a: Combatant; b: Combatant; replay: BattleReplay } | null>(null);

  const loadOwned = useCallback(async () => {
    if (!address || !contractsDeployed) return;
    setLoadingOwned(true);
    try {
      setOwned(await fetchOwnedCards(address));
    } finally {
      setLoadingOwned(false);
    }
  }, [address]);

  useEffect(() => {
    // Loading owned cards from chain on mount / wallet change -- external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOwned();
  }, [loadOwned]);

  async function handleLoadOpponent() {
    const tokenId = BigInt(opponentInput || "0");
    setLoadingOpponent(true);
    setOpponentError(null);
    setOpponent(null);
    try {
      const instance = await fetchCardInstance(tokenId);
      if (!instance) throw new Error("No card found for that token id");
      setOpponent({ tokenId, def: instance.def, level: instance.level });
    } catch (e) {
      setOpponentError(parseContractError(e));
    } finally {
      setLoadingOpponent(false);
    }
  }

  async function handleBattle() {
    if (!account || !yourCard || !opponent || battling) return;
    setBattling(true);
    setBattleError(null);
    try {
      const wallet = walletClientFor(account);
      const hash = await wallet.writeContract({
        chain: anvil,
        address: addresses.packetMonsters,
        abi: packetMonstersAbi,
        functionName: "battle",
        args: [yourCard.tokenId, opponent.tokenId],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") throw new Error("Battle transaction reverted");

      let seed: bigint | null = null;
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== addresses.packetMonsters.toLowerCase()) continue;
        try {
          const decoded = decodeEventLog({
            abi: packetMonstersAbi,
            eventName: "BattleResult",
            data: log.data,
            topics: log.topics,
          });
          seed = (decoded.args as { seed: bigint }).seed;
          break;
        } catch {
          continue;
        }
      }
      if (seed === null) throw new Error("Could not find BattleResult event in receipt");

      const a: Combatant = {
        tokenId: yourCard.tokenId,
        name: yourCard.def.name,
        typeId: yourCard.def.typeId,
        hp: yourCard.def.hp,
        attack: yourCard.def.attack,
        speed: yourCard.def.speed,
        level: yourCard.level,
      };
      const b: Combatant = {
        tokenId: opponent.tokenId,
        name: opponent.def.name,
        typeId: opponent.def.typeId,
        hp: opponent.def.hp,
        attack: opponent.def.attack,
        speed: opponent.def.speed,
        level: opponent.level,
      };
      setResult({ a, b, replay: simulateBattle(seed, a, b) });
      await loadOwned();
    } catch (e) {
      setBattleError(parseContractError(e));
    } finally {
      setBattling(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink">Battle</h1>

      {!contractsDeployed && (
        <p className="mb-4 text-[11px] text-exotic">Contracts not deployed -- battles disabled.</p>
      )}

      {result ? (
        <div className="space-y-4">
          <BattleReplayView a={result.a} b={result.b} replay={result.replay} />
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setOpponent(null);
              setOpponentInput("");
            }}
            className="rounded border border-line px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
          >
            new battle
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <section>
            <h2 className="mb-2 text-[10px] uppercase tracking-wider text-muted">
              your card {loadingOwned && "(loading...)"}
            </h2>
            <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1">
              {owned.map((c) => (
                <Card
                  key={c.tokenId.toString()}
                  def={c.def}
                  level={c.level}
                  selected={yourCard?.tokenId === c.tokenId}
                  onClick={() => setYourCard(c)}
                />
              ))}
            </div>
            {contractsDeployed && !loadingOwned && owned.length === 0 && (
              <p className="mt-2 text-[11px] text-muted">No cards yet. Buy a pack first.</p>
            )}
          </section>

          <section>
            <h2 className="mb-2 text-[10px] uppercase tracking-wider text-muted">opponent token id</h2>
            <div className="flex gap-2">
              <input
                value={opponentInput}
                onChange={(e) => setOpponentInput(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="e.g. 12"
                className="w-full rounded border border-line bg-panel-2 px-2 py-1.5 text-xs text-ink"
              />
              <button
                type="button"
                onClick={handleLoadOpponent}
                disabled={loadingOpponent || !opponentInput}
                className="shrink-0 rounded border border-line px-2 py-1.5 text-[10px] uppercase tracking-wider text-muted hover:text-ink disabled:opacity-40 cursor-pointer"
              >
                {loadingOpponent ? "loading..." : "load"}
              </button>
            </div>
            {opponentError && <p className="mt-1 text-[11px] text-plasma">{opponentError}</p>}
            {opponent && (
              <div className="mt-3 w-32">
                <Card def={opponent.def} level={opponent.level} />
              </div>
            )}
          </section>
        </div>
      )}

      {!result && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleBattle}
            disabled={battling || !yourCard || !opponent || !contractsDeployed}
            className="w-full rounded border border-plasma bg-plasma/10 px-4 py-3 text-sm font-bold uppercase tracking-wider text-plasma disabled:cursor-not-allowed disabled:opacity-40 hover:bg-plasma/20 transition-colors cursor-pointer sm:w-auto"
          >
            {battling ? "battling..." : "battle"}
          </button>
          {battleError && <p className="mt-2 text-[11px] text-plasma">{battleError}</p>}
        </div>
      )}
    </div>
  );
}

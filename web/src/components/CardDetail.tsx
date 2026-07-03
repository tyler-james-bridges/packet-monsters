"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { fetchTokenURI, type OnchainMetadata } from "@/lib/tokenUri";
import { typeInfo, rarityInfo } from "@/lib/cards";
import type { OwnedCard } from "@/lib/onchain";

export function CardDetail({ card, onClose }: { card: OwnedCard; onClose: () => void }) {
  const [meta, setMeta] = useState<OnchainMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const info = typeInfo(card.def.typeId);
  const rarity = rarityInfo(card.def.rarity);

  useEffect(() => {
    let cancelled = false;
    // Reading tokenURI from chain -- external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchTokenURI(card.tokenId).then((result) => {
      if (!cancelled) {
        setMeta(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [card.tokenId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-line bg-panel p-4 sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full shrink-0 sm:w-40">
          <Card def={card.def} level={card.level} />
        </div>
        <div className="flex-1 space-y-3 text-xs">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-ink">{card.def.name}</h2>
              <p className="text-muted">{card.def.host}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted hover:text-ink cursor-pointer"
              aria-label="Close"
            >
              close
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <dt className="text-muted">token id</dt>
            <dd className="text-ink">{card.tokenId.toString()}</dd>
            <dt className="text-muted">type</dt>
            <dd style={{ color: info.hex }}>{info.name}</dd>
            <dt className="text-muted">rarity</dt>
            <dd style={{ color: rarity.hex }}>{rarity.name}</dd>
            <dt className="text-muted">level</dt>
            <dd className="text-ink">{card.level}</dd>
            <dt className="text-muted">network</dt>
            <dd className="text-ink">{card.def.network}</dd>
            <dt className="text-muted">price</dt>
            <dd className="text-ink">${card.def.priceUsd} / call</dd>
            <dt className="text-muted">latency</dt>
            <dd className="text-ink">{card.def.latencyMs}ms</dd>
            <dt className="text-muted">status</dt>
            <dd className="text-ink">{card.def.alive ? "live" : "dead endpoint"}</dd>
          </dl>

          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wider text-muted">onchain tokenURI art</p>
            <div className="flex h-32 items-center justify-center rounded border border-line bg-panel-2">
              {loading ? (
                <span className="text-[10px] text-muted pulse-soft">reading tokenURI...</span>
              ) : meta?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meta.image} alt={`${card.def.name} onchain art`} className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-muted">no tokenURI available</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

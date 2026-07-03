"use client";

import { useRef, type PointerEvent } from "react";
import { CardArt } from "./CardArt";
import { StatBar } from "./StatBar";
import { GHOST_TYPE_ID, rarityInfo, typeInfo, type CardDef } from "@/lib/cards";

interface CardProps {
  def: CardDef;
  level?: number;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

// Trading-card proportions 63:88. Holo shimmer + tilt on rare+ (rarity >= 2),
// static shimmer on touch. GHOST cards flicker.
export function Card({ def, level = 1, className = "", onClick, selected }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const info = typeInfo(def.typeId);
  const rarity = rarityInfo(def.rarity);
  const isHolo = def.rarity >= 2;
  const isGhost = def.typeId === GHOST_TYPE_ID;

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!isHolo || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty("--mx", String(px));
    ref.current.style.setProperty("--my", String(py));
    const rx = ((py - 50) / 50) * -6;
    const ry = ((px - 50) / 50) * 6;
    ref.current.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handlePointerLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`group relative aspect-[63/88] w-full overflow-hidden rounded-xl border bg-panel transition-shadow duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${isGhost ? "ghost-flicker" : ""} ${className}`}
      style={{
        borderColor: selected ? info.hex : `${info.hex}55`,
        boxShadow: selected
          ? `0 0 0 2px ${info.hex}, 0 0 24px ${info.hex}66`
          : `0 0 14px ${info.hex}33`,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="relative h-[46%] w-full">
        <CardArt urlHash={def.urlHash} typeId={def.typeId} alive={def.alive} />
        {isHolo && <div className="holo-foil" />}
        <div className="absolute left-1.5 top-1.5 flex gap-0.5">
          {Array.from({ length: def.rarity + 1 }, (_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: rarity.hex, boxShadow: `0 0 4px ${rarity.hex}` }}
            />
          ))}
        </div>
        <span
          className="absolute right-1.5 top-1.5 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide"
          style={{ color: info.hex, background: "#07070bcc", border: `1px solid ${info.hex}55` }}
        >
          {info.name}
        </span>
        {!def.alive && (
          <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1 py-0.5 text-[7px] uppercase tracking-wide text-muted">
            dead endpoint
          </span>
        )}
      </div>

      <div className="flex h-[54%] flex-col justify-between px-2 py-1.5">
        <div>
          <div className="truncate text-[10px] font-bold leading-tight text-ink">{def.name}</div>
          <div className="truncate text-[8px] text-muted">{def.host}</div>
          {level > 1 && (
            <div className="text-[8px] text-exotic">lvl {level}</div>
          )}
        </div>
        <div className="space-y-0.5">
          <StatBar label="hp" value={def.hp} max={130} color="var(--color-ghost)" />
          <StatBar label="atk" value={def.attack} max={100} color="var(--color-plasma)" />
          <StatBar label="spd" value={def.speed} max={100} color="var(--color-frost)" />
        </div>
        <div className="flex items-center justify-between text-[8px] text-muted">
          <span>${def.priceUsd} / call</span>
          <span>{def.latencyMs}ms</span>
        </div>
      </div>
    </div>
  );
}

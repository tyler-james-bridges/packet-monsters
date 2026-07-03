"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { effectiveStats, type BattleReplay as Replay, type Combatant } from "@/lib/battle";
import { typeInfo } from "@/lib/cards";

const TURN_MS = 900;

export function BattleReplayView({
  a,
  b,
  replay,
}: {
  a: Combatant;
  b: Combatant;
  replay: Replay;
}) {
  const [step, setStep] = useState(-1); // -1 = not started
  const [playing, setPlaying] = useState(true);
  const maxHpA = replay.maxHpA;
  const maxHpB = replay.maxHpB;
  const infoA = typeInfo(a.typeId);
  const infoB = typeInfo(b.typeId);

  const done = step >= replay.turns.length - 1;

  useEffect(() => {
    if (!playing || done) return;
    const id = setTimeout(() => setStep((s) => Math.min(s + 1, replay.turns.length - 1)), TURN_MS);
    return () => clearTimeout(id);
  }, [playing, done, replay.turns.length, step]);

  const current = step >= 0 ? replay.turns[step] : null;
  const hpA = current ? current.hpA : maxHpA;
  const hpB = current ? current.hpB : maxHpB;

  const flashColor = current
    ? current.attacker === "A"
      ? infoA.hex
      : infoB.hex
    : null;

  const winnerName = replay.winner === "A" ? a.name : b.name;

  const shakeKey = useMemo(() => (current?.crit ? step : -1), [current, step]);

  return (
    <motion.div
      key={shakeKey}
      animate={current?.crit ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-line bg-panel p-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <Fighter name={a.name} color={infoA.hex} hp={hpA} maxHp={maxHpA} level={a.level} align="left" />
        <Fighter name={b.name} color={infoB.hex} hp={hpB} maxHp={maxHpB} level={b.level} align="right" />
      </div>

      <div
        className="my-4 flex h-16 items-center justify-center rounded border text-center text-xs transition-colors duration-200"
        style={{
          borderColor: flashColor ? `${flashColor}88` : "var(--color-line)",
          background: flashColor ? `${flashColor}22` : "transparent",
        }}
      >
        {step === -1 ? (
          <span className="text-muted">battle starting...</span>
        ) : current ? (
          <MoveLine turn={current} attackerName={current.attacker === "A" ? a.name : b.name} attackerType={current.attacker === "A" ? infoA : infoB} />
        ) : null}
      </div>

      {done && step >= 0 && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs font-bold uppercase tracking-wider text-ghost text-glow"
        >
          {winnerName} wins
        </motion.p>
      )}

      {!done && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
          >
            {playing ? "pause" : "resume"}
          </button>
          <button
            type="button"
            onClick={() => setStep(replay.turns.length - 1)}
            className="rounded border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
          >
            skip to result
          </button>
        </div>
      )}
    </motion.div>
  );
}

function Fighter({
  name,
  color,
  hp,
  maxHp,
  level,
  align,
}: {
  name: string;
  color: string;
  hp: number;
  maxHp: number;
  level: number;
  align: "left" | "right";
}) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="flex items-center justify-between gap-2 text-[11px]">
        {align === "left" ? (
          <>
            <span className="truncate text-ink" style={{ color }}>{name}</span>
            <span className="text-muted">lvl {level}</span>
          </>
        ) : (
          <>
            <span className="text-muted">lvl {level}</span>
            <span className="truncate text-ink" style={{ color }}>{name}</span>
          </>
        )}
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-panel-2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="mt-0.5 text-[9px] text-muted tabular-nums">
        {hp} / {maxHp} hp
      </div>
    </div>
  );
}

function MoveLine({
  turn,
  attackerName,
  attackerType,
}: {
  turn: Replay["turns"][number];
  attackerName: string;
  attackerType: ReturnType<typeof typeInfo>;
}) {
  if (turn.miss) {
    return (
      <span className="text-[11px] text-muted">
        {attackerName} used {attackerType.move} -- 408 Request Timeout
      </span>
    );
  }
  return (
    <span className="text-[11px]" style={{ color: attackerType.hex }}>
      {attackerName} used {attackerType.move}
      {turn.crit ? " -- 5xx CRITICAL" : ""} -- {turn.damage} dmg
    </span>
  );
}

export function initialCombatant(
  tokenId: bigint,
  name: string,
  typeId: number,
  hp: number,
  attack: number,
  speed: number,
  level: number,
): Combatant {
  return { tokenId, name, typeId, hp, attack, speed, level };
}

export { effectiveStats };

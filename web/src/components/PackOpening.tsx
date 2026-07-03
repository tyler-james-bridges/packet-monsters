"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Card } from "./Card";
import { rarityInfo, type CardDef } from "@/lib/cards";

interface RevealCard {
  tokenId: bigint;
  def: CardDef;
}

type Stage = "sealed" | "tearing" | "revealed";

// The hero moment: sealed pack -> tear -> three cards fly out face-down ->
// tap each to flip with a rarity-colored glow burst.
export function PackOpening({
  cards,
  onDone,
}: {
  cards: RevealCard[];
  onDone: () => void;
}) {
  const [stage, setStage] = useState<Stage>("sealed");
  const [flipped, setFlipped] = useState<boolean[]>(cards.map(() => false));

  const allFlipped = flipped.every(Boolean);

  function openPack() {
    setStage("tearing");
    setTimeout(() => setStage("revealed"), 650);
  }

  function flip(i: number) {
    setFlipped((prev) => prev.map((v, idx) => (idx === i ? true : v)));
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <AnimatePresence mode="wait">
        {stage !== "revealed" && (
          <motion.button
            key="pack"
            type="button"
            onClick={openPack}
            disabled={stage === "tearing"}
            initial={{ scale: 1, rotate: 0 }}
            animate={
              stage === "tearing"
                ? { scale: [1, 1.08, 0.9], rotate: [0, -3, 6], opacity: [1, 1, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 0.6 }}
            className="relative flex h-72 w-48 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-surge/60 bg-panel shadow-[0_0_40px_rgba(59,130,246,0.35)]"
          >
            <div className="holo-foil" />
            <span className="text-lg font-bold tracking-widest text-surge text-glow">
              BOOSTER
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-wider text-muted">
              3 endpoints inside
            </span>
            <span className="mt-6 text-[11px] text-ink">
              {stage === "sealed" ? "tap to tear open" : "tearing..."}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {stage === "revealed" && (
        <>
          <div className="grid w-full max-w-3xl grid-cols-3 gap-3 px-4 sm:gap-6">
            {cards.map((c, i) => (
              <FlipCard
                key={c.tokenId.toString()}
                def={c.def}
                index={i}
                flipped={flipped[i]}
                onFlip={() => flip(i)}
              />
            ))}
          </div>
          <AnimatePresence>
            {allFlipped && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                type="button"
                onClick={onDone}
                className="rounded border border-ghost/60 bg-ghost/10 px-4 py-2 text-xs uppercase tracking-wider text-ghost hover:bg-ghost/20 transition-colors cursor-pointer"
              >
                add to collection
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function FlipCard({
  def,
  index,
  flipped,
  onFlip,
}: {
  def: CardDef;
  index: number;
  flipped: boolean;
  onFlip: () => void;
}) {
  const rarity = rarityInfo(def.rarity);
  return (
    <motion.div
      initial={{ opacity: 0, y: -40, rotate: index === 1 ? 0 : index === 0 ? -8 : 8 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay: 0.12 * index, type: "spring", stiffness: 220, damping: 20 }}
      className="relative"
      style={{ perspective: 800 }}
    >
      {flipped && (
        <motion.div
          initial={{ opacity: 0.9, scale: 0.4 }}
          animate={{ opacity: 0, scale: 2.2 }}
          transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0 z-10 rounded-xl"
          style={{ background: `radial-gradient(circle, ${rarity.hex}aa, transparent 70%)` }}
        />
      )}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative aspect-[63/88] w-full"
      >
        <button
          type="button"
          onClick={onFlip}
          disabled={flipped}
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-surge/50 bg-panel-2 shadow-[0_0_16px_rgba(59,130,246,0.25)] cursor-pointer disabled:cursor-default"
        >
          <span className="text-2xl text-surge">?</span>
          <span className="text-[8px] uppercase tracking-wider text-muted">tap to flip</span>
        </button>
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0"
        >
          <Card def={def} />
        </div>
      </motion.div>
    </motion.div>
  );
}

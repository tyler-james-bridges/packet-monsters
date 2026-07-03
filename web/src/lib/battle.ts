import { encodeAbiParameters, hexToBigInt, keccak256 } from "viem";
import { GHOST_TYPE_ID } from "./cards";

// Deterministic replay of the onchain battle math from SPEC.md. Must match
// the contract exactly so the animation always agrees with the stored winner.

export interface Combatant {
  tokenId: bigint;
  name: string;
  typeId: number;
  hp: number; // base def hp
  attack: number; // base def attack
  speed: number;
  level: number; // each level above 1 adds +2 hp and +1 attack
}

export interface TurnEvent {
  turnIndex: number;
  attacker: "A" | "B";
  miss: boolean;
  crit: boolean;
  damage: number;
  hpA: number; // remaining after this turn
  hpB: number;
}

export interface BattleReplay {
  turns: TurnEvent[];
  winner: "A" | "B";
  winnerTokenId: bigint;
  maxHpA: number;
  maxHpB: number;
}

export function effectiveStats(c: Combatant): { hp: number; attack: number } {
  const bonus = Math.max(0, c.level - 1);
  return { hp: c.hp + 2 * bonus, attack: c.attack + bonus };
}

function roll(seed: bigint, turnIndex: number): bigint {
  return hexToBigInt(
    keccak256(
      encodeAbiParameters(
        [{ type: "uint256" }, { type: "uint256" }],
        [seed, BigInt(turnIndex)],
      ),
    ),
  );
}

export function simulateBattle(
  seed: bigint,
  a: Combatant,
  b: Combatant,
): BattleReplay {
  const effA = effectiveStats(a);
  const effB = effectiveStats(b);
  let hpA = BigInt(effA.hp);
  let hpB = BigInt(effB.hp);

  // Faster card attacks first; speed ties go to tokenA.
  const aFirst = a.speed >= b.speed;
  const turns: TurnEvent[] = [];
  let winner: "A" | "B" | null = null;

  for (let turnIndex = 0; turnIndex < 64; turnIndex++) {
    const attackerIsA = aFirst ? turnIndex % 2 === 0 : turnIndex % 2 === 1;
    const attacker = attackerIsA ? a : b;
    const defender = attackerIsA ? b : a;
    const r = roll(seed, turnIndex);
    const pct = r % 100n;
    const miss = pct >= 90n;
    const crit = pct < 10n;
    let damage = 0n;

    if (!miss) {
      let atk = BigInt(attackerIsA ? effA.attack : effB.attack);
      if (
        attacker.typeId === GHOST_TYPE_ID &&
        defender.typeId !== GHOST_TYPE_ID
      ) {
        atk += 15n;
      }
      damage = (atk * (100n + (r % 21n))) / 100n;
      if (crit) damage *= 2n;
      if (attackerIsA) {
        hpB = hpB > damage ? hpB - damage : 0n;
      } else {
        hpA = hpA > damage ? hpA - damage : 0n;
      }
    }

    turns.push({
      turnIndex,
      attacker: attackerIsA ? "A" : "B",
      miss,
      crit: !miss && crit,
      damage: Number(damage),
      hpA: Number(hpA),
      hpB: Number(hpB),
    });

    if (hpA === 0n || hpB === 0n) {
      winner = hpA === 0n ? "B" : "A";
      break;
    }
  }

  if (winner === null) {
    // Turn cap: higher remaining hp wins, ties broken by lower tokenId.
    if (hpA > hpB) winner = "A";
    else if (hpB > hpA) winner = "B";
    else winner = a.tokenId < b.tokenId ? "A" : "B";
  }

  return {
    turns,
    winner,
    winnerTokenId: winner === "A" ? a.tokenId : b.tokenId,
    maxHpA: effA.hp,
    maxHpB: effB.hp,
  };
}

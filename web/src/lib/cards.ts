import cardsJson from "@/data/cards.json";

export interface CardDef {
  id: number;
  name: string;
  host: string;
  urlHash: string;
  hp: number;
  attack: number;
  speed: number;
  typeId: number;
  rarity: number;
  priceUsd: string;
  latencyMs: number;
  alive: boolean;
  network: string;
}

export const cards: CardDef[] = cardsJson as CardDef[];
export const cardById = new Map(cards.map((c) => [c.id, c]));

export interface TypeInfo {
  name: string;
  hex: string;
  cssVar: string;
  move: string;
}

export const TYPES: TypeInfo[] = [
  { name: "SURGE", hex: "#3b82f6", cssVar: "var(--color-surge)", move: "200 OK Slam" },
  { name: "PHANTOM", hex: "#a78bfa", cssVar: "var(--color-phantom)", move: "301 Redirect" },
  { name: "PLASMA", hex: "#d946ef", cssVar: "var(--color-plasma)", move: "PATCH Burn" },
  { name: "FROST", hex: "#67e8f9", cssVar: "var(--color-frost)", move: "Cache Freeze" },
  { name: "EXOTIC", hex: "#fbbf24", cssVar: "var(--color-exotic)", move: "418 Teapot Toss" },
  { name: "SANDBOX", hex: "#94a3b8", cssVar: "var(--color-sandbox)", move: "Mock Response" },
  { name: "GHOST", hex: "#4ade80", cssVar: "var(--color-ghost)", move: "503 Service Unavailable" },
];

export const GHOST_TYPE_ID = 6;

export interface RarityInfo {
  name: string;
  hex: string;
}

export const RARITIES: RarityInfo[] = [
  { name: "COMMON", hex: "#94a3b8" },
  { name: "UNCOMMON", hex: "#34d399" },
  { name: "RARE", hex: "#38bdf8" },
  { name: "EPIC", hex: "#c084fc" },
  { name: "LEGENDARY", hex: "#fbbf24" },
];

export function typeInfo(typeId: number): TypeInfo {
  return TYPES[typeId] ?? TYPES[5];
}

export function rarityInfo(rarity: number): RarityInfo {
  return RARITIES[rarity] ?? RARITIES[0];
}

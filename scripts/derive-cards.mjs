// Derives data/cards.json from data/x402-index.json (real x402 bazaar data).
// Stat formulas here are the single source of truth referenced by SPEC.md.
import { readFileSync, writeFileSync } from "node:fs";
import { keccak256, toBytes } from "viem";

const index = JSON.parse(readFileSync(new URL("../data/x402-index.json", import.meta.url)));

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));

const TESTNET = /(sepolia|testnet|devnet|amoy|fuji)/i;

// Assign the most distinctive mainnet the endpoint supports, so the type
// spread reflects the whole bazaar rather than everyone's default (base).
function typeIdFor(networks, alive) {
  if (!alive) return 6; // GHOST
  const mains = (networks || []).map((n) => n.toLowerCase()).filter((n) => !TESTNET.test(n));
  if (mains.length === 0) return 5; // SANDBOX (testnet-only)
  const has = (pred) => mains.some(pred);
  if (has((n) => n.startsWith("avalanche") || n === "eip155:43114")) return 3; // FROST
  if (has((n) => n.startsWith("polygon") || n === "eip155:137")) return 2; // PLASMA
  if (has((n) => n.startsWith("keeta") || n.startsWith("sei") || n.startsWith("monad") || n.startsWith("xdc"))) return 4; // EXOTIC
  if (has((n) => n.startsWith("solana"))) return 1; // PHANTOM
  return 0; // SURGE (base and other EVM)
}

function rarityFor(priceUsd) {
  if (priceUsd < 0.01) return 0;
  if (priceUsd < 0.05) return 1;
  if (priceUsd < 0.25) return 2;
  if (priceUsd < 1) return 3;
  return 4;
}

function nameFor(url) {
  const u = new URL(url);
  const host = u.hostname.replace(/^(www|api|x402)\./, "");
  const label = host.split(".")[0];
  const segs = u.pathname.split("/").filter(Boolean);
  // last meaningful path segment, skipping ids/uuids/hex
  const meaningful = segs
    .filter((s) => !/^[0-9a-f-]{16,}$/i.test(s) && !/^v\d+$/i.test(s) && s !== "api" && s !== "proxy")
    .pop();
  const name = meaningful ? `${label} ${meaningful}` : label;
  return name.replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 28).trim();
}

const seen = new Set();
const cards = [];

const resources = [...index.resources].sort((a, b) => a.url.localeCompare(b.url));

for (const r of resources) {
  if (!r.url || seen.has(r.url)) continue;
  const p = r.pricing?.[0];
  if (!p || !p.maxAmountRequired) continue;
  seen.add(r.url);

  const priceUsd = Number(p.maxAmountRequired) / 1e6; // stablecoin, 6 decimals
  if (!Number.isFinite(priceUsd) || priceUsd <= 0 || priceUsd > 1000) continue;

  const alive = Boolean(r.health?.isAlive);
  const latencyMs = r.health?.latencyMs ?? 1500;
  const timeoutSec = p.maxTimeoutSeconds ?? 60;

  // Healthy fast services are hardier: timeout headroom + measured latency
  const latFactor = (1500 - Math.min(latencyMs, 1500)) / 40;
  const hp = alive
    ? clamp(40 + Math.min(timeoutSec, 120) / 3 + latFactor, 40, 120)
    : clamp(22 + Math.min(timeoutSec, 120) / 6 + latFactor / 2, 22, 60);
  const attack = clamp(12 + 30 * Math.log10(1 + priceUsd * 200), 12, 99);
  const speed = clamp(100 - latencyMs / 15, 8, 98);

  cards.push({
    id: cards.length + 1,
    name: nameFor(r.url),
    host: new URL(r.url).hostname,
    urlHash: keccak256(toBytes(r.url)),
    hp,
    attack,
    speed,
    typeId: typeIdFor(
      r.networksSupported?.length ? r.networksSupported : [p.network],
      alive
    ),
    rarity: rarityFor(priceUsd),
    priceUsd: priceUsd.toFixed(priceUsd < 0.01 ? 4 : 2),
    latencyMs,
    alive,
    network: p.network,
  });
}

// Dedupe display names by suffixing a counter
const nameCounts = {};
for (const c of cards) {
  nameCounts[c.name] = (nameCounts[c.name] || 0) + 1;
  if (nameCounts[c.name] > 1) c.name = `${c.name} ${nameCounts[c.name]}`.slice(0, 28);
}

writeFileSync(
  new URL("../data/cards.json", import.meta.url),
  JSON.stringify(cards, null, 1) + "\n"
);

const byType = {};
const byRarity = {};
for (const c of cards) {
  byType[c.typeId] = (byType[c.typeId] || 0) + 1;
  byRarity[c.rarity] = (byRarity[c.rarity] || 0) + 1;
}
console.log(`cards: ${cards.length}`);
console.log("byType", byType, "byRarity", byRarity);

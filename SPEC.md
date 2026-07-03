# PACKET MONSTERS

Trading-card battler where every card is a real x402 API endpoint. Buy booster
packs via x402 micropayment, cards mint as ERC-721s with fully onchain SVG art,
battles post feedback to an ERC-8004 Reputation Registry.

Tagline: "gotta cache 'em all"

## Ground rules (both agents)

- No emojis anywhere. No em dashes. No fake/placeholder data.
- All card stats derive from `data/cards.json`, generated from real x402
  bazaar indexer data (`data/x402-index.json`) by `scripts/derive-cards.mjs`.
- Localhost first: anvil (chain id 31337), no real funds, no external RPC.
- Say "onchain" not "on-chain".
- Mobile-first UI.

## Repo layout

```
contracts/   Foundry project (contracts agent owns this dir)
web/         Next.js app (frontend agent owns this dir)
data/        x402-index.json (raw), cards.json (derived, committed)
scripts/     derive-cards.mjs (already written, do not modify)
```

Agents must not write outside their directory except reading `data/` and this
file.

## Card model (frozen -- both sides depend on it)

`data/cards.json` is an array of card definitions:

```json
{
  "id": 1,
  "name": "stableenrich exa-search",
  "host": "stableenrich.dev",
  "urlHash": "0x...keccak256 of full url",
  "hp": 92,
  "attack": 34,
  "speed": 71,
  "typeId": 0,
  "rarity": 1,
  "priceUsd": "0.02",
  "latencyMs": 210,
  "alive": true,
  "network": "base"
}
```

Types (typeId): 0 SURGE (base), 1 PHANTOM (solana), 2 PLASMA (polygon),
3 FROST (avalanche), 4 EXOTIC (sei/monad/keeta/other), 5 SANDBOX (testnets),
6 GHOST (endpoint dead at index time -- overrides network type).

Rarity: 0 common (<$0.01), 1 uncommon (<$0.05), 2 rare (<$0.25),
3 epic (<$1), 4 legendary (>=$1). GHOST cards keep price rarity.

Stat formulas live in `scripts/derive-cards.mjs`; contracts and web treat
cards.json as the source of truth. Card definitions are loaded into the
contract at deploy time by the deploy script.

## Contract interface (frozen)

One game contract, `contracts/src/PacketMonsters.sol` (ERC-721, OZ base):

```solidity
struct CardDef { string name; string host; bytes32 urlHash; uint8 hp; uint8 attack; uint8 speed; uint8 typeId; uint8 rarity; bool alive; }
struct Card    { uint16 defId; uint8 level; }

function addCardDefs(CardDef[] calldata defs) external;           // onlyOwner, deploy-time seeding
function mintPack(address to, uint256 seed) external returns (uint256[3] memory tokenIds); // onlyPackSeller
function battle(uint256 tokenA, uint256 tokenB) external returns (uint256 winner);
function cardOf(uint256 tokenId) external view returns (CardDef memory, Card memory);
function tokenURI(uint256 tokenId) public view returns (string memory); // onchain SVG, base64 data URI

event PackOpened(address indexed to, uint256[3] tokenIds, uint256 seed);
event BattleResult(uint256 indexed tokenA, uint256 indexed tokenB, uint256 winner, uint256 seed);
```

- `packSeller` is an address set at deploy (the web server's local signer).
  It mints after verifying x402 payment. Owner can update it.
- `mintPack` picks 3 defIds pseudorandomly from the seed with rarity
  weighting: common 45%, uncommon 30%, rare 15%, epic 7%, legendary 3%.
- `battle` may only be called by an owner of one of the two tokens. Same-owner
  battles are allowed (practice mode) but reputation feedback only fires for
  different-owner battles. Seed =
  `uint256(keccak256(abi.encode(block.prevrandao, tokenA, tokenB, nonce++)))`.
- Battle math (deterministic, web replay must match exactly):
  turn-based, faster card attacks first; per turn
  `roll = uint256(keccak256(abi.encode(seed, turnIndex)))`;
  miss when `roll % 100 >= 90`; crit (x2 damage) when `roll % 100 < 10`;
  damage = `attack * (100 + roll % 21) / 100`.
  GHOST attacking non-GHOST gets +15 attack. First card to reduce the other
  to 0 hp wins. Cap 64 turns; at cap, higher remaining hp wins, ties broken
  by lower tokenId.
- Winner card levels up (+1 level, max 99). In battle math each level above 1
  adds +2 hp and +1 attack.

ERC-8004: minimal `IdentityRegistry` (ERC-721 agent ids) and
`ReputationRegistry` in `contracts/src/erc8004/`. Contracts agent verifies the
real ERC-8004 interface shape (via ethskills standards skill / eips.ethereum.org)
and keeps the minimal version faithful to it. Deploy script registers each
unique endpoint host as an agent; PacketMonsters posts positive feedback tagged
`packet-monsters-battle` for the winning card's agent after each
different-owner battle.

MockUSDC: 6 decimals, mintable by anyone (local only). Implement EIP-3009
`transferWithAuthorization` if feasible so the x402 payment is a real gasless
signature flow; otherwise plain ERC-20 and the web tier verifies a direct
transfer.

Deploy script (`contracts/script/Deploy.s.sol` plus a JS seeder if needed):
deploys MockUSDC, registries, PacketMonsters; seeds all card defs from
`data/cards.json`; registers agents; writes addresses + ABIs to
`contracts/deployment.json` (documented in contracts/README.md) so the
orchestrator can wire the web app at integration.

## Web app (frontend agent)

Next.js (App Router) + Tailwind v4 + viem. TypeScript strict.

### Design system -- this is a hero surface, treat it like a product

Aesthetic: retro-arcade holographic TCG. Near-black background (#07070b
range), CRT scanline overlay at low opacity, monospace display type (Geist
Mono or similar), neon accent glow per card type:

- SURGE electric blue (#3b82f6), PHANTOM violet (#a78bfa), PLASMA magenta
  (#d946ef), FROST ice cyan (#67e8f9), EXOTIC amber (#fbbf24), SANDBOX
  slate (#94a3b8), GHOST toxic green (#4ade80).

Define these as CSS custom properties / Tailwind theme tokens, not scattered
hex literals. Dark-only is fine, but then do not ship a theme toggle
(ethskills frontend-ux Rule 6).

Card component is the centerpiece:
- Trading-card proportions (63:88), rounded corners, type-colored border glow.
- Renders the onchain tokenURI SVG for authenticity in collection views; a
  richer HTML/CSS version for interactive views is fine as long as stats and
  art elements match.
- Holo foil effect for rare+ (animated gradient shimmer that tracks pointer
  tilt on desktop, gyro-free static shimmer on mobile).
- Rarity shown as pips or a badge; GHOST cards get a flicker/static
  animation.
- Stats bar: HP / ATK / SPD with small meters, price and latency as flavor
  text ("$0.02 per call", "210ms").

The pack opening is the hero moment: sealed pack graphic, tear animation,
three cards fly out face-down, tap/click each to flip with 3D rotation and a
glow burst matching rarity. Must feel great on a phone. framer-motion is
allowed.

Battles render as a turn log with animated HP bars draining per hit, screen
shake on crit, type-colored attack flashes. HTTP-themed move names by
attacker type: SURGE "200 OK Slam", PHANTOM "301 Redirect", PLASMA "PATCH
Burn", FROST "Cache Freeze", EXOTIC "418 Teapot Toss", SANDBOX "Mock
Response", GHOST "503 Service Unavailable". Crits show "5xx CRITICAL",
misses show "408 Request Timeout". The replay must be computed from the
BattleResult seed with the exact contract math so the animation always
matches the onchain winner.

### ethskills frontend-ux rules (mandatory)

- Every onchain button has its own pending state, disables on click, releases
  in `finally`. No shared isLoading.
- Contract errors are translated to human-readable inline messages near the
  button. Never show raw revert data or fail silently.
- All token amounts via `formatUnits` (USDC is 6 decimals); show dollar
  context (MockUSDC is dollar-pegged, so "$0.05" is the USD context).
- Addresses truncated with copy button.
- Favicon, tab title, OG title/description set to Packet Monsters identity.
  No template branding left behind.

### Wallet model

Burner wallet auto-generated and kept in localStorage, funded via
`POST /api/faucet` (uses anvil default account #0 to send ETH + mint
MockUSDC). No extension needed. Show the burner address + balances (ETH and
USDC with $ context) in the header.

### Pages

- `/` shop: one product, a booster pack, $0.05 in MockUSDC. Buy flow does a
  real HTTP 402 dance: `GET /api/pack` returns status 402 with a
  `PAYMENT-REQUIRED` header (base64 JSON, x402 V2 shape: scheme "exact",
  network `eip155:31337`, asset MockUSDC address, payTo pack seller,
  maxAmountRequired "50000", description). Client pays (EIP-3009 signature
  if MockUSDC supports it, else transfer + tx hash in a `PAYMENT` header),
  server verifies onchain, calls `mintPack`, responds with tokenIds. Then
  the pack-opening sequence plays.
- `/collection`: gallery of owned cards, filter by type/rarity, card detail
  view showing the raw onchain SVG and endpoint metadata.
- `/battle`: pick one of your cards and any opponent token, per-button
  pending states through the battle tx, then the animated replay.
- `/leaderboard`: reads ReputationRegistry feedback events and ranks endpoint
  agents by wins. Framed explicitly as "ERC-8004 reputation, live from the
  registry", with agent id and host shown.

Config: single `web/src/lib/config.ts`; addresses imported from a local
`deployment.json` copied in at integration (define the import, tolerate the
file being absent until then). RPC http://127.0.0.1:8545, poll interval 2-4s.

## Definition of done (integration, done by orchestrator)

- `anvil` + deploy + `pnpm dev` in web -> full loop works: faucet, 402 pack
  purchase, pack opening, collection, battle with animation matching onchain
  winner, leaderboard showing 8004 feedback.
- Foundry tests pass: pack rarity distribution sanity, battle determinism,
  level-up, feedback emission, tokenURI validity.

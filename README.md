# PACKET MONSTERS

Gotta cache 'em all.

A trading-card battler where every card is a real x402 API endpoint from the
bazaar. Stats derive from real metrics: attack from the endpoint's x402 price,
speed from measured latency, HP from health and timeout headroom. Dead
endpoints come back as GHOST-type cards.

- Booster packs are bought through a real HTTP 402 payment flow (x402)
- Cards are ERC-721s with fully onchain SVG art
- Battle results post feedback to an ERC-8004 Reputation Registry, so the
  leaderboard is literally an onchain agent reputation graph of x402 services

See SPEC.md for the full design. Card data is derived from
`data/x402-index.json` (x402 bazaar indexer output) by
`scripts/derive-cards.mjs`.

## Local dev

```
anvil                          # terminal 1
cd contracts && <deploy>       # see contracts/README.md
cd web && pnpm install && pnpm dev
```

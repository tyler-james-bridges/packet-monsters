# Packet Monsters -- contracts

Foundry project implementing the frozen interface from `../SPEC.md`. Owns
this directory only.

## Dependencies

`forge install` git submodules misbehave inside this worktree (the worktree
shares a `.git` with the parent repo via `.git/worktrees/...`, and
`forge install`'s submodule handling pollutes the parent repo's git state).
The fallback used here:

- `lib/forge-std` -- vendored directly (git-cloned at tag `v1.16.2`, `.git`
  stripped, committed as plain files under `contracts/lib/`).
- `@openzeppelin/contracts` -- installed via `npm install` (pinned exact
  version `5.6.1` in `package.json`), referenced through `remappings.txt`.

No git submodules are used anywhere in this project.

## Contracts

- `src/PacketMonsters.sol` -- ERC-721 game contract. Card defs, pack
  minting, deterministic battles, onchain SVG `tokenURI`.
- `src/erc8004/IdentityRegistry.sol` -- minimal ERC-8004 identity registry
  (ERC-721 agent ids with `agentURI`).
- `src/erc8004/ReputationRegistry.sol` -- minimal ERC-8004 reputation
  registry (open `giveFeedback`, tag-filtered `getSummary`).
- `src/MockUSDC.sol` -- 6-decimal ERC-20 with open `mint` and a full
  **EIP-3009** implementation (`transferWithAuthorization`,
  `receiveWithAuthorization`, `cancelAuthorization`), so the x402 payment
  path can be a real gasless signature flow. EIP-712 domain: name
  `"Mock USD Coin"`, version `"2"` (matches real USDC's domain shape).

## Deploy (one command, against a running anvil)

Start anvil in one terminal:

```bash
anvil
```

Then from `contracts/`:

```bash
./deploy.sh
```

This runs `forge script script/Deploy.s.sol:Deploy --rpc-url http://127.0.0.1:8545 --broadcast`
against chain 31337, then `node script/build-deployment.mjs` to merge the
deployed addresses with the compiled ABIs into `contracts/deployment.json`.

Overridable env vars (defaults shown):

```bash
RPC_URL=http://127.0.0.1:8545
DEPLOYER_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  # anvil #0
PACK_SELLER=0x70997970C51812dc3A010C7d01b50e0d17dc79C8                          # anvil #1
```

The deploy script:

1. Deploys `MockUSDC`, `IdentityRegistry`, `ReputationRegistry`,
   `PacketMonsters`.
2. Loads `../data/cards.json` via `vm.readFile` / `vm.parseJson`
   (`script/CardLoader.sol`) and seeds all 90 card defs through
   `addCardDefs`, batched 30 at a time. `defId` is assigned in append order,
   so `defId == cards.json id`.
3. Registers each of the 36 unique endpoint hosts as an ERC-8004 agent
   (`IdentityRegistry.register`) and wires `host -> agentId` in
   `PacketMonsters` via `setHostAgent`.
4. Writes `deployment.addresses.json` (git-ignored, intermediate), which
   `script/build-deployment.mjs` merges with `out/*.sol/*.json` ABIs into
   `contracts/deployment.json` (**committed**, consumed by the web tier).

`contracts/deployment.json` shape:

```json
{
  "chainId": 31337,
  "rpcUrl": "http://127.0.0.1:8545",
  "contracts": { "MockUSDC": "0x..", "IdentityRegistry": "0x..", "ReputationRegistry": "0x..", "PacketMonsters": "0x.." },
  "owner": "0x..",
  "packSeller": "0x..",
  "usdc": { "decimals": 6, "eip3009": true, "eip712Domain": { "name": "Mock USD Coin", "version": "2" } },
  "abis": { "PacketMonsters": [...], "MockUSDC": [...], "IdentityRegistry": [...], "ReputationRegistry": [...] }
}
```

## Tests

```bash
forge build   # clean, no errors (a handful of cosmetic forge-lint warnings)
forge test    # 33 tests, all passing
```

Coverage: pack rarity distribution (statistical, 600 packs), battle
determinism (same state -> same winner), an independent reference
implementation of the frozen battle math cross-checked against the
contract via `replayBattle` and live `battle` calls including the exact
seed derivation and `BattleResult` event, level-up on win (and no level-up
for the loser), level cap at 99, ERC-8004 feedback emitted only for
different-owner battles (and never for same-owner practice battles),
`getSummary` aggregation, `tokenURI` returning valid base64 JSON with a
decodable, well-formed SVG (checked across many minted cards spanning all
rarities/types), full MockUSDC EIP-3009 flow (transfer/receive/cancel,
replay protection, expiry, wrong-signer rejection), and access control on
`addCardDefs` / `setPackSeller` / `setHostAgent` / `mintPack`.

## End-to-end verification performed

Ran locally as part of building this: started `anvil`, ran `./deploy.sh`,
then via `cast`:

- `mintPack` as the pack seller for two different addresses (3 cards each).
- `tokenURI` -- decoded the base64 JSON, decoded the nested base64 SVG,
  confirmed it renders name/host/type/HP/ATK/SPD/rarity pips.
- `battle` between tokens owned by different addresses -- confirmed the
  `BattleResult` event and a `NewFeedback` event on `ReputationRegistry`
  tagged `packet-monsters-battle` / `win` for the winning card's host
  agent, value 100.

anvil was killed after verification; no state persists.

## Deviations from the frozen interface

None. `CardDef`, `Card`, `addCardDefs`, `mintPack`, `battle`, `cardOf`,
`tokenURI`, `PackOpened`, `BattleResult` match SPEC.md exactly. One
addition beyond the frozen interface: a view-only `replayBattle(tokenA,
tokenB, seed)` that runs the same battle math without consuming a battle
nonce or emitting events, used by tests and available to the web client if
useful for pre-flight checks (it does not replace or change the required
`battle` behavior).

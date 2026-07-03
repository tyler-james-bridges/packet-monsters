#!/usr/bin/env node
// Merges deployment.addresses.json (written by script/Deploy.s.sol) with the
// forge build artifacts' ABIs into contracts/deployment.json, the single
// file the web tier imports at integration.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const addresses = JSON.parse(readFileSync(join(root, "deployment.addresses.json"), "utf8"));

const abi = (name) =>
  JSON.parse(readFileSync(join(root, "out", `${name}.sol`, `${name}.json`), "utf8")).abi;

const deployment = {
  chainId: addresses.chainId,
  rpcUrl: "http://127.0.0.1:8545",
  contracts: {
    MockUSDC: addresses.MockUSDC,
    IdentityRegistry: addresses.IdentityRegistry,
    ReputationRegistry: addresses.ReputationRegistry,
    PacketMonsters: addresses.PacketMonsters,
  },
  owner: addresses.owner,
  packSeller: addresses.packSeller,
  usdc: {
    decimals: 6,
    eip3009: true,
    eip712Domain: { name: "Mock USD Coin", version: "2" },
  },
  abis: {
    PacketMonsters: abi("PacketMonsters"),
    MockUSDC: abi("MockUSDC"),
    IdentityRegistry: abi("IdentityRegistry"),
    ReputationRegistry: abi("ReputationRegistry"),
  },
};

writeFileSync(join(root, "deployment.json"), JSON.stringify(deployment, null, 2) + "\n");
console.log("wrote contracts/deployment.json");

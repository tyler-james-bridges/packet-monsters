#!/usr/bin/env bash
# One-command deploy against a running anvil (chain 31337).
# Usage: ./deploy.sh
# Env (all optional):
#   RPC_URL       default http://127.0.0.1:8545
#   DEPLOYER_KEY  default anvil account #0 key
#   PACK_SELLER   default anvil account #1 (0x7099...79C8)
set -euo pipefail
cd "$(dirname "$0")"

export RPC_URL="${RPC_URL:-http://127.0.0.1:8545}"
export DEPLOYER_KEY="${DEPLOYER_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
export PACK_SELLER="${PACK_SELLER:-0x70997970C51812dc3A010C7d01b50e0d17dc79C8}"

if [ ! -d node_modules/@openzeppelin/contracts ]; then
  npm install
fi

forge build
forge script script/Deploy.s.sol:Deploy --rpc-url "$RPC_URL" --broadcast -v
node script/build-deployment.mjs

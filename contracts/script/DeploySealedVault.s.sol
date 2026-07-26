// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {SealedVault} from "../src/SealedVault.sol";
import {PacketMonsters} from "../src/PacketMonsters.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";

/// Deploys the SEALED VAULT draw protocol alongside an existing Packet Monsters
/// deployment. Run `script/Deploy.s.sol:Deploy` first; that writes
/// deployment.addresses.json with the game and registry addresses this script
/// binds to.
///
/// The vault is deliberately bound at construction to ONE ERC-721 collection
/// and ONE reputation registry, both immutable. There is no setter for either,
/// which is what removes the malicious-token class of attacks and denies the
/// admin key any path to redirect custody.
///
/// Env:
///   DEPLOYER_KEY   deployer/owner private key (default: anvil account #0)
///   VAULT_OWNER    vault owner; can only ever adjust the timelocked fee split,
///                  pause new deposits and commits, and sweep accrued protocol
///                  fees. It can never touch backing, credits, escrow or cards.
///                  (default: the deployer)
///   PACKET_MONSTERS  address of the deployed PacketMonsters ERC-721
///   REPUTATION_REGISTRY  address of the deployed ERC-8004 ReputationRegistry
contract DeploySealedVault is Script {
    uint256 internal constant ANVIL_KEY_0 = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external {
        uint256 deployerKey = vm.envOr("DEPLOYER_KEY", ANVIL_KEY_0);
        address deployer = vm.addr(deployerKey);
        address vaultOwner = vm.envOr("VAULT_OWNER", deployer);

        address game = vm.envAddress("PACKET_MONSTERS");
        address registry = vm.envAddress("REPUTATION_REGISTRY");
        require(game != address(0), "PACKET_MONSTERS unset");

        vm.startBroadcast(deployerKey);
        SealedVault vault = new SealedVault(vaultOwner, PacketMonsters(game), ReputationRegistry(registry));
        vm.stopBroadcast();

        console2.log("SealedVault        ", address(vault));
        console2.log("  cards            ", address(vault.cards()));
        console2.log("  reputation       ", address(vault.reputationRegistry()));
        console2.log("  owner            ", vaultOwner);
        console2.log("  feeBps           ", vault.feeBps());
        console2.log("  MAX_FEE_BPS      ", vault.MAX_FEE_BPS());
        console2.log("  lpFeeShareBps    ", vault.lpFeeShareBps());
        console2.log("  MIN_BACKING      ", vault.MIN_BACKING());
        console2.log("  MAX_BACKING      ", vault.MAX_BACKING());
        console2.log("  RESOLVE_DELAY    ", vault.RESOLVE_DELAY());
        console2.log("  REVEAL_WINDOW    ", vault.REVEAL_WINDOW());
        console2.log("  BOND             ", vault.BOND());
        console2.log("  MAX_POSITIONS    ", vault.MAX_POSITIONS());
        console2.log("  PARAM_TIMELOCK   ", vault.PARAM_TIMELOCK());

        string memory json = "sealedVault";
        vm.serializeAddress(json, "SealedVault", address(vault));
        vm.serializeAddress(json, "owner", vaultOwner);
        vm.serializeAddress(json, "cards", game);
        string memory out = vm.serializeAddress(json, "reputationRegistry", registry);
        vm.writeJson(out, string.concat(vm.projectRoot(), "/sealed-vault.addresses.json"));
    }
}

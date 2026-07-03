// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {IdentityRegistry} from "../src/erc8004/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";
import {PacketMonsters, CardDef} from "../src/PacketMonsters.sol";
import {CardLoader} from "./CardLoader.sol";

/// Deploys MockUSDC, the ERC-8004 registries, and PacketMonsters against a
/// local anvil (chain 31337); seeds all 90 card defs from data/cards.json;
/// registers each unique endpoint host as an ERC-8004 agent and wires
/// host -> agentId in the game contract; writes deployment.addresses.json
/// (script/build-deployment.mjs then merges in the ABIs -> deployment.json).
///
/// Env:
///   DEPLOYER_KEY  deployer/owner private key (default: anvil account #0)
///   PACK_SELLER   pack seller address (default: anvil account #1)
contract Deploy is Script {
    uint256 constant ANVIL_KEY_0 = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    address constant ANVIL_ADDR_1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    uint256 constant SEED_BATCH = 30;

    function run() external {
        uint256 deployerKey = vm.envOr("DEPLOYER_KEY", ANVIL_KEY_0);
        address packSeller = vm.envOr("PACK_SELLER", ANVIL_ADDR_1);
        address deployer = vm.addr(deployerKey);

        (CardDef[] memory defs, string[] memory hosts) =
            CardLoader.load(string.concat(vm.projectRoot(), "/../data/cards.json"));

        vm.startBroadcast(deployerKey);

        MockUSDC usdc = new MockUSDC();
        IdentityRegistry identity = new IdentityRegistry();
        ReputationRegistry reputation = new ReputationRegistry(identity);
        PacketMonsters game = new PacketMonsters(deployer, packSeller, reputation);

        // Seed all card defs in batches.
        for (uint256 start = 0; start < defs.length; start += SEED_BATCH) {
            uint256 n = defs.length - start;
            if (n > SEED_BATCH) n = SEED_BATCH;
            CardDef[] memory batch = new CardDef[](n);
            for (uint256 i = 0; i < n; i++) {
                batch[i] = defs[start + i];
            }
            game.addCardDefs(batch);
        }

        // Register each unique host as an ERC-8004 agent and wire it up.
        uint256 agents = 0;
        for (uint256 i = 0; i < hosts.length; i++) {
            if (game.hostAgent(keccak256(bytes(hosts[i]))) != 0) continue;
            uint256 agentId = identity.register(
                string.concat("https://", hosts[i], "/.well-known/agent-registration.json"), ""
            );
            game.setHostAgent(hosts[i], agentId);
            agents++;
        }

        vm.stopBroadcast();

        console2.log("MockUSDC:           ", address(usdc));
        console2.log("IdentityRegistry:   ", address(identity));
        console2.log("ReputationRegistry: ", address(reputation));
        console2.log("PacketMonsters:     ", address(game));
        console2.log("owner:              ", deployer);
        console2.log("packSeller:         ", packSeller);
        console2.log("card defs seeded:   ", uint256(game.defCount()));
        console2.log("agents registered:  ", agents);

        string memory obj = "deployment";
        vm.serializeUint(obj, "chainId", block.chainid);
        vm.serializeAddress(obj, "MockUSDC", address(usdc));
        vm.serializeAddress(obj, "IdentityRegistry", address(identity));
        vm.serializeAddress(obj, "ReputationRegistry", address(reputation));
        vm.serializeAddress(obj, "PacketMonsters", address(game));
        vm.serializeAddress(obj, "owner", deployer);
        string memory out = vm.serializeAddress(obj, "packSeller", packSeller);
        vm.writeJson(out, string.concat(vm.projectRoot(), "/deployment.addresses.json"));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VmSafe} from "forge-std/Vm.sol";
import {CardDef} from "../src/PacketMonsters.sol";

/// Loads data/cards.json (the frozen card model) into CardDef structs.
/// Shared by the deploy script and the test suite so both run against the
/// real card data, never fixtures.
library CardLoader {
    VmSafe private constant vm = VmSafe(address(uint160(uint256(keccak256("hevm cheat code")))));

    /// Mirror of one cards.json entry. Field names are ordered
    /// alphabetically because vm.parseJson ABI-encodes JSON object members
    /// in alphabetical key order.
    struct RawCard {
        bool alive;
        uint256 attack;
        string host;
        uint256 hp;
        uint256 id;
        uint256 latencyMs;
        string name;
        string network;
        string priceUsd;
        uint256 rarity;
        uint256 speed;
        uint256 typeId;
        bytes32 urlHash;
    }

    function load(string memory path) internal view returns (CardDef[] memory defs, string[] memory hosts) {
        string memory json = vm.readFile(path);
        RawCard[] memory raw = abi.decode(vm.parseJson(json), (RawCard[]));
        defs = new CardDef[](raw.length);
        hosts = new string[](raw.length);
        for (uint256 i = 0; i < raw.length; i++) {
            RawCard memory r = raw[i];
            // Contract defIds are 1-based append order; cards.json ids must
            // line up so defId == cards.json id.
            require(r.id == i + 1, "cards.json ids not sequential");
            require(r.hp <= type(uint8).max && r.attack <= type(uint8).max && r.speed <= type(uint8).max, "stat overflow");
            require(r.typeId <= 6 && r.rarity <= 4, "bad type or rarity");
            defs[i] = CardDef({
                name: r.name,
                host: r.host,
                urlHash: r.urlHash,
                hp: uint8(r.hp),
                attack: uint8(r.attack),
                speed: uint8(r.speed),
                typeId: uint8(r.typeId),
                rarity: uint8(r.rarity),
                alive: r.alive
            });
            hosts[i] = r.host;
        }
    }
}

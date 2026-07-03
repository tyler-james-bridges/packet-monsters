// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {PacketMonsters, CardDef, Card} from "../src/PacketMonsters.sol";
import {IdentityRegistry} from "../src/erc8004/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";
import {CardLoader} from "../script/CardLoader.sol";
import {TestUtils} from "./utils/TestUtils.sol";

contract PacketMonstersTest is Test {
    using TestUtils for string;

    event PackOpened(address indexed to, uint256[3] tokenIds, uint256 seed);
    event BattleResult(uint256 indexed tokenA, uint256 indexed tokenB, uint256 winner, uint256 seed);

    bytes32 constant NEW_FEEDBACK_TOPIC =
        keccak256("NewFeedback(uint256,address,int128,uint8,string,string,string,string,bytes32)");

    IdentityRegistry identity;
    ReputationRegistry reputation;
    PacketMonsters game;

    address seller = makeAddr("seller");
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        identity = new IdentityRegistry();
        reputation = new ReputationRegistry(identity);
        game = new PacketMonsters(address(this), seller, reputation);

        // Seed the real 90-card set; never fixtures.
        (CardDef[] memory defs, string[] memory hosts) =
            CardLoader.load(string.concat(vm.projectRoot(), "/../data/cards.json"));
        game.addCardDefs(defs);
        assertEq(game.defCount(), 90, "expected 90 card defs");

        // Register each unique host as an ERC-8004 agent, like the deploy.
        for (uint256 i = 0; i < hosts.length; i++) {
            if (game.hostAgent(keccak256(bytes(hosts[i]))) != 0) continue;
            uint256 agentId = identity.register(
                string.concat("https://", hosts[i], "/.well-known/agent-registration.json"), ""
            );
            game.setHostAgent(hosts[i], agentId);
        }
    }

    function _mintPackTo(address to, uint256 seed) internal returns (uint256[3] memory ids) {
        vm.prank(seller);
        ids = game.mintPack(to, seed);
    }

    // ------------------------------------------------------------------
    // Access control
    // ------------------------------------------------------------------

    function test_RevertWhen_AddCardDefsNotOwner() public {
        CardDef[] memory defs = new CardDef[](0);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        game.addCardDefs(defs);
    }

    function test_RevertWhen_SetPackSellerNotOwner() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        game.setPackSeller(alice);
    }

    function test_RevertWhen_SetHostAgentNotOwner() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        game.setHostAgent("example.com", 1);
    }

    function test_RevertWhen_MintPackNotPackSeller() public {
        vm.prank(alice);
        vm.expectRevert(PacketMonsters.NotPackSeller.selector);
        game.mintPack(alice, 1);
    }

    function test_OwnerCanRotatePackSeller() public {
        game.setPackSeller(alice);
        assertEq(game.packSeller(), alice);
        vm.prank(alice);
        game.mintPack(alice, 42);
        // Old seller is locked out.
        vm.prank(seller);
        vm.expectRevert(PacketMonsters.NotPackSeller.selector);
        game.mintPack(alice, 43);
    }

    // ------------------------------------------------------------------
    // Packs
    // ------------------------------------------------------------------

    function test_MintPackMintsThreeCards() public {
        uint256 seed = 12345;
        vm.expectEmit(true, false, false, true, address(game));
        emit PackOpened(alice, [uint256(1), 2, 3], seed);
        uint256[3] memory ids = _mintPackTo(alice, seed);

        for (uint256 i = 0; i < 3; i++) {
            assertEq(ids[i], i + 1);
            assertEq(game.ownerOf(ids[i]), alice);
            (CardDef memory def, Card memory card) = game.cardOf(ids[i]);
            assertEq(card.level, 1);
            assertGe(card.defId, 1);
            assertLe(card.defId, 90);
            assertGt(bytes(def.name).length, 0);
        }
        assertEq(game.balanceOf(alice), 3);
        assertEq(game.nextTokenId(), 4);
    }

    /// Statistical sanity of the 45/30/15/7/3 rarity weighting over 600
    /// packs (1800 cards). Bounds are ~5 sigma wide.
    function test_PackRarityDistribution() public {
        uint256 packs = 600;
        uint256[5] memory counts;
        for (uint256 p = 0; p < packs; p++) {
            uint256[3] memory ids = _mintPackTo(alice, uint256(keccak256(abi.encode("rarity", p))));
            for (uint256 i = 0; i < 3; i++) {
                (CardDef memory def,) = game.cardOf(ids[i]);
                counts[def.rarity]++;
            }
        }
        uint256 total = packs * 3;
        assertEq(counts[0] + counts[1] + counts[2] + counts[3] + counts[4], total);
        // Expected: 810 / 540 / 270 / 126 / 54 out of 1800.
        assertGe(counts[0], 666, "common too rare");
        assertLe(counts[0], 954, "common too frequent");
        assertGe(counts[1], 396, "uncommon too rare");
        assertLe(counts[1], 684, "uncommon too frequent");
        assertGe(counts[2], 162, "rare too rare");
        assertLe(counts[2], 378, "rare too frequent");
        assertGe(counts[3], 54, "epic too rare");
        assertLe(counts[3], 216, "epic too frequent");
        assertGe(counts[4], 9, "legendary too rare");
        assertLe(counts[4], 135, "legendary too frequent");
    }

    // ------------------------------------------------------------------
    // Battles
    // ------------------------------------------------------------------

    function test_RevertWhen_BattleSameToken() public {
        uint256[3] memory ids = _mintPackTo(alice, 1);
        vm.prank(alice);
        vm.expectRevert(PacketMonsters.SameToken.selector);
        game.battle(ids[0], ids[0]);
    }

    function test_RevertWhen_BattleCallerNotParticipant() public {
        uint256[3] memory a = _mintPackTo(alice, 1);
        uint256[3] memory b = _mintPackTo(bob, 2);
        vm.prank(makeAddr("carol"));
        vm.expectRevert(PacketMonsters.NotParticipant.selector);
        game.battle(a[0], b[0]);
    }

    function test_BattleDeterministic_SameStateSameWinner() public {
        uint256[3] memory a = _mintPackTo(alice, 1);
        uint256[3] memory b = _mintPackTo(bob, 2);

        uint256 snap = vm.snapshotState();
        vm.prank(alice);
        uint256 winner1 = game.battle(a[0], b[0]);
        vm.revertToState(snap);
        vm.prank(alice);
        uint256 winner2 = game.battle(a[0], b[0]);
        assertEq(winner1, winner2, "same state must produce the same winner");
    }

    /// Replays the frozen SPEC.md battle math with an independent local
    /// implementation and requires the contract to agree, including the
    /// exact seed derivation and BattleResult event.
    function test_BattleMatchesReferenceReplay() public {
        uint256[3] memory a = _mintPackTo(alice, 777);
        uint256[3] memory b = _mintPackTo(bob, 888);

        for (uint256 i = 0; i < 3; i++) {
            uint256 tokenA = a[i];
            uint256 tokenB = b[i];
            uint256 expectedSeed =
                uint256(keccak256(abi.encode(block.prevrandao, tokenA, tokenB, game.battleNonce())));
            uint256 expectedWinner = _referenceBattle(tokenA, tokenB, expectedSeed);

            assertEq(game.replayBattle(tokenA, tokenB, expectedSeed), expectedWinner, "replayBattle mismatch");

            vm.expectEmit(true, true, false, true, address(game));
            emit BattleResult(tokenA, tokenB, expectedWinner, expectedSeed);
            vm.prank(alice);
            uint256 winner = game.battle(tokenA, tokenB);
            assertEq(winner, expectedWinner, "onchain winner disagrees with reference math");
        }
    }

    function test_WinnerLevelsUpLoserDoesNot() public {
        uint256[3] memory a = _mintPackTo(alice, 10);
        uint256[3] memory b = _mintPackTo(bob, 11);
        vm.prank(alice);
        uint256 winner = game.battle(a[0], b[0]);
        uint256 loser = winner == a[0] ? b[0] : a[0];

        (, Card memory w) = game.cardOf(winner);
        (, Card memory l) = game.cardOf(loser);
        assertEq(w.level, 2, "winner should level up");
        assertEq(l.level, 1, "loser should not level up");
    }

    function test_LevelBonusChangesReplayStats() public {
        // Level a card up, then confirm the leveled fighter is used: a
        // level-2 card has +2 hp and +1 attack in the reference math, and
        // replayBattle must track that.
        uint256[3] memory a = _mintPackTo(alice, 20);
        uint256[3] memory b = _mintPackTo(bob, 21);
        vm.prank(alice);
        game.battle(a[0], b[0]);

        uint256 seed = 0xdecaf;
        assertEq(
            game.replayBattle(a[0], b[0], seed),
            _referenceBattle(a[0], b[0], seed),
            "post-level-up replay mismatch"
        );
    }

    function test_LevelCapsAt99() public {
        uint256[3] memory a = _mintPackTo(alice, 30);
        uint256[3] memory b = _mintPackTo(bob, 31);
        // Force many battles; winners vary but total levels gained is one
        // per battle, capped per card at 99.
        for (uint256 i = 0; i < 300; i++) {
            vm.prank(alice);
            game.battle(a[0], b[0]);
        }
        (, Card memory ca) = game.cardOf(a[0]);
        (, Card memory cb) = game.cardOf(b[0]);
        assertLe(ca.level, 99);
        assertLe(cb.level, 99);
        assertGe(uint256(ca.level) + uint256(cb.level), 100, "300 battles should max out at least one card");
    }

    // ------------------------------------------------------------------
    // ERC-8004 feedback
    // ------------------------------------------------------------------

    function test_FeedbackEmittedForDifferentOwnerBattle() public {
        uint256[3] memory a = _mintPackTo(alice, 40);
        uint256[3] memory b = _mintPackTo(bob, 41);

        vm.recordLogs();
        vm.prank(alice);
        uint256 winner = game.battle(a[0], b[0]);
        (CardDef memory winDef,) = game.cardOf(winner);
        uint256 expectedAgent = game.hostAgent(keccak256(bytes(winDef.host)));
        assertGt(expectedAgent, 0, "winner host must be a registered agent");

        Vm.Log[] memory logs = vm.getRecordedLogs();
        uint256 found = 0;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] != NEW_FEEDBACK_TOPIC) continue;
            found++;
            assertEq(logs[i].emitter, address(reputation));
            assertEq(uint256(logs[i].topics[1]), expectedAgent, "feedback for wrong agent");
            assertEq(address(uint160(uint256(logs[i].topics[2]))), address(game), "client must be the game");
            (int128 value, uint8 dec, string memory tag1, string memory tag2, string memory endpoint,,) =
                abi.decode(logs[i].data, (int128, uint8, string, string, string, string, bytes32));
            assertEq(value, 100);
            assertEq(dec, 0);
            assertEq(tag1, "packet-monsters-battle");
            assertEq(tag2, "win");
            assertEq(endpoint, winDef.host);
        }
        assertEq(found, 1, "exactly one feedback event expected");
        assertEq(reputation.feedbackCount(expectedAgent), 1);
    }

    function test_NoFeedbackForSameOwnerBattle() public {
        uint256[3] memory a = _mintPackTo(alice, 50);

        vm.recordLogs();
        vm.prank(alice);
        game.battle(a[0], a[1]);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        for (uint256 i = 0; i < logs.length; i++) {
            assertTrue(logs[i].topics[0] != NEW_FEEDBACK_TOPIC, "practice battles must not post feedback");
        }
    }

    function test_ReputationSummaryAggregatesBattleWins() public {
        uint256[3] memory a = _mintPackTo(alice, 60);
        uint256[3] memory b = _mintPackTo(bob, 61);
        vm.prank(alice);
        uint256 winner = game.battle(a[0], b[0]);
        (CardDef memory winDef,) = game.cardOf(winner);
        uint256 agentId = game.hostAgent(keccak256(bytes(winDef.host)));

        address[] memory clients = new address[](1);
        clients[0] = address(game);
        (uint64 count, int128 avg, uint8 dec) = reputation.getSummary(agentId, clients, "packet-monsters-battle", "");
        assertEq(count, 1);
        assertEq(avg, 100);
        assertEq(dec, 0);
    }

    // ------------------------------------------------------------------
    // tokenURI / onchain SVG
    // ------------------------------------------------------------------

    function test_TokenURIIsOnchainBase64JsonWithSvg() public {
        uint256[3] memory ids = _mintPackTo(alice, 70);
        (CardDef memory def,) = game.cardOf(ids[0]);

        string memory uri = game.tokenURI(ids[0]);
        assertTrue(uri.startsWith("data:application/json;base64,"), "tokenURI must be a base64 JSON data URI");

        string memory json = string(TestUtils.base64Decode(uri.slice(29)));
        // Must be valid JSON with the expected fields.
        string memory name = vm.parseJsonString(json, ".name");
        assertTrue(name.contains(def.name), "JSON name must contain the card name");
        string memory host = vm.parseJsonString(json, ".attributes[6].value");
        assertEq(host, def.host, "host attribute mismatch");

        string memory image = vm.parseJsonString(json, ".image");
        assertTrue(image.startsWith("data:image/svg+xml;base64,"), "image must be a base64 SVG data URI");
        string memory svg = string(TestUtils.base64Decode(image.slice(26)));
        assertTrue(svg.startsWith("<svg"), "image must decode to an SVG");
        assertTrue(svg.contains("</svg>"), "SVG must be complete");
        assertTrue(svg.contains("HP"), "SVG must show the HP stat");
        assertTrue(svg.contains("ATK"), "SVG must show the ATK stat");
        assertTrue(svg.contains("SPD"), "SVG must show the SPD stat");
        assertTrue(svg.contains("LV.1"), "SVG must show the level");
    }

    function test_TokenURICoversAllTypesAndRarities() public {
        // Mint enough packs to hit many defs and confirm every tokenURI
        // decodes to well-formed JSON + SVG.
        for (uint256 p = 0; p < 20; p++) {
            _mintPackTo(alice, uint256(keccak256(abi.encode("uri", p))));
        }
        uint256 minted = game.nextTokenId() - 1;
        for (uint256 t = 1; t <= minted; t++) {
            string memory uri = game.tokenURI(t);
            string memory json = string(TestUtils.base64Decode(uri.slice(29)));
            string memory image = vm.parseJsonString(json, ".image");
            string memory svg = string(TestUtils.base64Decode(image.slice(26)));
            assertTrue(svg.startsWith("<svg"));
            assertTrue(svg.contains("</svg>"));
        }
    }

    function test_RevertWhen_QueryingNonexistentToken() public {
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 999));
        game.cardOf(999);
        vm.expectRevert(abi.encodeWithSelector(IERC721Errors.ERC721NonexistentToken.selector, 999));
        game.tokenURI(999);
    }

    // ------------------------------------------------------------------
    // Independent reference implementation of the frozen battle math
    // ------------------------------------------------------------------

    struct RefFighter {
        uint256 tokenId;
        int256 hp;
        uint256 attack;
        uint256 speed;
        bool ghost;
    }

    function _refFighter(uint256 tokenId) internal view returns (RefFighter memory f) {
        (CardDef memory d, Card memory c) = game.cardOf(tokenId);
        f.tokenId = tokenId;
        f.hp = int256(uint256(d.hp)) + 2 * (int256(uint256(c.level)) - 1);
        f.attack = uint256(d.attack) + (uint256(c.level) - 1);
        f.speed = d.speed;
        f.ghost = d.typeId == 6;
    }

    function _referenceBattle(uint256 tokenA, uint256 tokenB, uint256 seed) internal view returns (uint256) {
        RefFighter memory a = _refFighter(tokenA);
        RefFighter memory b = _refFighter(tokenB);

        bool aActs = a.speed > b.speed || (a.speed == b.speed && tokenA < tokenB);
        for (uint256 turn = 0; turn < 64; turn++) {
            RefFighter memory atk = aActs ? a : b;
            RefFighter memory def = aActs ? b : a;
            uint256 roll = uint256(keccak256(abi.encode(seed, turn)));
            if (roll % 100 < 90) {
                uint256 power = atk.attack + ((atk.ghost && !def.ghost) ? 15 : 0);
                uint256 dmg = (power * (100 + (roll % 21))) / 100;
                if (roll % 100 < 10) dmg *= 2;
                def.hp -= int256(dmg);
                if (def.hp <= 0) return atk.tokenId;
            }
            aActs = !aActs;
        }
        if (a.hp == b.hp) return tokenA < tokenB ? tokenA : tokenB;
        return a.hp > b.hp ? tokenA : tokenB;
    }
}

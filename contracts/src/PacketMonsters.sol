// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {ReputationRegistry} from "./erc8004/ReputationRegistry.sol";

/// Frozen interface structs (SPEC.md). Do not change.
struct CardDef {
    string name;
    string host;
    bytes32 urlHash;
    uint8 hp;
    uint8 attack;
    uint8 speed;
    uint8 typeId;
    uint8 rarity;
    bool alive;
}

struct Card {
    uint16 defId;
    uint8 level;
}

/// PACKET MONSTERS. Trading-card battler where every card is a real x402
/// API endpoint. Cards are ERC-721 tokens with fully onchain SVG art.
/// Battles are deterministic from an onchain seed so the web client can
/// replay them exactly. Different-owner battle wins post positive feedback
/// to an ERC-8004 ReputationRegistry for the winning card's endpoint agent.
contract PacketMonsters is ERC721, Ownable {
    using Strings for uint256;

    event PackOpened(address indexed to, uint256[3] tokenIds, uint256 seed);
    event BattleResult(uint256 indexed tokenA, uint256 indexed tokenB, uint256 winner, uint256 seed);
    event PackSellerUpdated(address indexed packSeller);
    event HostAgentSet(string host, uint256 agentId);

    error NotPackSeller();
    error NoCardDefs();
    error InvalidCardDef();
    error SameToken();
    error NotParticipant();

    uint256 private constant MAX_TURNS = 64;
    uint8 private constant GHOST_TYPE = 6;
    uint8 private constant MAX_LEVEL = 99;

    ReputationRegistry public immutable reputationRegistry;
    address public packSeller;

    uint16 public defCount;
    mapping(uint16 => CardDef) private _defs; // defId (1-based, == cards.json id) => def
    uint16[][5] private _defsByRarity;

    uint256 public nextTokenId = 1;
    mapping(uint256 => Card) private _cards;

    uint256 public battleNonce;

    /// keccak256(bytes(host)) => ERC-8004 agentId (0 = unregistered)
    mapping(bytes32 => uint256) public hostAgent;

    modifier onlyPackSeller() {
        if (msg.sender != packSeller) revert NotPackSeller();
        _;
    }

    constructor(address owner_, address packSeller_, ReputationRegistry reputationRegistry_)
        ERC721("Packet Monsters", "PKMN")
        Ownable(owner_)
    {
        require(packSeller_ != address(0), "zero pack seller");
        packSeller = packSeller_;
        reputationRegistry = reputationRegistry_;
    }

    // ------------------------------------------------------------------
    // Admin
    // ------------------------------------------------------------------

    /// Deploy-time seeding. Defs are appended in order; defId is 1-based so
    /// it matches the `id` field in data/cards.json when seeded in file order.
    function addCardDefs(CardDef[] calldata defs) external onlyOwner {
        for (uint256 i = 0; i < defs.length; i++) {
            CardDef calldata d = defs[i];
            if (d.rarity > 4 || d.typeId > GHOST_TYPE || bytes(d.name).length == 0) revert InvalidCardDef();
            uint16 defId = ++defCount;
            _defs[defId] = d;
            _defsByRarity[d.rarity].push(defId);
        }
    }

    function setPackSeller(address packSeller_) external onlyOwner {
        require(packSeller_ != address(0), "zero pack seller");
        packSeller = packSeller_;
        emit PackSellerUpdated(packSeller_);
    }

    /// Wire an endpoint host to its ERC-8004 agentId (set at seed time).
    function setHostAgent(string calldata host, uint256 agentId) external onlyOwner {
        hostAgent[keccak256(bytes(host))] = agentId;
        emit HostAgentSet(host, agentId);
    }

    // ------------------------------------------------------------------
    // Packs
    // ------------------------------------------------------------------

    /// Mint a 3-card booster pack. Called by the pack seller after it has
    /// verified the x402 payment offchain. Rarity weights:
    /// common 45%, uncommon 30%, rare 15%, epic 7%, legendary 3%.
    function mintPack(address to, uint256 seed) external onlyPackSeller returns (uint256[3] memory tokenIds) {
        if (defCount == 0) revert NoCardDefs();
        for (uint256 i = 0; i < 3; i++) {
            uint256 r = uint256(keccak256(abi.encode(seed, i)));
            uint16 defId = _pickDef(r);
            uint256 tokenId = nextTokenId++;
            _cards[tokenId] = Card({defId: defId, level: 1});
            _mint(to, tokenId);
            tokenIds[i] = tokenId;
        }
        emit PackOpened(to, tokenIds, seed);
    }

    function _pickDef(uint256 r) internal view returns (uint16) {
        uint256 w = r % 100;
        uint8 rarity;
        if (w < 45) rarity = 0;
        else if (w < 75) rarity = 1;
        else if (w < 90) rarity = 2;
        else if (w < 97) rarity = 3;
        else rarity = 4;
        // Fall back to lower rarities if a bucket is empty (cannot happen
        // with the shipped cards.json, which has all five rarities).
        while (_defsByRarity[rarity].length == 0) {
            if (rarity == 0) revert NoCardDefs();
            rarity--;
        }
        uint16[] storage bucket = _defsByRarity[rarity];
        return bucket[(r / 100) % bucket.length];
    }

    // ------------------------------------------------------------------
    // Battles
    // ------------------------------------------------------------------

    struct Fighter {
        uint256 tokenId;
        uint256 hp;
        uint256 attack;
        uint256 speed;
        bool ghost;
    }

    /// Deterministic turn-based battle. Caller must own one of the tokens.
    /// Same-owner battles are allowed (practice mode) but ERC-8004 feedback
    /// only fires for different-owner battles.
    function battle(uint256 tokenA, uint256 tokenB) external returns (uint256 winner) {
        if (tokenA == tokenB) revert SameToken();
        address ownerA = ownerOf(tokenA);
        address ownerB = ownerOf(tokenB);
        if (msg.sender != ownerA && msg.sender != ownerB) revert NotParticipant();

        uint256 seed = uint256(keccak256(abi.encode(block.prevrandao, tokenA, tokenB, battleNonce++)));
        winner = _runBattle(tokenA, tokenB, seed);

        Card storage winCard = _cards[winner];
        if (winCard.level < MAX_LEVEL) {
            winCard.level += 1;
        }

        emit BattleResult(tokenA, tokenB, winner, seed);

        if (ownerA != ownerB) {
            string memory host = _defs[winCard.defId].host;
            uint256 agentId = hostAgent[keccak256(bytes(host))];
            if (agentId != 0) {
                reputationRegistry.giveFeedback(
                    agentId, 100, 0, "packet-monsters-battle", "win", host, "", bytes32(0)
                );
            }
        }
    }

    /// Replay helper: same math as battle() for a known seed, using current
    /// card levels. View-only; the web client can also replicate this in JS.
    function replayBattle(uint256 tokenA, uint256 tokenB, uint256 seed) external view returns (uint256) {
        _requireOwned(tokenA);
        _requireOwned(tokenB);
        return _runBattle(tokenA, tokenB, seed);
    }

    function _fighter(uint256 tokenId) internal view returns (Fighter memory f) {
        Card memory c = _cards[tokenId];
        CardDef storage d = _defs[c.defId];
        uint256 levelBonus = uint256(c.level) - 1; // each level above 1: +2 hp, +1 attack
        f = Fighter({
            tokenId: tokenId,
            hp: uint256(d.hp) + 2 * levelBonus,
            attack: uint256(d.attack) + levelBonus,
            speed: d.speed,
            ghost: d.typeId == GHOST_TYPE
        });
    }

    /// Battle math (frozen, SPEC.md): faster card attacks first (speed tie:
    /// lower tokenId first). Per turn:
    ///   roll = keccak256(abi.encode(seed, turnIndex))
    ///   miss when roll % 100 >= 90; crit (x2, applied after the division)
    ///   when roll % 100 < 10; damage = attack * (100 + roll % 21) / 100.
    /// GHOST attacking non-GHOST gets +15 attack. Cap 64 turns; at cap the
    /// higher remaining hp wins, ties broken by lower tokenId.
    function _runBattle(uint256 tokenA, uint256 tokenB, uint256 seed) internal view returns (uint256) {
        Fighter memory a = _fighter(tokenA);
        Fighter memory b = _fighter(tokenB);
        bool aFirst = a.speed > b.speed || (a.speed == b.speed && tokenA < tokenB);
        Fighter memory attacker = aFirst ? a : b;
        Fighter memory defender = aFirst ? b : a;

        for (uint256 turn = 0; turn < MAX_TURNS; turn++) {
            uint256 roll = uint256(keccak256(abi.encode(seed, turn)));
            uint256 r = roll % 100;
            if (r < 90) {
                uint256 atk = attacker.attack;
                if (attacker.ghost && !defender.ghost) atk += 15;
                uint256 dmg = (atk * (100 + (roll % 21))) / 100;
                if (r < 10) dmg *= 2;
                defender.hp = dmg >= defender.hp ? 0 : defender.hp - dmg;
                if (defender.hp == 0) return attacker.tokenId;
            }
            (attacker, defender) = (defender, attacker);
        }

        if (a.hp == b.hp) return tokenA < tokenB ? tokenA : tokenB;
        return a.hp > b.hp ? tokenA : tokenB;
    }

    // ------------------------------------------------------------------
    // Views
    // ------------------------------------------------------------------

    function cardOf(uint256 tokenId) external view returns (CardDef memory, Card memory) {
        _requireOwned(tokenId);
        Card memory c = _cards[tokenId];
        return (_defs[c.defId], c);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Card memory c = _cards[tokenId];
        CardDef storage d = _defs[c.defId];

        uint256 levelBonus = uint256(c.level) - 1;
        uint256 hp = uint256(d.hp) + 2 * levelBonus;
        uint256 attack = uint256(d.attack) + levelBonus;

        string memory json = string.concat(
            '{"name":"',
            d.name,
            " #",
            tokenId.toString(),
            '","description":"Packet Monsters: a real x402 API endpoint as a trading card. Host ',
            d.host,
            '. gotta cache em all.","attributes":[',
            _attributes(d, c, hp, attack),
            '],"image":"data:image/svg+xml;base64,',
            Base64.encode(bytes(_svg(d, c, tokenId, hp, attack))),
            '"}'
        );
        return string.concat("data:application/json;base64,", Base64.encode(bytes(json)));
    }

    function _attributes(CardDef storage d, Card memory c, uint256 hp, uint256 attack)
        internal
        view
        returns (string memory)
    {
        return string.concat(
            '{"trait_type":"Type","value":"',
            _typeName(d.typeId),
            '"},{"trait_type":"Rarity","value":"',
            _rarityName(d.rarity),
            '"},{"trait_type":"HP","value":',
            hp.toString(),
            '},{"trait_type":"Attack","value":',
            attack.toString(),
            '},{"trait_type":"Speed","value":',
            uint256(d.speed).toString(),
            '},{"trait_type":"Level","value":',
            uint256(c.level).toString(),
            '},{"trait_type":"Host","value":"',
            d.host,
            '"},{"trait_type":"Alive","value":"',
            d.alive ? "yes" : "no",
            '"}'
        );
    }

    // ------------------------------------------------------------------
    // Onchain SVG card art
    // ------------------------------------------------------------------

    function _svg(CardDef storage d, Card memory c, uint256 tokenId, uint256 hp, uint256 attack)
        internal
        view
        returns (string memory)
    {
        string memory color = _typeColor(d.typeId);
        string memory head = string.concat(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 315 440">',
            '<defs><filter id="g" x="-40%" y="-40%" width="180%" height="180%">',
            '<feGaussianBlur stdDeviation="4"/></filter>',
            '<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">',
            '<stop offset="0" stop-color="#12121c"/><stop offset="1" stop-color="#07070b"/>',
            "</linearGradient></defs>",
            '<rect width="315" height="440" rx="18" fill="url(#bg)"/>',
            '<rect x="7" y="7" width="301" height="426" rx="14" fill="none" stroke="',
            color,
            '" stroke-width="4" opacity="0.55" filter="url(#g)"/>',
            '<rect x="7" y="7" width="301" height="426" rx="14" fill="none" stroke="',
            color,
            '" stroke-width="2"/>'
        );
        string memory title = string.concat(
            '<text x="22" y="38" font-family="monospace" font-size="13" font-weight="bold" fill="',
            color,
            '">',
            _typeName(d.typeId),
            '</text><text x="293" y="38" text-anchor="end" font-family="monospace" font-size="13" fill="#e4e4e7">LV.',
            uint256(c.level).toString(),
            '</text><text x="22" y="72" font-family="monospace" font-size="16" font-weight="bold" fill="#fafafa">',
            _clip(d.name, 30),
            '</text><text x="22" y="92" font-family="monospace" font-size="10" fill="#a1a1aa">',
            _clip(d.host, 44),
            "</text>"
        );
        string memory emblem = string.concat(
            '<circle cx="157" cy="182" r="58" fill="none" stroke="',
            color,
            '" stroke-width="2" opacity="0.45"/><circle cx="157" cy="182" r="44" fill="',
            color,
            '" opacity="0.12"/><text x="157" y="199" text-anchor="middle" font-family="monospace" font-size="46" font-weight="bold" fill="',
            color,
            '">',
            _typeInitial(d.typeId),
            '</text><text x="157" y="262" text-anchor="middle" font-family="monospace" font-size="9" fill="#52525b">',
            _clip(Strings.toHexString(uint256(d.urlHash), 32), 22),
            "</text>",
            d.alive ? "" : '<text x="157" y="280" text-anchor="middle" font-family="monospace" font-size="10" fill="#4ade80">503 SERVICE UNAVAILABLE</text>'
        );
        string memory stats = string.concat(
            _statRow("HP", hp, 300, color),
            _statRow("ATK", attack, 332, color),
            _statRow("SPD", d.speed, 364, color)
        );
        string memory footer = string.concat(
            _rarityPips(d.rarity, color),
            '<text x="293" y="416" text-anchor="end" font-family="monospace" font-size="11" fill="#a1a1aa">',
            _rarityName(d.rarity),
            "</text></svg>"
        );
        return string.concat(head, title, emblem, stats, footer);
    }

    function _statRow(string memory label, uint256 value, uint256 y, string memory color)
        internal
        pure
        returns (string memory)
    {
        uint256 bar = value > 200 ? 200 : value; // bar caps at 200
        uint256 w = (bar * 170) / 200;
        return string.concat(
            '<text x="22" y="',
            (y + 9).toString(),
            '" font-family="monospace" font-size="12" fill="#e4e4e7">',
            label,
            '</text><text x="103" y="',
            (y + 9).toString(),
            '" text-anchor="end" font-family="monospace" font-size="12" fill="#fafafa">',
            value.toString(),
            '</text><rect x="113" y="',
            y.toString(),
            '" width="170" height="10" rx="5" fill="#27272a"/><rect x="113" y="',
            y.toString(),
            '" width="',
            w.toString(),
            '" height="10" rx="5" fill="',
            color,
            '"/>'
        );
    }

    function _rarityPips(uint8 rarity, string memory color) internal pure returns (string memory) {
        string memory pips = "";
        for (uint256 i = 0; i < 5; i++) {
            pips = string.concat(
                pips,
                '<circle cx="',
                (28 + i * 18).toString(),
                '" cy="412" r="5" fill="',
                i <= rarity ? color : "#27272a",
                '"/>'
            );
        }
        return pips;
    }

    function _typeName(uint8 typeId) internal pure returns (string memory) {
        if (typeId == 0) return "SURGE";
        if (typeId == 1) return "PHANTOM";
        if (typeId == 2) return "PLASMA";
        if (typeId == 3) return "FROST";
        if (typeId == 4) return "EXOTIC";
        if (typeId == 5) return "SANDBOX";
        return "GHOST";
    }

    function _typeInitial(uint8 typeId) internal pure returns (string memory) {
        if (typeId == 0) return "S";
        if (typeId == 1) return "P";
        if (typeId == 2) return "L";
        if (typeId == 3) return "F";
        if (typeId == 4) return "X";
        if (typeId == 5) return "B";
        return "G";
    }

    function _typeColor(uint8 typeId) internal pure returns (string memory) {
        if (typeId == 0) return "#3b82f6";
        if (typeId == 1) return "#a78bfa";
        if (typeId == 2) return "#d946ef";
        if (typeId == 3) return "#67e8f9";
        if (typeId == 4) return "#fbbf24";
        if (typeId == 5) return "#94a3b8";
        return "#4ade80";
    }

    function _rarityName(uint8 rarity) internal pure returns (string memory) {
        if (rarity == 0) return "COMMON";
        if (rarity == 1) return "UNCOMMON";
        if (rarity == 2) return "RARE";
        if (rarity == 3) return "EPIC";
        return "LEGENDARY";
    }

    /// Clip an ASCII string to at most n characters, appending ".." if cut.
    function _clip(string memory s, uint256 n) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        if (b.length <= n) return s;
        bytes memory out = new bytes(n);
        for (uint256 i = 0; i < n; i++) {
            out[i] = b[i];
        }
        return string.concat(string(out), "..");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IdentityRegistry} from "./IdentityRegistry.sol";

/// Minimal ERC-8004 Reputation Registry, faithful to the deployed interface:
/// anyone can post signed fixed-point feedback for a registered agent, with
/// two tags, an endpoint, and optional offchain metadata. Feedback is stored
/// and emitted; consumers filter by client address to resist Sybil feedback.
contract ReputationRegistry {
    struct Feedback {
        address client;
        int128 value;
        uint8 valueDecimals;
        string tag1;
        string tag2;
        string endpoint;
        string ipfsHash;
        bytes32 dataHash;
    }

    event NewFeedback(
        uint256 indexed agentId,
        address indexed client,
        int128 value,
        uint8 valueDecimals,
        string tag1,
        string tag2,
        string endpoint,
        string ipfsHash,
        bytes32 dataHash
    );

    error UnknownAgent();

    IdentityRegistry public immutable identityRegistry;
    mapping(uint256 => Feedback[]) private _feedback;

    constructor(IdentityRegistry identityRegistry_) {
        identityRegistry = identityRegistry_;
    }

    function giveFeedback(
        uint256 agentId,
        int128 value,
        uint8 valueDecimals,
        string calldata tag1,
        string calldata tag2,
        string calldata endpoint,
        string calldata ipfsHash,
        bytes32 dataHash
    ) external {
        if (!identityRegistry.agentExists(agentId)) revert UnknownAgent();
        _feedback[agentId].push(
            Feedback({
                client: msg.sender,
                value: value,
                valueDecimals: valueDecimals,
                tag1: tag1,
                tag2: tag2,
                endpoint: endpoint,
                ipfsHash: ipfsHash,
                dataHash: dataHash
            })
        );
        emit NewFeedback(agentId, msg.sender, value, valueDecimals, tag1, tag2, endpoint, ipfsHash, dataHash);
    }

    function feedbackCount(uint256 agentId) external view returns (uint256) {
        return _feedback[agentId].length;
    }

    function readFeedback(uint256 agentId, uint256 index) external view returns (Feedback memory) {
        return _feedback[agentId][index];
    }

    /// Summary over stored feedback for an agent, filtered by client
    /// allowlist (empty = all clients) and tags (empty string = any tag).
    /// Returns the number of matches, the average raw value, and the
    /// valueDecimals of the first match (matches are expected to share a
    /// decimals convention per tag).
    function getSummary(uint256 agentId, address[] calldata clients, string calldata tag1, string calldata tag2)
        external
        view
        returns (uint64 count, int128 averageValue, uint8 valueDecimals)
    {
        Feedback[] storage all = _feedback[agentId];
        int256 sum = 0;
        for (uint256 i = 0; i < all.length; i++) {
            Feedback storage f = all[i];
            if (!_matches(f, clients, tag1, tag2)) continue;
            if (count == 0) valueDecimals = f.valueDecimals;
            sum += f.value;
            count++;
        }
        // Safe: an average of int128 values always fits in int128.
        // forge-lint: disable-next-line(unsafe-typecast)
        if (count > 0) averageValue = int128(sum / int256(uint256(count)));
    }

    function _matches(Feedback storage f, address[] calldata clients, string calldata tag1, string calldata tag2)
        private
        view
        returns (bool)
    {
        if (bytes(tag1).length != 0 && keccak256(bytes(f.tag1)) != keccak256(bytes(tag1))) return false;
        if (bytes(tag2).length != 0 && keccak256(bytes(f.tag2)) != keccak256(bytes(tag2))) return false;
        if (clients.length != 0 && !_contains(clients, f.client)) return false;
        return true;
    }

    function _contains(address[] calldata list, address a) private pure returns (bool) {
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i] == a) return true;
        }
        return false;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// Minimal ERC-8004 Identity Registry, faithful to the deployed interface:
/// agents are ERC-721 tokens whose tokenId is the globally unique agentId,
/// registered with an agentURI that resolves to the agent registration JSON
/// (type https://eips.ethereum.org/EIPS/eip-8004#registration-v1).
contract IdentityRegistry is ERC721 {
    event Registered(uint256 indexed agentId, string agentURI, address indexed owner);
    event AgentURIUpdated(uint256 indexed agentId, string agentURI);

    error NotAgentOwner();

    uint256 private _nextAgentId = 1;
    mapping(uint256 => string) private _agentURIs;

    constructor() ERC721("ERC-8004 Identity Registry", "AGENT") {}

    /// Register a new agent. The metadata argument is accepted for interface
    /// compatibility with the reference registry and is not stored.
    function register(string calldata agentURI_, bytes calldata) external returns (uint256 agentId) {
        agentId = _nextAgentId++;
        _mint(msg.sender, agentId);
        _agentURIs[agentId] = agentURI_;
        emit Registered(agentId, agentURI_, msg.sender);
    }

    function setAgentURI(uint256 agentId, string calldata agentURI_) external {
        if (msg.sender != _requireOwned(agentId)) revert NotAgentOwner();
        _agentURIs[agentId] = agentURI_;
        emit AgentURIUpdated(agentId, agentURI_);
    }

    function agentURI(uint256 agentId) public view returns (string memory) {
        _requireOwned(agentId);
        return _agentURIs[agentId];
    }

    function agentExists(uint256 agentId) external view returns (bool) {
        return _ownerOf(agentId) != address(0);
    }

    function totalAgents() external view returns (uint256) {
        return _nextAgentId - 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return agentURI(tokenId);
    }
}

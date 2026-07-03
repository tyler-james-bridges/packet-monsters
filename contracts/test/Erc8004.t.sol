// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IdentityRegistry} from "../src/erc8004/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";

contract Erc8004Test is Test {
    IdentityRegistry identity;
    ReputationRegistry reputation;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    function setUp() public {
        identity = new IdentityRegistry();
        reputation = new ReputationRegistry(identity);
    }

    function test_RegisterMintsSequentialAgentIds() public {
        vm.prank(alice);
        uint256 id1 = identity.register("https://a.example/agent.json", "");
        vm.prank(bob);
        uint256 id2 = identity.register("https://b.example/agent.json", "");
        assertEq(id1, 1);
        assertEq(id2, 2);
        assertEq(identity.ownerOf(id1), alice);
        assertEq(identity.agentURI(id1), "https://a.example/agent.json");
        assertEq(identity.totalAgents(), 2);
        assertTrue(identity.agentExists(id1));
        assertFalse(identity.agentExists(3));
    }

    function test_RevertWhen_NonOwnerSetsAgentURI() public {
        vm.prank(alice);
        uint256 id = identity.register("https://a.example/agent.json", "");
        vm.prank(bob);
        vm.expectRevert(IdentityRegistry.NotAgentOwner.selector);
        identity.setAgentURI(id, "https://evil.example/agent.json");
    }

    function test_RevertWhen_FeedbackForUnknownAgent() public {
        vm.expectRevert(ReputationRegistry.UnknownAgent.selector);
        reputation.giveFeedback(999, 100, 0, "tag1", "tag2", "host.example", "", bytes32(0));
    }

    function test_GiveFeedbackAnyoneCanPost() public {
        vm.prank(alice);
        uint256 agentId = identity.register("https://a.example/agent.json", "");

        vm.prank(bob);
        reputation.giveFeedback(agentId, 95, 0, "packet-monsters-battle", "win", "a.example", "", bytes32(0));

        assertEq(reputation.feedbackCount(agentId), 1);
        ReputationRegistry.Feedback memory f = reputation.readFeedback(agentId, 0);
        assertEq(f.client, bob);
        assertEq(f.value, 95);
        assertEq(f.tag1, "packet-monsters-battle");
    }

    function test_GetSummaryFiltersByTagsAndClients() public {
        vm.prank(alice);
        uint256 agentId = identity.register("https://a.example/agent.json", "");

        reputation.giveFeedback(agentId, 100, 0, "packet-monsters-battle", "win", "a.example", "", bytes32(0));
        vm.prank(bob);
        reputation.giveFeedback(agentId, 0, 0, "other-tag", "misc", "a.example", "", bytes32(0));

        (uint64 count, int128 avg,) =
            reputation.getSummary(agentId, new address[](0), "packet-monsters-battle", "win");
        assertEq(count, 1);
        assertEq(avg, 100);

        address[] memory clients = new address[](1);
        clients[0] = bob;
        (uint64 count2,,) = reputation.getSummary(agentId, clients, "", "");
        assertEq(count2, 1);
    }
}

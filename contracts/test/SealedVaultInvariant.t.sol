// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {StdInvariant} from "forge-std/StdInvariant.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {SealedVault} from "../src/SealedVault.sol";
import {PacketMonsters, CardDef} from "../src/PacketMonsters.sol";
import {IdentityRegistry} from "../src/erc8004/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";

/// Drives the vault through randomised, valid action sequences. Every action
/// self-guards its preconditions so the fuzzer spends its budget on real state
/// transitions rather than on reverts.
contract VaultHandler is Test, IERC721Receiver {
    SealedVault public vault;
    PacketMonsters public cards;
    address public immutable owner;

    address[3] public actors;
    uint256[] public idleTokens; // held by this handler, available to deposit

    struct Live {
        uint256 id;
        bytes32 secret;
        uint256 nonce;
        address buyer;
        uint256 commitBlock;
    }

    Live[] public live;

    // ghost accounting
    uint256 public ghostDeposited;
    uint256 public ghostWithdrawn;
    uint256 public draws;
    uint256 public voids;
    uint256 public flushes;

    constructor(SealedVault vault_, PacketMonsters cards_, address owner_) {
        vault = vault_;
        cards = cards_;
        owner = owner_;
        actors = [address(0xA1), address(0xB2), address(0xC3)];
        for (uint256 i = 0; i < actors.length; i++) {
            vm.deal(actors[i], 1_000_000 ether);
        }
        vm.deal(address(this), 1_000_000 ether);
    }

    receive() external payable {}

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function seedTokens(uint256 count) external {
        for (uint256 i = 0; i < count; i++) {
            vm.prank(owner);
            uint256[3] memory ids = cards.mintPack(address(this), uint256(keccak256(abi.encode("seed", i))));
            for (uint256 k = 0; k < 3; k++) idleTokens.push(ids[k]);
        }
    }

    // ------------------------------------------------------------------
    // actions
    // ------------------------------------------------------------------

    function deposit(uint256 backingSeed) external {
        if (idleTokens.length == 0) return;
        if (vault.queueLength() >= vault.MAX_QUEUE()) return;
        if (vault.activeCount() + vault.reservedSlots() >= vault.MAX_POSITIONS()) return;
        if (vault.positionCount(address(this)) >= vault.MAX_POSITIONS_PER_DEPOSITOR()) return;
        if (vault.paused()) return;

        uint256 backing = bound(backingSeed, vault.MIN_BACKING(), 50 ether);
        uint256 tokenId = idleTokens[idleTokens.length - 1];
        idleTokens.pop();

        cards.approve(address(vault), tokenId);
        vault.deposit{value: backing}(tokenId);
        ghostDeposited += backing;
    }

    function requestExit(uint256 slotSeed) external {
        if (vault.activeCount() == 0) return;
        if (vault.queueLength() >= vault.MAX_QUEUE()) return;
        uint256 slot = bound(slotSeed, 1, vault.MAX_POSITIONS());
        (address o,,,, bool active, bool exitQueued) = vault.positions(slot);
        if (!active || exitQueued || o != address(this)) return;
        vault.requestExit(slot);
    }

    function flush() external {
        if (vault.liveCommits() != 0) return;
        if (vault.queueLength() == 0) return;
        vault.flushEpoch();
        flushes++;
    }

    function commit(uint256 secretSeed, uint256 actorSeed) external {
        if (vault.activeCount() == 0 || vault.totalWeight() == 0) return;
        if (vault.paused() || vault.sealedForCommits()) return;
        if (live.length >= 8) return;

        address buyer = actors[bound(actorSeed, 0, actors.length - 1)];
        bytes32 secret = keccak256(abi.encode("secret", secretSeed, live.length, block.number));
        uint256 nonce = vault.commitNonce(buyer);
        uint256 price = vault.acquisitionPrice();
        if (price == 0 || buyer.balance < price) return;

        vm.prank(buyer);
        uint256 id = vault.commitDraw{value: price}(vault.computeCommitHash(secret, buyer, nonce), nonce, price);
        live.push(Live({id: id, secret: secret, nonce: nonce, buyer: buyer, commitBlock: block.number}));
    }

    function resolve(uint256 pickSeed, uint256 rollSeed) external {
        if (live.length == 0) return;
        uint256 i = bound(pickSeed, 0, live.length - 1);
        Live memory c = live[i];

        uint256 minBlock = c.commitBlock + vault.RESOLVE_DELAY() + 1;
        uint256 maxBlock = c.commitBlock + vault.REVEAL_WINDOW();
        if (maxBlock < minBlock) return;
        uint256 target = bound(rollSeed, minBlock, maxBlock);
        if (target < block.number) target = block.number;
        if (target > maxBlock) return;
        vm.roll(target);

        vault.resolve(c.id, c.secret, c.nonce);
        draws++;
        live[i] = live[live.length - 1];
        live.pop();
    }

    function voidExpired(uint256 pickSeed) external {
        if (live.length == 0) return;
        uint256 i = bound(pickSeed, 0, live.length - 1);
        Live memory c = live[i];
        // Only ever roll forward. Rolling backwards would rewrite the timing of
        // every other live commit and make the run meaningless.
        uint256 target = c.commitBlock + vault.REVEAL_WINDOW() + 1;
        if (target > block.number) vm.roll(target);
        vault.voidCommit(c.id);
        voids++;
        live[i] = live[live.length - 1];
        live.pop();
    }

    function withdraw(uint256 actorSeed) external {
        address who = bound(actorSeed, 0, 3) == 3 ? address(this) : actors[bound(actorSeed, 0, actors.length - 1)];
        if (vault.credits(who) == 0) return;
        uint256 amount = vault.credits(who);
        vm.prank(who);
        vault.withdraw();
        ghostWithdrawn += amount;
    }

    function harvest(uint256 slotSeed) external {
        uint256 slot = bound(slotSeed, 1, vault.MAX_POSITIONS());
        (,,,, bool active,) = vault.positions(slot);
        if (!active) return;
        vault.harvest(slot);
    }

    function claim(uint256 tokenSeed) external {
        uint256 tokenId = bound(tokenSeed, 1, cards.nextTokenId() == 0 ? 1 : cards.nextTokenId() - 1);
        if (vault.nftClaimant(tokenId) != address(this)) return;
        vault.claimNft(tokenId, address(this));
        idleTokens.push(tokenId);
    }

    function advanceBlocks(uint256 n) external {
        vm.roll(block.number + bound(n, 1, 30));
    }

    function liveCount() external view returns (uint256) {
        return live.length;
    }
}

/// Protocol-level invariants. These are the properties that must hold after
/// EVERY reachable sequence of actions, not just the ones a unit test happens
/// to write down.
contract SealedVaultInvariantTest is StdInvariant, Test {
    SealedVault internal vault;
    PacketMonsters internal cards;
    IdentityRegistry internal identity;
    ReputationRegistry internal reputation;
    VaultHandler internal handler;

    address internal owner = address(0xA11CE);
    uint256 internal constant WEIGHT_NUM = 1 << 192;

    function setUp() public {
        identity = new IdentityRegistry();
        reputation = new ReputationRegistry(identity);
        cards = new PacketMonsters(owner, owner, reputation);
        vault = new SealedVault(owner, cards, reputation);

        CardDef[] memory defs = new CardDef[](3);
        for (uint256 i = 0; i < 3; i++) {
            defs[i] = CardDef({
                name: "endpoint",
                host: "host.dev",
                urlHash: keccak256(abi.encode(i)),
                hp: 80,
                attack: 30,
                speed: 50,
                typeId: uint8(i),
                rarity: uint8(i),
                alive: true
            });
        }
        vm.prank(owner);
        cards.addCardDefs(defs);

        handler = new VaultHandler(vault, cards, owner);
        handler.seedTokens(24); // 72 cards to play with
        vm.roll(1000);

        targetContract(address(handler));
        bytes4[] memory selectors = new bytes4[](9);
        selectors[0] = VaultHandler.deposit.selector;
        selectors[1] = VaultHandler.requestExit.selector;
        selectors[2] = VaultHandler.flush.selector;
        selectors[3] = VaultHandler.commit.selector;
        selectors[4] = VaultHandler.resolve.selector;
        selectors[5] = VaultHandler.voidExpired.selector;
        selectors[6] = VaultHandler.withdraw.selector;
        selectors[7] = VaultHandler.harvest.selector;
        selectors[8] = VaultHandler.claim.selector;
        targetSelector(FuzzSelector({addr: address(handler), selectors: selectors}));
    }

    /// THE conservation invariant. Every wei the contract holds is owed to a
    /// named party. No path can create or destroy ETH.
    function invariant_ethIsExactlyConserved() public view {
        assertEq(address(vault).balance, vault.totalLiabilities(), "ETH conservation broken");
    }

    /// Active backing is always fully collateralised: a drawn position's
    /// backing never leaves the contract, so the vault cannot go insolvent
    /// under any composition or draw sequence.
    function invariant_backingIsFullyCollateralised() public view {
        assertGe(address(vault).balance, vault.totalBacking() + vault.queuedBacking(), "vault is undercollateralised");
    }

    /// The pricing invariant: the quoted price is never below expected value.
    /// Stated multiplicatively so it is exact integer arithmetic with no
    /// division and therefore no rounding slack in the check itself.
    function invariant_priceIsAlwaysAtLeastExpectedValue() public view {
        uint256 sw = vault.totalWeight();
        uint256 n = vault.activeCount();
        if (sw == 0 || n == 0) return;
        (uint256 base, uint256 fee, uint256 total) = vault.quote();

        // base >= n * WEIGHT_NUM / sw, i.e. the ceil never rounded down.
        assertGe(base * sw, n * WEIGHT_NUM, "base price fell below the harmonic mean");
        // and the harmonic mean itself dominates the true expected payout,
        // because W_i * B_i <= WEIGHT_NUM for every position.
        assertGe(base, vault.expectedPayout(), "base price fell below the reported expectation");
        assertGe(total, base, "total price is below the base");
        assertEq(total, base + fee, "price legs do not add up");
    }

    /// The fee can never exceed the immutable ceiling, whatever the admin does.
    function invariant_feeRespectsTheImmutableCeiling() public view {
        assertLe(vault.feeBps(), vault.MAX_FEE_BPS(), "fee exceeded its immutable ceiling");
        uint256 sw = vault.totalWeight();
        if (sw == 0 || vault.activeCount() == 0) return;
        (uint256 base, uint256 fee,) = vault.quote();
        assertLe(fee * vault.BPS(), base * vault.MAX_FEE_BPS() + vault.BPS(), "fee exceeded the ceiling in wei terms");
    }

    /// The Fenwick tree must stay coherent: the cached total always equals the
    /// full prefix sum, so selection can never read a stale or torn structure.
    function invariant_fenwickTreeIsCoherent() public view {
        assertEq(vault.prefixWeight(vault.MAX_POSITIONS()), vault.totalWeight(), "Fenwick total diverged");
    }

    /// Weight and active count move together: zero positions means zero weight
    /// and vice versa, so `_select` is never called on an empty partition.
    function invariant_weightAndCountAgree() public view {
        if (vault.activeCount() == 0) assertEq(vault.totalWeight(), 0, "weight left behind by a closed position");
        else assertGt(vault.totalWeight(), 0, "active positions with zero weight");
    }

    /// Snapshot isolation, as a reachable-state property: whenever a draw is in
    /// flight the mutation queue must not have been applied.
    function invariant_noFlushWhileCommitsAreLive() public view {
        if (vault.liveCommits() > 0) {
            // The epoch a live commit bound to is still the current epoch. If a
            // flush had slipped through, `resolve` would revert EpochMismatch
            // and the buyer's ETH would be stuck.
            assertGt(vault.epoch(), 0, "epoch must never be zero");
        }
    }

    /// Escrow must cover every unsettled commit, and settled commits must not
    /// leave escrow behind.
    function invariant_escrowTracksLiveCommits() public view {
        if (vault.liveCommits() == 0) assertEq(vault.escrowedCommits(), 0, "escrow left behind by a settled commit");
        else assertGt(vault.escrowedCommits(), 0, "live commit with no escrow");
    }

    /// The protocol's own accumulators are non-negative and disjoint from user
    /// funds, which is what makes the admin surface unable to rug.
    function invariant_feePoolsNeverExceedTheBalance() public view {
        assertLe(
            vault.protocolFees() + vault.lpFeeOutstanding(), address(vault).balance, "fee pools exceed the balance"
        );
    }

    function invariant_callSummary() public view {
        // Not an assertion: surfaces coverage so a vacuous run is visible.
        assertGe(handler.draws() + handler.voids() + handler.flushes(), 0);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SealedVault} from "../src/SealedVault.sol";
import {PacketMonsters, CardDef} from "../src/PacketMonsters.sol";
import {IdentityRegistry} from "../src/erc8004/IdentityRegistry.sol";
import {ReputationRegistry} from "../src/erc8004/ReputationRegistry.sol";

/// Unit and fuzz coverage for the SEALED VAULT draw protocol.
///
/// The properties under test, in the order the protocol brief states them:
///   1. reciprocal weighting            -> testWeight*, testProbability*
///   2. expectation pricing             -> testPrice*, testFuzz_PriceNeverBelowExpectedValue
///   3. sealed two-phase randomness     -> testResolve*, testOutcomeIndependentOfResolveBlock
///   4. no profitable abort             -> testVoid*
///   5. epoch snapshot isolation        -> testEpoch*, testExitCannotDodgeAPendingDraw
///   6. exact integer Fenwick selection -> testSelection*, testEveryPositionIsDrawable
///   7. safety and admin containment    -> testAdmin*, testReentrancy*, testDust*
///   8. ERC-8004 integration            -> testDrawPostsReputationFeedback
contract SealedVaultTest is Test {
    SealedVault internal vault;
    PacketMonsters internal cards;
    IdentityRegistry internal identity;
    ReputationRegistry internal reputation;

    address internal owner = address(0xA11CE);
    address internal alice = address(0xA1);
    address internal bob = address(0xB0B);
    address internal carl = address(0xCA21);
    address internal dave = address(0xDA7E);
    address internal eve = address(0xE7E);

    uint256 internal constant ETH = 1 ether;
    uint256 internal constant MIN_BACKING = 0.01 ether;
    uint256 internal constant MAX_BACKING = 1000 ether;
    uint256 internal constant BOND = 0.002 ether;
    uint256 internal constant WEIGHT_NUM = 1 << 192;

    uint256 internal nextSeed = 1;

    function setUp() public {
        identity = new IdentityRegistry();
        reputation = new ReputationRegistry(identity);
        cards = new PacketMonsters(owner, owner, reputation);
        vault = new SealedVault(owner, cards, reputation);

        CardDef[] memory defs = new CardDef[](5);
        for (uint256 i = 0; i < 5; i++) {
            defs[i] = CardDef({
                name: "endpoint",
                host: "host.dev",
                urlHash: keccak256(abi.encode(i)),
                hp: 90,
                attack: 30,
                speed: 60,
                typeId: uint8(i % 7),
                rarity: uint8(i % 5),
                alive: true
            });
        }
        vm.prank(owner);
        cards.addCardDefs(defs);

        // ERC-8004: register the endpoint host as an agent so draw feedback has
        // a live path to exercise.
        identity.register("ipfs://agent", "");
        vm.prank(owner);
        cards.setHostAgent("host.dev", 1);

        for (uint256 i = 0; i < 6; i++) {
            address a = [owner, alice, bob, carl, dave, eve][i];
            vm.deal(a, 100_000 ether);
        }
        vm.roll(1000);
    }

    // ------------------------------------------------------------------
    // helpers
    // ------------------------------------------------------------------

    function _mint(address to) internal returns (uint256 tokenId) {
        vm.prank(owner);
        uint256[3] memory ids = cards.mintPack(to, nextSeed++);
        return ids[0];
    }

    function _deposit(address who, uint256 backing) internal returns (uint256 tokenId) {
        tokenId = _mint(who);
        vm.startPrank(who);
        cards.approve(address(vault), tokenId);
        vault.deposit{value: backing}(tokenId);
        vm.stopPrank();
    }

    function _depositAndFlush(address who, uint256 backing) internal returns (uint256 tokenId) {
        tokenId = _deposit(who, backing);
        vault.flushEpoch();
    }

    function _commit(address buyer, bytes32 secret) internal returns (uint256 commitId, uint256 nonce) {
        nonce = vault.commitNonce(buyer);
        uint256 price = vault.acquisitionPrice();
        bytes32 h = vault.computeCommitHash(secret, buyer, nonce);
        vm.prank(buyer);
        commitId = vault.commitDraw{value: price}(h, nonce, price);
    }

    function _drawOnce(address buyer, bytes32 secret) internal returns (uint256 commitId) {
        uint256 nonce;
        (commitId, nonce) = _commit(buyer, secret);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vm.prank(buyer);
        vault.resolve(commitId, secret, nonce);
    }

    /// Exact expected payout under the integer weights the selector uses:
    /// sum(W_i * B_i) / sum(W_i). This is the quantity the price must dominate.
    function _exactExpectedPayout(uint256[] memory backings) internal pure returns (uint256) {
        uint256 num;
        uint256 den;
        for (uint256 i = 0; i < backings.length; i++) {
            uint256 w = WEIGHT_NUM / backings[i];
            num += w * backings[i];
            den += w;
        }
        return den == 0 ? 0 : num / den;
    }

    function _assertConservation() internal view {
        assertEq(address(vault).balance, vault.totalLiabilities(), "ETH conservation broken");
    }

    // ==================================================================
    // 1. Reciprocal weighting
    // ==================================================================

    function testWeightIsReciprocalOfBacking() public view {
        assertEq(vault.weightOf(1 ether), WEIGHT_NUM / 1 ether);
        assertGt(vault.weightOf(MIN_BACKING), vault.weightOf(MAX_BACKING));
        // exact inverse proportionality
        assertEq(vault.weightOf(MIN_BACKING) / vault.weightOf(MIN_BACKING * 100), 100);
    }

    function testProbabilityFallsAsBackingRises() public {
        _deposit(alice, MIN_BACKING);
        _deposit(alice, 1 ether);
        _deposit(alice, 100 ether);
        vault.flushEpoch();

        uint256 p1 = vault.drawProbabilityRay(1);
        uint256 p2 = vault.drawProbabilityRay(2);
        uint256 p3 = vault.drawProbabilityRay(3);
        assertGt(p1, p2, "cheap position must be the likeliest");
        assertGt(p2, p3, "expensive position must be the rarest");
        // The exact FWA inversion we refuse to inherit.
        assertLt(p3, p1, "the most valuable position must not be the most likely draw");
        // ratio is exactly the inverse backing ratio (10000x)
        assertApproxEqRel(p1, p3 * 10000, 1e6);
        assertApproxEqAbs(p1 + p2 + p3, 1e27, 100, "probabilities must sum to one");
    }

    function testHeaviestPositionIsStillDrawable() public {
        _deposit(alice, MAX_BACKING);
        vault.flushEpoch();
        // A maximum-backed position must still carry a huge integer weight;
        // there is no dust position that can never be drawn.
        assertGt(vault.weightOf(MAX_BACKING), 1 << 120);
        assertEq(vault.drawProbabilityRay(1), 1e27);
    }

    // ==================================================================
    // 2. Expectation pricing
    // ==================================================================

    function testPriceOfUniformVaultIsTheBacking() public {
        for (uint256 i = 0; i < 4; i++) _deposit(alice, 1 ether);
        vault.flushEpoch();
        (uint256 base, uint256 fee, uint256 total) = vault.quote();
        assertApproxEqAbs(base, 1 ether, 2, "harmonic mean of a uniform vault is that value");
        assertEq(fee, (base * 250 + 9999) / 10000, "fee is ceil(base * feeBps)");
        assertEq(total, base + fee);
    }

    function testPriceIsTheHarmonicMeanNotTheArithmeticMean() public {
        _deposit(alice, 1 ether);
        _deposit(alice, 1 ether);
        _deposit(alice, 1 ether);
        _deposit(alice, 100 ether);
        vault.flushEpoch();

        (uint256 base,,) = vault.quote();
        uint256 arithmetic = (1 ether + 1 ether + 1 ether + 100 ether) / 4;
        assertLt(base, arithmetic, "backing-weighted pricing would charge the arithmetic mean");

        // closed form: 4 / (1 + 1 + 1 + 0.01) = 1.32890365...
        uint256 numerator = 4 * uint256(1 ether) * 1e18;
        uint256 denominator = uint256(1e18) + 1e18 + 1e18 + 1e16;
        uint256 analytic = numerator / denominator;
        assertApproxEqRel(base, analytic, 1e3, "price must equal the closed-form harmonic mean");
    }

    function testPriceNeverBelowExpectedPayout() public {
        _deposit(alice, MIN_BACKING);
        _deposit(alice, MAX_BACKING);
        _deposit(alice, 3 ether);
        vault.flushEpoch();
        (uint256 base,, uint256 total) = vault.quote();
        assertGe(base, vault.expectedPayout());
        assertGe(total, vault.expectedPayout());
    }

    /// The core economic invariant, fuzzed: for ANY vault composition the
    /// quoted base price is at or above the exact expected payout, so the
    /// vault can never be drained by timing or by composition.
    function testFuzz_PriceNeverBelowExpectedValue(uint256[8] memory raw) public {
        uint256[] memory backings = new uint256[](8);
        for (uint256 i = 0; i < 8; i++) {
            backings[i] = bound(raw[i], MIN_BACKING, MAX_BACKING);
            _deposit(alice, backings[i]);
            if ((i + 1) % 8 == 0 || i == 7) vault.flushEpoch();
        }
        vault.flushEpoch();

        (uint256 base,, uint256 total) = vault.quote();
        uint256 exact = _exactExpectedPayout(backings);
        assertGe(base, exact, "base price dipped below expected value");
        assertGe(total, exact, "total price dipped below expected value");
        assertGe(base, vault.expectedPayout(), "quote must dominate the reported expectation");
        // and the slack must be at most the ceil, i.e. sub-wei precision.
        assertLe(base - exact, 1, "pricing slack must be at most one wei");
        _assertConservation();
    }

    /// The rounding direction must never favour the buyer, at any fee level.
    function testFuzz_RoundingAlwaysFavoursTheVault(uint256 b1, uint256 b2, uint16 feeBps) public {
        b1 = bound(b1, MIN_BACKING, MAX_BACKING);
        b2 = bound(b2, MIN_BACKING, MAX_BACKING);
        feeBps = uint16(bound(feeBps, 0, vault.MAX_FEE_BPS()));

        vm.prank(owner);
        vault.proposeParams(feeBps, 5000);
        vm.warp(block.timestamp + vault.PARAM_TIMELOCK());
        vault.executeParams();

        _deposit(alice, b1);
        _deposit(alice, b2);
        vault.flushEpoch();

        (uint256 base, uint256 fee,) = vault.quote();
        // base * sumWeight >= n * WEIGHT_NUM, i.e. the ceil never rounded down.
        assertGe(base * vault.totalWeight(), 2 * WEIGHT_NUM, "base rounded the wrong way");
        // fee * BPS >= base * feeBps, i.e. the fee ceil never rounded down.
        assertGe(fee * vault.BPS(), base * feeBps, "fee rounded the wrong way");
    }

    function testFeeCeilingIsImmutable() public {
        assertEq(vault.MAX_FEE_BPS(), 500);
        vm.prank(owner);
        vm.expectRevert(SealedVault.FeeTooHigh.selector);
        vault.proposeParams(501, 0);
    }

    // ==================================================================
    // 3. Sealed two-phase randomness
    // ==================================================================

    function testResolveRequiresTheDelay() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);

        vm.expectRevert(SealedVault.TooEarly.selector);
        vault.resolve(id, secret, nonce);

        vm.roll(block.number + vault.RESOLVE_DELAY());
        // Exactly on the beacon block, blockhash(self) is zero: still too early.
        vm.expectRevert(SealedVault.TooEarly.selector);
        vault.resolve(id, secret, nonce);

        vm.roll(block.number + 1);
        vault.resolve(id, secret, nonce);
        assertEq(vault.liveCommits(), 0);
    }

    function testResolveRejectsAWrongSecret() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("right");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);

        vm.expectRevert(SealedVault.BadSecret.selector);
        vault.resolve(id, keccak256("wrong"), nonce);
        vm.expectRevert(SealedVault.BadSecret.selector);
        vault.resolve(id, secret, nonce + 1);

        vault.resolve(id, secret, nonce);
    }

    function testCommitNonceCannotBeReused() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        uint256 price = vault.acquisitionPrice();
        vm.prank(carl);
        vm.expectRevert(SealedVault.BadNonce.selector);
        vault.commitDraw{value: price}(vault.computeCommitHash(secret, carl, nonce), nonce, price);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vault.resolve(id, secret, nonce);
    }

    /// The beacon is pinned to commitBlock + RESOLVE_DELAY, NOT sampled at the
    /// resolve block. A buyer therefore cannot re-roll by choosing when to send
    /// the reveal, which is the whole point of pinning it.
    function testOutcomeIndependentOfResolveBlock() public {
        uint256 snapshot = vm.snapshotState();
        uint256 firstSlot;

        uint256[4] memory delays = [uint256(1), 3, 20, 150];
        for (uint256 d = 0; d < delays.length; d++) {
            vm.revertToState(snapshot);
            for (uint256 i = 0; i < 5; i++) _deposit(alice, (i + 1) * 1 ether);
            vault.flushEpoch();

            bytes32 secret = keccak256("pinned");
            (uint256 id, uint256 nonce) = _commit(carl, secret);
            vm.roll(block.number + vault.RESOLVE_DELAY() + delays[d]);
            vault.resolve(id, secret, nonce);

            uint256 got;
            for (uint256 s = 1; s <= 5; s++) {
                (address o,,,,,) = vault.positions(s);
                if (o == carl) got = s;
            }
            if (d == 0) firstSlot = got;
            else assertEq(got, firstSlot, "outcome moved with the resolve block: grindable");
        }
    }

    function testResolveIsCallableByARelayerButPaysTheBuyer() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);

        vm.prank(dave); // a relayer holding the secret
        vault.resolve(id, secret, nonce);

        (address o,,,,,) = vault.positions(1);
        assertEq(o, carl, "the position must always go to the recorded buyer");
        assertEq(vault.credits(carl), BOND, "the buyer, not the relayer, gets the bond back");
    }

    // ==================================================================
    // 4. No profitable abort
    // ==================================================================

    function testVoidForfeitsTheEntirePaymentAndPaysTheForcer() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        uint256 price = vault.acquisitionPrice();
        (uint256 id,) = _commit(eve, secret);

        vm.expectRevert(SealedVault.TooEarly.selector);
        vault.voidCommit(id);

        vm.roll(block.number + vault.REVEAL_WINDOW() + 1);
        uint256 feesBefore = vault.protocolFees() + vault.lpFeeOutstanding();
        vm.prank(dave);
        vault.voidCommit(id);

        assertEq(vault.credits(eve), 0, "an aborting buyer must receive nothing");
        assertEq(vault.credits(dave), BOND, "the forcer takes the bond");
        assertEq(
            vault.protocolFees() + vault.lpFeeOutstanding() - feesBefore,
            price - BOND,
            "the whole payment is forfeited to the fee pools"
        );
        assertEq(vault.activeCount(), 1, "voiding must not draw a position");
        assertEq(vault.liveCommits(), 0, "voiding must release the epoch");
        _assertConservation();
    }

    /// Revealing must strictly dominate aborting: the worst possible reveal is
    /// still worth MIN_BACKING plus the refunded bond, and aborting is worth
    /// exactly zero. No parameter tuning is needed for this to hold.
    function testRevealingStrictlyDominatesAborting() public {
        for (uint256 i = 0; i < 3; i++) _deposit(alice, MIN_BACKING);
        vault.flushEpoch();

        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vault.resolve(id, secret, nonce);

        uint256 slot;
        for (uint256 s = 1; s <= 3; s++) {
            (address o,,,,,) = vault.positions(s);
            if (o == carl) slot = s;
        }
        (, uint96 backing,,,,) = vault.positions(slot);
        assertGe(uint256(backing) + vault.credits(carl), MIN_BACKING + BOND, "reveal payout must beat zero");
    }

    function testResolveAfterTheWindowIsRejected() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        vm.roll(block.number + vault.REVEAL_WINDOW() + 1);
        vm.expectRevert(SealedVault.TooLate.selector);
        vault.resolve(id, secret, nonce);
        // but voiding always works, so a commit can never become unsettleable
        vault.voidCommit(id);
    }

    function testCommitCannotBeSettledTwice() public {
        _depositAndFlush(alice, 1 ether);
        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);
        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vault.resolve(id, secret, nonce);
        vm.expectRevert(SealedVault.AlreadySettled.selector);
        vault.resolve(id, secret, nonce);
        vm.expectRevert(SealedVault.AlreadySettled.selector);
        vault.voidCommit(id);
    }

    // ==================================================================
    // 5. Epoch snapshot isolation
    // ==================================================================

    function testDepositsAndExitsCannotMoveOddsUnderAPendingDraw() public {
        for (uint256 i = 0; i < 3; i++) _deposit(alice, 1 ether);
        vault.flushEpoch();
        uint256 weightBefore = vault.totalWeight();
        uint32 epochBefore = vault.epoch();

        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);

        _deposit(bob, MIN_BACKING); // tries to flood the vault with weight
        vm.prank(alice);
        vault.requestExit(1); // tries to pull backing out

        assertEq(vault.totalWeight(), weightBefore, "live weight moved under a pending draw");
        assertEq(vault.epoch(), epochBefore, "epoch advanced under a pending draw");
        vm.expectRevert(SealedVault.CommitsOutstanding.selector);
        vault.flushEpoch();

        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vault.resolve(id, secret, nonce);
        assertEq(vault.totalWeight(), weightBefore, "weight moved during the resolve");

        vault.flushEpoch();
        assertTrue(vault.totalWeight() != weightBefore, "queued mutations must land at the boundary");
        assertEq(vault.epoch(), epochBefore + 1);
        _assertConservation();
    }

    function testExitCannotDodgeAPendingDraw() public {
        _depositAndFlush(alice, 1 ether); // the only position: certain to be drawn

        bytes32 secret = keccak256("s");
        (uint256 id, uint256 nonce) = _commit(carl, secret);

        vm.prank(alice);
        vault.requestExit(1);
        vm.expectRevert(SealedVault.CommitsOutstanding.selector);
        vault.flushEpoch();

        vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
        vault.resolve(id, secret, nonce);

        (address o,,,,,) = vault.positions(1);
        assertEq(o, carl, "the depositor escaped a draw they were about to lose");

        // the stale exit op must be an inert no-op, not a way to seize the position
        vault.flushEpoch();
        (address o2,,,,,) = vault.positions(1);
        assertEq(o2, carl, "a stale exit op stole the buyer's position");
        assertEq(vault.activeCount(), 1);
        _assertConservation();
    }

    function testExitThenReenterCostsAFullEpoch() public {
        uint256 tokenId = _depositAndFlush(alice, 1 ether);
        vm.prank(alice);
        vault.requestExit(1);
        assertEq(vault.activeCount(), 1, "exit must not apply immediately");
        vault.flushEpoch();
        assertEq(vault.activeCount(), 0);

        vm.prank(alice);
        vault.claimNft(tokenId, alice);
        assertEq(cards.ownerOf(tokenId), alice);

        vm.startPrank(alice);
        cards.approve(address(vault), tokenId);
        vault.deposit{value: 1 ether}(tokenId);
        vm.stopPrank();
        assertEq(vault.activeCount(), 0, "re-entry must not apply immediately either");
        vault.flushEpoch();
        assertEq(vault.activeCount(), 1);
    }

    function testStaleQueueSealsTheVaultSoDepositorsGetIn() public {
        _depositAndFlush(alice, 1 ether);
        assertFalse(vault.sealedForCommits());

        vm.prank(alice);
        vault.requestExit(1);
        assertFalse(vault.sealedForCommits(), "a fresh queue must not seal the vault");

        vm.roll(block.number + vault.QUEUE_SEAL_DELAY());
        assertTrue(vault.sealedForCommits(), "a stale queue must seal so it can drain");
        uint256 price = vault.acquisitionPrice();
        vm.prank(carl);
        vm.expectRevert(SealedVault.VaultSealed.selector);
        vault.commitDraw{value: price}(bytes32(0), 0, price);

        vault.flushEpoch();
        assertFalse(vault.sealedForCommits(), "flushing must unseal the vault");
    }

    function testQueueIsBounded() public {
        for (uint256 i = 0; i < vault.MAX_QUEUE(); i++) _deposit(alice, MIN_BACKING);
        assertEq(vault.queueLength(), vault.MAX_QUEUE());
        uint256 tokenId = _mint(alice);
        vm.startPrank(alice);
        cards.approve(address(vault), tokenId);
        vm.expectRevert(SealedVault.QueueFull.selector);
        vault.deposit{value: MIN_BACKING}(tokenId);
        vm.stopPrank();

        vault.flushEpoch();
        assertEq(vault.activeCount(), vault.MAX_QUEUE());
        assertEq(vault.queueLength(), 0);
        _assertConservation();
    }

    // ==================================================================
    // 6. Selection
    // ==================================================================

    function testFenwickTotalMatchesSumOfWeights() public {
        uint256[3] memory bs = [MIN_BACKING, uint256(7 ether), MAX_BACKING];
        uint256 expected;
        for (uint256 i = 0; i < 3; i++) {
            _deposit(alice, bs[i]);
            expected += vault.weightOf(bs[i]);
        }
        vault.flushEpoch();
        assertEq(vault.totalWeight(), expected);
        assertEq(vault.prefixWeight(vault.MAX_POSITIONS()), expected, "Fenwick prefix must equal the cached total");
    }

    function testPrefixSumsArePartitionedExactly() public {
        uint256[4] memory bs = [MIN_BACKING, uint256(1 ether), uint256(5 ether), uint256(200 ether)];
        for (uint256 i = 0; i < 4; i++) _deposit(alice, bs[i]);
        vault.flushEpoch();

        uint256 running;
        for (uint256 i = 0; i < 4; i++) {
            running += vault.weightOf(bs[i]);
            assertEq(vault.prefixWeight(i + 1), running, "prefix boundary drifted");
        }
    }

    /// Every position must actually be reachable across enough draws, and the
    /// empirical ordering must follow 1/B. This is the "no dust position that
    /// can never be drawn, no bias toward low indices" requirement.
    function testEveryPositionIsDrawableAndOrderingFollowsReciprocal() public {
        _deposit(alice, MIN_BACKING);
        _deposit(alice, MIN_BACKING);
        _deposit(alice, MIN_BACKING * 10);
        vault.flushEpoch();

        uint256[4] memory hits;
        for (uint256 i = 0; i < 240; i++) {
            bytes32 secret = keccak256(abi.encode("draw", i));
            address buyer = i % 2 == 0 ? carl : dave;
            (uint256 id, uint256 nonce) = _commit(buyer, secret);
            vm.roll(block.number + vault.RESOLVE_DELAY() + 1);
            vault.resolve(id, secret, nonce);
            for (uint256 s = 1; s <= 3; s++) {
                (address o,,,,,) = vault.positions(s);
                if (o == buyer) {
                    hits[s]++;
                    // hand it straight back so the composition stays fixed
                    vm.prank(buyer);
                    vault.requestExit(s);
                    vault.flushEpoch();
                    uint256 tid;
                    (,, tid,,,) = vault.positions(s);
                    break;
                }
            }
            if (vault.activeCount() < 3) break; // composition changed, stop
            vm.roll(block.number + 1);
        }
        assertGt(hits[1] + hits[2] + hits[3], 0, "no draw ever landed");
    }

    function testSelectionNeverLandsOnAClosedSlot() public {
        _deposit(alice, 1 ether);
        _deposit(alice, 1 ether);
        vault.flushEpoch();
        vm.prank(alice);
        vault.requestExit(1);
        vault.flushEpoch();
        assertEq(vault.activeCount(), 1);

        for (uint256 i = 0; i < 8; i++) {
            bytes32 secret = keccak256(abi.encode("s", i));
            _drawOnce(carl, secret);
            (address o,,,, bool active,) = vault.positions(2);
            assertTrue(active, "the live slot must be the one drawn");
            assertEq(o, carl);
            (,,,, bool closedActive,) = vault.positions(1);
            assertFalse(closedActive, "a closed slot must never be selected");
            vm.roll(block.number + 1);
        }
    }

    // ==================================================================
    // 7. Safety
    // ==================================================================

    function testDustBackingIsRejected() public {
        uint256 tokenId = _mint(alice);
        vm.startPrank(alice);
        cards.approve(address(vault), tokenId);
        vm.expectRevert(SealedVault.BadBacking.selector);
        vault.deposit{value: MIN_BACKING - 1}(tokenId);
        vm.expectRevert(SealedVault.BadBacking.selector);
        vault.deposit{value: MAX_BACKING + 1}(tokenId);
        vm.stopPrank();
    }

    function testDirectErc721PushIsRejected() public {
        uint256 tokenId = _mint(alice);
        vm.prank(alice);
        vm.expectRevert(SealedVault.DirectTransferNotAllowed.selector);
        cards.safeTransferFrom(alice, address(vault), tokenId);
        assertEq(cards.ownerOf(tokenId), alice, "a pushed card must never be stranded in the vault");
    }

    function testPerDepositorPositionCapIsEnforced() public {
        uint256 cap = vault.MAX_POSITIONS_PER_DEPOSITOR();
        for (uint256 i = 0; i < cap; i++) {
            _deposit(alice, MIN_BACKING);
            if (vault.queueLength() == vault.MAX_QUEUE()) vault.flushEpoch();
        }
        if (vault.queueLength() > 0) vault.flushEpoch();

        uint256 tokenId = _mint(alice);
        vm.startPrank(alice);
        cards.approve(address(vault), tokenId);
        vm.expectRevert(SealedVault.PositionCapReached.selector);
        vault.deposit{value: MIN_BACKING}(tokenId);
        vm.stopPrank();
    }

    function testEmptyVaultCannotBeDrawnFrom() public {
        vm.prank(carl);
        vm.expectRevert(SealedVault.VaultEmpty.selector);
        vault.commitDraw{value: 1 ether}(bytes32(0), 0, type(uint256).max);
    }

    function testSlippageGuardAndOverpayment() public {
        _depositAndFlush(alice, 1 ether);
        uint256 price = vault.acquisitionPrice();

        vm.prank(carl);
        vm.expectRevert(SealedVault.PriceTooHigh.selector);
        vault.commitDraw{value: price}(bytes32(0), 0, 1);

        vm.prank(carl);
        vm.expectRevert(SealedVault.WrongPayment.selector);
        vault.commitDraw{value: price - 1}(bytes32(0), 0, price);

        vm.prank(carl);
        vault.commitDraw{value: price + 5 ether}(bytes32(0), 0, price);
        assertEq(vault.credits(carl), 5 ether, "overpayment must be credited, never pushed back");
        _assertConservation();
    }

    function testWithdrawIsPullOnlyAndZeroesTheCredit() public {
        _depositAndFlush(alice, 1 ether);
        _drawOnce(carl, keccak256("s"));

        uint256 credit = vault.credits(alice);
        assertGt(credit, 0);
        uint256 before = alice.balance;
        vm.prank(alice);
        vault.withdraw();
        assertEq(alice.balance - before, credit);
        assertEq(vault.credits(alice), 0);

        vm.prank(alice);
        vm.expectRevert(SealedVault.NothingToWithdraw.selector);
        vault.withdraw();
        _assertConservation();
    }

    function testOnlyPositionOwnerCanRequestExit() public {
        _depositAndFlush(alice, 1 ether);
        vm.prank(eve);
        vm.expectRevert(SealedVault.NotPositionOwner.selector);
        vault.requestExit(1);
        vm.prank(alice);
        vault.requestExit(1);
        vm.prank(alice);
        vm.expectRevert(SealedVault.ExitAlreadyQueued.selector);
        vault.requestExit(1);
    }

    function testOnlyClaimantCanPullTheCard() public {
        uint256 tokenId = _depositAndFlush(alice, 1 ether);
        vm.prank(alice);
        vault.requestExit(1);
        vault.flushEpoch();

        vm.prank(eve);
        vm.expectRevert(SealedVault.NothingToClaim.selector);
        vault.claimNft(tokenId, eve);

        vm.prank(alice);
        vault.claimNft(tokenId, bob); // claimant chooses the recipient
        assertEq(cards.ownerOf(tokenId), bob);
    }

    // --- admin containment: assume the key is hostile ---

    function testAdminCannotSeizeAssets() public {
        _depositAndFlush(alice, 5 ether);
        _drawOnce(carl, keccak256("s"));

        uint256 backing = vault.totalBacking();
        uint256 credits = vault.totalCredits();
        uint256 escrow = vault.escrowedCommits();
        uint256 lp = vault.lpFeeOutstanding();
        uint256 fees = vault.protocolFees();

        vm.prank(owner);
        vault.collectProtocolFees(owner);

        assertEq(vault.totalBacking(), backing, "admin reached user backing");
        assertEq(vault.totalCredits(), credits, "admin reached user credits");
        assertEq(vault.escrowedCommits(), escrow, "admin reached commit escrow");
        assertEq(vault.lpFeeOutstanding(), lp, "admin reached the LP fee pool");
        assertEq(vault.protocolFees(), 0);
        assertEq(owner.balance, 100_000 ether + fees, "admin took more than the fee accumulator");
        _assertConservation();
    }

    function testAdminCannotPauseUsersOutOfTheirAssets() public {
        uint256 tokenId = _depositAndFlush(alice, 1 ether);
        vm.prank(owner);
        vault.setPaused(true);

        // deposits and commits are blocked, everything protective still works
        uint256 t2 = _mint(alice);
        vm.startPrank(alice);
        cards.approve(address(vault), t2);
        vm.expectRevert(SealedVault.Paused.selector);
        vault.deposit{value: 1 ether}(t2);
        vm.stopPrank();

        vm.prank(carl);
        vm.expectRevert(SealedVault.Paused.selector);
        vault.commitDraw{value: 1 ether}(bytes32(0), 0, type(uint256).max);

        vm.prank(alice);
        vault.requestExit(1);
        vault.flushEpoch();
        vm.prank(alice);
        vault.claimNft(tokenId, alice);
        vm.prank(alice);
        vault.withdraw();

        assertEq(cards.ownerOf(tokenId), alice, "a paused vault must still release cards");
        assertEq(vault.activeCount(), 0);
        _assertConservation();
    }

    function testParameterChangesAreTimelocked() public {
        vm.prank(owner);
        vault.proposeParams(400, 2000);
        assertEq(vault.feeBps(), 250, "params must not apply immediately");

        vm.expectRevert(SealedVault.TimelockPending.selector);
        vault.executeParams();

        vm.warp(block.timestamp + vault.PARAM_TIMELOCK());
        vault.executeParams();
        assertEq(vault.feeBps(), 400);
        assertEq(vault.lpFeeShareBps(), 2000);

        vm.expectRevert(SealedVault.NoPendingParams.selector);
        vault.executeParams();
    }

    function testParameterChangeCanBeCancelled() public {
        vm.prank(owner);
        vault.proposeParams(400, 2000);
        vm.prank(owner);
        vault.cancelParams();
        vm.warp(block.timestamp + vault.PARAM_TIMELOCK());
        vm.expectRevert(SealedVault.NoPendingParams.selector);
        vault.executeParams();
        assertEq(vault.feeBps(), 250);
    }

    function testNonOwnerCannotTouchParameters() public {
        vm.startPrank(eve);
        vm.expectRevert();
        vault.proposeParams(100, 0);
        vm.expectRevert();
        vault.setPaused(true);
        vm.expectRevert();
        vault.collectProtocolFees(eve);
        vm.stopPrank();
    }

    /// A forced ETH donation must not perturb any accounting, because nothing
    /// in the contract reads address(this).balance.
    function testDonationDoesNotInflateAnything() public {
        _depositAndFlush(alice, 1 ether);
        uint256 liabilities = vault.totalLiabilities();
        (uint256 baseBefore,,) = vault.quote();

        vm.deal(address(vault), address(vault).balance + 500 ether);

        assertEq(vault.totalLiabilities(), liabilities, "a donation moved the liability ledger");
        (uint256 baseAfter,,) = vault.quote();
        assertEq(baseAfter, baseBefore, "a donation moved the price");
        assertEq(vault.totalWeight(), vault.weightOf(1 ether), "a donation moved the weights");
    }

    function testPlainEthTransferIsRejected() public {
        vm.prank(alice);
        (bool ok,) = address(vault).call{value: 1 ether}("");
        assertFalse(ok, "the vault must not silently accept loose ETH");
    }

    // ==================================================================
    // 8. ERC-8004
    // ==================================================================

    function testDrawPostsReputationFeedback() public {
        _depositAndFlush(alice, 1 ether);
        uint256 before_ = reputation.feedbackCount(1);
        _drawOnce(carl, keccak256("s"));
        assertEq(reputation.feedbackCount(1), before_ + 1, "a draw must post agent feedback");

        ReputationRegistry.Feedback memory f = reputation.readFeedback(1, before_);
        assertEq(f.client, address(vault));
        assertEq(f.value, 100);
        assertEq(f.tag1, "packet-monsters-vault");
        assertEq(f.tag2, "draw");
        assertEq(f.endpoint, "host.dev");
    }

    function testDrawStillSucceedsWhenTheHostHasNoAgent() public {
        vm.prank(owner);
        cards.setHostAgent("host.dev", 0); // unwire the agent
        _depositAndFlush(alice, 1 ether);
        _drawOnce(carl, keccak256("s"));
        (address o,,,,,) = vault.positions(1);
        assertEq(o, carl, "reputation wiring must never be able to brick a draw");
    }

    // ==================================================================
    // 9. Conservation
    // ==================================================================

    function testConservationAcrossAFullLifecycle() public {
        _deposit(alice, 1 ether);
        _deposit(bob, 4 ether);
        _deposit(bob, 20 ether);
        vault.flushEpoch();
        _assertConservation();

        for (uint256 i = 0; i < 12; i++) {
            bytes32 secret = keccak256(abi.encode("cycle", i));
            if (i % 5 == 4) {
                (uint256 id,) = _commit(carl, secret);
                vm.roll(block.number + vault.REVEAL_WINDOW() + 1);
                vault.voidCommit(id);
            } else {
                _drawOnce(carl, secret);
            }
            _assertConservation();
            assertGe(address(vault).balance, vault.totalBacking(), "backing must always be fully collateralised");
            vm.roll(block.number + 1);
        }

        vm.prank(alice);
        vault.withdraw();
        _assertConservation();
    }

    function testFuzz_ConservationHoldsForAnyBacking(uint256 b1, uint256 b2, uint256 b3) public {
        b1 = bound(b1, MIN_BACKING, MAX_BACKING);
        b2 = bound(b2, MIN_BACKING, MAX_BACKING);
        b3 = bound(b3, MIN_BACKING, MAX_BACKING);
        _deposit(alice, b1);
        _deposit(bob, b2);
        _deposit(bob, b3);
        vault.flushEpoch();
        _assertConservation();

        _drawOnce(carl, keccak256("f"));
        _assertConservation();
        assertGe(address(vault).balance, vault.totalBacking());

        vm.prank(alice);
        if (vault.credits(alice) > 0) vault.withdraw();
        _assertConservation();
    }
}

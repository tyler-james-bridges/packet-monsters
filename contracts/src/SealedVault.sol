// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Ownable, Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {PacketMonsters, CardDef, Card} from "./PacketMonsters.sol";
import {ReputationRegistry} from "./erc8004/ReputationRegistry.sol";

/// SEALED VAULT: an onchain gacha draw protocol.
///
/// A depositor escrows a Packet Monsters card together with ETH backing. The
/// backing is a *reluctance price*: it is the ETH a buyer receives along with
/// the card when that position is drawn, and it is what the depositor gets back
/// if they exit un-drawn. A buyer pays one acquisition price and receives one
/// randomly selected position.
///
/// This is deliberately NOT the Fake World Assets construction. Two holes are
/// closed here.
///
/// HOLE 1 -- backing-proportional selection inverts the gacha. If P(draw i)
/// rises with B_i then the most valuable position is the most likely pull,
/// which is economically incoherent. This vault selects with probability
/// proportional to the RECIPROCAL of backing:
///
///     w_i   = (1 / B_i) / sum_j (1 / B_j)
///     E[B]  = n / sum_j (1 / B_j)                       (the harmonic mean)
///
/// Scarcity and value now agree: a heavily backed legendary is the rarest pull
/// and also the largest payout.
///
/// HOLE 2 -- a price that does not track expected value is a free option. Every
/// draw here is priced at exactly the expected payout plus a bounded fee,
/// maintained in O(1) from the Fenwick total, so the vault cannot be timed or
/// arbitraged by composition. See "PRECISION AND ROUNDING" below for the proof
/// that the rounding direction always favours the protocol.
///
/// Conservation is exact and unconditional: the ETH a buyer pays is split into
/// (seller proceeds, protocol fee, LP fee) and the backing behind a position
/// never moves when the position changes hands. The vault can therefore never
/// become insolvent under any vault composition or draw sequence.
///
/// ---------------------------------------------------------------------------
/// PRECISION AND ROUNDING (this is the load-bearing analysis; read it)
/// ---------------------------------------------------------------------------
///
/// Integer weights. For a position with backing B_i wei we store
///
///     W_i = floor(WEIGHT_NUM / B_i),      WEIGHT_NUM = 2**192
///
/// Backing is clamped to [MIN_BACKING, MAX_BACKING] = [1e16, 1e21] wei, so
///
///     W_min = floor(2**192 / 1e21) ~= 6.3e36 ~= 2**122
///     W_max = floor(2**192 / 1e16) ~= 6.3e41 ~= 2**139
///
/// Two consequences. First, every active position has W_i >= 2**122 >= 1, so
/// there is no dust position that can never be drawn -- the smallest legal
/// weight is astronomically far from zero. Second, the truncation in floor()
/// costs at most 1 part in 2**122 of relative weight, which is far below any
/// economically meaningful resolution.
///
/// Overflow. MAX_POSITIONS = 4096 = 2**12, so the Fenwick total obeys
/// SW <= 4096 * 2**139 = 2**151, and the pricing numerator obeys
/// n * WEIGHT_NUM <= 2**12 * 2**192 = 2**204. Both are comfortably inside
/// uint256 (2**256). No intermediate in this contract exceeds 2**204.
///
/// Pricing, and why it always favours the protocol. The selection distribution
/// actually implemented is P(i) = W_i / SW where SW = sum_j W_j, so the exact
/// expected payout is
///
///     E = (sum_i W_i * B_i) / SW
///
/// Because W_i = floor(WEIGHT_NUM / B_i) we have W_i * B_i <= WEIGHT_NUM for
/// every i, hence sum_i W_i * B_i <= n * WEIGHT_NUM, hence
///
///     E <= (n * WEIGHT_NUM) / SW <= ceilDiv(n * WEIGHT_NUM, SW) = basePrice
///
/// So basePrice >= E holds as an inequality over the integers, with no
/// floating point and no statistical argument, for EVERY vault composition.
/// The fee is then added with ceilDiv as well, so
///
///     price = basePrice + ceilDiv(basePrice * feeBps, BPS) >= E
///
/// and the protocol's expected margin per draw is at least the fee. A buyer
/// can never construct a vault or pick a moment at which price < E.
///
/// Tightness. The slack introduced by the two floors is
/// sum_i (WEIGHT_NUM mod B_i) / SW < n * B_max / SW <= B_max^2 / WEIGHT_NUM
/// = (1e21)^2 / 2**192 ~= 1.6e-16 wei. The slack is sub-wei, so the ceilDiv
/// dominates it: the price is within 1 wei of the true expected value and the
/// house edge is the fee and nothing else.
///
/// Modulo bias. The draw word is a full 256-bit keccak output reduced mod SW
/// with SW <= 2**151, so the selection bias is bounded by 2**151 / 2**256 =
/// 2**-105. That is not a meaningful deviation from uniform.
///
/// ---------------------------------------------------------------------------
/// SEALED TWO-PHASE RANDOMNESS
/// ---------------------------------------------------------------------------
///
/// Payment and resolution are never in the same transaction. A buyer commits
/// keccak256(secret, buyer, nonce) with payment at block C. The outcome is
/// pinned to the beacon block BB = C + RESOLVE_DELAY and derived from
///
///     word = keccak256(secret, blockhash(BB), commitId, buyer, this, chainid)
///
/// Note the beacon is `blockhash(BB)` for a FIXED block BB, not
/// `block.prevrandao` sampled at whatever block the resolve transaction happens
/// to land in. That is a deliberate hardening. On a post-merge chain the header
/// of block BB contains that block's prevRandao, so blockhash(BB) is a binding
/// commitment to the beacon randomness of BB; but unlike reading prevrandao at
/// resolve time it gives the buyer no ability to choose which block supplies
/// the entropy. A buyer who could pick the sampling block would get a free
/// re-roll per block for as long as the reveal window lasts.
///
/// At block BB the secret is still sealed, so the proposer of BB cannot see the
/// outcome. By the time the secret is revealed, BB is already final. Neither
/// party can steer the draw alone.
///
/// Residual assumption, stated honestly: a buyer who is also the proposer of
/// block BB knows the secret and can compute their own candidate block hash
/// before publishing. They may withhold the block, in which case block BB is
/// produced by a different proposer and the outcome changes. That is exactly
/// ONE re-roll, the replacement is unpredictable to them, and it costs a full
/// block reward plus MEV. Note this is why only a SINGLE beacon block is mixed
/// in: every additional beacon block would be another slot an adversary might
/// control, i.e. another independent withhold-or-publish lever, so more beacon
/// blocks make grinding easier rather than harder. Removing this residual
/// entirely requires an external VRF or a threshold beacon; see SEALED_VAULT.md.
///
/// ---------------------------------------------------------------------------
/// NO PROFITABLE ABORT
/// ---------------------------------------------------------------------------
///
/// Once blockhash(BB) is public a buyer can compute their own outcome and may
/// be tempted to withhold the reveal. Forcing a draw with a secret-free word
/// would not fix this: it would simply give the buyer a menu of two computable
/// outcomes to choose between, at the price of the bond.
///
/// Instead, after REVEAL_WINDOW blocks anyone may `voidCommit`. Voiding does
/// NOT draw. The buyer's entire payment is forfeited to the fee pools, the
/// caller takes the bond as the forcing incentive, and the vault epoch is
/// released. Every possible revealed outcome delivers a position worth at least
/// MIN_BACKING plus the refunded bond, while aborting delivers zero. Revealing
/// therefore STRICTLY dominates aborting for every buyer, every vault and every
/// outcome, with no parameter tuning required.
///
/// Because voiding consumes no randomness it also removes the 256-block
/// blockhash expiry edge case completely: there is no reachable state in which
/// a commit can neither be resolved nor voided. Reveal additionally requires
/// blockhash(BB) != 0 and REVEAL_WINDOW is set well inside the 256-block
/// window, so a resolve can never read a zeroed (and therefore predictable)
/// beacon.
///
/// ---------------------------------------------------------------------------
/// EPOCH SNAPSHOT ISOLATION
/// ---------------------------------------------------------------------------
///
/// Deposits and exits never mutate the live tree directly. They append to a
/// bounded queue and are applied only by `flushEpoch`, which requires
/// liveCommits == 0. Therefore the weight vector a buyer commits against is
/// bit-for-bit the weight vector their draw resolves against, and a depositor
/// physically cannot withdraw backing out from under a pending draw or exit to
/// dodge one: their exit cannot apply until every in-flight commit has settled.
/// Re-entry is queued as well, so exit-then-reenter costs at least a full epoch
/// and dodges nothing.
///
/// Depositor liveness is bounded in the other direction too: if the queue has
/// been waiting longer than QUEUE_SEAL_DELAY blocks the vault stops accepting
/// NEW commits, so the in-flight set drains and the queue flushes.
contract SealedVault is Ownable2Step, ReentrancyGuard, IERC721Receiver {
    // ------------------------------------------------------------------
    // Constants. Everything here is compile-time immutable by construction;
    // no admin action can change any of them.
    // ------------------------------------------------------------------

    uint256 public constant BPS = 10_000;

    /// Hard ceiling on the protocol fee. Immutable, un-raisable, no exceptions.
    uint256 public constant MAX_FEE_BPS = 500; // 5.00%

    /// Fixed-point numerator for reciprocal weights. See PRECISION above.
    uint256 public constant WEIGHT_NUM = 1 << 192;

    uint256 public constant MIN_BACKING = 0.01 ether;
    uint256 public constant MAX_BACKING = 1000 ether;

    /// Power of two: required by the Fenwick binary-lifting search.
    uint256 public constant MAX_POSITIONS = 4096;
    uint256 public constant MAX_POSITIONS_PER_DEPOSITOR = 64;

    /// Blocks from commit to the pinned beacon block, and thus to the earliest
    /// legal resolve.
    uint256 public constant RESOLVE_DELAY = 2;

    /// Blocks after commit within which the buyer must reveal. Kept well inside
    /// the 256-block blockhash horizon measured from the beacon block.
    uint256 public constant REVEAL_WINDOW = 200;

    /// Buyer bond, refunded on an honest reveal, paid to the forcer on a void.
    uint256 public constant BOND = 0.002 ether;

    /// Bounded mutation queue. Small enough that a full flush is a bounded,
    /// single-transaction operation.
    uint256 public constant MAX_QUEUE = 32;

    /// After this many blocks with a non-empty queue the vault stops accepting
    /// new commits so that depositors are guaranteed to get in and out.
    uint256 public constant QUEUE_SEAL_DELAY = 300;

    /// Timelock on the only two mutable parameters.
    uint256 public constant PARAM_TIMELOCK = 2 days;

    uint256 private constant RAY = 1e27;

    // ------------------------------------------------------------------
    // Immutables
    // ------------------------------------------------------------------

    /// The one and only collection this vault will custody. Restricting to a
    /// single trusted, non-reentrant ERC-721 removes the malicious-token class
    /// of attacks entirely (fake transfers, reentrant hooks, fee-on-transfer
    /// analogues, ownerOf lying).
    PacketMonsters public immutable cards;

    /// ERC-8004 reputation sink. Draw demand is posted here as agent feedback,
    /// mirroring how PacketMonsters posts battle wins.
    ReputationRegistry public immutable reputationRegistry;

    // ------------------------------------------------------------------
    // Types
    // ------------------------------------------------------------------

    struct Position {
        address owner; //  160
        uint96 backing; //  96  -> one slot (MAX_BACKING = 1e21 < 2**96)
        uint256 tokenId;
        uint256 feeDebt; // LP fee accumulator checkpoint
        bool active;
        bool exitQueued;
    }

    struct Commit {
        address buyer; // 160
        uint64 commitBlock; // 64
        bool settled; // 8   -> one slot
        uint128 pricePaid; // seller proceeds + fee
        uint128 feeAmount;
        uint32 epoch;
        bytes32 commitHash;
    }

    enum OpKind {
        Deposit,
        Exit
    }

    struct QueuedOp {
        OpKind kind;
        address account;
        uint96 backing;
        uint256 tokenId; // deposit only
        uint256 slotId; // exit only
    }

    // ------------------------------------------------------------------
    // Storage
    // ------------------------------------------------------------------

    /// Fenwick tree of integer weights, 1-based, index == slotId.
    uint256[MAX_POSITIONS + 1] private _tree;
    /// Cached tree total so pricing is O(1).
    uint256 public totalWeight;

    mapping(uint256 => Position) public positions; // slotId => position
    uint256 public activeCount;
    uint256 private _nextSlot = 1;
    uint256[] private _freeSlots;
    /// Slots promised to queued deposits but not yet allocated.
    uint256 public reservedSlots;

    mapping(address => uint256) public positionCount; // includes queued deposits
    /// tokenId => address entitled to pull the NFT out after an exit settled.
    mapping(uint256 => address) public nftClaimant;

    QueuedOp[] private _queue;
    uint256 public queueOpenedAtBlock;

    uint32 public epoch = 1;
    uint256 public liveCommits;

    mapping(uint256 => Commit) public commits;
    uint256 public nextCommitId = 1;
    mapping(address => uint256) public commitNonce;

    /// Pull-payment ledger. ETH is never pushed to an arbitrary address.
    mapping(address => uint256) public credits;
    uint256 public totalCredits;

    uint256 public totalBacking;
    /// ETH sent with deposits that are still queued. Held by the contract but
    /// not yet earning LP fees and not yet part of `totalBacking`; tracked
    /// separately so the conservation invariant stays exact across the queue.
    uint256 public queuedBacking;
    uint256 public escrowedCommits; // price + bond held for unsettled commits
    uint256 public protocolFees;
    uint256 public lpFeeOutstanding;
    uint256 public accFeePerBacking; // RAY-scaled, per wei of backing

    uint16 public feeBps = 250; // 2.50%
    uint16 public lpFeeShareBps = 5_000; // half of the fee is paid to depositors

    uint16 public pendingFeeBps;
    uint16 public pendingLpFeeShareBps;
    uint64 public paramEta;

    /// Blocks new deposits and new commits only. Exits, flushes, resolves,
    /// voids, claims and withdrawals are never pausable, so a hostile admin
    /// cannot trap a single wei or a single card.
    bool public paused;

    // ------------------------------------------------------------------
    // Events
    // ------------------------------------------------------------------

    event Deposited(address indexed depositor, uint256 indexed tokenId, uint256 backing, uint256 queueIndex);
    event ExitRequested(address indexed owner, uint256 indexed slotId);
    event PositionOpened(uint256 indexed slotId, address indexed owner, uint256 indexed tokenId, uint256 backing);
    event PositionClosed(uint256 indexed slotId, address indexed owner, uint256 indexed tokenId, uint256 backing);
    event EpochAdvanced(uint32 indexed newEpoch, uint256 opsApplied);
    event DrawCommitted(
        uint256 indexed commitId, address indexed buyer, uint32 indexed epochId, uint256 price, uint256 fee
    );
    event DrawResolved(
        uint256 indexed commitId,
        address indexed buyer,
        uint256 indexed slotId,
        uint256 tokenId,
        uint256 backing,
        address seller
    );
    event DrawVoided(uint256 indexed commitId, address indexed buyer, address indexed forcer, uint256 forfeited);
    event NftClaimed(address indexed to, uint256 indexed tokenId);
    event Withdrawn(address indexed to, uint256 amount);
    event ParamsProposed(uint16 feeBps, uint16 lpFeeShareBps, uint64 eta);
    event ParamsExecuted(uint16 feeBps, uint16 lpFeeShareBps);
    event ParamsCancelled();
    event PausedSet(bool paused);
    event ProtocolFeesCollected(address indexed to, uint256 amount);

    // ------------------------------------------------------------------
    // Errors
    // ------------------------------------------------------------------

    error Paused();
    error BadBacking();
    error QueueFull();
    error VaultFull();
    error VaultEmpty();
    error VaultSealed();
    error PositionCapReached();
    error NotPositionOwner();
    error PositionInactive();
    error ExitAlreadyQueued();
    error CommitsOutstanding();
    error QueueEmpty();
    error WrongPayment();
    error PriceTooHigh();
    error BadNonce();
    error TooEarly();
    error TooLate();
    error AlreadySettled();
    error BadSecret();
    error BeaconUnavailable();
    error NothingToClaim();
    error NothingToWithdraw();
    error TransferFailed();
    error FeeTooHigh();
    error NoPendingParams();
    error TimelockPending();
    error DirectTransferNotAllowed();
    error EpochMismatch();
    error ZeroRecipient();

    constructor(address owner_, PacketMonsters cards_, ReputationRegistry reputationRegistry_) Ownable(owner_) {
        require(address(cards_) != address(0), "zero cards");
        cards = cards_;
        reputationRegistry = reputationRegistry_;
    }

    // ==================================================================
    // Pricing. O(1), exact, and provably never below expected value.
    // ==================================================================

    /// Expected payout of one draw, in wei. This is the harmonic mean of the
    /// active backings, evaluated over the exact integer weights the selector
    /// actually uses. Rounded DOWN, so quoting it can never overstate value.
    function expectedPayout() public view returns (uint256) {
        uint256 sw = totalWeight;
        if (sw == 0) return 0;
        return (activeCount * WEIGHT_NUM) / sw;
    }

    /// Acquisition price split into seller proceeds and protocol fee.
    /// base >= expectedPayout by construction (see PRECISION above); both legs
    /// round up, so every rounding error in the system accrues to the vault.
    function quote() public view returns (uint256 base, uint256 fee, uint256 total) {
        uint256 sw = totalWeight;
        if (sw == 0 || activeCount == 0) return (0, 0, 0);
        base = _ceilDiv(activeCount * WEIGHT_NUM, sw);
        fee = _ceilDiv(base * feeBps, BPS);
        total = base + fee;
    }

    /// Total ETH a buyer must send to commit a draw.
    function acquisitionPrice() external view returns (uint256) {
        (,, uint256 total) = quote();
        return total == 0 ? 0 : total + BOND;
    }

    /// Integer weight of a backing amount. Public so clients can reproduce the
    /// published odds exactly rather than trusting a table.
    function weightOf(uint256 backing) public pure returns (uint256) {
        if (backing == 0) return 0;
        return WEIGHT_NUM / backing;
    }

    /// Draw probability of a slot as a RAY-scaled fraction (1e27 == certainty).
    function drawProbabilityRay(uint256 slotId) external view returns (uint256) {
        uint256 sw = totalWeight;
        if (sw == 0) return 0;
        Position storage p = positions[slotId];
        if (!p.active) return 0;
        return (weightOf(p.backing) * RAY) / sw;
    }

    // ==================================================================
    // Deposits and exits. Both are queued; neither touches the live tree.
    // ==================================================================

    /// Escrow a card plus `msg.value` of backing. Applies at the next epoch.
    function deposit(uint256 tokenId) external payable nonReentrant {
        if (paused) revert Paused();
        uint256 backing = msg.value;
        if (backing < MIN_BACKING || backing > MAX_BACKING) revert BadBacking();
        if (_queue.length >= MAX_QUEUE) revert QueueFull();
        if (activeCount + reservedSlots >= MAX_POSITIONS) revert VaultFull();
        if (positionCount[msg.sender] >= MAX_POSITIONS_PER_DEPOSITOR) revert PositionCapReached();

        // Effects first.
        positionCount[msg.sender] += 1;
        reservedSlots += 1;
        queuedBacking += backing;
        _openQueue();
        uint256 idx = _queue.length;
        _queue.push(
            QueuedOp({
                kind: OpKind.Deposit,
                account: msg.sender,
                backing: uint96(backing),
                tokenId: tokenId,
                slotId: 0
            })
        );

        // Interaction last. `transferFrom` (not safeTransferFrom) is used on the
        // way IN: this contract is the recipient, so there is no receiver hook
        // to reenter through, and `cards` is a fixed, known-good collection.
        cards.transferFrom(msg.sender, address(this), tokenId);
        if (cards.ownerOf(tokenId) != address(this)) revert TransferFailed();

        emit Deposited(msg.sender, tokenId, backing, idx);
    }

    /// Ask to close a position. Applies at the next epoch, which cannot occur
    /// while any draw is in flight -- this is what makes exit-griefing and
    /// exit-to-dodge impossible.
    function requestExit(uint256 slotId) external nonReentrant {
        Position storage p = positions[slotId];
        if (!p.active) revert PositionInactive();
        if (p.owner != msg.sender) revert NotPositionOwner();
        if (p.exitQueued) revert ExitAlreadyQueued();
        if (_queue.length >= MAX_QUEUE) revert QueueFull();

        p.exitQueued = true;
        _openQueue();
        _queue.push(QueuedOp({kind: OpKind.Exit, account: msg.sender, backing: 0, tokenId: 0, slotId: slotId}));

        emit ExitRequested(msg.sender, slotId);
    }

    /// Apply the whole queue and advance the epoch. Permissionless, atomic and
    /// gas-bounded (MAX_QUEUE ops, each O(log MAX_POSITIONS)). Requires that no
    /// draw is in flight, which is precisely the snapshot-isolation guarantee.
    function flushEpoch() external nonReentrant {
        if (liveCommits != 0) revert CommitsOutstanding();
        uint256 n = _queue.length;
        if (n == 0) revert QueueEmpty();

        for (uint256 i = 0; i < n; i++) {
            QueuedOp memory op = _queue[i];
            if (op.kind == OpKind.Deposit) {
                _applyDeposit(op);
            } else {
                _applyExit(op);
            }
        }

        delete _queue;
        queueOpenedAtBlock = 0;
        epoch += 1;
        emit EpochAdvanced(epoch, n);
    }

    function _applyDeposit(QueuedOp memory op) private {
        uint256 slotId = _allocateSlot();
        reservedSlots -= 1;

        uint256 backing = op.backing;
        positions[slotId] = Position({
            owner: op.account,
            backing: uint96(backing),
            tokenId: op.tokenId,
            feeDebt: (backing * accFeePerBacking) / RAY,
            active: true,
            exitQueued: false
        });

        _treeAdd(slotId, weightOf(backing));
        activeCount += 1;
        totalBacking += backing;
        queuedBacking -= backing;

        emit PositionOpened(slotId, op.account, op.tokenId, backing);
    }

    function _applyExit(QueuedOp memory op) private {
        Position storage p = positions[op.slotId];
        // The position may have changed hands (drawn) or already closed between
        // the request and the flush. Silently skip rather than revert, so one
        // stale op can never brick the queue for everybody else.
        if (!p.active || p.owner != op.account) {
            p.exitQueued = false;
            return;
        }

        uint256 backing = p.backing;
        uint256 tokenId = p.tokenId;
        address owner_ = p.owner;

        _harvest(p);
        _treeSub(op.slotId, weightOf(backing));
        activeCount -= 1;
        totalBacking -= backing;
        positionCount[owner_] -= 1;

        _credit(owner_, backing);
        nftClaimant[tokenId] = owner_;

        p.active = false;
        p.exitQueued = false;
        p.owner = address(0);
        p.backing = 0;
        p.tokenId = 0;
        p.feeDebt = 0;
        _freeSlots.push(op.slotId);

        emit PositionClosed(op.slotId, owner_, tokenId, backing);
    }

    /// Pull the card out after an exit has settled. Pull, never push: an exit
    /// must never invoke an arbitrary receiver hook inside `flushEpoch`, or a
    /// malicious depositor could revert and brick the queue for everyone.
    /// `to` is chosen by the claimant so that a contract owner which cannot
    /// implement `onERC721Received` is never permanently locked out of its card.
    function claimNft(uint256 tokenId, address to) external nonReentrant {
        if (nftClaimant[tokenId] != msg.sender || msg.sender == address(0)) revert NothingToClaim();
        if (to == address(0)) revert ZeroRecipient();
        delete nftClaimant[tokenId];
        emit NftClaimed(to, tokenId);
        cards.safeTransferFrom(address(this), to, tokenId);
    }

    // ==================================================================
    // Sealed two-phase draw
    // ==================================================================

    function computeCommitHash(bytes32 secret, address buyer, uint256 nonce) public pure returns (bytes32) {
        return keccak256(abi.encode(secret, buyer, nonce));
    }

    /// Phase 1. Pay, and seal the outcome. `maxTotal` is slippage protection:
    /// a flush between simulation and inclusion can move the price.
    function commitDraw(bytes32 commitHash, uint256 nonce, uint256 maxTotal)
        external
        payable
        nonReentrant
        returns (uint256 commitId)
    {
        if (paused) revert Paused();
        if (queueOpenedAtBlock != 0 && block.number >= queueOpenedAtBlock + QUEUE_SEAL_DELAY) revert VaultSealed();
        if (activeCount == 0 || totalWeight == 0) revert VaultEmpty();
        if (nonce != commitNonce[msg.sender]) revert BadNonce();

        (uint256 base, uint256 fee, uint256 total) = quote();
        if (total > maxTotal) revert PriceTooHigh();
        uint256 required = total + BOND;
        if (msg.value < required) revert WrongPayment();

        commitNonce[msg.sender] = nonce + 1;
        commitId = nextCommitId++;
        commits[commitId] = Commit({
            buyer: msg.sender,
            commitBlock: uint64(block.number),
            settled: false,
            pricePaid: uint128(total),
            feeAmount: uint128(fee),
            epoch: epoch,
            commitHash: commitHash
        });
        liveCommits += 1;
        escrowedCommits += required;

        // Overpayment is credited, never pushed back.
        if (msg.value > required) _credit(msg.sender, msg.value - required);

        emit DrawCommitted(commitId, msg.sender, epoch, base, fee);
    }

    /// Phase 2. Reveal and draw. Callable by anyone holding the secret (a
    /// relayer, say); the position always goes to the recorded buyer.
    function resolve(uint256 commitId, bytes32 secret, uint256 nonce) external nonReentrant {
        Commit storage c = commits[commitId];
        address buyer = c.buyer;
        if (buyer == address(0)) revert AlreadySettled();
        if (c.settled) revert AlreadySettled();

        uint256 beaconBlock = uint256(c.commitBlock) + RESOLVE_DELAY;
        // Strictly greater: blockhash(block.number) is defined to be zero, so a
        // resolve landing exactly on the beacon block would read no entropy.
        if (block.number <= beaconBlock) revert TooEarly();
        if (block.number > uint256(c.commitBlock) + REVEAL_WINDOW) revert TooLate();
        if (computeCommitHash(secret, buyer, nonce) != c.commitHash) revert BadSecret();
        // Snapshot isolation, asserted rather than merely argued: `flushEpoch`
        // requires liveCommits == 0 and this commit holds that count above zero,
        // so the epoch cannot have moved. Checked anyway.
        if (c.epoch != epoch) revert EpochMismatch();

        bytes32 beacon = blockhash(beaconBlock);
        // Unreachable while REVEAL_WINDOW (200) < 256, but a zero beacon would
        // be publicly predictable at commit time, so refuse it explicitly.
        if (beacon == bytes32(0)) revert BeaconUnavailable();

        uint256 price = c.pricePaid;
        uint256 fee = c.feeAmount;

        // -------- effects --------
        c.settled = true;
        liveCommits -= 1;
        escrowedCommits -= (price + BOND);

        uint256 word = uint256(keccak256(abi.encode(secret, beacon, commitId, buyer, address(this), block.chainid)));
        uint256 slotId = _select(word);

        Position storage p = positions[slotId];
        address seller = p.owner;

        // Settle the seller's accrued LP fees before the position changes hands,
        // then re-checkpoint for the new owner.
        _harvest(p);
        p.owner = buyer;
        p.feeDebt = (uint256(p.backing) * accFeePerBacking) / RAY;
        // Keep the per-depositor tally exact across a change of hands. The cap
        // is deliberately NOT enforced here: a buyer at their position limit
        // must still be able to receive a draw they already paid for, otherwise
        // the cap becomes a way to brick a resolve.
        positionCount[seller] -= 1;
        positionCount[buyer] += 1;

        // Conservation: price == base + fee. base to the seller, fee split
        // between depositors and the protocol, bond back to the buyer. The
        // backing itself does not move; the buyer simply now owns the position.
        _credit(seller, price - fee);
        _credit(buyer, BOND);
        _splitFee(fee);

        emit DrawResolved(commitId, buyer, slotId, p.tokenId, p.backing, seller);

        // -------- interaction (isolated, cannot revert the draw) --------
        _postDrawFeedback(p.tokenId);
    }

    /// Force-settle an unrevealed commit. No draw occurs. The payment is
    /// forfeited to the fee pools and the bond pays the caller. See the
    /// "NO PROFITABLE ABORT" note: this makes revealing strictly dominant.
    function voidCommit(uint256 commitId) external nonReentrant {
        Commit storage c = commits[commitId];
        address buyer = c.buyer;
        if (buyer == address(0) || c.settled) revert AlreadySettled();
        if (block.number <= uint256(c.commitBlock) + REVEAL_WINDOW) revert TooEarly();

        uint256 price = c.pricePaid;

        c.settled = true;
        liveCommits -= 1;
        escrowedCommits -= (price + BOND);

        _credit(msg.sender, BOND);
        _splitFee(price);

        emit DrawVoided(commitId, buyer, msg.sender, price);
    }

    // ==================================================================
    // Selection: Fenwick over exact integer weights
    // ==================================================================

    /// Uniformly select a slot with probability W_i / totalWeight.
    function _select(uint256 word) private view returns (uint256) {
        uint256 sw = totalWeight;
        if (sw == 0) revert VaultEmpty();
        uint256 target = word % sw;

        // Binary lifting: find the largest `pos` whose prefix sum is <= target.
        // The owning slot is pos + 1. Slots with zero weight are impossible to
        // land on, because prefix(pos+1) == prefix(pos) <= target would have
        // advanced the walk past them. There is therefore no unreachable dust
        // slot and no bias toward low indices: the mapping from the uniform
        // integer range [0, sw) to slots is an exact partition.
        uint256 pos = 0;
        uint256 rem = target;
        for (uint256 bit = MAX_POSITIONS; bit > 0; bit >>= 1) {
            uint256 next = pos + bit;
            if (next <= MAX_POSITIONS) {
                uint256 node = _tree[next];
                if (node <= rem) {
                    pos = next;
                    rem -= node;
                }
            }
        }
        return pos + 1;
    }

    function _treeAdd(uint256 i, uint256 delta) private {
        for (uint256 x = i; x <= MAX_POSITIONS; x += x & (~x + 1)) {
            _tree[x] += delta;
        }
        totalWeight += delta;
    }

    function _treeSub(uint256 i, uint256 delta) private {
        for (uint256 x = i; x <= MAX_POSITIONS; x += x & (~x + 1)) {
            _tree[x] -= delta;
        }
        totalWeight -= delta;
    }

    /// Prefix sum, exposed for tests and for clients verifying published odds.
    function prefixWeight(uint256 count) public view returns (uint256 sum) {
        for (uint256 x = count; x > 0; x -= x & (~x + 1)) {
            sum += _tree[x];
        }
    }

    // ==================================================================
    // Fees, credits, withdrawals
    // ==================================================================

    function _splitFee(uint256 amount) private {
        if (amount == 0) return;
        uint256 toLp = (amount * lpFeeShareBps) / BPS;
        uint256 tb = totalBacking;
        if (toLp == 0 || tb == 0) {
            protocolFees += amount;
            return;
        }
        uint256 delta = (toLp * RAY) / tb; // rounds down
        uint256 allocated = (delta * tb) / RAY; // <= toLp, exact
        accFeePerBacking += delta;
        lpFeeOutstanding += allocated;
        protocolFees += amount - allocated; // remainder and dust to the protocol
    }

    /// Move a position's accrued LP fee into its owner's credit balance.
    function _harvest(Position storage p) private {
        uint256 entitled = (uint256(p.backing) * accFeePerBacking) / RAY;
        uint256 debt = p.feeDebt;
        if (entitled <= debt) return;
        uint256 earned = entitled - debt;
        // Sum-of-floors can exceed the floor-of-sum by at most one wei per
        // harvest. Clamping keeps lpFeeOutstanding non-negative unconditionally.
        if (earned > lpFeeOutstanding) earned = lpFeeOutstanding;
        p.feeDebt = entitled;
        lpFeeOutstanding -= earned;
        _credit(p.owner, earned);
    }

    /// Realise a position's accrued fees without closing it.
    function harvest(uint256 slotId) external nonReentrant {
        Position storage p = positions[slotId];
        if (!p.active) revert PositionInactive();
        _harvest(p);
    }

    function _credit(address to, uint256 amount) private {
        if (amount == 0) return;
        credits[to] += amount;
        totalCredits += amount;
    }

    /// Pull payment. ETH is never pushed from any other path in this contract.
    function withdraw() external nonReentrant {
        uint256 amount = credits[msg.sender];
        if (amount == 0) revert NothingToWithdraw();
        credits[msg.sender] = 0;
        totalCredits -= amount;
        emit Withdrawn(msg.sender, amount);
        (bool ok,) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    /// Everything the contract owes. Never reads address(this).balance, so a
    /// forced ETH donation (selfdestruct) cannot perturb any accounting.
    function totalLiabilities() public view returns (uint256) {
        return totalBacking + queuedBacking + totalCredits + escrowedCommits + protocolFees + lpFeeOutstanding;
    }

    // ==================================================================
    // ERC-8004
    // ==================================================================

    /// Post draw demand for the drawn card's endpoint agent, mirroring the
    /// PacketMonsters battle-feedback convention. Wrapped so that a registry
    /// failure can never brick a draw or strand a buyer's payment.
    function _postDrawFeedback(uint256 tokenId) private {
        if (address(reputationRegistry) == address(0)) return;
        try cards.cardOf(tokenId) returns (CardDef memory d, Card memory) {
            uint256 agentId = cards.hostAgent(keccak256(bytes(d.host)));
            if (agentId == 0) return;
            try reputationRegistry.giveFeedback(
                agentId, 100, 0, "packet-monsters-vault", "draw", d.host, "", bytes32(0)
            ) {} catch {}
        } catch {}
    }

    // ==================================================================
    // Admin. Deliberately tiny. Nothing here can move a card, a backing, a
    // credit or an escrow: the only ETH an owner can ever touch is
    // `protocolFees`, which is a disjoint accumulator.
    // ==================================================================

    function proposeParams(uint16 feeBps_, uint16 lpFeeShareBps_) external onlyOwner {
        if (feeBps_ > MAX_FEE_BPS) revert FeeTooHigh();
        if (lpFeeShareBps_ > BPS) revert FeeTooHigh();
        pendingFeeBps = feeBps_;
        pendingLpFeeShareBps = lpFeeShareBps_;
        paramEta = uint64(block.timestamp + PARAM_TIMELOCK);
        emit ParamsProposed(feeBps_, lpFeeShareBps_, paramEta);
    }

    function cancelParams() external onlyOwner {
        paramEta = 0;
        emit ParamsCancelled();
    }

    function executeParams() external {
        uint64 eta = paramEta;
        if (eta == 0) revert NoPendingParams();
        if (block.timestamp < eta) revert TimelockPending();
        // Re-check against the immutable ceiling at execution time as well.
        if (pendingFeeBps > MAX_FEE_BPS) revert FeeTooHigh();
        feeBps = pendingFeeBps;
        lpFeeShareBps = pendingLpFeeShareBps;
        paramEta = 0;
        emit ParamsExecuted(feeBps, lpFeeShareBps);
    }

    function setPaused(bool paused_) external onlyOwner {
        paused = paused_;
        emit PausedSet(paused_);
    }

    function collectProtocolFees(address to) external onlyOwner nonReentrant {
        uint256 amount = protocolFees;
        if (amount == 0) revert NothingToWithdraw();
        if (to == address(0)) revert TransferFailed();
        protocolFees = 0;
        emit ProtocolFeesCollected(to, amount);
        (bool ok,) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    // ==================================================================
    // Views
    // ==================================================================

    function queueLength() external view returns (uint256) {
        return _queue.length;
    }

    function queuedOp(uint256 i) external view returns (QueuedOp memory) {
        return _queue[i];
    }

    /// True when the vault has stopped accepting new commits so that a stale
    /// mutation queue can drain.
    function sealedForCommits() public view returns (bool) {
        return queueOpenedAtBlock != 0 && block.number >= queueOpenedAtBlock + QUEUE_SEAL_DELAY;
    }

    function freeSlotCount() external view returns (uint256) {
        return _freeSlots.length;
    }

    // ==================================================================
    // Internals
    // ==================================================================

    function _openQueue() private {
        if (_queue.length == 0) queueOpenedAtBlock = block.number;
    }

    function _allocateSlot() private returns (uint256 slotId) {
        uint256 freeLen = _freeSlots.length;
        if (freeLen > 0) {
            slotId = _freeSlots[freeLen - 1];
            _freeSlots.pop();
            return slotId;
        }
        slotId = _nextSlot;
        if (slotId > MAX_POSITIONS) revert VaultFull();
        _nextSlot = slotId + 1;
    }

    function _ceilDiv(uint256 a, uint256 b) private pure returns (uint256) {
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /// Reject pushed ERC-721s outright. Cards may only enter through
    /// `deposit`, which pairs them with backing; a bare `safeTransferFrom` into
    /// this contract would otherwise strand the token forever. Reverting here
    /// also means no untrusted code path can ever call back into the vault
    /// through the receiver hook.
    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        revert DirectTransferNotAllowed();
    }
}

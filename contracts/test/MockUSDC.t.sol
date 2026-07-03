// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC usdc;

    uint256 payerKey = 0xA11CE;
    address payer;
    address payee = makeAddr("payee");

    function setUp() public {
        usdc = new MockUSDC();
        payer = vm.addr(payerKey);
    }

    function test_Decimals() public view {
        assertEq(usdc.decimals(), 6);
    }

    function test_OpenMint() public {
        usdc.mint(payer, 50_000_000);
        assertEq(usdc.balanceOf(payer), 50_000_000);
    }

    function _sign(bytes32 structHash) internal view returns (uint8 v, bytes32 r, bytes32 s) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdc.DOMAIN_SEPARATOR(), structHash));
        (v, r, s) = vm.sign(payerKey, digest);
    }

    function test_TransferWithAuthorization() public {
        usdc.mint(payer, 100_000_000);
        uint256 value = 50_000; // $0.05
        bytes32 nonce = keccak256("pack-purchase-1");
        bytes32 structHash = keccak256(
            abi.encode(
                usdc.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, value, 0, block.timestamp + 1 hours, nonce
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = _sign(structHash);

        usdc.transferWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);

        assertEq(usdc.balanceOf(payee), value);
        assertEq(usdc.balanceOf(payer), 100_000_000 - value);
        assertTrue(usdc.authorizationState(payer, nonce));
    }

    function test_RevertWhen_AuthorizationReplayed() public {
        usdc.mint(payer, 100_000_000);
        uint256 value = 50_000;
        bytes32 nonce = keccak256("nonce-1");
        bytes32 structHash = keccak256(
            abi.encode(
                usdc.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, value, 0, block.timestamp + 1 hours, nonce
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = _sign(structHash);
        usdc.transferWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);

        vm.expectRevert(MockUSDC.AuthorizationUsedOrCanceled.selector);
        usdc.transferWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);
    }

    function test_RevertWhen_AuthorizationExpired() public {
        usdc.mint(payer, 100_000_000);
        uint256 value = 50_000;
        bytes32 nonce = keccak256("nonce-2");
        uint256 validBefore = block.timestamp + 1;
        bytes32 structHash = keccak256(
            abi.encode(usdc.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, value, 0, validBefore, nonce)
        );
        (uint8 v, bytes32 r, bytes32 s) = _sign(structHash);

        vm.warp(block.timestamp + 10);
        vm.expectRevert(MockUSDC.AuthorizationExpired.selector);
        usdc.transferWithAuthorization(payer, payee, value, 0, validBefore, nonce, v, r, s);
    }

    function test_RevertWhen_WrongSigner() public {
        usdc.mint(payer, 100_000_000);
        uint256 value = 50_000;
        bytes32 nonce = keccak256("nonce-3");
        bytes32 structHash = keccak256(
            abi.encode(
                usdc.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, value, 0, block.timestamp + 1 hours, nonce
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdc.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(0xBEEF, digest); // wrong key

        vm.expectRevert(MockUSDC.InvalidSignature.selector);
        usdc.transferWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);
    }

    function test_ReceiveWithAuthorizationRequiresPayeeCaller() public {
        usdc.mint(payer, 100_000_000);
        uint256 value = 50_000;
        bytes32 nonce = keccak256("nonce-4");
        bytes32 structHash = keccak256(
            abi.encode(
                usdc.RECEIVE_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, value, 0, block.timestamp + 1 hours, nonce
            )
        );
        (uint8 v, bytes32 r, bytes32 s) = _sign(structHash);

        vm.expectRevert(MockUSDC.CallerMustBePayee.selector);
        usdc.receiveWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);

        vm.prank(payee);
        usdc.receiveWithAuthorization(payer, payee, value, 0, block.timestamp + 1 hours, nonce, v, r, s);
        assertEq(usdc.balanceOf(payee), value);
    }

    function test_CancelAuthorization() public {
        bytes32 nonce = keccak256("nonce-5");
        bytes32 structHash = keccak256(abi.encode(usdc.CANCEL_AUTHORIZATION_TYPEHASH(), payer, nonce));
        (uint8 v, bytes32 r, bytes32 s) = _sign(structHash);
        usdc.cancelAuthorization(payer, nonce, v, r, s);
        assertTrue(usdc.authorizationState(payer, nonce));

        usdc.mint(payer, 1_000_000);
        bytes32 xferHash = keccak256(
            abi.encode(usdc.TRANSFER_WITH_AUTHORIZATION_TYPEHASH(), payer, payee, 1, 0, block.timestamp + 1, nonce)
        );
        (uint8 v2, bytes32 r2, bytes32 s2) = _sign(xferHash);
        vm.expectRevert(MockUSDC.AuthorizationUsedOrCanceled.selector);
        usdc.transferWithAuthorization(payer, payee, 1, 0, block.timestamp + 1, nonce, v2, r2, s2);
    }
}

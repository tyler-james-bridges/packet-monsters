import type { PrivateKeyAccount } from "viem/accounts";
import { bytesToHex } from "viem";
import { mockUsdcAbi } from "@/lib/abi";
import { addresses, anvil, PAYMENT_PATH, USDC_EIP712_VERSION } from "@/lib/config";
import { publicClient, walletClientFor } from "@/lib/clients";
import {
  decodePaymentRequired,
  encodePayment,
  type PaymentPayload,
} from "@/lib/x402";

export interface BuyPackResult {
  tokenIds: bigint[];
  seed: bigint;
  txHash: `0x${string}`;
}

// The full x402 dance: GET, read the 402's PAYMENT-REQUIRED header, pay
// (EIP-3009 signature or a direct transfer, per config.PAYMENT_PATH), retry
// GET with a PAYMENT header proving it.
export async function buyPack(account: PrivateKeyAccount): Promise<BuyPackResult> {
  const first = await fetch("/api/pack");
  if (first.status !== 402) {
    throw new Error(`Expected 402 from /api/pack, got ${first.status}`);
  }
  const headerValue = first.headers.get("PAYMENT-REQUIRED");
  if (!headerValue) {
    throw new Error("Server did not send a PAYMENT-REQUIRED header");
  }
  const required = decodePaymentRequired(headerValue);
  const terms = required.accepts[0];
  if (!terms) {
    throw new Error("Server sent no payment terms");
  }

  const payload: PaymentPayload =
    PAYMENT_PATH === "eip3009"
      ? await buildEip3009Payment(account, terms.payTo, BigInt(terms.maxAmountRequired))
      : await buildTransferPayment(account, terms.payTo, BigInt(terms.maxAmountRequired));

  const second = await fetch("/api/pack", {
    headers: { PAYMENT: encodePayment(payload) },
  });
  const body = await second.json();
  if (!second.ok) {
    throw new Error(body.error ?? `Purchase failed (${second.status})`);
  }

  return {
    tokenIds: (body.tokenIds as string[]).map((id) => BigInt(id)),
    seed: BigInt(body.seed),
    txHash: body.txHash,
  };
}

async function buildTransferPayment(
  account: PrivateKeyAccount,
  payTo: `0x${string}`,
  amount: bigint,
): Promise<PaymentPayload> {
  const wallet = walletClientFor(account);
  const hash = await wallet.writeContract({
    chain: anvil,
    address: addresses.mockUsdc,
    abi: mockUsdcAbi,
    functionName: "transfer",
    args: [payTo, amount],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  return { kind: "transfer", txHash: hash };
}

async function buildEip3009Payment(
  account: PrivateKeyAccount,
  payTo: `0x${string}`,
  amount: bigint,
): Promise<PaymentPayload> {
  const name = await publicClient.readContract({
    address: addresses.mockUsdc,
    abi: mockUsdcAbi,
    functionName: "name",
  });

  const now = BigInt(Math.floor(Date.now() / 1000));
  const validAfter = 0n;
  const validBefore = now + 3600n;
  const nonceBytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce = bytesToHex(nonceBytes);

  const signature = await account.signTypedData({
    domain: {
      name,
      version: USDC_EIP712_VERSION,
      chainId: anvil.id,
      verifyingContract: addresses.mockUsdc,
    },
    types: {
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    primaryType: "TransferWithAuthorization",
    message: {
      from: account.address,
      to: payTo,
      value: amount,
      validAfter,
      validBefore,
      nonce,
    },
  });

  const r = `0x${signature.slice(2, 66)}` as `0x${string}`;
  const s = `0x${signature.slice(66, 130)}` as `0x${string}`;
  const v = parseInt(signature.slice(130, 132), 16);

  return {
    kind: "eip3009",
    from: account.address,
    to: payTo,
    value: amount.toString(),
    validAfter: validAfter.toString(),
    validBefore: validBefore.toString(),
    nonce,
    v,
    r,
    s,
  };
}

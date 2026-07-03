import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { bytesToHex, decodeEventLog, isAddress, isHex } from "viem";
import { mockUsdcAbi, packetMonstersAbi } from "@/lib/abi";
import { addresses, contractsDeployed, PACK_PRICE_UNITS, X402_NETWORK } from "@/lib/config";
import {
  decodePayment,
  encodePaymentRequired,
  type PaymentPayload,
} from "@/lib/x402";
import { packSellerAddress, packSellerWalletClient } from "@/lib/server/serverClients";
import { publicClient } from "@/lib/clients";
import { isPaymentUsed, markPaymentUsed } from "@/lib/server/usedPayments";

function paymentRequiredResponse() {
  const header = encodePaymentRequired({
    x402Version: 2,
    accepts: [
      {
        scheme: "exact",
        network: X402_NETWORK,
        asset: addresses.mockUsdc,
        payTo: packSellerAddress,
        maxAmountRequired: PACK_PRICE_UNITS.toString(),
        description: "Packet Monsters booster pack (3 cards)",
        resource: "/api/pack",
      },
    ],
  });
  return NextResponse.json(
    { error: "Payment required" },
    { status: 402, headers: { "PAYMENT-REQUIRED": header } },
  );
}

async function verifyTransferPayment(
  payload: Extract<PaymentPayload, { kind: "transfer" }>,
): Promise<{ ok: true; from: `0x${string}` } | { ok: false; error: string }> {
  if (!isHex(payload.txHash)) {
    return { ok: false, error: "Malformed payment: bad tx hash" };
  }
  if (isPaymentUsed(payload.txHash)) {
    return { ok: false, error: "Payment already used" };
  }

  let receipt;
  try {
    receipt = await publicClient.getTransactionReceipt({ hash: payload.txHash });
  } catch {
    return { ok: false, error: "Payment tx not found onchain" };
  }
  if (receipt.status !== "success") {
    return { ok: false, error: "Payment tx reverted" };
  }

  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== addresses.mockUsdc.toLowerCase()) continue;
    try {
      const decoded = decodeEventLog({
        abi: mockUsdcAbi,
        eventName: "Transfer",
        data: log.data,
        topics: log.topics,
      });
      const { from, to, value } = decoded.args as {
        from: `0x${string}`;
        to: `0x${string}`;
        value: bigint;
      };
      if (
        to.toLowerCase() === packSellerAddress.toLowerCase() &&
        value >= PACK_PRICE_UNITS
      ) {
        markPaymentUsed(payload.txHash);
        return { ok: true, from };
      }
    } catch {
      continue;
    }
  }
  return { ok: false, error: "No matching USDC transfer found in that tx" };
}

async function verifyEip3009Payment(
  payload: Extract<PaymentPayload, { kind: "eip3009" }>,
): Promise<{ ok: true; from: `0x${string}` } | { ok: false; error: string }> {
  if (BigInt(payload.value) < PACK_PRICE_UNITS) {
    return { ok: false, error: "Signed amount is below the pack price" };
  }
  if (payload.to.toLowerCase() !== packSellerAddress.toLowerCase()) {
    return { ok: false, error: "Signed payment does not pay the pack seller" };
  }
  try {
    const hash = await packSellerWalletClient.writeContract({
      address: addresses.mockUsdc,
      abi: mockUsdcAbi,
      functionName: "transferWithAuthorization",
      args: [
        payload.from,
        payload.to,
        BigInt(payload.value),
        BigInt(payload.validAfter),
        BigInt(payload.validBefore),
        payload.nonce,
        payload.v,
        payload.r,
        payload.s,
      ],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") {
      return { ok: false, error: "Authorization transfer reverted" };
    }
    return { ok: true, from: payload.from };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authorization transfer failed";
    return { ok: false, error: message };
  }
}

export async function GET(request: Request) {
  if (!contractsDeployed) {
    return NextResponse.json(
      { error: "Contracts not deployed yet. See web/src/lib/deployment.json." },
      { status: 503 },
    );
  }

  const paymentHeader = request.headers.get("PAYMENT");
  if (!paymentHeader) {
    return paymentRequiredResponse();
  }

  let payload: PaymentPayload;
  try {
    payload = decodePayment(paymentHeader);
  } catch {
    return NextResponse.json({ error: "Malformed PAYMENT header" }, { status: 400 });
  }

  const verified =
    payload.kind === "eip3009"
      ? await verifyEip3009Payment(payload)
      : await verifyTransferPayment(payload);

  if (!verified.ok) {
    return NextResponse.json({ error: verified.error }, { status: 402 });
  }
  if (!isAddress(verified.from)) {
    return NextResponse.json({ error: "Could not resolve buyer address" }, { status: 400 });
  }

  const seed = BigInt(bytesToHex(randomBytes(32)));

  try {
    const hash = await packSellerWalletClient.writeContract({
      address: addresses.packetMonsters,
      abi: packetMonstersAbi,
      functionName: "mintPack",
      args: [verified.from, seed],
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (receipt.status !== "success") {
      return NextResponse.json({ error: "mintPack reverted" }, { status: 500 });
    }

    let tokenIds: string[] = [];
    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== addresses.packetMonsters.toLowerCase()) continue;
      try {
        const decoded = decodeEventLog({
          abi: packetMonstersAbi,
          eventName: "PackOpened",
          data: log.data,
          topics: log.topics,
        });
        const args = decoded.args as { tokenIds: readonly bigint[] };
        tokenIds = args.tokenIds.map((id) => id.toString());
        break;
      } catch {
        continue;
      }
    }

    return NextResponse.json({ tokenIds, seed: seed.toString(), txHash: hash });
  } catch (err) {
    const message = err instanceof Error ? err.message : "mintPack failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { isAddress, parseEther, parseUnits } from "viem";
import { mockUsdcAbi } from "@/lib/abi";
import { addresses, contractsDeployed, USDC_DECIMALS } from "@/lib/config";
import { faucetWalletClient } from "@/lib/server/serverClients";
import { publicClient } from "@/lib/clients";

const FAUCET_ETH = parseEther("1");
const FAUCET_USDC = parseUnits("100", USDC_DECIMALS);

export async function POST(request: Request) {
  if (!contractsDeployed) {
    return NextResponse.json(
      { error: "Contracts not deployed yet. See web/src/lib/deployment.json." },
      { status: 503 },
    );
  }

  let body: { address?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const address = body.address;
  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Missing or invalid address" }, { status: 400 });
  }

  try {
    const ethHash = await faucetWalletClient.sendTransaction({
      to: address,
      value: FAUCET_ETH,
    });
    await publicClient.waitForTransactionReceipt({ hash: ethHash });

    const usdcHash = await faucetWalletClient.writeContract({
      address: addresses.mockUsdc,
      abi: mockUsdcAbi,
      functionName: "mint",
      args: [address, FAUCET_USDC],
    });
    await publicClient.waitForTransactionReceipt({ hash: usdcHash });

    return NextResponse.json({ ethHash, usdcHash });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Faucet transaction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

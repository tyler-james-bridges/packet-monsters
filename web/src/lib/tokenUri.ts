import { packetMonstersAbi } from "@/lib/abi";
import { publicClient } from "@/lib/clients";
import { addresses, contractsDeployed } from "@/lib/config";

export interface OnchainMetadata {
  name?: string;
  description?: string;
  image?: string; // data URI, usually base64 SVG
}

export async function fetchTokenURI(tokenId: bigint): Promise<OnchainMetadata | null> {
  if (!contractsDeployed) return null;
  try {
    const uri = await publicClient.readContract({
      address: addresses.packetMonsters,
      abi: packetMonstersAbi,
      functionName: "tokenURI",
      args: [tokenId],
    });
    return decodeTokenURI(uri);
  } catch {
    return null;
  }
}

export function decodeTokenURI(uri: string): OnchainMetadata {
  if (uri.startsWith("data:application/json;base64,")) {
    const json = atob(uri.slice("data:application/json;base64,".length));
    try {
      return JSON.parse(json);
    } catch {
      return {};
    }
  }
  if (uri.startsWith("data:application/json,")) {
    try {
      return JSON.parse(decodeURIComponent(uri.slice("data:application/json,".length)));
    } catch {
      return {};
    }
  }
  if (uri.startsWith("data:image")) {
    return { image: uri };
  }
  return {};
}

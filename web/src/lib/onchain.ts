import type { Address } from "viem";
import { packetMonstersAbi } from "@/lib/abi";
import { publicClient } from "@/lib/clients";
import { addresses, contractsDeployed } from "@/lib/config";
import { cardById, type CardDef } from "@/lib/cards";

export interface OwnedCard {
  tokenId: bigint;
  def: CardDef;
  level: number;
}

export async function fetchCardInstance(
  tokenId: bigint,
): Promise<{ def: CardDef; level: number } | null> {
  if (!contractsDeployed) return null;
  try {
    const [, card] = await publicClient.readContract({
      address: addresses.packetMonsters,
      abi: packetMonstersAbi,
      functionName: "cardOf",
      args: [tokenId],
    });
    const def = cardById.get(card.defId);
    if (!def) return null;
    return { def, level: card.level };
  } catch {
    return null;
  }
}

// No ERC721Enumerable in the frozen ABI, so ownership is reconstructed from
// Transfer logs plus a fresh ownerOf check per SPEC.md.
export async function fetchOwnedCards(owner: Address): Promise<OwnedCard[]> {
  if (!contractsDeployed) return [];

  const incoming = await publicClient.getLogs({
    address: addresses.packetMonsters,
    event: packetMonstersAbi.find((e) => e.type === "event" && e.name === "Transfer")!,
    args: { to: owner },
    fromBlock: 0n,
    toBlock: "latest",
  });

  const candidateIds = [...new Set(incoming.map((log) => (log.args as { tokenId: bigint }).tokenId))];

  const owned: OwnedCard[] = [];
  for (const tokenId of candidateIds) {
    try {
      const currentOwner = await publicClient.readContract({
        address: addresses.packetMonsters,
        abi: packetMonstersAbi,
        functionName: "ownerOf",
        args: [tokenId],
      });
      if (currentOwner.toLowerCase() !== owner.toLowerCase()) continue;
      const instance = await fetchCardInstance(tokenId);
      if (instance) owned.push({ tokenId, ...instance });
    } catch {
      continue;
    }
  }

  return owned.sort((a, b) => Number(a.tokenId - b.tokenId));
}

import { decodeEventLog, hexToString } from "viem";
import { publicClient } from "@/lib/clients";
import { addresses, contractsDeployed, FEEDBACK_TAG } from "@/lib/config";
import {
  newFeedbackEvent8004,
  newFeedbackEventSimple,
  registeredEventA,
  registeredEventB,
} from "@/lib/abi";

export interface LeaderboardEntry {
  agentId: bigint;
  host: string;
  feedbackCount: number;
}

function tagMatches(raw: string): boolean {
  if (raw === FEEDBACK_TAG) return true;
  try {
    return hexToString(raw as `0x${string}`).replace(/\0+$/, "") === FEEDBACK_TAG;
  } catch {
    return false;
  }
}

async function readFeedbackCounts(): Promise<Map<bigint, number>> {
  const counts = new Map<bigint, number>();
  const logs = await publicClient.getLogs({
    address: addresses.reputationRegistry,
    fromBlock: 0n,
    toBlock: "latest",
  });

  for (const log of logs) {
    for (const abiEvent of [newFeedbackEventSimple, newFeedbackEvent8004]) {
      try {
        const decoded = decodeEventLog({
          abi: [abiEvent],
          data: log.data,
          topics: log.topics,
        });
        const args = decoded.args as Record<string, unknown>;
        const agentId = args.agentId as bigint;
        const tag = (args.tag ?? args.tag1) as string | undefined;
        if (tag !== undefined && !tagMatches(tag)) break;
        counts.set(agentId, (counts.get(agentId) ?? 0) + 1);
        break;
      } catch {
        continue;
      }
    }
  }
  return counts;
}

async function readAgentHosts(): Promise<Map<bigint, string>> {
  const hosts = new Map<bigint, string>();
  const logs = await publicClient.getLogs({
    address: addresses.identityRegistry,
    fromBlock: 0n,
    toBlock: "latest",
  });

  for (const log of logs) {
    for (const abiEvent of [registeredEventA, registeredEventB]) {
      try {
        const decoded = decodeEventLog({
          abi: [abiEvent],
          data: log.data,
          topics: log.topics,
        });
        const args = decoded.args as { agentId: bigint; agentDomain: string };
        hosts.set(args.agentId, args.agentDomain);
        break;
      } catch {
        continue;
      }
    }
  }
  return hosts;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!contractsDeployed) return [];
  const [counts, hosts] = await Promise.all([readFeedbackCounts(), readAgentHosts()]);
  const entries: LeaderboardEntry[] = [...counts.entries()].map(([agentId, feedbackCount]) => ({
    agentId,
    host: hosts.get(agentId) ?? `agent #${agentId}`,
    feedbackCount,
  }));
  return entries.sort((a, b) => b.feedbackCount - a.feedbackCount);
}

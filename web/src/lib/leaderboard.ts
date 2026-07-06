import { publicClient } from "@/lib/clients";
import { addresses, contractsDeployed, FEEDBACK_TAG } from "@/lib/config";
import { newFeedbackEvent, registeredEvent } from "@/lib/abi";

export interface LeaderboardEntry {
  agentId: bigint;
  host: string;
  feedbackCount: number;
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!contractsDeployed) return [];

  const [feedbackLogs, registeredLogs] = await Promise.all([
    publicClient.getLogs({
      address: addresses.reputationRegistry,
      event: newFeedbackEvent,
      fromBlock: 0n,
      toBlock: "latest",
    }),
    publicClient.getLogs({
      address: addresses.identityRegistry,
      event: registeredEvent,
      fromBlock: 0n,
      toBlock: "latest",
    }),
  ]);

  const hosts = new Map<bigint, string>();
  for (const log of registeredLogs) {
    const { agentId, agentURI } = log.args;
    if (agentId !== undefined && agentURI) {
      hosts.set(agentId, agentURI.replace(/^https?:\/\//, "").split("/")[0]);
    }
  }

  const counts = new Map<bigint, number>();
  for (const log of feedbackLogs) {
    const { agentId, tag1, endpoint } = log.args;
    if (agentId === undefined || tag1 !== FEEDBACK_TAG) continue;
    counts.set(agentId, (counts.get(agentId) ?? 0) + 1);
    if (endpoint && !hosts.has(agentId)) hosts.set(agentId, endpoint);
  }

  const entries: LeaderboardEntry[] = [...counts.entries()].map(
    ([agentId, feedbackCount]) => ({
      agentId,
      host: hosts.get(agentId) ?? `agent #${agentId}`,
      feedbackCount,
    })
  );
  return entries.sort((a, b) => b.feedbackCount - a.feedbackCount);
}

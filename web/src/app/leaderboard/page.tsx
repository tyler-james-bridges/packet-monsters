"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import { contractsDeployed, FEEDBACK_TAG } from "@/lib/config";
import { parseContractError } from "@/lib/errors";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!contractsDeployed) return;
    setLoading(true);
    setError(null);
    try {
      setEntries(await fetchLeaderboard());
    } catch (e) {
      setError(parseContractError(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loading reputation events from chain on mount -- external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-sm font-bold uppercase tracking-widest text-ink">Leaderboard</h1>
        <button
          type="button"
          onClick={load}
          disabled={loading || !contractsDeployed}
          className="rounded border border-line px-2 py-1 text-[10px] uppercase tracking-wider text-muted hover:text-ink disabled:opacity-40 cursor-pointer"
        >
          {loading ? "refreshing..." : "refresh"}
        </button>
      </div>
      <p className="mb-4 text-[10px] text-muted">
        ERC-8004 reputation, live from the registry -- ranked by feedback tagged &quot;{FEEDBACK_TAG}&quot;
      </p>

      {!contractsDeployed && (
        <p className="text-[11px] text-exotic">Contracts not deployed -- no reputation data yet.</p>
      )}
      {error && <p className="text-[11px] text-plasma">{error}</p>}
      {contractsDeployed && !loading && entries.length === 0 && (
        <p className="text-[11px] text-muted">No battle feedback recorded yet.</p>
      )}

      <ol className="space-y-1.5">
        {entries.map((e, i) => (
          <li
            key={e.agentId.toString()}
            className="flex items-center justify-between rounded border border-line bg-panel px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-right text-muted tabular-nums">{i + 1}</span>
              <div>
                <div className="text-ink">{e.host}</div>
                <div className="text-[10px] text-muted">agent #{e.agentId.toString()}</div>
              </div>
            </div>
            <span className="text-ghost text-glow tabular-nums">{e.feedbackCount} wins</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

"use client";

import { contractsDeployed } from "@/lib/config";

export function DeployBanner() {
  if (contractsDeployed) return null;
  return (
    <div className="border-b border-exotic/40 bg-exotic/10 px-4 py-2 text-center text-[11px] text-exotic">
      Contracts not deployed. Run anvil + the deploy script and drop
      deployment.json into web/src/lib to go live.
    </div>
  );
}

import type { Metadata } from "next";
import { VaultStage } from "@/components/VaultStage";
// The engine stylesheet is scoped to .vault-root, so importing it here keeps
// every rule inert on the rest of the application.
import "@/vault/ui/hud.css";

export const metadata: Metadata = {
  title: "Sealed Vault | Packet Monsters",
  description:
    "Open a sealed packet. Draws are priced at exact expected value, so the vault cannot be timed.",
};

interface VaultPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * The vault fills the viewport below the application header. `seed` and `shot`
 * exist for the deterministic screenshot harness; neither is part of normal
 * play, and supplying a seed is what switches the engine into fixed timestep
 * mode so a captured frame is reproducible.
 */
export default async function VaultPage({ searchParams }: VaultPageProps) {
  const params = await searchParams;

  return <VaultStage seed={first(params.seed)} shot={first(params.shot)} />;
}

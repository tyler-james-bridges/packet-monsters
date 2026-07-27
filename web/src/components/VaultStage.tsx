"use client";

import { useEffect, useRef, useState } from "react";
import type { VaultHandle } from "@/vault/mount";

interface VaultStageProps {
  /** Deterministic seed. Present only when driven by the screenshot harness. */
  seed?: string | null;
  /** Named harness state to drive after mount. */
  shot?: string | null;
}

/**
 * Client boundary for the 3D vault.
 *
 * The engine is imported dynamically inside the effect rather than at module
 * scope: it touches `window`, `document` and `matchMedia` while constructing the
 * renderer, none of which exist during a server render. Dynamic import also
 * keeps roughly 700 KB of engine out of the bundle for every other route.
 *
 * The effect is written to survive being run twice, because React runs effects
 * mount-unmount-mount in development. `cancelled` covers the case where the
 * component unmounts while the import is still in flight, which would otherwise
 * leave an orphaned WebGL context alive with no handle to dispose it.
 */
export function VaultStage({ seed = null, shot = null }: VaultStageProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState<string | null>(null);

  // The header is content-sized and wraps to a second row on narrow screens, so
  // its height is not a constant a stylesheet could hardcode. Measure it and
  // give the stage exactly the space that is left.
  useEffect(() => {
    const frame = frameRef.current;
    const header = document.querySelector("header");
    if (!frame) return;

    const apply = () => {
      const used = header?.getBoundingClientRect().height ?? 0;
      frame.style.height = `${Math.max(240, window.innerHeight - used)}px`;
    };

    apply();
    const observer = new ResizeObserver(apply);
    if (header) observer.observe(header);
    window.addEventListener("resize", apply, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let handle: VaultHandle | null = null;

    void (async () => {
      try {
        const { mountVault } = await import("@/vault/mount");
        if (cancelled) return;
        handle = mountVault(host, { seed, deterministic: seed !== null || shot !== null });
        if (shot) {
          const harness = (window as unknown as { __harness?: { goto(n: string): Promise<void> } })
            .__harness;
          await harness?.goto(shot);
        }
      } catch (error) {
        if (!cancelled) setFailed(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [seed, shot]);

  return (
    <div ref={frameRef} className="relative w-full">
      <div ref={hostRef} className="h-full w-full" />
      {failed && (
        <div className="absolute inset-0 grid place-content-center gap-3 px-6 text-center">
          <p className="text-xs tracking-[0.2em] text-muted">VAULT UNAVAILABLE</p>
          <p className="max-w-[36ch] text-xs leading-relaxed text-muted">
            The vault needs WebGL2. If your browser supports it, hardware acceleration may be
            switched off.
          </p>
          <p className="max-w-[52ch] font-mono text-[10px] leading-relaxed text-muted/70">
            {failed}
          </p>
        </div>
      )}
    </div>
  );
}

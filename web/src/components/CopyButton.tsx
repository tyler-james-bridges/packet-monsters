"use client";

import { useState } from "react";

export function CopyButton({ value, label = "copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard API unavailable; no-op
        }
      }}
      className="text-[10px] uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer"
      aria-label={`Copy ${label}`}
    >
      {copied ? "copied" : label}
    </button>
  );
}

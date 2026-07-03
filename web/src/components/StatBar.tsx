export function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-1.5 text-[9px]">
      <span className="w-6 shrink-0 text-muted uppercase">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-2">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-6 shrink-0 text-right text-ink tabular-nums">{value}</span>
    </div>
  );
}

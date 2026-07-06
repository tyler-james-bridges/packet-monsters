import { typeInfo } from "@/lib/cards";

// Deterministic abstract art generated from the card's urlHash so every card
// looks distinct without needing the live onchain SVG. Collection detail
// swaps this out for the real tokenURI render once contracts are wired up.
export function CardArt({
  urlHash,
  typeId,
  alive,
}: {
  urlHash: string;
  typeId: number;
  alive: boolean;
}) {
  const info = typeInfo(typeId);
  const seed = parseInt(urlHash.slice(2, 10), 16) || 0;
  const rand = (n: number, m: number) => (seed >> n) % m;
  // SVG ids are document-global; a shared id would make every card on the
  // page reuse the first card's gradient color.
  const gradId = `card-art-bg-${urlHash.slice(2, 10)}-${typeId}`;

  const shapes = Array.from({ length: 5 }, (_, i) => {
    const cx = 20 + rand(i * 3, 60);
    const cy = 15 + rand(i * 3 + 1, 50);
    const r = 6 + rand(i * 3 + 2, 14);
    return { cx, cy, r, key: i };
  });

  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor={info.hex} stopOpacity={alive ? 0.35 : 0.15} />
          <stop offset="100%" stopColor="#07070b" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect width="100" height="70" fill={`url(#${gradId})`} />
      {shapes.map((s) => (
        <circle
          key={s.key}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="none"
          stroke={info.hex}
          strokeOpacity={alive ? 0.5 : 0.2}
          strokeWidth="1"
        />
      ))}
      <line
        x1="0"
        y1="55"
        x2="100"
        y2="45"
        stroke={info.hex}
        strokeOpacity={alive ? 0.6 : 0.2}
        strokeWidth="0.6"
      />
    </svg>
  );
}

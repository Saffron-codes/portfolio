import { DESK, VIEWBOX } from "../layout";

/** Wall, floor and rug. Drawn first. */
export function Wall() {
  return (
    <g>
      <defs>
        <radialGradient id="wallVignette" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="var(--sc-wall-2)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--sc-wall-2)" stopOpacity="1" />
        </radialGradient>
      </defs>
      <rect x="0" y="-1200" width={VIEWBOX.width} height="2100" fill="var(--sc-wall)" />
      <rect x="0" y="-1200" width={VIEWBOX.width} height="2100" fill="url(#wallVignette)" style={{ opacity: "var(--sc-vignette)" }} />
      {/* Floor */}
      <rect x="0" y="700" width={VIEWBOX.width} height="1400" fill="var(--sc-floor)" />
      <rect x="0" y="700" width={VIEWBOX.width} height="1400" fill="var(--sc-floor-2)" opacity="0.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={i * 200 + 20} y="700" width="2" height="1400" fill="var(--sc-floor-2)" opacity="0.35" />
      ))}
      {/* Skirting */}
      <rect x="0" y="690" width={VIEWBOX.width} height="14" fill="var(--sc-wall-2)" opacity="0.6" />
      {/* Rug */}
      <rect x="320" y="760" width="960" height="260" rx="40" fill="var(--sc-rug)" />
      <rect x="350" y="790" width="900" height="200" rx="30" fill="none" stroke="var(--sc-rug-2)" strokeWidth="8" />
      <rect x="390" y="830" width="820" height="120" rx="20" fill="var(--sc-rug-2)" opacity="0.5" />
    </g>
  );
}

/** The desk slab, drawn after wall objects and before desk objects. */
export function Desk() {
  const { x, y, width, top, edge } = DESK;
  return (
    <g>
      <defs>
        <linearGradient id="deskTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sc-wood-light)" />
          <stop offset="1" stopColor="var(--sc-wood)" />
        </linearGradient>
      </defs>
      {/* Shadow on the floor */}
      <rect x={x + 10} y={y + top + edge} width={width - 20} height="30" rx="10" fill="var(--sc-shadow)" />
      {/* Legs */}
      <rect x={x + 40} y={y + top + edge - 4} width="40" height="340" rx="4" fill="var(--sc-wood-dark)" />
      <rect x={x + width - 80} y={y + top + edge - 4} width="40" height="340" rx="4" fill="var(--sc-wood-dark)" />
      {/* Top surface */}
      <rect x={x} y={y} width={width} height={top} rx="8" fill="url(#deskTop)" />
      {/* Wood grain */}
      <g stroke="var(--sc-wood-dark)" strokeWidth="1.5" opacity="0.14" fill="none">
        <path d={`M${x + 60} ${y + 30} q 260 10 520 0 t 520 0`} />
        <path d={`M${x + 120} ${y + 75} q 200 -10 400 0 t 400 0 t 300 -4`} />
        <path d={`M${x + 40} ${y + 112} q 300 8 600 0 t 600 0`} />
      </g>
      {/* Front edge */}
      <rect x={x} y={y + top - 6} width={width} height={edge + 6} rx="6" fill="var(--sc-wood-dark)" />
      <rect x={x} y={y + top - 6} width={width} height="6" fill="var(--sc-wood)" />
    </g>
  );
}

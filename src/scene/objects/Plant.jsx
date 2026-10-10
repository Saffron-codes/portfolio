/** Potted plant. Size: 120 × 190, pot at the bottom. */
export const PLANT_SIZE = { width: 120, height: 190 };

const LEAVES = [
  [60, 120, -70, 46, 18], [60, 120, -30, 52, 20], [60, 120, 10, 50, 19], [60, 120, 50, 46, 17],
  [60, 110, -95, 34, 14], [60, 110, 85, 34, 14], [60, 112, -10, 40, 16],
];

export default function Plant(props) {
  return (
    <g {...props}>
      <ellipse cx="60" cy="188" rx="48" ry="6" fill="var(--sc-shadow)" />
      {/* Leaves */}
      {LEAVES.map(([cx, cy, angle, rx, ry], i) => (
        <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy - rx} rx={ry} ry={rx} fill={i % 2 ? "var(--sc-leaf)" : "var(--sc-leaf-2)"} />
          <line x1={cx} y1={cy - 6} x2={cx} y2={cy - rx * 1.7} stroke="var(--sc-leaf-2)" strokeWidth="1.5" opacity="0.6" />
        </g>
      ))}
      {/* Pot */}
      <polygon points="24,128 96,128 86,186 34,186" fill="var(--sc-pot)" />
      <polygon points="24,128 50,128 44,186 34,186" fill="var(--sc-highlight)" opacity="0.5" />
      <rect x="18" y="118" width="84" height="16" rx="5" fill="var(--sc-pot-2)" />
      <rect x="18" y="118" width="84" height="5" rx="2.5" fill="var(--sc-highlight)" opacity="0.5" />
    </g>
  );
}

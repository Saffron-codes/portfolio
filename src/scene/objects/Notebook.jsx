/** Open notebook lying on the desk with a pen. Size: 230 × 95. */
export const NOTEBOOK_SIZE = { width: 230, height: 95 };
export const NOTEBOOK_PAGES = { x: 8, y: 6, width: 204, height: 80 };

export default function Notebook(props) {
  const p = NOTEBOOK_PAGES;
  return (
    <g {...props}>
      <rect x="4" y="10" width="212" height="82" rx="6" fill="var(--sc-shadow)" />
      {/* Cover */}
      <rect x="0" y="0" width="220" height="92" rx="6" fill="var(--sc-notebook)" />
      {/* Pages */}
      <rect x={p.x} y={p.y} width={p.width / 2 - 2} height={p.height} rx="3" fill="var(--sc-paper)" />
      <rect x={p.x + p.width / 2 + 2} y={p.y} width={p.width / 2 - 2} height={p.height} rx="3" fill="var(--sc-paper)" />
      <rect x={p.x + p.width / 2 - 2} y={p.y} width="4" height={p.height} fill="var(--sc-notebook-2)" />
      {/* Ruled lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} stroke="var(--sc-paper-line)" strokeWidth="1.5">
          <line x1={p.x + 10} y1={p.y + 18 + i * 13} x2={p.x + p.width / 2 - 12} y2={p.y + 18 + i * 13} />
          <line x1={p.x + p.width / 2 + 12} y1={p.y + 18 + i * 13} x2={p.x + p.width - 10} y2={p.y + 18 + i * 13} />
        </g>
      ))}
      {/* Handwriting squiggles */}
      <path d="M22 24 q6 -5 12 0 t12 0 t12 0 M22 37 q6 -5 12 0 t12 0 M22 50 q6 -5 12 0 t12 0 t12 0 t12 0" fill="none" stroke="var(--sc-accent)" strokeWidth="1.5" opacity="0.7" />
      <rect x="126" y="20" width="60" height="38" rx="4" fill="var(--sc-amber)" opacity="0.35" />
      {/* Spiral */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx="110" cy={16 + i * 12} r="3" fill="none" stroke="var(--sc-device-2)" strokeWidth="2" />
      ))}
      {/* Pen */}
      <g transform="rotate(-8 200 70)">
        <rect x="150" y="72" width="100" height="9" rx="4.5" fill="var(--sc-device-dark)" />
        <polygon points="250,72 262,76.5 250,81" fill="var(--sc-device-2)" />
        <rect x="150" y="72" width="12" height="9" rx="4.5" fill="var(--sc-accent)" />
      </g>
    </g>
  );
}

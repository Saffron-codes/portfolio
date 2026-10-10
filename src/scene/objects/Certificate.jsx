/** Framed certificate on the wall (education). Size: 190 × 150. */
export const CERT_SIZE = { width: 190, height: 150 };
export const CERT_PAPER = { x: 22, y: 20, width: 146, height: 110 };

export default function Certificate(props) {
  const p = CERT_PAPER;
  return (
    <g {...props}>
      <circle cx="95" cy="-10" r="3" fill="var(--sc-device-dark)" opacity="0.6" />
      <path d="M95 -10 L 40 6 M95 -10 L 150 6" stroke="var(--sc-device-dark)" strokeWidth="1.2" opacity="0.5" fill="none" />
      <rect x="4" y="6" width="190" height="150" rx="6" fill="var(--sc-shadow)" />
      <rect x="0" y="0" width="190" height="150" rx="6" fill="var(--sc-frame-dark)" />
      <rect x="10" y="10" width="170" height="130" rx="3" fill="var(--sc-wall)" />
      <rect x={p.x} y={p.y} width={p.width} height={p.height} rx="2" fill="var(--sc-paper)" />
      {/* Decorative border + text lines */}
      <rect x={p.x + 6} y={p.y + 6} width={p.width - 12} height={p.height - 12} rx="2" fill="none" stroke="var(--sc-accent)" strokeWidth="1.2" opacity="0.7" />
      <rect x="60" y="36" width="70" height="6" rx="3" fill="var(--sc-accent)" opacity="0.8" />
      <rect x="48" y="50" width="94" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      <rect x="54" y="58" width="82" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      <rect x="64" y="66" width="62" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      {/* Seal + ribbon */}
      <circle cx="132" cy="106" r="11" fill="var(--sc-amber)" />
      <circle cx="132" cy="106" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
      <polygon points="126,114 128,128 132,124 136,128 138,114" fill="var(--sc-neon)" opacity="0.85" />
      <rect x="44" y="108" width="50" height="3" rx="1.5" fill="var(--sc-paper-line)" />
      {/* Glass sheen */}
      <polygon points="14,10 60,10 20,140 10,140" fill="var(--sc-highlight)" opacity="0.6" />
    </g>
  );
}

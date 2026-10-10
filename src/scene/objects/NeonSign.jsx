/**
 * Neon name sign on the wall. Real <text> so the name is crawlable.
 * Size: ~470 × 165.
 */
export const NEON_SIZE = { width: 470, height: 165 };

export default function NeonSign({ name, title, ...props }) {
  return (
    <g {...props}>
      <defs>
        <filter id="neonGlow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {/* Mounting board */}
      <rect x="0" y="0" width="470" height="165" rx="16" fill="var(--sc-wall-2)" opacity="0.35" />
      <circle cx="18" cy="18" r="3" fill="var(--sc-device-dark)" opacity="0.5" />
      <circle cx="452" cy="18" r="3" fill="var(--sc-device-dark)" opacity="0.5" />
      <circle cx="18" cy="147" r="3" fill="var(--sc-device-dark)" opacity="0.5" />
      <circle cx="452" cy="147" r="3" fill="var(--sc-device-dark)" opacity="0.5" />

      {/* Glow layers */}
      <g style={{ opacity: "var(--sc-neon-glow)" }} aria-hidden="true">
        <text x="235" y="82" textAnchor="middle" fontFamily="Pacifico, 'Brush Script MT', cursive" fontSize="46" fill="var(--sc-neon)" stroke="var(--sc-neon)" strokeWidth="6" filter="url(#neonGlow)">
          {name}
        </text>
        <text x="235" y="130" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fontWeight="600" letterSpacing="6" fill="var(--sc-neon-2)" stroke="var(--sc-neon-2)" strokeWidth="4" filter="url(#neonGlow)">
          {title.toUpperCase()}
        </text>
      </g>
      {/* Crisp tubes */}
      <text x="235" y="82" textAnchor="middle" fontFamily="Pacifico, 'Brush Script MT', cursive" fontSize="46" fill="#fff6fb" stroke="var(--sc-neon)" strokeWidth="1.2" paintOrder="stroke">
        {name}
      </text>
      <text x="235" y="130" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="19" fontWeight="600" letterSpacing="6" fill="#effffd" stroke="var(--sc-neon-2)" strokeWidth="0.8" paintOrder="stroke">
        {title.toUpperCase()}
      </text>
    </g>
  );
}

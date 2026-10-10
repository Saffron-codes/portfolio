/**
 * Desk lamp (theme toggle later). The warm light cone shows only when the lamp is on
 * (light mode) via --sc-lamp-on. Size: 170 × 250, base bottom-left, head top-right.
 */
export const LAMP_SIZE = { width: 170, height: 250 };

export default function Lamp(props) {
  return (
    <g {...props}>
      <defs>
        <radialGradient id="lampLight" cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#ffcf6e" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffcf6e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lampHalo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe3a3" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe3a3" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Light cone + halo (lamp on) */}
      <g style={{ opacity: "var(--sc-lamp-on)" }}>
        <polygon points="128,52 86,250 480,250 198,52" fill="url(#lampLight)" />
        <ellipse cx="160" cy="48" rx="120" ry="90" fill="url(#lampHalo)" />
      </g>

      {/* Shadow + base */}
      <ellipse cx="50" cy="248" rx="54" ry="7" fill="var(--sc-shadow)" />
      <ellipse cx="50" cy="243" rx="44" ry="9" fill="var(--sc-device-dark)" />
      <rect x="40" y="200" width="20" height="40" rx="4" fill="var(--sc-device-dark)" />
      {/* Arm */}
      <path d="M50 206 L 50 110 L 150 40" fill="none" stroke="var(--sc-device-dark)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="110" r="7" fill="var(--sc-device-2)" />
      {/* Head (cone) pointing down-right */}
      <g transform="rotate(32 150 40)">
        <polygon points="118,20 182,20 196,66 104,66" fill="var(--sc-device-dark)" />
        <rect x="104" y="60" width="92" height="8" rx="3" fill="var(--sc-device-2)" />
        <ellipse cx="150" cy="66" rx="40" ry="5" fill="#ffe6b0" style={{ opacity: "var(--sc-lamp-on)" }} />
      </g>
    </g>
  );
}

/** Laptop with a dark code editor on screen. Size: 300 × 185 (base extends past the lid). */
export const LAPTOP_SIZE = { width: 300, height: 185 };
export const LAPTOP_SCREEN = { x: 40, y: 8, width: 220, height: 142 };

const LINES = [
  [12, 60, "#c792ea"], [26, 110, "#82aaff"], [8, 90, "#c3e88d"], [40, 150, "#89ddff"],
  [26, 70, "#f78c6c"], [26, 130, "#c3e88d"], [8, 50, "#c792ea"], [26, 100, "#82aaff"], [12, 80, "#ffcb6b"],
];

export default function Laptop(props) {
  const s = LAPTOP_SCREEN;
  return (
    <g {...props}>
      <defs>
        <radialGradient id="laptopGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#8ec5ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#8ec5ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="150" cy="80" rx="230" ry="150" fill="url(#laptopGlow)" style={{ opacity: "var(--sc-screen-glow)" }} />
      <ellipse cx="150" cy="186" rx="160" ry="8" fill="var(--sc-shadow)" />

      {/* Lid */}
      <rect x="30" y="0" width="240" height="160" rx="8" fill="var(--sc-device)" />
      <rect x={s.x} y={s.y} width={s.width} height={s.height} rx="4" fill="#1b1e2b" />
      {/* Editor chrome */}
      <rect x={s.x} y={s.y} width={s.width} height="14" fill="#262a3b" />
      <circle cx={s.x + 10} cy={s.y + 7} r="3" fill="#ff5f57" />
      <circle cx={s.x + 20} cy={s.y + 7} r="3" fill="#febc2e" />
      <circle cx={s.x + 30} cy={s.y + 7} r="3" fill="#28c840" />
      <rect x={s.x} y={s.y + 14} width="18" height={s.height - 14} fill="#20243a" />
      {LINES.map(([indent, w, color], i) => (
        <g key={i}>
          <rect x={s.x + 5} y={s.y + 24 + i * 13} width="8" height="3" rx="1.5" fill="#4c5270" />
          <rect x={s.x + 22 + indent} y={s.y + 23 + i * 13} width={w} height="5" rx="2.5" fill={color} opacity="0.85" />
        </g>
      ))}
      <circle cx="150" cy="4" r="1.6" fill="var(--sc-device-dark)" />

      {/* Base */}
      <polygon points="30,160 270,160 300,182 0,182" fill="var(--sc-device)" />
      <polygon points="30,160 270,160 300,182 0,182" fill="var(--sc-highlight)" opacity="0.4" />
      <rect x="0" y="180" width="300" height="5" rx="2" fill="var(--sc-device-2)" />
      <rect x="60" y="165" width="180" height="9" rx="3" fill="var(--sc-device-dark)" opacity="0.55" />
      <rect x="125" y="176" width="50" height="4" rx="2" fill="var(--sc-device-dark)" opacity="0.35" />
    </g>
  );
}

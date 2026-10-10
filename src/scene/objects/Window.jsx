/**
 * Big window on the back wall, with curtains, sill and a distant skyline.
 * `sky` is one of "dawn" | "day" | "sunset" | "night" (Chennai time, see Phase 4).
 * Size: 490 × 367 (frame 490 × 345, sill below). Curtains hang outside the frame.
 */
const SKIES = {
  dawn: { top: "#f3a26d", mid: "#f7c9a0", bottom: "#fbe6cf" },
  day: { top: "#74bde4", mid: "#a9d9f0", bottom: "#dcf0f8" },
  sunset: { top: "#5b4b8a", mid: "#e88a63", bottom: "#f9c784" },
  night: { top: "#0b1430", mid: "#1b2a55", bottom: "#2a3d6b" },
};

const STARS = [
  [40, 30], [92, 58], [140, 22], [210, 70], [260, 36], [330, 50], [380, 20], [420, 76],
  [70, 110], [180, 125], [300, 105], [440, 120], [120, 160], [360, 150], [240, 175],
];

const BUILDINGS = [
  [0, 48, 36], [40, 70, 28], [72, 42, 44], [120, 86, 30], [154, 60, 40], [198, 96, 26],
  [228, 56, 46], [278, 74, 34], [316, 104, 22], [342, 64, 42], [388, 82, 30], [422, 50, 40],
];

export const WINDOW_SIZE = { width: 490, height: 367 };
export const GLASS_RECT = { x: 14, y: 14, width: 462, height: 317 };

export default function Window({ sky = "day", ...props }) {
  const colors = SKIES[sky] ?? SKIES.day;
  const isNight = sky === "night";
  const isDay = sky === "day";
  const g = GLASS_RECT;

  return (
    <g {...props}>
      <defs>
        <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.top} />
          <stop offset="0.55" stopColor={colors.mid} />
          <stop offset="1" stopColor={colors.bottom} />
        </linearGradient>
        <radialGradient id="windowGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#9fc2ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9fc2ff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="windowGlass">
          <rect x={g.x} y={g.y} width={g.width} height={g.height} rx="8" />
        </clipPath>
      </defs>

      {/* Light spill onto the wall (dark mode only) */}
      <ellipse cx="245" cy="180" rx="420" ry="300" fill="url(#windowGlow)" style={{ opacity: "var(--sc-window-glow)" }} />

      {/* Curtains */}
      <rect x="-74" y="-18" width="66" height="400" rx="22" fill="var(--sc-curtain)" />
      <rect x="498" y="-18" width="66" height="400" rx="22" fill="var(--sc-curtain)" />
      <rect x="-60" y="-18" width="10" height="400" rx="5" fill="var(--sc-highlight)" />
      <rect x="512" y="-18" width="10" height="400" rx="5" fill="var(--sc-highlight)" />
      {/* Curtain rod */}
      <rect x="-90" y="-26" width="670" height="8" rx="4" fill="var(--sc-frame-dark)" />
      <circle cx="-92" cy="-22" r="7" fill="var(--sc-frame-dark)" />
      <circle cx="582" cy="-22" r="7" fill="var(--sc-frame-dark)" />

      {/* Frame */}
      <rect x="0" y="0" width="490" height="345" rx="14" fill="var(--sc-frame)" />
      <rect x={g.x} y={g.y} width={g.width} height={g.height} rx="8" fill="url(#windowSky)" />

      <g clipPath="url(#windowGlass)">
        {/* Sun / moon */}
        {isDay && <circle cx="380" cy="80" r="26" fill="#fff4c8" opacity="0.95" />}
        {sky === "sunset" && <circle cx="120" cy="250" r="34" fill="#ffd57a" opacity="0.9" />}
        {sky === "dawn" && <circle cx="360" cy="240" r="30" fill="#fff0c2" opacity="0.9" />}
        {isNight && (
          <g>
            <circle cx="380" cy="80" r="24" fill="#f5efd6" />
            <circle cx="390" cy="72" r="20" fill={colors.top} opacity="0.9" />
            {STARS.map(([x, y], i) => (
              <circle key={i} cx={x + 14} cy={y + 14} r={i % 3 === 0 ? 1.8 : 1.2} fill="#fff8e1" opacity="0.9" />
            ))}
          </g>
        )}

        {/* Clouds (static for now; drift in Phase 4) */}
        <g fill="#ffffff" opacity={isNight ? 0.12 : 0.75}>
          <ellipse cx="110" cy="110" rx="46" ry="16" />
          <ellipse cx="135" cy="100" rx="30" ry="18" />
          <ellipse cx="300" cy="150" rx="56" ry="17" />
          <ellipse cx="320" cy="140" rx="34" ry="20" />
        </g>

        {/* Distant skyline */}
        <g fill="var(--sc-skyline)" opacity="0.65">
          {BUILDINGS.map(([x, h, w], i) => (
            <rect key={i} x={x + 14} y={g.y + g.height - h} width={w} height={h} rx="2" />
          ))}
        </g>
        {isNight && (
          <g fill="#ffd784" opacity="0.8">
            {BUILDINGS.map(([x, h, w], i) => (
              <g key={i}>
                <rect x={x + 20} y={g.y + g.height - h + 10} width="4" height="5" />
                <rect x={x + w} y={g.y + g.height - h + 24} width="4" height="5" />
              </g>
            ))}
          </g>
        )}
        {/* Glass sheen */}
        <polygon points="40,14 150,14 60,331 14,331" fill="var(--sc-highlight)" opacity="0.5" />
      </g>

      {/* Mullions */}
      <rect x="240" y="14" width="10" height="317" fill="var(--sc-frame)" />
      <rect x="14" y="168" width="462" height="10" fill="var(--sc-frame)" />

      {/* Sill */}
      <rect x="-16" y="345" width="522" height="22" rx="5" fill="var(--sc-frame-dark)" />
      <rect x="-16" y="345" width="522" height="6" rx="3" fill="var(--sc-highlight)" />
      <rect x="-10" y="367" width="510" height="14" fill="var(--sc-shadow)" opacity="0.5" />
    </g>
  );
}

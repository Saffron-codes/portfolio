/** Desk monitor showing a tiny desktop. Size: 280 × 217. */
export const MONITOR_SIZE = { width: 280, height: 217 };
export const MONITOR_SCREEN = { x: 10, y: 10, width: 260, height: 160 };

export default function Monitor(props) {
  const s = MONITOR_SCREEN;
  return (
    <g {...props}>
      <defs>
        <linearGradient id="monitorWallpaper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b6d8a" />
          <stop offset="1" stopColor="#5a4b8a" />
        </linearGradient>
        <radialGradient id="monitorGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#9bb8ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#9bb8ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="100" rx="250" ry="170" fill="url(#monitorGlow)" style={{ opacity: "var(--sc-screen-glow)" }} />
      <ellipse cx="140" cy="214" rx="90" ry="7" fill="var(--sc-shadow)" />

      {/* Stand */}
      <rect x="80" y="204" width="120" height="12" rx="6" fill="var(--sc-device-dark)" />
      <rect x="125" y="176" width="30" height="32" fill="var(--sc-device-dark)" />
      {/* Bezel + screen */}
      <rect x="0" y="0" width="280" height="180" rx="10" fill="var(--sc-device-dark)" />
      <rect x={s.x} y={s.y} width={s.width} height={s.height} rx="4" fill="url(#monitorWallpaper)" />
      {/* Decorative windows */}
      <g>
        <rect x="32" y="30" width="118" height="78" rx="4" fill="#f4f1ea" opacity="0.95" />
        <rect x="32" y="30" width="118" height="12" rx="4" fill="#d9d4c7" />
        <rect x="40" y="50" width="60" height="5" rx="2.5" fill="#9aa3ad" />
        <rect x="40" y="60" width="90" height="4" rx="2" fill="#c3c9cf" />
        <rect x="40" y="68" width="76" height="4" rx="2" fill="#c3c9cf" />
        <rect x="40" y="82" width="36" height="12" rx="3" fill="var(--sc-accent)" />
        <rect x="160" y="54" width="96" height="62" rx="4" fill="#f4f1ea" opacity="0.95" />
        <rect x="160" y="54" width="96" height="12" rx="4" fill="#d9d4c7" />
        <rect x="168" y="74" width="80" height="26" rx="3" fill="#b9d6cf" />
        <rect x="168" y="104" width="50" height="4" rx="2" fill="#c3c9cf" />
      </g>
      {/* Taskbar */}
      <rect x={s.x} y={s.y + s.height - 14} width={s.width} height="14" fill="#1f2535" opacity="0.85" />
      <circle cx="30" cy="163" r="4" fill="#89ddff" />
      <rect x="42" y="159" width="8" height="8" rx="2" fill="#c3e88d" />
      <rect x="56" y="159" width="8" height="8" rx="2" fill="#f78c6c" />
      <circle cx="140" cy="4" r="1.8" fill="#161820" />
      <circle cx="262" cy="175" r="1.6" fill="#7bdc8e" />
    </g>
  );
}

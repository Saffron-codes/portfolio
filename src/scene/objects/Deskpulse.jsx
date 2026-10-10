/** Deskpulse smart desk display. Size: 130 × 94. Screen content becomes a live overlay in Phase 4. */
export const DESKPULSE_SIZE = { width: 130, height: 94 };
export const DESKPULSE_SCREEN = { x: 8, y: 8, width: 114, height: 60 };

export default function Deskpulse(props) {
  const s = DESKPULSE_SCREEN;
  return (
    <g {...props}>
      <defs>
        <radialGradient id="deskpulseGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd28a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="65" cy="40" rx="120" ry="80" fill="url(#deskpulseGlow)" style={{ opacity: "var(--sc-screen-glow)" }} />
      <ellipse cx="65" cy="93" rx="42" ry="5" fill="var(--sc-shadow)" />
      <rect x="35" y="86" width="60" height="7" rx="3.5" fill="var(--sc-device-dark)" />
      <rect x="52" y="76" width="26" height="12" fill="var(--sc-device-dark)" />
      <rect x="0" y="0" width="130" height="80" rx="10" fill="var(--sc-device-dark)" />
      <rect x={s.x} y={s.y} width={s.width} height={s.height} rx="5" fill="#0f1724" />
      {/* Placeholder dashboard: clock block, weather dot, status line */}
      <rect x={s.x + 8} y={s.y + 10} width="52" height="18" rx="4" fill="#ffd98a" opacity="0.9" />
      <circle cx={s.x + 92} cy={s.y + 19} r="9" fill="var(--sc-amber)" />
      <rect x={s.x + 8} y={s.y + 36} width="80" height="5" rx="2.5" fill="#7fa89a" opacity="0.9" />
      <rect x={s.x + 8} y={s.y + 46} width="48" height="4" rx="2" fill="#4c5a6b" />
      <circle cx="65" cy="74" r="1.8" fill="#7bdc8e" />
    </g>
  );
}

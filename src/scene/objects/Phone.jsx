/** Phone standing in a dock, showing a chat app. Size: 72 × 158. */
export const PHONE_SIZE = { width: 72, height: 158 };
export const PHONE_SCREEN = { x: 5, y: 8, width: 62, height: 134 };

export default function Phone(props) {
  const s = PHONE_SCREEN;
  return (
    <g {...props}>
      <defs>
        <radialGradient id="phoneGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#b7ffe9" stopOpacity="0.45" />
          <stop offset="1" stopColor="#b7ffe9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="36" cy="75" rx="110" ry="110" fill="url(#phoneGlow)" style={{ opacity: "var(--sc-screen-glow)" }} />
      <ellipse cx="36" cy="158" rx="46" ry="5" fill="var(--sc-shadow)" />
      {/* Dock */}
      <rect x="-8" y="142" width="88" height="16" rx="5" fill="var(--sc-device-2)" />
      {/* Body */}
      <rect x="0" y="0" width="72" height="150" rx="12" fill="var(--sc-device-dark)" />
      <rect x={s.x} y={s.y} width={s.width} height={s.height} rx="8" fill="#f6f9f8" />
      {/* App bar */}
      <rect x={s.x} y={s.y} width={s.width} height="18" rx="8" fill="var(--sc-accent)" />
      <rect x={s.x} y={s.y + 10} width={s.width} height="8" fill="var(--sc-accent)" />
      <circle cx={s.x + 10} cy={s.y + 9} r="4" fill="#ffffff" opacity="0.9" />
      <rect x={s.x + 18} y={s.y + 7} width="24" height="4" rx="2" fill="#ffffff" opacity="0.9" />
      {/* Bubbles */}
      <rect x={s.x + 5} y={s.y + 28} width="38" height="14" rx="6" fill="#dfe9e6" />
      <rect x={s.x + 19} y={s.y + 48} width="38" height="14" rx="6" fill="var(--sc-accent)" />
      <rect x={s.x + 5} y={s.y + 68} width="30" height="14" rx="6" fill="#dfe9e6" />
      <rect x={s.x + 5} y={s.y + 90} width="20" height="10" rx="5" fill="var(--sc-accent)" opacity="0.5" />
      <rect x={s.x + 29} y={s.y + 90} width="20" height="10" rx="5" fill="var(--sc-accent)" opacity="0.5" />
      {/* Input bar */}
      <rect x={s.x + 4} y={s.y + s.height - 16} width="54" height="11" rx="5.5" fill="#e4ebe9" />
      <circle cx={s.x + 52} cy={s.y + s.height - 10.5} r="4" fill="var(--sc-accent)" />
      {/* Notch */}
      <rect x="26" y="4" width="20" height="4" rx="2" fill="#161820" />
    </g>
  );
}

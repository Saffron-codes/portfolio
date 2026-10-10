/** Coffee mug with steam (animated in Phase 4). Size: 72 × 72, steam rises above y=0. */
export const MUG_SIZE = { width: 72, height: 72 };

export default function Mug(props) {
  return (
    <g {...props}>
      <ellipse cx="30" cy="70" rx="30" ry="4" fill="var(--sc-shadow)" />
      {/* Steam */}
      <g fill="none" stroke="var(--sc-steam)" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M18 18 c -6 -8 6 -14 0 -22" />
        <path d="M30 14 c -6 -8 6 -14 0 -22" />
        <path d="M42 18 c -6 -8 6 -14 0 -22" />
      </g>
      {/* Handle */}
      <path d="M56 36 c 16 0 16 24 0 24" fill="none" stroke="var(--sc-mug)" strokeWidth="8" strokeLinecap="round" />
      {/* Body */}
      <rect x="4" y="24" width="52" height="46" rx="8" fill="var(--sc-mug)" />
      <rect x="4" y="24" width="12" height="46" rx="6" fill="var(--sc-highlight)" opacity="0.5" />
      <ellipse cx="30" cy="24" rx="26" ry="6" fill="var(--sc-mug-2)" />
      <ellipse cx="30" cy="24" rx="21" ry="4" fill="#4a2c1d" />
      <ellipse cx="33" cy="23" rx="8" ry="1.6" fill="#7a4b32" opacity="0.8" />
      {/* Little heart */}
      <path d="M30 50 l -6 -6 a 4 4 0 0 1 6 -6 a 4 4 0 0 1 6 6 z" fill="#fff" opacity="0.6" />
    </g>
  );
}

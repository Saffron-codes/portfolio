/** Mouse (follows the cursor in Phase 4). Size: 44 × 64. */
export const MOUSE_SIZE = { width: 44, height: 64 };

export default function Mouse(props) {
  return (
    <g {...props}>
      <ellipse cx="22" cy="62" rx="22" ry="4" fill="var(--sc-shadow)" />
      <path d="M22 0 C 40 0 44 20 44 36 C 44 54 36 62 22 62 C 8 62 0 54 0 36 C 0 20 4 0 22 0 Z" fill="var(--sc-device)" />
      <path d="M22 0 C 40 0 44 20 44 36 L 0 36 C 0 20 4 0 22 0 Z" fill="var(--sc-highlight)" opacity="0.5" />
      <line x1="22" y1="4" x2="22" y2="30" stroke="var(--sc-device-2)" strokeWidth="1.5" />
      <rect x="19" y="12" width="6" height="12" rx="3" fill="var(--sc-device-dark)" opacity="0.7" />
      {/* Cable */}
      <path d="M22 0 C 22 -14 40 -14 44 -30" fill="none" stroke="var(--sc-device-dark)" strokeWidth="2" opacity="0.5" />
    </g>
  );
}

/** Sleeping cat curled up on the windowsill. Size: 90 × 50. */
export const CAT_SIZE = { width: 90, height: 50 };

export default function Cat(props) {
  return (
    <g {...props}>
      <ellipse cx="45" cy="47" rx="42" ry="5" fill="var(--sc-shadow)" />
      {/* Tail wrapped around the front */}
      <path d="M8 36 C -6 36 -4 50 14 48 L 60 48" fill="none" stroke="var(--sc-cat-2)" strokeWidth="9" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="42" cy="32" rx="40" ry="17" fill="var(--sc-cat)" />
      {/* Stripes */}
      <path d="M28 18 q4 8 0 16 M40 16 q4 9 0 18 M52 17 q4 8 0 16" fill="none" stroke="var(--sc-cat-2)" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
      {/* Head */}
      <circle cx="72" cy="28" r="15" fill="var(--sc-cat)" />
      <polygon points="60,18 63,4 72,15" fill="var(--sc-cat)" />
      <polygon points="84,18 81,4 72,15" fill="var(--sc-cat)" />
      <polygon points="62,17 64,8 70,15" fill="var(--sc-cat-2)" opacity="0.7" />
      <polygon points="82,17 80,8 74,15" fill="var(--sc-cat-2)" opacity="0.7" />
      {/* Closed eyes + nose */}
      <path d="M64 29 q3 3 6 0 M74 29 q3 3 6 0" fill="none" stroke="var(--sc-ink)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="72" cy="34" r="1.6" fill="var(--sc-ink)" opacity="0.7" />
      {/* Paws */}
      <ellipse cx="56" cy="46" rx="7" ry="4" fill="var(--sc-cat)" />
      <ellipse cx="66" cy="46" rx="7" ry="4" fill="var(--sc-cat)" />
      {/* zzz */}
      <text x="84" y="10" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="var(--sc-accent)" opacity="0.8" aria-hidden="true">
        z
      </text>
      <text x="91" y="2" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" fill="var(--sc-accent)" opacity="0.6" aria-hidden="true">
        z
      </text>
    </g>
  );
}

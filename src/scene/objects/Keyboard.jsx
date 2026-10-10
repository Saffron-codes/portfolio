/** Keyboard. Keys are generated per row so Phase 3 can map skill groups onto them. Size: 340 × 62. */
export const KEYBOARD_SIZE = { width: 340, height: 62 };

const KEY = 9;
const PITCH = 11.5;
const ROWS = [
  { y: 8, x: 8, count: 28 },
  { y: 20, x: 12, count: 27 },
  { y: 32, x: 16, count: 25 },
];

export function keyboardKeys() {
  const keys = [];
  ROWS.forEach((row, r) => {
    for (let i = 0; i < row.count; i += 1) {
      keys.push({ id: `r${r}k${i}`, x: row.x + i * PITCH, y: row.y, w: KEY, h: KEY });
    }
  });
  // Bottom row: 3 modifiers, space bar, 3 modifiers.
  const y = 44;
  [8, 21, 34].forEach((x, i) => keys.push({ id: `r3l${i}`, x, y, w: 11, h: KEY }));
  keys.push({ id: "space", x: 48, y, w: 190, h: KEY });
  [241, 254, 267].forEach((x, i) => keys.push({ id: `r3r${i}`, x, y, w: 11, h: KEY }));
  [282, 295, 308, 321].forEach((x, i) => keys.push({ id: `r3a${i}`, x, y, w: 11, h: KEY }));
  return keys;
}

const KEYS = keyboardKeys();

export default function Keyboard(props) {
  return (
    <g {...props}>
      <rect x="4" y="6" width="340" height="60" rx="8" fill="var(--sc-shadow)" />
      <rect x="0" y="0" width="340" height="62" rx="8" fill="var(--sc-device)" />
      <rect x="0" y="0" width="340" height="4" rx="2" fill="var(--sc-highlight)" />
      {KEYS.map((k) => (
        <rect key={k.id} x={k.x} y={k.y} width={k.w} height={k.h} rx="2" fill="var(--sc-key)" />
      ))}
      {/* A few accent keys */}
      <rect x={8 + 27 * PITCH} y="8" width={KEY} height={KEY} rx="2" fill="var(--sc-accent)" opacity="0.8" />
      <rect x="321" y="44" width="11" height={KEY} rx="2" fill="var(--sc-amber)" opacity="0.8" />
    </g>
  );
}

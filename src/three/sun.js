/** Sun position for a Chennai hour: rises on the right of the window, peaks high, sets on the left. */
export function sunPositionFor(hour) {
  if (hour < 5.5 || hour > 18.5) return [0.6, 2.4, -2.4];
  const t = (hour - 5.5) / 13; // 0 at dawn → 1 at dusk
  const elevation = Math.sin(t * Math.PI); // 0 → 1 → 0
  const x = 2.6 - t * 5.2;
  const y = 0.9 + elevation * 3.4;
  return [x, y, -2.4];
}

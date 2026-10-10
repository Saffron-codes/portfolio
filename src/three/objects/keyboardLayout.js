/**
 * 75% keyboard layout. Units: 1u = 19.05 mm. Rows run back (F row) to front.
 * `kind`: "letter" (black) or "mod" (lavender). `w` is the key width in units.
 */
export const U = 0.01905;

const ROWS = [
  [["Esc", 1, "mod"], ...["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].map((k) => [k, 1, "letter"]), ["Del", 1, "mod"]],
  [["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1], ["7", 1], ["8", 1], ["9", 1], ["0", 1], ["-", 1], ["=", 1], ["Backspace", 2, "mod"], ["Home", 1, "mod"]],
  [["Tab", 1.5, "mod"], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1], ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["[", 1], ["]", 1], ["\\", 1.5], ["PgUp", 1, "mod"]],
  [["Caps", 1.75, "mod"], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1], ["J", 1], ["K", 1], ["L", 1], [";", 1], ["'", 1], ["Enter", 2.25, "mod"], ["PgDn", 1, "mod"]],
  [["Shift", 2.25, "mod"], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1], ["M", 1], [",", 1], [".", 1], ["/", 1], ["Shift", 1.75, "mod"], ["Up", 1, "mod"], ["End", 1, "mod"]],
  [["Ctrl", 1.25, "mod"], ["Win", 1.25, "mod"], ["Alt", 1.25, "mod"], ["Space", 6.25], ["Alt", 1, "mod"], ["Fn", 1, "mod"], ["Ctrl", 1, "mod"], ["Left", 1, "mod"], ["Down", 1, "mod"], ["Right", 1, "mod"]],
];

export const CASE = { width: 0.32, depth: 0.135, height: 0.026 };
export const KEY = { height: 0.009, gap: 0.0015 };

/** All keys with centre positions (x, z) relative to the keyboard origin. */
export const KEYS = (() => {
  const keys = [];
  const marginX = (CASE.width - 16 * U) / 2;
  const z0 = -CASE.depth / 2 + (CASE.depth - 6 * U) / 2 + U / 2;
  ROWS.forEach((row, r) => {
    let cursor = -CASE.width / 2 + marginX;
    row.forEach(([label, w, kind = "letter"]) => {
      // Right-hand nav column on rows 0–4 is pushed to the far right edge.
      const isNav = ["Del", "Home", "PgUp", "PgDn", "End"].includes(label) || (label === "Up" && r === 4);
      if (isNav && label !== "Up") cursor = CASE.width / 2 - marginX - U;
      if (label === "Up") cursor = CASE.width / 2 - marginX - 2 * U;
      keys.push({
        id: `${r}-${keys.length}`,
        label,
        kind,
        row: r,
        w: w * U - KEY.gap,
        d: U - KEY.gap,
        x: cursor + (w * U) / 2,
        z: z0 + r * U,
      });
      cursor += w * U;
    });
  });
  return keys;
})();

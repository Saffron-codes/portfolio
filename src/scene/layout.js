/**
 * Scene coordinate space is 1600 × 900 (see Scene.jsx viewBox).
 * Each entry is the top-left origin of that object's component.
 * Keep important objects inside x 100–1500 and y 60–860 so "slice" scaling
 * never crops them on common aspect ratios.
 */
export const VIEWBOX = { width: 1600, height: 900 };

/**
 * ViewBox for a given viewport aspect ratio, always keeping the full desk width.
 * Wider than 16:9 crops mostly floor (little from the top); narrower reveals
 * more wall above and a little floor below instead of cropping the sides.
 */
export function viewBoxFor(width, height) {
  const aspect = width > 0 && height > 0 ? width / height : 16 / 9;
  const h = Math.round(VIEWBOX.width / aspect);
  const y = h >= VIEWBOX.height
    ? -Math.round((h - VIEWBOX.height) * 0.7)
    : Math.round((VIEWBOX.height - h) * 0.35);
  return `0 ${y} ${VIEWBOX.width} ${h}`;
}

export const DESK = { x: 80, y: 520, width: 1440, top: 140, edge: 42 };

export const layout = {
  window: { x: 560, y: 55 },
  cat: { x: 605, y: 352 },
  neonSign: { x: 50, y: 95 },
  certificate: { x: 1140, y: 150 },
  lamp: { x: 140, y: 325 },
  laptop: { x: 320, y: 390 },
  monitor: { x: 690, y: 358 },
  phone: { x: 1000, y: 420 },
  deskpulse: { x: 1100, y: 481 },
  plant: { x: 1290, y: 385 },
  notebook: { x: 340, y: 590 },
  keyboard: { x: 620, y: 598 },
  mouse: { x: 980, y: 598 },
  mug: { x: 1075, y: 565 },
  paperTray: { x: 1180, y: 590 },
};

/** Absolute scene-space rect for an object's screen/page, for HTML overlays. */
export function absoluteRect(key, localRect) {
  const origin = layout[key];
  return { x: origin.x + localRect.x, y: origin.y + localRect.y, width: localRect.width, height: localRect.height };
}

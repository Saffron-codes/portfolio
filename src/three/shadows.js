/**
 * The shadow map is frozen (renderer.shadowMap.autoUpdate = false) and re-rendered only
 * on request: at load, when the sun moves (time-of-day), or when an object animates.
 * This is effectively a baked shadow with no per-frame cost.
 */
let pendingFrames = 0;

export function requestShadowUpdate(frames = 2) {
  pendingFrames = Math.max(pendingFrames, frames);
}

/** Called once per frame by ShadowSetup; returns true when the map should render this frame. */
export function consumeShadowFrame() {
  if (pendingFrames <= 0) return false;
  pendingFrames -= 1;
  return true;
}

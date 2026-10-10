/**
 * Shared state for the portfolio ⇄ desk transition.
 * - opening: the desk card has just expanded; DeskView shows the poster until the 3D is ready
 *   and the camera starts from the preview's current angle before gliding to the default view.
 * - returning: the desk is closing; the desk card plays the shrink-back animation on mount.
 * - azimuth: the preview camera's current yaw offset (radians) from the default view.
 */
export const handoff = { opening: false, returning: false, azimuth: 0 };

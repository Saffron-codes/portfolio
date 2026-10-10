import * as THREE from "three";
import { anchors } from "./registry";

/** Default view: standing just behind and above the chair. */
// Standing on the floor strip between the chair and the bed.
export const DEFAULT_POSE = { position: [0, 1.36, 1.3], target: [0.05, 1.0, -0.2] };

/** Sitting in the chair: eyes at the chair, looking at the monitor. */
export const SEATED_POSE = { position: [0, 1.17, 0.6], target: [-0.05, 1.02, -0.17] };

/** Phones: a fixed view framed tighter on the desk (no orbit, so it never fights scrolling). */
export const MOBILE_POSE = { position: [0.08, 1.38, 0.95], target: [0.08, 0.92, -0.15] };

/**
 * Per-object framing. `distance` is how far the camera sits from the panel anchor along its
 * normal; `tilt` (radians) leans the view toward the chair for flat, face-up panels so the
 * camera never looks straight down. `lift` nudges the target up a little.
 */
export const FOCUS = {
  monitor: { distance: 0.56 },
  laptop: { distance: 0.42 },
  keyboard: { distance: 0.4, tilt: 0.25 },
  phone: { distance: 0.3, tilt: 0.25 },
  notebook: { distance: 0.38, tilt: 0.25 },
  deskpulse: { distance: 0.32, tilt: 0.1 },
  certificate: { distance: 0.4 },
  window: { distance: 1.45, lift: 0.05 },
};

const up = new THREE.Vector3(0, 1, 0);

/** Camera position + target for an object's panel, computed from its live anchor transform. */
export function poseFor(name) {
  const anchor = anchors.get(name);
  const focus = FOCUS[name];
  if (!anchor || !focus) return null;
  anchor.updateWorldMatrix(true, false);
  const center = anchor.getWorldPosition(new THREE.Vector3());
  const normal = new THREE.Vector3(0, 0, 1).transformDirection(anchor.matrixWorld).normalize();
  let direction = normal;
  if (focus.tilt && Math.abs(normal.dot(up)) > 0.6) {
    // Face-up panel: look from above, leaning toward the chair (+z).
    direction = new THREE.Vector3(0, Math.cos(focus.tilt), Math.sin(focus.tilt)).normalize();
  }
  const position = center.clone().addScaledVector(direction, focus.distance);
  const target = center.clone();
  if (focus.lift) target.y += focus.lift;
  return { position: position.toArray(), target: target.toArray() };
}

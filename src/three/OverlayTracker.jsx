import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { anchors, overlay } from "./registry";

const corner = new THREE.Vector3();
const topLeft = new THREE.Vector2();
const topRight = new THREE.Vector2();

function project(anchor, x, y, camera, size, out) {
  corner.set(x, y, 0);
  anchor.localToWorld(corner);
  corner.project(camera);
  out.set(((corner.x + 1) / 2) * size.width, ((1 - corner.y) / 2) * size.height);
}

/**
 * Every frame, projects the active panel anchor's top edge to screen space and pins the DOM
 * overlay to it: translate to the top-left corner, rotate to match the edge, scale from the
 * panel's design width. Runs inside the Canvas.
 */
export default function OverlayTracker() {
  useFrame(({ camera, size }) => {
    const el = overlay.el;
    const anchor = overlay.name ? anchors.get(overlay.name) : null;
    if (!el || !anchor) return;
    const { width, height } = anchor.userData.panel;
    anchor.updateWorldMatrix(true, false);
    project(anchor, -width / 2, height / 2, camera, size, topLeft);
    project(anchor, width / 2, height / 2, camera, size, topRight);
    const dx = topRight.x - topLeft.x;
    const dy = topRight.y - topLeft.y;
    const edge = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const scale = edge / overlay.design.width;
    el.style.transform = `translate(${topLeft.x.toFixed(1)}px, ${topLeft.y.toFixed(1)}px) rotate(${angle.toFixed(4)}rad) scale(${scale.toFixed(4)})`;
  });
  return null;
}

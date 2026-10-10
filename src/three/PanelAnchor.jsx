import { useEffect, useRef } from "react";
import { anchors } from "./registry";

/**
 * Invisible marker for where an object's content panel sits: a `width` × `height` rect in the
 * local XY plane, facing +Z. Objects place one on their screen or page; the camera rig flies to
 * it and the DOM overlay is pinned to its projected rectangle.
 */
export default function PanelAnchor({ name, width, height, position, rotation }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    node.userData.panel = { width, height };
    anchors.set(name, node);
    return () => {
      if (anchors.get(name) === node) anchors.delete(name);
    };
  }, [name, width, height]);
  return <group ref={ref} position={position} rotation={rotation} />;
}

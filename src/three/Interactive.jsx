import { useEffect, useRef } from "react";
import { Html } from "@react-three/drei";
import { useInteraction } from "./InteractionContext";

/**
 * Makes a desk object clickable: hover glow + floating label, pointer cursor, click → select.
 * Wraps the object's group; the geometry inside knows nothing about interaction.
 */
export default function Interactive({ name, label, labelOffset = [0, 0.3, 0], children, ...props }) {
  const { hovered, active, setHovered, select } = useInteraction();
  const group = useRef(null);
  const isHovered = hovered === name && !active;

  // Soft emissive lift on every lit material in the object while hovered.
  useEffect(() => {
    if (!isHovered || !group.current) return undefined;
    const saved = [];
    group.current.traverse((object) => {
      const material = object.material;
      if (!object.isMesh || !material?.emissive || material.emissiveMap || object.userData.noHighlight) return;
      saved.push([material, material.emissive.getHex(), material.emissiveIntensity]);
      material.emissive.set("#ffd9a0");
      material.emissiveIntensity = 0.22;
    });
    document.body.style.cursor = "pointer";
    return () => {
      saved.forEach(([material, hex, intensity]) => {
        material.emissive.setHex(hex);
        material.emissiveIntensity = intensity;
      });
      document.body.style.cursor = "";
    };
  }, [isHovered]);

  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (!active) setHovered(name);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered((current) => (current === name ? null : current));
      }}
      onClick={(event) => {
        event.stopPropagation();
        select(name);
      }}
    >
      {children}
      {isHovered && (
        <Html position={labelOffset} center zIndexRange={[40, 0]} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full bg-ink/85 px-3 py-1 text-sm font-medium text-cream shadow-lg backdrop-blur dark:bg-cream/90 dark:text-ink">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

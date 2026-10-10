import { RoundedBox } from "@react-three/drei";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
export const PHONE_SCREEN = { width: 0.069, height: 0.152 };

/** Black phone lying flat, screen off (wakes in Phase 5). */
export default function Phone({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <RoundedBox args={[0.075, 0.008, 0.16]} radius={0.004} smoothness={4} position={[0, 0.004, 0]} castShadow>
        <meshStandardMaterial color="#121212" roughness={0.4} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.0081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PHONE_SCREEN.width, PHONE_SCREEN.height]} />
        <meshStandardMaterial
          color={active ? "#e8f3f0" : "#05060a"}
          emissive={active ? "#e8f3f0" : "#000000"}
          emissiveIntensity={active ? 0.6 : 0}
          roughness={0.12}
          metalness={0.3}
        />
      </mesh>
      <PanelAnchor name={name} width={PHONE_SCREEN.width} height={PHONE_SCREEN.height} position={[0, 0.0086, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

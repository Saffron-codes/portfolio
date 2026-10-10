import { RoundedBox } from "@react-three/drei";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
// Galaxy S24: 147 × 70.6 × 7.6 mm, flat sides, small corner radius.
const W = 0.0706;
const D = 0.147;
const H = 0.0076;
export const PHONE_SCREEN = { width: 0.066, height: 0.141 };

/** Samsung Galaxy S24 lying face up, screen off until Contact opens. */
export default function Phone({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      {/* Flat aluminium frame */}
      <RoundedBox args={[W, H - 0.0008, D]} radius={0.0045} smoothness={4} position={[0, (H - 0.0008) / 2, 0]} castShadow>
        <meshStandardMaterial color="#3a3d44" roughness={0.35} metalness={0.8} />
      </RoundedBox>
      {/* Glass back/front body slightly inset */}
      <RoundedBox args={[W - 0.001, H, D - 0.001]} radius={0.0042} smoothness={4} position={[0, H / 2, 0]}>
        <meshStandardMaterial color="#0e0f12" roughness={0.25} metalness={0.1} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, H + 0.0002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PHONE_SCREEN.width, PHONE_SCREEN.height]} />
        <meshStandardMaterial
          color={active ? "#e8f3f0" : "#05060a"}
          emissive={active ? "#e8f3f0" : "#000000"}
          emissiveIntensity={active ? 0.6 : 0}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Punch-hole selfie camera, top centre */}
      <mesh position={[0, H + 0.0004, -D / 2 + 0.008]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.0016, 12]} />
        <meshStandardMaterial color="#000" roughness={0.3} />
      </mesh>
      {/* Side buttons on the right edge */}
      <mesh position={[W / 2 + 0.0004, H / 2, -0.028]}>
        <boxGeometry args={[0.0008, 0.0025, 0.012]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.35} metalness={0.8} />
      </mesh>
      <mesh position={[W / 2 + 0.0004, H / 2, -0.008]}>
        <boxGeometry args={[0.0008, 0.0025, 0.022]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.35} metalness={0.8} />
      </mesh>
      <PanelAnchor name={name} width={PHONE_SCREEN.width} height={PHONE_SCREEN.height} position={[0, H + 0.0006, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

import { RoundedBox } from "@react-three/drei";

/* eslint-disable no-unused-vars */
/** Small black rounded zip case with a metal carabiner loop. */
export default function EarbudsCase({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <RoundedBox args={[0.07, 0.03, 0.07]} radius={0.012} smoothness={4} position={[0, 0.015, 0]} castShadow>
        <meshStandardMaterial color="#161616" roughness={0.8} />
      </RoundedBox>
      {/* Zip around the lid */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.028, 0.0305, 4, 1]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* realme-yellow zip pull */}
      <mesh position={[0.03, 0.026, 0.012]}>
        <boxGeometry args={[0.012, 0.0025, 0.004]} />
        <meshStandardMaterial color="#f5d400" roughness={0.5} />
      </mesh>
      {/* Carabiner */}
      <group position={[0.04, 0.006, 0.03]} rotation={[Math.PI / 2, 0, 0.6]}>
        <mesh>
          <torusGeometry args={[0.013, 0.0022, 8, 24]} />
          <meshStandardMaterial color="#c0c4c8" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

import { STEEL } from "../materials";

/* eslint-disable no-unused-vars */
/** Brushed steel tin r 0.045, h 0.12, with a slotted lid. */
export default function SteelTin({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <mesh position={[0, 0.056, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.112, 32]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0, 0.116, 0]} castShadow>
        <cylinderGeometry args={[0.047, 0.047, 0.008, 32]} />
        <meshStandardMaterial {...STEEL} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.1205, 0]}>
        <boxGeometry args={[0.034, 0.001, 0.005]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>
      {/* Seam */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.0455, 0.0455, 0.003, 32]} />
        <meshStandardMaterial color="#8d9094" roughness={0.4} metalness={0.9} />
      </mesh>
    </group>
  );
}

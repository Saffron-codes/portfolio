/* eslint-disable no-unused-vars */
/** Navy zip capsule 0.17 × 0.065 × 0.05. */
export default function GlassesCase({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <group position={[0, 0.025, 0]} scale={[1, 0.78, 1]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.032, 0.105, 6, 16]} />
          <meshStandardMaterial color="#1f2a4a" roughness={0.75} />
        </mesh>
      </group>
      {/* Zip */}
      <mesh position={[0, 0.0495, 0]}>
        <boxGeometry args={[0.16, 0.0015, 0.004]} />
        <meshStandardMaterial color="#8a8f9a" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0.07, 0.047, 0.006]}>
        <boxGeometry args={[0.012, 0.003, 0.006]} />
        <meshStandardMaterial color="#8a8f9a" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}

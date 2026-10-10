/* eslint-disable no-unused-vars */
const W = 0.148;
const D = 0.21;
const H = 0.015;

/** A5 notebook: teal cloth cover, cream page block, black elastic band. */
export default function Notebook({ name, onSelect, hovered, active, ...props }) {
  const cover = <meshStandardMaterial color="#2e6b6b" roughness={0.92} />;
  return (
    <group name={name} {...props}>
      <mesh position={[0, 0.0015, 0]} castShadow>
        <boxGeometry args={[W, 0.003, D]} />
        {cover}
      </mesh>
      <mesh position={[0, H - 0.0015, 0]} castShadow>
        <boxGeometry args={[W, 0.003, D]} />
        {cover}
      </mesh>
      <mesh position={[-W / 2 + 0.003, H / 2, 0]} castShadow>
        <boxGeometry args={[0.006, H, D]} />
        {cover}
      </mesh>
      {/* Pages */}
      <mesh position={[0.002, H / 2, 0]}>
        <boxGeometry args={[W - 0.008, H - 0.006, D - 0.006]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.95} />
      </mesh>
      {/* Elastic band */}
      <mesh position={[W / 2 - 0.028, H / 2, 0]}>
        <boxGeometry args={[0.006, H + 0.0012, D + 0.0012]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
    </group>
  );
}

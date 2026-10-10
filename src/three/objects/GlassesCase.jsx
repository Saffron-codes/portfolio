import { RoundedBox } from "@react-three/drei";

/* eslint-disable no-unused-vars */
const W = 0.16;
const H = 0.055;
const D = 0.068;

/** Lenskart-style hard spectacles case: navy rounded shell with a zip around the top. No logo. */
export default function GlassesCase({ name, onSelect, hovered, active, ...props }) {
  const zip = <meshStandardMaterial color="#8a8f9a" roughness={0.4} metalness={0.6} />;
  return (
    <group name={name} {...props}>
      <RoundedBox args={[W, H, D]} radius={0.02} smoothness={5} position={[0, H / 2, 0]} castShadow>
        <meshStandardMaterial color="#1f2a4a" roughness={0.8} />
      </RoundedBox>
      {/* Zip track around the top shell */}
      <mesh position={[0, H - 0.012, D / 2 - 0.006]}>
        <boxGeometry args={[W - 0.03, 0.0025, 0.003]} />
        {zip}
      </mesh>
      <mesh position={[0, H - 0.012, -D / 2 + 0.006]}>
        <boxGeometry args={[W - 0.03, 0.0025, 0.003]} />
        {zip}
      </mesh>
      <mesh position={[W / 2 - 0.006, H - 0.012, 0]}>
        <boxGeometry args={[0.003, 0.0025, D - 0.03]} />
        {zip}
      </mesh>
      {/* Zip pull */}
      <mesh position={[-W / 2 + 0.03, H - 0.011, D / 2 + 0.002]}>
        <boxGeometry args={[0.014, 0.003, 0.005]} />
        {zip}
      </mesh>
    </group>
  );
}

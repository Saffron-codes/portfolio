import { useMemo } from "react";
import { makeResumeSheet } from "../textures";
import profile from "../../data/profile";

/* eslint-disable no-unused-vars */
const W = 0.21;
const H = 0.297;

/** A4 resume under a binder clip, hanging from a small nail. Origin = sheet centre on the wall. */
export default function ResumeSheet({ name, onSelect, hovered, active, ...props }) {
  const sheet = useMemo(() => makeResumeSheet(profile), []);
  const metal = <meshStandardMaterial color="#c0c4c8" roughness={0.3} metalness={0.9} />;
  return (
    <group name={name} {...props}>
      <mesh position={[0, 0, 0.003]} rotation={[0.03, 0, 0]} castShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={sheet} roughness={0.95} />
      </mesh>
      {/* Binder clip */}
      <mesh position={[0, H / 2 - 0.008, 0.008]} castShadow>
        <boxGeometry args={[0.032, 0.016, 0.01]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      <mesh position={[-0.008, H / 2 + 0.006, 0.006]} rotation={[0, 0, 0.2]}>
        <torusGeometry args={[0.009, 0.0009, 6, 16]} />
        {metal}
      </mesh>
      <mesh position={[0.008, H / 2 + 0.006, 0.006]} rotation={[0, 0, -0.2]}>
        <torusGeometry args={[0.009, 0.0009, 6, 16]} />
        {metal}
      </mesh>
      {/* Nail */}
      <mesh position={[0, H / 2 + 0.014, 0.004]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.012, 8]} />
        {metal}
      </mesh>
    </group>
  );
}

import { useMemo } from "react";
import * as THREE from "three";
import { makePaisley } from "../textures";

/* eslint-disable no-unused-vars */
const PENS = [
  { color: "#1e3a8a", r: 0.0045, h: 0.15, x: 0.012, z: 0.008, tilt: [0.08, 0, -0.1] },
  { color: "#111111", r: 0.0045, h: 0.145, x: -0.014, z: 0.012, tilt: [0.1, 0, 0.12] },
  { color: "#b91c1c", r: 0.0042, h: 0.142, x: 0.004, z: -0.018, tilt: [-0.12, 0, 0.04] },
  { color: "#e8c547", r: 0.004, h: 0.165, x: -0.02, z: -0.008, tilt: [-0.05, 0, 0.16] },
  { color: "#5fa8d3", r: 0.0045, h: 0.148, x: 0.02, z: -0.004, tilt: [0.02, 0, -0.16] },
  { color: "#2b2b2b", r: 0.0042, h: 0.158, x: -0.004, z: 0.022, tilt: [0.16, 0, 0.02] },
  { color: "#f0a04b", r: 0.004, h: 0.16, x: 0.0, z: -0.002, tilt: [0, 0, 0.04] },
];

/** Clear acrylic pen holder wrapped in a paisley canvas, with pens, a box cutter and a screwdriver. */
export default function PenHolder({ name, onSelect, hovered, active, ...props }) {
  const paisley = useMemo(makePaisley, []);
  return (
    <group name={name} {...props}>
      {/* Printed canvas wrap */}
      <mesh position={[0, 0.055, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.11, 32, 1, true]} />
        <meshStandardMaterial map={paisley} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.001, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.002, 32]} />
        <meshStandardMaterial color="#3a1f45" roughness={0.9} />
      </mesh>
      {/* Clear acrylic outer wall, slightly taller than the wrap */}
      <mesh position={[0, 0.058, 0]} userData={{ noShadow: true }}>
        <cylinderGeometry args={[0.0425, 0.0425, 0.116, 32, 1, true]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.22} roughness={0.1} metalness={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Pens and pencils */}
      {PENS.map((pen, i) => (
        <group key={i} position={[pen.x, 0.012, pen.z]} rotation={pen.tilt}>
          <mesh position={[0, pen.h / 2, 0]} castShadow>
            <cylinderGeometry args={[pen.r, pen.r, pen.h, 10]} />
            <meshStandardMaterial color={pen.color} roughness={0.5} />
          </mesh>
          <mesh position={[0, pen.h + 0.006, 0]}>
            <coneGeometry args={[pen.r, 0.012, 10]} />
            <meshStandardMaterial color={pen.color === "#e8c547" ? "#d9b48a" : "#555"} roughness={0.5} />
          </mesh>
        </group>
      ))}
      {/* Yellow box cutter */}
      <group position={[-0.024, 0.012, 0.016]} rotation={[0.08, 0.6, 0.2]}>
        <mesh position={[0, 0.075, 0]} castShadow>
          <boxGeometry args={[0.016, 0.15, 0.009]} />
          <meshStandardMaterial color="#f5c518" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.154, 0]}>
          <boxGeometry args={[0.012, 0.014, 0.001]} />
          <meshStandardMaterial color="#c0c4c8" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
      {/* Screwdriver */}
      <group position={[0.026, 0.012, 0.018]} rotation={[-0.06, 0, -0.2]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.0025, 0.0025, 0.08, 8]} />
          <meshStandardMaterial color="#b9bcc0" roughness={0.3} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.105, 0]} castShadow>
          <cylinderGeometry args={[0.008, 0.007, 0.05, 12]} />
          <meshStandardMaterial color="#c62828" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

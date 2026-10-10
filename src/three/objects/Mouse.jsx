import { useMemo } from "react";
import * as THREE from "three";
import { BLACK_PLASTIC } from "../materials";

/* eslint-disable no-unused-vars */
/** Black rounded mouse ~0.062 × 0.115 × 0.035 with a cable to the back. */
export default function Mouse({ name, onSelect, hovered, active, ...props }) {
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.018, -0.05),
      new THREE.Vector3(0.01, 0.006, -0.12),
      new THREE.Vector3(-0.02, 0.002, -0.2),
      new THREE.Vector3(-0.04, 0.002, -0.3),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.002, 6, false);
  }, []);

  return (
    <group name={name} {...props}>
      <mesh position={[0, 0.012, 0]} scale={[0.031, 0.023, 0.0575]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial {...BLACK_PLASTIC} roughness={0.45} />
      </mesh>
      {/* Button split */}
      <mesh position={[0, 0.034, 0.02]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.0008, 0.002, 0.03]} />
        <meshStandardMaterial color="#000" roughness={1} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.031, 0.022]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.004, 16]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.6} />
      </mesh>
      <mesh geometry={cable}>
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
    </group>
  );
}

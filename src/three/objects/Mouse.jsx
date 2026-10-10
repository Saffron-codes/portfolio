import { useMemo } from "react";
import * as THREE from "three";
import { BLACK_PLASTIC } from "../materials";

/* eslint-disable no-unused-vars */
/** Dell office mouse: matte black, slightly flattened, grey scroll wheel, wired to the laptop. */
export default function Mouse({ name, onSelect, hovered, active, ...props }) {
  // Cable runs from the front of the mouse to the laptop's left-side port (world ≈ 0.23, 0.76, -0.06).
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.014, -0.052),
      new THREE.Vector3(0.012, 0.004, -0.12),
      new THREE.Vector3(0.03, 0.003, -0.19),
      new THREE.Vector3(0.04, 0.012, -0.23),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.0018, 6, false);
  }, []);

  return (
    <group name={name} {...props}>
      {/* Body: a flattened, elongated shell */}
      <mesh position={[0, 0.011, 0]} scale={[0.031, 0.021, 0.057]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial {...BLACK_PLASTIC} roughness={0.6} />
      </mesh>
      {/* Button split and wheel slot */}
      <mesh position={[0, 0.0305, 0.018]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.0008, 0.002, 0.03]} />
        <meshStandardMaterial color="#000" roughness={1} />
      </mesh>
      <mesh position={[0, 0.0275, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0055, 0.0055, 0.0045, 16]} />
        <meshStandardMaterial color="#6b6f75" roughness={0.6} />
      </mesh>
      <mesh geometry={cable}>
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
    </group>
  );
}

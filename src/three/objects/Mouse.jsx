import { useMemo } from "react";
import * as THREE from "three";

/* eslint-disable no-unused-vars */
// Dell MS116 (CN-05NT8R): 113 × 62 × 36 mm, a plump symmetric egg with a high rounded back.
/** Dell MS116 optical mouse, wired to the laptop's left-side port. */
export default function Mouse({ name, onSelect, hovered, active, ...props }) {
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.012, -0.054),
      new THREE.Vector3(0.012, 0.004, -0.12),
      new THREE.Vector3(0.03, 0.003, -0.19),
      new THREE.Vector3(0.04, 0.012, -0.23),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.0018, 6, false);
  }, []);
  const shell = <meshStandardMaterial color="#141414" roughness={0.65} metalness={0.02} />;

  return (
    <group name={name} {...props}>
      {/* Rounded body: a tall egg, fuller toward the back, flat where it meets the desk */}
      <mesh position={[0, 0.009, -0.004]} scale={[0.031, 0.027, 0.0565]} castShadow>
        <sphereGeometry args={[1, 28, 20]} />
        {shell}
      </mesh>
      <mesh position={[0, 0.012, 0.012]} scale={[0.0295, 0.0215, 0.046]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        {shell}
      </mesh>
      {/* Button split */}
      <mesh position={[0, 0.0305, 0.016]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[0.0007, 0.002, 0.034]} />
        <meshStandardMaterial color="#000" roughness={1} />
      </mesh>
      {/* Grey scroll wheel in its slot */}
      <mesh position={[0, 0.0285, 0.017]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.0058, 0.0058, 0.0048, 18]} />
        <meshStandardMaterial color="#7a7e84" roughness={0.6} />
      </mesh>
      <mesh geometry={cable}>
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
    </group>
  );
}

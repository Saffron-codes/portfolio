import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** ~15.6" laptop on a stand: base tilted ~15° at the back, lid open ~105°. */
export default function Laptop({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      {/* Stand feet */}
      <Blockout size={[0.26, 0.02, 0.04]} color="#7a7a7a" position={[0, 0, 0.08]} />
      <Blockout size={[0.26, 0.06, 0.04]} color="#7a7a7a" position={[0, 0, -0.09]} />
      {/* Base, raised at the back */}
      <group position={[0, 0.03, 0.1]} rotation={[0.26, 0, 0]}>
        <Blockout size={[0.36, 0.018, 0.24]} color="#a8a8a8" position={[0, 0, -0.12]} />
        {/* Lid, open ~105° from the base */}
        <group position={[0, 0.018, -0.24]} rotation={[-0.35, 0, 0]}>
          <Blockout size={[0.36, 0.23, 0.006]} color="#8f8f8f" />
        </group>
      </group>
    </group>
  );
}

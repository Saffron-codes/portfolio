import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Pen holder: cylinder r 0.04, h 0.11, with pens above. */
export default function PenHolder({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <BlockoutCylinder radius={0.04} height={0.11} color="#a0a0a0" />
      <BlockoutCylinder radius={0.004} height={0.07} color="#777" position={[0.01, 0.11, 0.01]} />
      <BlockoutCylinder radius={0.004} height={0.06} color="#777" position={[-0.015, 0.11, -0.01]} />
      <BlockoutCylinder radius={0.004} height={0.05} color="#777" position={[0.02, 0.11, -0.02]} />
    </group>
  );
}

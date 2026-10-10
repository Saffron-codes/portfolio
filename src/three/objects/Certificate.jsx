import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Framed certificate 0.30 × 0.22 hanging from the wall hook (origin = frame centre on the wall). */
export default function Certificate({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.3, 0.02, 0.22]} color="#8f8f8f" rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0.01]} />
    </group>
  );
}

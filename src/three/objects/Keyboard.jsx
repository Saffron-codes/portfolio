import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** 75% keyboard: case 0.32 × 0.135 × 0.03 (keycaps come in Phase 4). */
export default function Keyboard({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.32, 0.03, 0.135]} color="#8a8a8a" />
    </group>
  );
}

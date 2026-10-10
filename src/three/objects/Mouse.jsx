import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Mouse ~0.062 wide × 0.115 long × 0.035 tall. */
export default function Mouse({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.062, 0.035, 0.115]} color="#8a8a8a" />
    </group>
  );
}

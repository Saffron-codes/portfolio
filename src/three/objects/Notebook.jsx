import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** A5 notebook: 0.148 × 0.21 × 0.015. */
export default function Notebook({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.148, 0.015, 0.21]} color="#9a9a9a" />
    </group>
  );
}

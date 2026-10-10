import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Phone lying flat: 0.075 × 0.16 × 0.008. */
export default function Phone({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.075, 0.008, 0.16]} color="#7f7f7f" />
    </group>
  );
}

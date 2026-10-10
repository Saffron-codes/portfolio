import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Glasses case: 0.17 × 0.065 × 0.05 capsule, in front of the monitor stand. */
export default function GlassesCase({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.17, 0.05, 0.065]} color="#8a8a8a" />
    </group>
  );
}

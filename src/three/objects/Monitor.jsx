import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** ~22" monitor: panel 0.50 × 0.30, bottom edge 0.12 above the desk, neck and stand. */
export default function Monitor({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.25, 0.012, 0.18]} color="#6b6b6b" />
      <Blockout size={[0.03, 0.12, 0.03]} color="#6b6b6b" position={[0, 0.012, 0]} />
      <Blockout size={[0.5, 0.3, 0.025]} color="#8f8f8f" position={[0, 0.12, 0]} />
    </group>
  );
}

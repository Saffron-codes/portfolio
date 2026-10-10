import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Earbuds case: small rounded zip case with a carabiner. */
export default function EarbudsCase({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.07, 0.03, 0.07]} color="#8a8a8a" />
    </group>
  );
}

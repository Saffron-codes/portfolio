import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Steel tin: cylinder r 0.045, h 0.12. */
export default function SteelTin({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <BlockoutCylinder radius={0.045} height={0.12} color="#a8a8a8" />
    </group>
  );
}

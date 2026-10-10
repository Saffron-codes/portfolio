import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Deskpulse desk display: wedge-shaped body ~0.11 × 0.08 with a 3.5" screen. */
export default function Deskpulse({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.11, 0.08, 0.04]} color="#8a8a8a" rotation={[-0.25, 0, 0]} position={[0, 0, -0.01]} />
    </group>
  );
}

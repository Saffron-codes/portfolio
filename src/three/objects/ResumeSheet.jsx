import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** A4 resume sheet under a binder clip, hanging from a nail (origin = sheet centre on the wall). */
export default function ResumeSheet({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.21, 0.004, 0.297]} color="#bdbdbd" rotation={[Math.PI / 2, 0, 0]} position={[0, -0.002, 0.004]} />
      <Blockout size={[0.04, 0.012, 0.02]} color="#777" rotation={[Math.PI / 2, 0, 0]} position={[0, -0.006, 0.16]} />
    </group>
  );
}

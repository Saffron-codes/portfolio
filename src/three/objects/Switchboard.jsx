import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Wall switchboard: white plate with a rocker switch, LED, and a round dial plate (origin = plate centre on the wall). */
export default function Switchboard({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <Blockout size={[0.09, 0.012, 0.07]} color="#b5b5b5" rotation={[Math.PI / 2, 0, 0]} position={[-0.05, -0.006, 0]} />
      <Blockout size={[0.025, 0.006, 0.035]} color="#8a8a8a" rotation={[Math.PI / 2, 0, 0]} position={[-0.055, -0.003, 0.01]} />
      <BlockoutCylinder radius={0.035} height={0.012} color="#8a8a8a" rotation={[Math.PI / 2, 0, 0]} position={[0.06, -0.006, -0.02]} />
    </group>
  );
}

import Blockout, { BlockoutCylinder } from "./Blockout";

/* eslint-disable no-unused-vars */
/** Black office chair seen from behind: backrest, seat, loop armrests, five-star base. */
export default function Chair({ name, onSelect, hovered, active, ...props }) {
  return (
    <group name={name} {...props}>
      <BlockoutCylinder radius={0.03} height={0.35} color="#6b6b6b" position={[0, 0.06, 0]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Blockout key={i} size={[0.04, 0.03, 0.3]} color="#6b6b6b" position={[0, 0.03, 0]} rotation={[0, (i * Math.PI * 2) / 5, 0]} />
      ))}
      <Blockout size={[0.48, 0.07, 0.46]} color="#7a7a7a" position={[0, 0.42, 0]} />
      <group position={[0, 0.49, 0.2]} rotation={[-0.12, 0, 0]}>
        <Blockout size={[0.46, 0.58, 0.08]} color="#7a7a7a" />
      </group>
      <Blockout size={[0.05, 0.03, 0.3]} color="#6b6b6b" position={[-0.26, 0.64, 0]} />
      <Blockout size={[0.05, 0.03, 0.3]} color="#6b6b6b" position={[0.26, 0.64, 0]} />
    </group>
  );
}

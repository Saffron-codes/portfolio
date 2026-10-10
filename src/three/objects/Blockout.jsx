/**
 * Phase 3 placeholder: a grey box resting on its origin (bottom-centre).
 * Every real object replaces this with its own geometry in Phase 4.
 */
export const BLOCKOUT_GREY = "#9a9a9a";

export default function Blockout({ size, color = BLOCKOUT_GREY, position = [0, 0, 0], rotation, ...props }) {
  const [w, h, d] = size;
  return (
    <mesh position={[position[0], position[1] + h / 2, position[2]]} rotation={rotation} {...props}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

export function BlockoutCylinder({ radius, height, color = BLOCKOUT_GREY, position = [0, 0, 0], ...props }) {
  return (
    <mesh position={[position[0], position[1] + height / 2, position[2]]} {...props}>
      <cylinderGeometry args={[radius, radius, height, 24]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

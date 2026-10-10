import { DESK_TOP } from "../layout";

const WIDTH = 1.2;
const DEPTH = 0.6;
const TOP = 0.03;
const PANEL = 0.03;
const APRON = 0.12;

const MAHOGANY = { color: "#4b2420", roughness: 0.45, metalness: 0.05 };

/**
 * Desk: 1.20 × 0.60 top, 0.03 thick, dark mahogany, solid side panels and a front apron
 * with a small handle. Cable grommet at the back left. Top surface sits at y = 0.75.
 */
export default function Desk(props) {
  const legHeight = DESK_TOP - TOP;
  return (
    <group name="desk" {...props}>
      {/* Top */}
      <mesh position={[0, DESK_TOP - TOP / 2, 0]}>
        <boxGeometry args={[WIDTH, TOP, DEPTH]} />
        <meshStandardMaterial {...MAHOGANY} />
      </mesh>
      {/* Side panels */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (WIDTH / 2 - PANEL / 2), legHeight / 2, 0]}>
          <boxGeometry args={[PANEL, legHeight, DEPTH]} />
          <meshStandardMaterial {...MAHOGANY} />
        </mesh>
      ))}
      {/* Back panel (modesty board) */}
      <mesh position={[0, legHeight / 2, -DEPTH / 2 + PANEL / 2]}>
        <boxGeometry args={[WIDTH - PANEL * 2, legHeight, PANEL]} />
        <meshStandardMaterial {...MAHOGANY} />
      </mesh>
      {/* Front apron / drawer face */}
      <mesh position={[0, legHeight - APRON / 2, DEPTH / 2 - PANEL / 2]}>
        <boxGeometry args={[WIDTH - PANEL * 2, APRON, PANEL]} />
        <meshStandardMaterial {...MAHOGANY} />
      </mesh>
      {/* Handle */}
      <mesh position={[0, legHeight - APRON / 2, DEPTH / 2 + 0.01]}>
        <boxGeometry args={[0.1, 0.012, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Cable grommet hole at the back left */}
      <mesh position={[-0.45, DESK_TOP + 0.0005, -0.22]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 24]} />
        <meshStandardMaterial color="#141414" roughness={0.9} />
      </mesh>
    </group>
  );
}

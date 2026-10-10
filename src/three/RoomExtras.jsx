import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { MathUtils } from "three";
import { requestShadowUpdate } from "./shadows";
import { makeFloralTexture, makeGlowTexture } from "./textures";

const CONCRETE = { color: "#a9a49b", roughness: 0.95 };
const WOOD = { color: "#6b4a2f", roughness: 0.7 };

/* ---------------- Door on the right wall ---------------- */
export const DOOR = { z0: 0.12, width: 0.9, height: 2.08 };

/**
 * Door to the hall, hinged on the back-corner jamb. `open` swings the leaf out into the hall.
 * Origin: the hinge line on the wall (x = wall, z = DOOR.z0). Drawn in world axes.
 */
export function Door({ position, open = false }) {
  const { reducedMotion } = useScene();
  const leaf = useRef(null);
  useFrame((_, delta) => {
    if (!leaf.current) return;
    const target = open ? 1.35 : 0;
    const current = leaf.current.rotation.y;
    if (Math.abs(current - target) < 0.001) return;
    leaf.current.rotation.y = reducedMotion ? target : MathUtils.damp(current, target, 5, delta);
    requestShadowUpdate(1);
  });
  const frame = <meshStandardMaterial color="#4a3424" roughness={0.7} />;
  return (
    <group position={position}>
      {/* Frame around the opening */}
      <mesh position={[0, DOOR.height + 0.03, DOOR.width / 2]} castShadow>
        <boxGeometry args={[0.12, 0.06, DOOR.width + 0.12]} />
        {frame}
      </mesh>
      <mesh position={[0, DOOR.height / 2, -0.03]} castShadow>
        <boxGeometry args={[0.12, DOOR.height + 0.06, 0.06]} />
        {frame}
      </mesh>
      <mesh position={[0, DOOR.height / 2, DOOR.width + 0.03]} castShadow>
        <boxGeometry args={[0.12, DOOR.height + 0.06, 0.06]} />
        {frame}
      </mesh>
      {/* Leaf, hinged at z = 0 */}
      <group ref={leaf}>
        <mesh position={[-0.02, DOOR.height / 2 - 0.01, DOOR.width / 2]} castShadow>
          <boxGeometry args={[0.035, DOOR.height - 0.03, DOOR.width - 0.02]} />
          <meshStandardMaterial {...WOOD} />
        </mesh>
        {[1.52, 0.56].map((y) => (
          <mesh key={y} position={[-0.04, y, DOOR.width / 2]}>
            <boxGeometry args={[0.006, 0.78, 0.64]} />
            <meshStandardMaterial color="#5a3d26" roughness={0.75} />
          </mesh>
        ))}
        <mesh position={[-0.055, 1.0, DOOR.width - 0.12]}>
          <cylinderGeometry args={[0.009, 0.009, 0.12, 12]} />
          <meshStandardMaterial color="#b9bcc0" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/** The hall beyond the door: just enough wall, floor and ceiling that an open door shows something. */
export function HallBeyond({ x, z0, z1 }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x + 1.2, 0, (z0 + z1) / 2]}>
        <planeGeometry args={[2.4, z1 - z0]} />
        <meshStandardMaterial color="#9a5a44" roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[x + 1.2, 2.6, (z0 + z1) / 2]}>
        <planeGeometry args={[2.4, z1 - z0]} />
        <meshStandardMaterial color="#e8e4cf" roughness={1} />
      </mesh>
      <mesh position={[x + 2.4, 1.3, (z0 + z1) / 2]}>
        <boxGeometry args={[0.1, 2.6, z1 - z0]} />
        <meshStandardMaterial color="#e3dfa8" roughness={0.95} />
      </mesh>
      {[z0, z1].map((z) => (
        <mesh key={z} position={[x + 1.2, 1.3, z]}>
          <boxGeometry args={[2.4, 2.6, 0.1]} />
          <meshStandardMaterial color="#e3dfa8" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Switch and socket panel ---------------- */
/** Indian-style modular panel: a row of rocker switches and two 3-pin sockets. Origin on the wall, facing -x. */
export function SwitchPanel({ position }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[0.3, 0.2, 0.012]} radius={0.004} smoothness={3} position={[0, 0, 0.006]} castShadow>
        <meshStandardMaterial color="#f1efe6" roughness={0.6} />
      </RoundedBox>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} position={[-0.115 + i * 0.046, 0.045, 0.014]}>
          <boxGeometry args={[0.02, 0.03, 0.005]} />
          <meshStandardMaterial color={i % 2 ? "#f6f4ec" : "#e8e5db"} roughness={0.5} />
        </mesh>
      ))}
      {[-0.07, 0.07].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.045, 0.013]}>
            <boxGeometry args={[0.055, 0.055, 0.004]} />
            <meshStandardMaterial color="#e9e6dc" roughness={0.6} />
          </mesh>
          {[[0, 0.014], [-0.012, -0.008], [0.012, -0.008]].map(([dx, dy], j) => (
            <mesh key={j} position={[x + dx, -0.045 + dy, 0.0155]}>
              <circleGeometry args={[0.0032, 10]} />
              <meshStandardMaterial color="#222" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0.12, -0.03, 0.013]}>
        <sphereGeometry args={[0.003, 8, 8]} />
        <meshStandardMaterial color="#ff2d2d" emissive="#ff2d2d" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ---------------- Concrete open shelf ---------------- */
const SHELF = { width: 1.36, depth: 0.34, height: 1.85, rows: 5, slab: 0.035 };

function Racket({ position, rotation, color }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.1, 0.006, 8, 24]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <circleGeometry args={[0.096, 24]} />
        <meshStandardMaterial color="#e8e8e8" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.006, 0.008, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Shuttle({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.012, 0]}>
        <sphereGeometry args={[0.012, 10, 10]} />
        <meshStandardMaterial color="#eaeaea" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <coneGeometry args={[0.03, 0.06, 12, 1, true]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Box({ size, color, position, rotation }) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]} rotation={rotation} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

function Cylinder({ r, h, color, position, metal = false }) {
  return (
    <mesh position={[position[0], position[1] + h / 2, position[2]]} castShadow>
      <cylinderGeometry args={[r, r, h, 16]} />
      <meshStandardMaterial color={color} roughness={metal ? 0.3 : 0.6} metalness={metal ? 0.8 : 0} />
    </mesh>
  );
}

/**
 * Five open concrete rows: rackets and a shuttle, grooming kit, folded house clothes,
 * hobby electronics, personal bits. Origin: bottom centre against the right wall, facing -x.
 */
export function ConcreteShelf({ position }) {
  const rowH = SHELF.height / SHELF.rows;
  const inner = SHELF.depth / 2 - 0.02;
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      {/* Side walls and slabs */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (SHELF.width / 2 - SHELF.slab / 2), SHELF.height / 2, 0]} castShadow>
          <boxGeometry args={[SHELF.slab, SHELF.height, SHELF.depth]} />
          <meshStandardMaterial {...CONCRETE} />
        </mesh>
      ))}
      {Array.from({ length: SHELF.rows + 1 }, (_, i) => (
        <mesh key={i} position={[0, i * rowH + SHELF.slab / 2, 0]} castShadow>
          <boxGeometry args={[SHELF.width, SHELF.slab, SHELF.depth]} />
          <meshStandardMaterial {...CONCRETE} />
        </mesh>
      ))}
      <mesh position={[0, SHELF.height / 2, -SHELF.depth / 2 + 0.01]}>
        <boxGeometry args={[SHELF.width, SHELF.height, 0.02]} />
        <meshStandardMaterial color="#aaa49b" roughness={1} />
      </mesh>

      {/* Row 5 (top): badminton rackets and the shuttle */}
      <group position={[0, 4 * rowH + SHELF.slab, 0]}>
        <Racket position={[-0.45, 0.06, -0.06]} rotation={[0.2, 0.3, 0.25]} color="#c0392b" />
        <Racket position={[-0.3, 0.06, -0.08]} rotation={[0.2, 0.2, -0.2]} color="#2563eb" />
        <Shuttle position={[0.0, 0, 0.03]} />
        <Shuttle position={[0.08, 0, -0.04]} />
        <Box size={[0.2, 0.07, 0.08]} color="#2d3a4a" position={[0.3, 0, -0.06]} />
        <Box size={[0.24, 0.05, 0.12]} color="#8d6e63" position={[0.52, 0, 0.0]} />
      </group>
      {/* Row 4: grooming */}
      <group position={[0, 3 * rowH + SHELF.slab, 0]}>
        <Box size={[0.05, 0.16, 0.035]} color="#1b1b1f" position={[-0.3, 0, 0.02]} rotation={[0, 0.2, 0]} />
        <Cylinder r={0.028} h={0.17} color="#1e5aa8" position={[-0.15, 0, 0]} />
        <Cylinder r={0.022} h={0.12} color="#e6e2d8" position={[-0.05, 0, 0.04]} />
        <Cylinder r={0.025} h={0.09} color="#2e8b57" position={[0.08, 0, -0.03]} />
        <Box size={[0.14, 0.04, 0.09]} color="#8d6e63" position={[0.26, 0, 0.0]} />
        <Cylinder r={0.03} h={0.14} color="#f1c40f" position={[0.45, 0, -0.02]} />
      </group>
      {/* Row 3: folded house clothes */}
      <group position={[0, 2 * rowH + SHELF.slab, 0]}>
        {[["#5b7fa6", -0.28], ["#c9c2b6", -0.28], ["#7d9b76", -0.28]].map(([c, x], i) => (
          <Box key={i} size={[0.26, 0.05, 0.22]} color={c} position={[x + 0.02 * i, i * 0.05, 0]} />
        ))}
        {[["#a84f5a", 0.1], ["#444a57", 0.1], ["#e0b26b", 0.1]].map(([c, x], i) => (
          <Box key={i} size={[0.24, 0.045, 0.2]} color={c} position={[x + 0.02 * i, i * 0.045, 0.01]} />
        ))}
      </group>
      {/* Row 2: hobby electronics */}
      <group position={[0, rowH + SHELF.slab, 0]}>
        <Box size={[0.17, 0.012, 0.06]} color="#e8e8e8" position={[-0.25, 0, 0.05]} rotation={[0, 0.3, 0]} />
        <Box size={[0.08, 0.035, 0.15]} color="#f0c419" position={[-0.05, 0, 0.0]} />
        <Box size={[0.22, 0.1, 0.16]} color="#2f3542" position={[0.18, 0, -0.04]} />
        <Box size={[0.1, 0.06, 0.07]} color="#1f6f8b" position={[0.3, 0.1, -0.04]} />
        <Cylinder r={0.03} h={0.03} color="#333" position={[-0.32, 0, -0.08]} />
      </group>
      {/* Row 1 (bottom): personal bits */}
      <group position={[0, SHELF.slab, 0]}>
        <Box size={[0.3, 0.2, 0.22]} color="#7a5a3a" position={[-0.42, 0, -0.02]} />
        <Box size={[0.2, 0.26, 0.14]} color="#3d5a80" position={[-0.08, 0, -0.04]} />
        <Box size={[0.06, 0.22, 0.16]} color="#c0392b" position={[0.1, 0, 0.0]} />
        <Box size={[0.34, 0.18, 0.2]} color="#556270" position={[0.42, 0, -0.02]} />
      </group>
      {/* keep the shelf depth reference used above */}
      <group visible={false} position={[0, 0, inner]} />
    </group>
  );
}

/* ---------------- Bed ---------------- */
/**
 * Double cot, 1.9 m long along x with the head toward the curtains (−x) and the feet at the
 * shelf wall (+x); 1.5 m wide along z against the wall behind the chair. Coir mattress, floral
 * sheet, two pillows and a spread blanket. Origin: floor centre.
 */
export function Bed({ position }) {
  const sheet = useMemo(() => {
    const t = makeFloralTexture("#5e2a84", "#9b59b6", "#e056a0", 17);
    t.repeat.set(6, 4);
    return t;
  }, []);
  const L = 1.9; // along x
  const W = 1.5; // along z
  return (
    <group position={position}>
      {/* Frame and legs */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[L, 0.08, W]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (L / 2 - 0.04), 0.18, sz * (W / 2 - 0.04)]} castShadow>
          <boxGeometry args={[0.06, 0.36, 0.06]} />
          <meshStandardMaterial {...WOOD} />
        </mesh>
      ))}
      {/* Headboard at the head end (−x) */}
      <mesh position={[-L / 2 + 0.02, 0.66, 0]} castShadow>
        <boxGeometry args={[0.04, 0.6, W]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {/* Coir mattress with the sheet */}
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[L - 0.05, 0.03, W - 0.03]} />
        <meshStandardMaterial color="#b58a5c" roughness={1} />
      </mesh>
      <RoundedBox args={[L - 0.06, 0.13, W - 0.04]} radius={0.035} smoothness={4} position={[0, 0.465, 0]} castShadow>
        <meshStandardMaterial map={sheet} roughness={0.95} />
      </RoundedBox>
      {/* Pillows at the head */}
      {[-0.36, 0.36].map((z) => (
        <RoundedBox key={z} args={[0.28, 0.1, 0.42]} radius={0.04} smoothness={4} position={[-L / 2 + 0.24, 0.58, z]} rotation={[0, z > 0 ? 0.08 : -0.1, 0]} castShadow>
          <meshStandardMaterial color="#f1ece2" roughness={0.95} />
        </RoundedBox>
      ))}
      {/* Blanket spread over the foot half, with a folded hem */}
      <RoundedBox args={[1.05, 0.05, W - 0.02]} radius={0.02} smoothness={3} position={[L / 2 - 0.55, 0.555, 0]} castShadow>
        <meshStandardMaterial color="#4f6d8f" roughness={0.98} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.06, W - 0.02]} radius={0.025} smoothness={3} position={[L / 2 - 1.0, 0.565, 0]} castShadow>
        <meshStandardMaterial color="#6b86a5" roughness={0.98} />
      </RoundedBox>
    </group>
  );
}

/* ---------------- Clothes hooks beside the window ---------------- */
function TShirt({ x, color }) {
  return (
    <group position={[x, -0.3, 0.05]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.5, 0.035]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.2, 0.17, 0]} rotation={[0, 0, side * 0.35]} castShadow>
          <boxGeometry args={[0.13, 0.14, 0.035]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 0.24, 0.019]}>
        <torusGeometry args={[0.05, 0.008, 6, 20, Math.PI]} />
        <meshStandardMaterial color="#00000055" transparent opacity={0.3} roughness={1} />
      </mesh>
    </group>
  );
}

function Jeans({ x, color }) {
  return (
    <group position={[x, -0.42, 0.05]}>
      {/* folded over the hook: a thicker slab with a seam down the middle */}
      <mesh castShadow>
        <boxGeometry args={[0.24, 0.74, 0.06]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <boxGeometry args={[0.006, 0.7, 0.002]} />
        <meshStandardMaterial color="#1c2a44" roughness={1} />
      </mesh>
      <mesh position={[0, 0.34, 0.032]}>
        <boxGeometry args={[0.24, 0.04, 0.004]} />
        <meshStandardMaterial color="#2f4468" roughness={1} />
      </mesh>
    </group>
  );
}

/** A wooden hook rail on the back wall: two pairs of jeans and two t-shirts. Origin: rail centre on the wall. */
export function ClothesHanger({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.012]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.024]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {[-0.36, -0.12, 0.12, 0.36].map((x) => (
        <mesh key={x} position={[x, -0.03, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.014, 0.004, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#b9bcc0" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <Jeans x={-0.36} color="#2b3f66" />
      <TShirt x={-0.12} color="#6fa3d6" />
      <TShirt x={0.12} color="#ece9e1" />
      <Jeans x={0.36} color="#1f2d47" />
    </group>
  );
}

/* ---------------- Ceiling fan and tube light ---------------- */
export function CeilingFan({ position }) {
  const { reducedMotion } = useScene();
  const blades = useRef(null);
  useFrame((_, delta) => {
    if (reducedMotion || !blades.current) return;
    blades.current.rotation.y += delta * 2.2;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.36, 10]} />
        <meshStandardMaterial color="#d8d3c7" roughness={0.6} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.09, 0.1, 0.1, 24]} />
        <meshStandardMaterial color="#d8d3c7" roughness={0.6} />
      </mesh>
      <group ref={blades} position={[0, -0.03, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[Math.cos((i * Math.PI * 2) / 3) * 0.36, 0, -Math.sin((i * Math.PI * 2) / 3) * 0.36]}>
            <boxGeometry args={[0.6, 0.008, 0.12]} />
            <meshStandardMaterial color="#cfc9bd" roughness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** LED batten on the wall behind the chair: slim white bar, bright diffuser and a soft halo when on. */
export function TubeLight({ position }) {
  const { lightsOn } = useScene();
  const glow = useMemo(makeGlowTexture, []);
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, 0.018]}>
        <boxGeometry args={[1.2, 0.028, 0.036]} />
        <meshStandardMaterial color="#f2f0ea" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.004, 0.038]}>
        <boxGeometry args={[1.16, 0.016, 0.004]} />
        <meshStandardMaterial color="#ffffff" emissive="#f6f8ff" emissiveIntensity={lightsOn ? 4 : 0} roughness={0.3} />
      </mesh>
      {lightsOn && (
        <>
          <sprite position={[0, -0.02, 0.12]} scale={[2.2, 0.75, 1]} renderOrder={10} userData={{ noShadow: true }}>
            <spriteMaterial map={glow} transparent opacity={0.55} depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} />
          </sprite>
          <pointLight position={[0, -0.1, 0.25]} intensity={0.9} distance={2.6} decay={1.6} color="#fff6e4" />
        </>
      )}
    </group>
  );
}

/* ---------------- Curtains on the left window ---------------- */
/** A hanging cloth panel: vertical folds, gathered at a tie-back. Local x across, y down, folds in +z. */
function curtainGeometry(width, height, tieY) {
  const geometry = new THREE.PlaneGeometry(width, height, 36, 48);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = x / width + 0.5; // 0..1 across
    const gather = Math.exp(-(((y - tieY) / 0.16) ** 2)); // 1 at the tie
    const folds = Math.sin(u * Math.PI * 7) * 0.035 + Math.sin(u * Math.PI * 3 + 1) * 0.02;
    pos.setX(i, x * (1 - 0.55 * gather));
    pos.setZ(i, folds * (1 - 0.7 * gather) + 0.01);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Two magenta floral panels on rings, each tied back at the waist. Origin: window centre on the wall, facing +x. */
export function Curtains({ position, width, height }) {
  const cloth = useMemo(() => {
    const t = makeFloralTexture("#b3175e", "#e0457b", "#ff8fb0", 5);
    t.repeat.set(1.5, 3);
    return t;
  }, []);
  const tieY = -height * 0.08;
  const panelW = 0.5;
  const geometry = useMemo(() => curtainGeometry(panelW, height, tieY), [height]);
  const rodY = height / 2 + 0.08;
  const panel = (side) => (
    <group key={side} position={[0.06, 0.08, side * (width / 2 - 0.22)]} rotation={[0, Math.PI / 2, 0]}>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial map={cloth} roughness={1} side={THREE.DoubleSide} transparent opacity={0.96} />
      </mesh>
      {/* Rings along the rod */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((x) => (
        <mesh key={x} position={[x, height / 2 + 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.018, 0.004, 8, 16]} />
          <meshStandardMaterial color="#4a3424" roughness={0.6} />
        </mesh>
      ))}
      {/* Tie-back band */}
      <mesh position={[0, tieY, 0.02]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.13, 0.012, 8, 24]} />
        <meshStandardMaterial color="#2b1b2b" roughness={0.9} />
      </mesh>
    </group>
  );
  return (
    <group position={position}>
      <mesh position={[0.06, rodY, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, width + 0.4, 10]} />
        <meshStandardMaterial color="#4a3424" roughness={0.6} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.06, rodY, side * (width / 2 + 0.2)]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color="#4a3424" roughness={0.6} />
        </mesh>
      ))}
      {panel(-1)}
      {panel(1)}
    </group>
  );
}

/* ---------------- Outside the left window: the road ---------------- */
/** A government road past the left window: verge, asphalt, a far compound wall and a couple of trees. */
export function RoadSide() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -0.02, 1.2]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color="#8a8458" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.3, -0.005, 1.2]}>
        <planeGeometry args={[2.6, 14]} />
        <meshStandardMaterial color="#45464a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.3, 0.0, 1.2]}>
        <planeGeometry args={[0.08, 14]} />
        <meshStandardMaterial color="#d8d2b8" roughness={1} />
      </mesh>
      {/* Compound wall across the road */}
      <mesh position={[-5.2, 0.7, 1.2]}>
        <boxGeometry args={[0.2, 1.4, 14]} />
        <meshStandardMaterial color="#d9c7a3" roughness={1} />
      </mesh>
      {/* A big, plain two-storey house across the road: flat roof, parapet, windows, a water tank */}
      <group position={[-8.2, 0, 1.0]}>
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[4.5, 6.0, 7.5]} />
          <meshStandardMaterial color="#e6cfae" roughness={0.95} />
        </mesh>
        <mesh position={[0, 6.1, 0]}>
          <boxGeometry args={[4.7, 0.35, 7.7]} />
          <meshStandardMaterial color="#d8bf9c" roughness={0.95} />
        </mesh>
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[4.6, 0.12, 7.6]} />
          <meshStandardMaterial color="#cdb391" roughness={0.95} />
        </mesh>
        {[1.6, 4.6].map((y) =>
          [-2.6, -0.9, 0.9, 2.6].map((z) => (
            <mesh key={`${y}-${z}`} position={[2.26, y, z]}>
              <boxGeometry args={[0.02, 1.2, 1.0]} />
              <meshStandardMaterial color="#2c3440" roughness={0.4} metalness={0.2} />
            </mesh>
          )),
        )}
        <mesh position={[2.26, 1.05, 0]}>
          <boxGeometry args={[0.02, 2.1, 1.0]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.8} />
        </mesh>
        <mesh position={[1.2, 6.8, -2.4]}>
          <cylinderGeometry args={[0.6, 0.6, 1.1, 16]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
      </group>
      {[-1.5, 3.5].map((z) => (
        <group key={z} position={[-5.6, 0, z]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 2.4, 8]} />
            <meshStandardMaterial color="#5a3a22" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.9, 0]}>
            <icosahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color="#4f8a3c" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

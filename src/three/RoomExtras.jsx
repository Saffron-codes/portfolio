import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { makeFloralTexture } from "./textures";

const CONCRETE = { color: "#a9a49b", roughness: 0.95 };
const WOOD = { color: "#6b4a2f", roughness: 0.7 };

/* ---------------- Door on the right wall ---------------- */
/** Wooden door to the outside, on the right wall near the back corner. Origin: bottom centre on the wall, facing -x. */
export function Door({ position }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh position={[0, 1.05, 0.02]} castShadow>
        <boxGeometry args={[1.0, 2.14, 0.04]} />
        <meshStandardMaterial color="#4a3424" roughness={0.7} />
      </mesh>
      {/* Leaf */}
      <mesh position={[0, 1.03, 0.035]} castShadow>
        <boxGeometry args={[0.88, 2.06, 0.03]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {/* Two recessed panels */}
      {[1.5, 0.55].map((y) => (
        <mesh key={y} position={[0, y, 0.052]}>
          <boxGeometry args={[0.66, 0.78, 0.006]} />
          <meshStandardMaterial color="#5a3d26" roughness={0.75} />
        </mesh>
      ))}
      {/* Handle and latch */}
      <mesh position={[0.34, 1.0, 0.07]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.009, 0.009, 0.12, 12]} />
        <meshStandardMaterial color="#b9bcc0" roughness={0.3} metalness={0.9} />
      </mesh>
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
const SHELF = { width: 0.9, depth: 0.34, height: 1.85, rows: 5, slab: 0.035 };

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
        <Racket position={[-0.22, 0.06, -0.06]} rotation={[0.2, 0.3, 0.25]} color="#c0392b" />
        <Racket position={[-0.1, 0.06, -0.08]} rotation={[0.2, 0.2, -0.2]} color="#2563eb" />
        <Shuttle position={[0.2, 0, 0.03]} />
        <Box size={[0.2, 0.07, 0.08]} color="#2d3a4a" position={[0.25, 0, -0.06]} />
      </group>
      {/* Row 4: grooming */}
      <group position={[0, 3 * rowH + SHELF.slab, 0]}>
        <Box size={[0.05, 0.16, 0.035]} color="#1b1b1f" position={[-0.3, 0, 0.02]} rotation={[0, 0.2, 0]} />
        <Cylinder r={0.028} h={0.17} color="#1e5aa8" position={[-0.15, 0, 0]} />
        <Cylinder r={0.022} h={0.12} color="#e6e2d8" position={[-0.05, 0, 0.04]} />
        <Cylinder r={0.025} h={0.09} color="#2e8b57" position={[0.08, 0, -0.03]} />
        <Box size={[0.14, 0.04, 0.09]} color="#8d6e63" position={[0.26, 0, 0.0]} />
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
        <Box size={[0.3, 0.2, 0.22]} color="#7a5a3a" position={[-0.22, 0, -0.02]} />
        <Box size={[0.2, 0.26, 0.14]} color="#3d5a80" position={[0.12, 0, -0.04]} />
        <Box size={[0.06, 0.22, 0.16]} color="#c0392b" position={[0.3, 0, 0.0]} />
      </group>
      {/* keep the shelf depth reference used above */}
      <group visible={false} position={[0, 0, inner]} />
    </group>
  );
}

/* ---------------- Bed ---------------- */
/** Single cot: wooden frame, coir mattress, purple floral sheet, two pillows. Origin: floor centre; length along z. */
export function Bed({ position }) {
  const sheet = useMemo(() => {
    const t = makeFloralTexture("#5e2a84", "#9b59b6", "#e056a0", 17);
    t.repeat.set(3, 6);
    return t;
  }, []);
  const W = 0.92;
  const L = 1.9;
  return (
    <group position={position}>
      {/* Frame and legs */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[W, 0.08, L]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * (W / 2 - 0.04), 0.18, sz * (L / 2 - 0.04)]} castShadow>
          <boxGeometry args={[0.06, 0.36, 0.06]} />
          <meshStandardMaterial {...WOOD} />
        </mesh>
      ))}
      {/* Headboard at the wall end */}
      <mesh position={[0, 0.62, L / 2 - 0.02]} castShadow>
        <boxGeometry args={[W, 0.52, 0.04]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {/* Coir mattress with the sheet */}
      <RoundedBox args={[W - 0.04, 0.12, L - 0.06]} radius={0.03} smoothness={4} position={[0, 0.46, 0]} castShadow>
        <meshStandardMaterial map={sheet} roughness={0.95} />
      </RoundedBox>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[W - 0.03, 0.03, L - 0.05]} />
        <meshStandardMaterial color="#b58a5c" roughness={1} />
      </mesh>
      {/* Two pillows at the head */}
      {[-0.2, 0.2].map((x) => (
        <RoundedBox key={x} args={[0.38, 0.09, 0.26]} radius={0.04} smoothness={4} position={[x, 0.565, L / 2 - 0.22]} rotation={[0, x > 0 ? -0.1 : 0.12, 0]} castShadow>
          <meshStandardMaterial color="#f1ece2" roughness={0.95} />
        </RoundedBox>
      ))}
      {/* Folded blanket at the foot */}
      <RoundedBox args={[W - 0.3, 0.08, 0.3] } radius={0.03} smoothness={3} position={[0.05, 0.56, -L / 2 + 0.3]} castShadow>
        <meshStandardMaterial color="#c75b8f" roughness={0.95} />
      </RoundedBox>
    </group>
  );
}

/* ---------------- Clothes hooks beside the window ---------------- */
/** A wooden hook rail on the back wall with a few hanging clothes. Origin: rail centre on the wall. */
export function ClothesHanger({ position }) {
  const items = [
    { x: -0.28, color: "#6fa3d6", w: 0.3, h: 0.62 },
    { x: -0.02, color: "#e4e1d8", w: 0.28, h: 0.7 },
    { x: 0.24, color: "#3f6b5c", w: 0.22, h: 0.55 },
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.012]} castShadow>
        <boxGeometry args={[0.8, 0.06, 0.024]} />
        <meshStandardMaterial {...WOOD} />
      </mesh>
      {[-0.3, -0.1, 0.1, 0.3].map((x) => (
        <mesh key={x} position={[x, -0.03, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.014, 0.004, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#b9bcc0" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {items.map((item) => (
        <group key={item.x} position={[item.x, -0.05 - item.h / 2, 0.045]}>
          <mesh castShadow>
            <boxGeometry args={[item.w, item.h, 0.04]} />
            <meshStandardMaterial color={item.color} roughness={0.95} />
          </mesh>
          <mesh position={[0, item.h / 2 - 0.1, 0.021]}>
            <boxGeometry args={[item.w * 0.6, 0.015, 0.002]} />
            <meshStandardMaterial color="#00000033" transparent opacity={0.25} roughness={1} />
          </mesh>
        </group>
      ))}
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

/** Tube light on the wall behind the chair. Lit when the room lights are on. */
export function TubeLight({ position }) {
  const { lightsOn } = useScene();
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[1.25, 0.05, 0.04]} />
        <meshStandardMaterial color="#e6e2d8" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.03, 0.035]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.014, 0.014, 1.2, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#fff4dc" emissiveIntensity={lightsOn ? 2.5 : 0} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ---------------- Curtains on the left window ---------------- */
/** Two magenta floral panels tied back at the waist. Origin: window centre on the wall, facing +x (into the room). */
export function Curtains({ position, width, height }) {
  const cloth = useMemo(() => {
    const t = makeFloralTexture("#b3175e", "#e0457b", "#ff8fb0", 5);
    t.repeat.set(2, 5);
    return t;
  }, []);
  const panel = (side) => (
    <group key={side} position={[0, 0, side * (width / 2 - 0.16)]}>
      {/* upper fall */}
      <mesh position={[0.045, height * 0.27, 0]} castShadow>
        <boxGeometry args={[0.05, height * 0.56, 0.4]} />
        <meshStandardMaterial map={cloth} roughness={0.95} />
      </mesh>
      {/* tie */}
      <mesh position={[0.045, -0.03, 0]}>
        <boxGeometry args={[0.07, 0.07, 0.16]} />
        <meshStandardMaterial color="#2b1b2b" roughness={0.9} />
      </mesh>
      {/* lower fall, narrower */}
      <mesh position={[0.045, -height * 0.33, 0]} castShadow>
        <boxGeometry args={[0.05, height * 0.56, 0.3]} />
        <meshStandardMaterial map={cloth} roughness={0.95} />
      </mesh>
    </group>
  );
  return (
    <group position={position}>
      <mesh position={[0.06, height / 2 + 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, width + 0.3, 10]} />
        <meshStandardMaterial color="#4a3424" roughness={0.6} />
      </mesh>
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

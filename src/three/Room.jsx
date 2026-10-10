import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { BACK_WALL_Z, LEFT_WALL_X } from "./layout";

const WALL = { color: "#e9e6ae", roughness: 0.95 };
const WALL_T = 0.1;
const ROOM_W = 3.0; // x from -0.85 to 2.15
const ROOM_D = 3.0; // z from -0.32 to 2.68
const ROOM_H = 2.6;
const ROOM_X0 = LEFT_WALL_X;
const ROOM_CX = ROOM_X0 + ROOM_W / 2;
const ROOM_CZ = BACK_WALL_Z + ROOM_D / 2;

// Window opening on the back wall.
// Measured against the photos: the frame starts ~0.13 m in from the monitor's left edge.
export const WINDOW = { x0: -0.18, x1: 1.3, y0: 0.84, y1: 2.1 };
const WW = WINDOW.x1 - WINDOW.x0;
const WH = WINDOW.y1 - WINDOW.y0;
const WCX = (WINDOW.x0 + WINDOW.x1) / 2;
const WCY = (WINDOW.y0 + WINDOW.y1) / 2;

function useFloorTexture() {
  return useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const tiles = 4;
    const tile = size / tiles;
    ctx.fillStyle = "#8d4a34"; // grout
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < tiles; i += 1) {
      for (let j = 0; j < tiles; j += 1) {
        const shade = 0.94 + ((i * 7 + j * 13) % 5) * 0.025;
        ctx.fillStyle = `rgb(${Math.round(180 * shade)}, ${Math.round(85 * shade)}, ${Math.round(58 * shade)})`;
        ctx.fillRect(i * tile + 3, j * tile + 3, tile - 6, tile - 6);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Each tile is 0.30 m.
    texture.repeat.set(ROOM_W / (0.3 * tiles), ROOM_D / (0.3 * tiles));
    texture.anisotropy = 4;
    return texture;
  }, []);
}

function Wall({ size, position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...WALL} />
    </mesh>
  );
}

function WindowFrame() {
  const frame = 0.06;
  const depth = 0.08;
  const z = BACK_WALL_Z - 0.02;
  const wood = <meshStandardMaterial color="#4a3424" roughness={0.7} />;
  const mullionXs = [WINDOW.x0 + WW / 3, WINDOW.x0 + (2 * WW) / 3];

  // Grille: 9 columns × 8 rows of cells → 8 vertical + 7 horizontal interior bars.
  const bars = useMemo(() => {
    const list = [];
    const innerX0 = WINDOW.x0 + frame;
    const innerX1 = WINDOW.x1 - frame;
    const innerY0 = WINDOW.y0 + frame;
    const innerY1 = WINDOW.y1 - frame;
    const iw = innerX1 - innerX0;
    const ih = innerY1 - innerY0;
    for (let c = 1; c < 9; c += 1) {
      list.push({ position: [innerX0 + (iw * c) / 9, WCY, 0], scale: [0.012, ih, 0.012] });
    }
    for (let r = 1; r < 8; r += 1) {
      list.push({ position: [WCX, innerY0 + (ih * r) / 8, 0], scale: [iw, 0.012, 0.012] });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0, z]}>
      {/* Frame */}
      <mesh position={[WCX, WINDOW.y1 - frame / 2, 0]} castShadow>
        <boxGeometry args={[WW, frame, depth]} />
        {wood}
      </mesh>
      <mesh position={[WCX, WINDOW.y0 + frame / 2, 0]} castShadow>
        <boxGeometry args={[WW, frame, depth]} />
        {wood}
      </mesh>
      <mesh position={[WINDOW.x0 + frame / 2, WCY, 0]} castShadow>
        <boxGeometry args={[frame, WH, depth]} />
        {wood}
      </mesh>
      <mesh position={[WINDOW.x1 - frame / 2, WCY, 0]} castShadow>
        <boxGeometry args={[frame, WH, depth]} />
        {wood}
      </mesh>
      {mullionXs.map((x) => (
        <mesh key={x} position={[x, WCY, 0]} castShadow>
          <boxGeometry args={[0.05, WH, depth]} />
          {wood}
        </mesh>
      ))}
      {/* Grille */}
      <Instances limit={16} position={[0, 0, -0.01]} castShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.5} />
        {bars.map((bar, i) => (
          <Instance key={i} position={bar.position} scale={bar.scale} />
        ))}
      </Instances>
      {/* Mosquito mesh */}
      <mesh position={[WCX, WCY, -0.05]} userData={{ noShadow: true }}>
        <planeGeometry args={[WW - frame * 2, WH - frame * 2]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.18} roughness={1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/** Walls, floor, window and the small wall details (cable, hook). */
export default function Room() {
  const floorTexture = useFloorTexture();

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM_CX, 0, ROOM_CZ]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial map={floorTexture} roughness={0.85} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[ROOM_CX, ROOM_H, ROOM_CZ]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f4f1dc" roughness={1} />
      </mesh>

      {/* Back wall, built around the window opening */}
      <Wall size={[WINDOW.x0 - ROOM_X0, ROOM_H, WALL_T]} position={[(ROOM_X0 + WINDOW.x0) / 2, ROOM_H / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[ROOM_X0 + ROOM_W - WINDOW.x1, ROOM_H, WALL_T]} position={[(WINDOW.x1 + ROOM_X0 + ROOM_W) / 2, ROOM_H / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[WW, WINDOW.y0, WALL_T]} position={[WCX, WINDOW.y0 / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[WW, ROOM_H - WINDOW.y1, WALL_T]} position={[WCX, (ROOM_H + WINDOW.y1) / 2, BACK_WALL_Z - WALL_T / 2]} />
      {/* Left wall */}
      <Wall size={[WALL_T, ROOM_H, ROOM_D]} position={[LEFT_WALL_X - WALL_T / 2, ROOM_H / 2, ROOM_CZ]} />

      {/* Cable running down the left part of the back wall, and the hook */}
      <mesh position={[-0.24, 1.7, BACK_WALL_Z + 0.006]}>
        <cylinderGeometry args={[0.004, 0.004, 1.8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      <mesh position={[-0.62, 1.55, BACK_WALL_Z + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.012, 0.003, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.8} roughness={0.3} />
      </mesh>

      <WindowFrame />

    </group>
  );
}

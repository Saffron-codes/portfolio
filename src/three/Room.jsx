import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { BACK_WALL_Z, LEFT_WALL_X } from "./layout";
import Interactive from "./Interactive";
import PanelAnchor from "./PanelAnchor";
import { LABELS } from "./sections";
import { makeNetTexture } from "./textures";
import { Bed, CeilingFan, ClothesHanger, ConcreteShelf, Curtains, Door, DOOR, HallBeyond, RoadSide, SwitchPanel, TubeLight } from "./RoomExtras";
import { useScene } from "./SceneContext";
import { LABELS as ALL_LABELS } from "./sections";

const WALL = { color: "#e9e6ae", roughness: 0.95 };
const WALL_T = 0.1;
// A square room: the desk sits in its back-left corner.
const ROOM_W = 3.3; // x from -0.85 to 2.45
const ROOM_D = 3.3; // z from -0.32 to 2.98
const ROOM_H = 2.6;
const ROOM_X0 = LEFT_WALL_X;
const ROOM_X1 = ROOM_X0 + ROOM_W;
const ROOM_Z1 = BACK_WALL_Z + ROOM_D;
const ROOM_CX = ROOM_X0 + ROOM_W / 2;
const ROOM_CZ = BACK_WALL_Z + ROOM_D / 2;

// Window opening on the back wall (measured against the photos).
export const WINDOW = { x0: -0.18, x1: 1.3, y0: 0.84, y1: 2.1 };
const WW = WINDOW.x1 - WINDOW.x0;
const WH = WINDOW.y1 - WINDOW.y0;
const WCX = (WINDOW.x0 + WINDOW.x1) / 2;
const WCY = (WINDOW.y0 + WINDOW.y1) / 2;

// Window on the left wall, facing the road.
export const LEFT_WINDOW = { z0: 0.35, z1: 1.75, y0: 0.84, y1: 2.05 };
const LWW = LEFT_WINDOW.z1 - LEFT_WINDOW.z0;
const LWH = LEFT_WINDOW.y1 - LEFT_WINDOW.y0;
const LWCZ = (LEFT_WINDOW.z0 + LEFT_WINDOW.z1) / 2;
const LWCY = (LEFT_WINDOW.y0 + LEFT_WINDOW.y1) / 2;

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

/**
 * A window unit drawn at its own origin (opening centre, facing +z): dark wood frame, vertical
 * mullions, a steel grille and a visible mosquito net. `columns` × `rows` grille cells.
 */
export function WindowUnit({ width, height, panes = 3, columns = 9, rows = 8 }) {
  const frame = 0.06;
  const depth = 0.08;
  const net = useMemo(() => {
    const t = makeNetTexture();
    t.repeat.set(width / 0.012, height / 0.012);
    return t;
  }, [width, height]);
  const wood = <meshStandardMaterial color="#4a3424" roughness={0.7} />;
  const mullionXs = Array.from({ length: panes - 1 }, (_, i) => -width / 2 + (width * (i + 1)) / panes);

  const bars = useMemo(() => {
    const list = [];
    const iw = width - frame * 2;
    const ih = height - frame * 2;
    for (let c = 1; c < columns; c += 1) list.push({ position: [-iw / 2 + (iw * c) / columns, 0, 0], scale: [0.012, ih, 0.012] });
    for (let r = 1; r < rows; r += 1) list.push({ position: [0, -ih / 2 + (ih * r) / rows, 0], scale: [iw, 0.012, 0.012] });
    return list;
  }, [width, height, columns, rows]);

  return (
    <group>
      <mesh position={[0, height / 2 - frame / 2, 0]} castShadow>
        <boxGeometry args={[width, frame, depth]} />
        {wood}
      </mesh>
      <mesh position={[0, -height / 2 + frame / 2, 0]} castShadow>
        <boxGeometry args={[width, frame, depth]} />
        {wood}
      </mesh>
      <mesh position={[-width / 2 + frame / 2, 0, 0]} castShadow>
        <boxGeometry args={[frame, height, depth]} />
        {wood}
      </mesh>
      <mesh position={[width / 2 - frame / 2, 0, 0]} castShadow>
        <boxGeometry args={[frame, height, depth]} />
        {wood}
      </mesh>
      {mullionXs.map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.05, height, depth]} />
          {wood}
        </mesh>
      ))}
      <Instances limit={columns + rows} position={[0, 0, -0.01]} castShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.5} />
        {bars.map((bar, i) => (
          <Instance key={i} position={bar.position} scale={bar.scale} />
        ))}
      </Instances>
      {/* Mosquito net: a fine mesh just outside the grille */}
      <mesh position={[0, 0, -0.045]} userData={{ noShadow: true, noHighlight: true }}>
        <planeGeometry args={[width - frame * 2, height - frame * 2]} />
        <meshStandardMaterial map={net} transparent opacity={0.55} alphaTest={0.05} roughness={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Walls, floor, both windows and everything fixed to the room. */
export default function Room() {
  const floorTexture = useFloorTexture();
  const { doorOpen } = useScene();
  const doorZ1 = DOOR.z0 + DOOR.width;

  return (
    <group>
      {/* Floor and ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM_CX, 0, ROOM_CZ]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial map={floorTexture} roughness={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[ROOM_CX, ROOM_H, ROOM_CZ]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f4f1dc" roughness={1} />
      </mesh>

      {/* Back wall, built around the window opening */}
      <Wall size={[WINDOW.x0 - ROOM_X0, ROOM_H, WALL_T]} position={[(ROOM_X0 + WINDOW.x0) / 2, ROOM_H / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[ROOM_X1 - WINDOW.x1, ROOM_H, WALL_T]} position={[(WINDOW.x1 + ROOM_X1) / 2, ROOM_H / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[WW, WINDOW.y0, WALL_T]} position={[WCX, WINDOW.y0 / 2, BACK_WALL_Z - WALL_T / 2]} />
      <Wall size={[WW, ROOM_H - WINDOW.y1, WALL_T]} position={[WCX, (ROOM_H + WINDOW.y1) / 2, BACK_WALL_Z - WALL_T / 2]} />

      {/* Left wall, built around its window */}
      <Wall size={[WALL_T, ROOM_H, LEFT_WINDOW.z0 - BACK_WALL_Z]} position={[LEFT_WALL_X - WALL_T / 2, ROOM_H / 2, (BACK_WALL_Z + LEFT_WINDOW.z0) / 2]} />
      <Wall size={[WALL_T, ROOM_H, ROOM_Z1 - LEFT_WINDOW.z1]} position={[LEFT_WALL_X - WALL_T / 2, ROOM_H / 2, (LEFT_WINDOW.z1 + ROOM_Z1) / 2]} />
      <Wall size={[WALL_T, LEFT_WINDOW.y0, LWW]} position={[LEFT_WALL_X - WALL_T / 2, LEFT_WINDOW.y0 / 2, LWCZ]} />
      <Wall size={[WALL_T, ROOM_H - LEFT_WINDOW.y1, LWW]} position={[LEFT_WALL_X - WALL_T / 2, (ROOM_H + LEFT_WINDOW.y1) / 2, LWCZ]} />

      {/* Right wall, built around the door opening; the wall behind the chair */}
      <Wall size={[WALL_T, ROOM_H, DOOR.z0 - BACK_WALL_Z]} position={[ROOM_X1 + WALL_T / 2, ROOM_H / 2, (BACK_WALL_Z + DOOR.z0) / 2]} />
      <Wall size={[WALL_T, ROOM_H, ROOM_Z1 - doorZ1]} position={[ROOM_X1 + WALL_T / 2, ROOM_H / 2, (doorZ1 + ROOM_Z1) / 2]} />
      <Wall size={[WALL_T, ROOM_H - DOOR.height, DOOR.width]} position={[ROOM_X1 + WALL_T / 2, (ROOM_H + DOOR.height) / 2, DOOR.z0 + DOOR.width / 2]} />
      <HallBeyond x={ROOM_X1 + WALL_T} z0={BACK_WALL_Z} z1={ROOM_Z1} />
      <Wall size={[ROOM_W, ROOM_H, WALL_T]} position={[ROOM_CX, ROOM_H / 2, ROOM_Z1 + WALL_T / 2]} />

      {/* Cable running down beside the window, and the hook the certificate hangs from */}
      <mesh position={[-0.24, 1.7, BACK_WALL_Z + 0.006]}>
        <cylinderGeometry args={[0.004, 0.004, 1.8, 8]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>
      <mesh position={[-0.62, 1.55, BACK_WALL_Z + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.012, 0.003, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Front window (the one the desk faces): clickable for the Chennai card */}
      <Interactive name="window" label={LABELS.window} labelOffset={[WCX + 0.25, WINDOW.y1 - 0.2, BACK_WALL_Z]}>
        <group position={[WCX, WCY, BACK_WALL_Z - 0.02]}>
          <WindowUnit width={WW} height={WH} />
          <PanelAnchor name="window" width={0.9} height={0.54} position={[0.2, 0.08, 0.05]} />
        </group>
      </Interactive>

      {/* Left window: same build, faces the road, curtains inside */}
      <group position={[LEFT_WALL_X - 0.02, LWCY, LWCZ]} rotation={[0, Math.PI / 2, 0]}>
        <WindowUnit width={LWW} height={LWH} panes={2} columns={6} rows={7} />
      </group>
      <Curtains position={[LEFT_WALL_X + 0.03, LWCY, LWCZ]} width={LWW + 0.3} height={LWH + 0.3} />
      <RoadSide />

      {/* Right side of the room: door (click to open), switches and sockets, the concrete shelf to the inner corner, the bed */}
      <Interactive name="door" label={ALL_LABELS.door} detail={doorOpen ? "click to close" : "click to open"} labelOffset={[ROOM_X1 - 0.2, 2.3, DOOR.z0 + DOOR.width / 2]}>
        <Door position={[ROOM_X1, 0, DOOR.z0]} open={doorOpen} />
      </Interactive>
      <SwitchPanel position={[ROOM_X1, 1.25, doorZ1 + 0.32]} />
      <ConcreteShelf position={[ROOM_X1, 0, ROOM_Z1 - 0.68]} />
      <Bed position={[ROOM_X1 - 0.34 - 0.95, 0, ROOM_Z1 - 0.77]} />

      {/* Clothes hooks beside the window, on the back wall */}
      <ClothesHanger position={[1.9, 1.78, BACK_WALL_Z]} />

      {/* Ceiling fan and the tube light on the wall behind the chair */}
      <CeilingFan position={[ROOM_CX, ROOM_H - 0.36, ROOM_CZ]} />
      <TubeLight position={[ROOM_CX, 2.25, ROOM_Z1]} />
    </group>
  );
}

import { useMemo } from "react";
import * as THREE from "three";
import { makeEditorScreen, makeLaptopDeck } from "../textures";
import { SILVER } from "../materials";
import { useScene } from "../SceneContext";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
const BASE = [0.36, 0.018, 0.24];
const LID = [0.36, 0.23, 0.006];
const STAND_TILT = 0.26; // ~15°
const LID_TILT = -0.41; // relative to the base: lid leans back ~105° open

export const LAPTOP_SCREEN = { width: 0.335, height: 0.2 };

function Cable({ points, radius = 0.003 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 24, radius, 6, false);
  }, [points, radius]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#111" roughness={0.6} />
    </mesh>
  );
}

/** ~15.6" silver laptop on a tilted stand, lid open ~105°, editor on screen. */
export default function Laptop({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn } = useScene();
  const editor = useMemo(makeEditorScreen, []);
  const deck = useMemo(makeLaptopDeck, []);

  return (
    <group name={name} {...props}>
      {/* Stand: two tilted rails, rear risers, front lip */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.15, 0.045, 0]} rotation={[STAND_TILT, 0, 0]} castShadow>
            <boxGeometry args={[0.02, 0.012, 0.27]} />
            <meshStandardMaterial {...SILVER} />
          </mesh>
          <mesh position={[side * 0.15, 0.035, -0.12]} castShadow>
            <boxGeometry args={[0.02, 0.07, 0.02]} />
            <meshStandardMaterial {...SILVER} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.022, 0.13]} castShadow>
        <boxGeometry args={[0.32, 0.024, 0.012]} />
        <meshStandardMaterial {...SILVER} />
      </mesh>

      {/* Base on the stand */}
      <group position={[0, 0.06, 0]} rotation={[STAND_TILT, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={BASE} />
          <meshStandardMaterial {...SILVER} />
        </mesh>
        <mesh position={[0, BASE[1] / 2 + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 0.23]} />
          <meshStandardMaterial map={deck} roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Lid hinged at the back */}
        <group position={[0, BASE[1] / 2, -BASE[2] / 2]} rotation={[LID_TILT, 0, 0]}>
          <mesh position={[0, LID[1] / 2, 0]} castShadow>
            <boxGeometry args={LID} />
            <meshStandardMaterial {...SILVER} />
          </mesh>
          <PanelAnchor name={name} width={LAPTOP_SCREEN.width} height={LAPTOP_SCREEN.height} position={[0, LID[1] / 2 + 0.004, LID[2] / 2 + 0.0015]} />
          <mesh position={[0, LID[1] / 2 + 0.004, LID[2] / 2 + 0.0005]}>
            <planeGeometry args={[LAPTOP_SCREEN.width, LAPTOP_SCREEN.height]} />
            <meshStandardMaterial
              map={editor}
              emissiveMap={editor}
              emissive="#ffffff"
              emissiveIntensity={lightsOn ? 0.5 : 0.95}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* One charger cable off the right side, running straight back behind the desk */}
      <Cable points={[[0.18, 0.072, -0.06], [0.215, 0.05, -0.08], [0.225, 0.004, -0.14], [0.225, 0.003, -0.3], [0.225, -0.1, -0.32]]} />
    </group>
  );
}

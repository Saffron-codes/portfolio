import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CASE, KEY, KEYS } from "./keyboardLayout";
import { BLACK_PLASTIC, LAVENDER } from "../materials";
import { useScene } from "../SceneContext";
import PanelAnchor from "../PanelAnchor";
import { keyboardEvents } from "../keyboardStore";

/* eslint-disable no-unused-vars */
export { KEYS };

function CoiledCable() {
  const geometry = useMemo(() => {
    const points = [];
    const x0 = -0.1;
    const zStart = -CASE.depth / 2 - 0.004;
    for (let i = 0; i <= 60; i += 1) {
      const t = i / 60;
      const angle = t * Math.PI * 2 * 7;
      points.push(new THREE.Vector3(x0 + Math.cos(angle) * 0.007, 0.012 + Math.sin(angle) * 0.007, zStart - t * 0.085));
    }
    points.push(new THREE.Vector3(x0 - 0.01, 0.003, zStart - 0.13));
    points.push(new THREE.Vector3(x0 - 0.05, 0.002, zStart - 0.2));
    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, 240, 0.0022, 6, false);
  }, []);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#111" roughness={0.6} />
    </mesh>
  );
}

const PRESS_DEPTH = 0.004;
const PRESS_TIME = 0.28;
const FLASH = new THREE.Color("#dcd6ff");

/**
 * Animates keycap presses: `press(label)` dips one key, `ripple()` sweeps every key left to
 * right. Driven by keyboardEvents (DOM key presses / section open).
 */
function useKeyAnimation(instanceRefs, keyTop, active) {
  const presses = useRef(new Map()); // key index → press start time (s)
  const clockRef = useRef(0);
  const baseColors = useMemo(() => KEYS.map((key) => new THREE.Color(key.kind === "mod" ? LAVENDER : "#1c1c1c")), []);

  useEffect(() => {
    const schedule = (index, delay = 0) => presses.current.set(index, clockRef.current + delay);
    return keyboardEvents.subscribe((event) => {
      if (event.type === "ripple") {
        KEYS.forEach((key, index) => schedule(index, (key.x + CASE.width / 2) * 2.2));
      } else if (event.type === "press") {
        KEYS.forEach((key, index) => {
          if (key.label === event.label) schedule(index);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (active) keyboardEvents.ripple();
  }, [active]);

  useFrame(({ clock }) => {
    clockRef.current = clock.getElapsedTime();
    const now = clockRef.current;
    presses.current.forEach((start, index) => {
      const instance = instanceRefs.current[index];
      if (!instance) return;
      const t = (now - start) / PRESS_TIME;
      if (t < 0) return;
      if (t >= 1) {
        presses.current.delete(index);
        instance.position.y = keyTop + KEY.height / 2;
        instance.color.copy(baseColors[index]);
        return;
      }
      const bump = Math.sin(t * Math.PI);
      instance.position.y = keyTop + KEY.height / 2 - PRESS_DEPTH * bump;
      instance.color.copy(baseColors[index]).lerp(FLASH, bump * 0.9);
    });
  });
}

/** 75% mechanical keyboard: black case, ~84 instanced keycaps, lavender modifiers, knob, RGB underglow. */
export default function Keyboard({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn } = useScene();
  const keycap = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);
  const keyTop = CASE.height - 0.004;
  const instanceRefs = useRef([]);
  useKeyAnimation(instanceRefs, keyTop, active);

  return (
    <group name={name} {...props}>
      <mesh position={[0, CASE.height / 2, 0]} castShadow>
        <boxGeometry args={[CASE.width, CASE.height, CASE.depth]} />
        <meshStandardMaterial {...BLACK_PLASTIC} />
      </mesh>
      {/* RGB underglow: a glowing plate the keys sit on (colour cycles in Phase 6) */}
      <mesh position={[0, keyTop + 0.0005, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
        <planeGeometry args={[CASE.width - 0.012, CASE.depth - 0.012]} />
        <meshStandardMaterial color="#5b6cff" emissive="#5b6cff" emissiveIntensity={lightsOn ? 1.2 : 2.2} roughness={1} />
      </mesh>
      <Instances limit={KEYS.length} geometry={keycap} castShadow frustumCulled={false}>
        <meshStandardMaterial roughness={0.6} />
        {KEYS.map((key, index) => (
          <Instance
            key={key.id}
            ref={(el) => {
              instanceRefs.current[index] = el;
            }}
            position={[key.x, keyTop + KEY.height / 2, key.z]}
            scale={[key.w, KEY.height, key.d]}
            color={key.kind === "mod" ? LAVENDER : "#1c1c1c"}
          />
        ))}
      </Instances>
      {/* Knob, top right */}
      <mesh position={[CASE.width / 2 - 0.016, keyTop + 0.006, -CASE.depth / 2 + 0.015]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.012, 20]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.35} metalness={0.7} />
      </mesh>
      <CoiledCable />
      {/* Skills panel floats above and behind the keys */}
      <PanelAnchor name={name} width={0.34} height={0.135} position={[0, 0.12, -0.09]} rotation={[-0.45, 0, 0]} />
    </group>
  );
}

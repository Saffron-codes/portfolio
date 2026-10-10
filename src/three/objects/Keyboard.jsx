import { useMemo } from "react";
import * as THREE from "three";
import { Instance, Instances } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { CASE, KEY, KEYS } from "./keyboardLayout";
import { BLACK_PLASTIC, LAVENDER } from "../materials";
import { useScene } from "../SceneContext";

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

/** 75% mechanical keyboard: black case, ~84 instanced keycaps, lavender modifiers, knob, RGB underglow. */
export default function Keyboard({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn } = useScene();
  const keycap = useMemo(() => new RoundedBoxGeometry(1, 1, 1, 2, 0.12), []);
  const keyTop = CASE.height - 0.004;

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
        {KEYS.map((key) => (
          <Instance
            key={key.id}
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
    </group>
  );
}

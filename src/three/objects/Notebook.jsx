import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import PanelAnchor from "../PanelAnchor";
import { useScene } from "../SceneContext";
import { requestShadowUpdate } from "../shadows";

/* eslint-disable no-unused-vars */
const W = 0.148;
const D = 0.21;
const H = 0.015;

/** A5 notebook: teal cloth cover, cream page block, black elastic band. The cover opens when active. */
export default function Notebook({ name, onSelect, hovered, active, ...props }) {
  const { reducedMotion } = useScene();
  const lid = useRef(null);
  const cover = <meshStandardMaterial color="#2e6b6b" roughness={0.92} />;

  useFrame((_, delta) => {
    if (!lid.current) return;
    const target = active ? Math.PI * 0.96 : 0;
    const current = lid.current.rotation.z;
    if (Math.abs(current - target) < 0.001) return;
    lid.current.rotation.z = reducedMotion ? target : MathUtils.damp(current, target, 6, delta);
    requestShadowUpdate(1);
  });

  return (
    <group name={name} {...props}>
      <mesh position={[0, 0.0015, 0]} castShadow>
        <boxGeometry args={[W, 0.003, D]} />
        {cover}
      </mesh>
      {/* Top cover, hinged at the spine */}
      <group ref={lid} position={[-W / 2, H, 0]}>
        <mesh position={[W / 2, -0.0015, 0]} castShadow>
          <boxGeometry args={[W, 0.003, D]} />
          {cover}
        </mesh>
        <mesh position={[W / 2 - 0.028, -0.003, 0]}>
          <boxGeometry args={[0.006, 0.0012, D + 0.0012]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[-W / 2 + 0.003, H / 2, 0]} castShadow>
        <boxGeometry args={[0.006, H, D]} />
        {cover}
      </mesh>
      {/* Pages */}
      <mesh position={[0.002, H / 2, 0]}>
        <boxGeometry args={[W - 0.008, H - 0.006, D - 0.006]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.95} />
      </mesh>
      {/* Elastic band (around the page block and bottom cover) */}
      <mesh position={[W / 2 - 0.028, (H - 0.003) / 2, 0]}>
        <boxGeometry args={[0.006, H - 0.003 + 0.0008, D + 0.0012]} />
        <meshStandardMaterial color="#111" roughness={0.9} />
      </mesh>
      <PanelAnchor name={name} width={W - 0.012} height={D - 0.012} position={[0.002, H - 0.0025, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

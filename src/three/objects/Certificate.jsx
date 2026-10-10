import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { makeCertificate } from "../textures";
import education from "../../data/education";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
const W = 0.3;
const H = 0.22;
const T = 0.015;
const HOOK_ABOVE = 0.15; // the wall hook sits this far above the frame centre

/** Framed certificate 0.30 × 0.22 hanging from the wall hook by a string. Origin = frame centre on the wall. */
export default function Certificate({ name, onSelect, hovered, active, ...props }) {
  const paper = useMemo(() => makeCertificate(education[0]), []);
  const wood = <meshStandardMaterial color="#6b4a2f" roughness={0.65} />;
  return (
    <group name={name} {...props}>
      <mesh position={[0, H / 2 - T / 2, 0.006]} castShadow>
        <boxGeometry args={[W, T, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[0, -H / 2 + T / 2, 0.006]} castShadow>
        <boxGeometry args={[W, T, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[-W / 2 + T / 2, 0, 0.006]} castShadow>
        <boxGeometry args={[T, H, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[W / 2 - T / 2, 0, 0.006]} castShadow>
        <boxGeometry args={[T, H, 0.012]} />
        {wood}
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[W - T * 2 + 0.004, H - T * 2 + 0.004]} />
        <meshStandardMaterial map={paper} roughness={0.9} />
      </mesh>
      <PanelAnchor name={name} width={W - T * 2 + 0.004} height={H - T * 2 + 0.004} position={[0, 0, 0.0125]} />
      {/* Hanging string */}
      <Line points={[[0, HOOK_ABOVE, 0.004], [-W / 2 + 0.03, H / 2 - 0.01, 0.004]]} color="#444" lineWidth={1} />
      <Line points={[[0, HOOK_ABOVE, 0.004], [W / 2 - 0.03, H / 2 - 0.01, 0.004]]} color="#444" lineWidth={1} />
    </group>
  );
}

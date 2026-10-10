import { useMemo } from "react";
import { makeMonitorWallpaper } from "../textures";
import { BLACK_PLASTIC } from "../materials";
import { useScene } from "../SceneContext";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
export const MONITOR_SCREEN = { width: 0.485, height: 0.285, center: [0, 0.27, 0.0135] };

/** ~22" monitor: 0.50 × 0.30 panel, bottom edge 0.12 above the desk, thin neck, V stand. */
export default function Monitor({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn } = useScene();
  const wallpaper = useMemo(makeMonitorWallpaper, []);
  const s = MONITOR_SCREEN;

  return (
    <group name={name} {...props}>
      {/* Stand hub + V legs */}
      <mesh position={[0, 0.0075, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.034, 0.015, 24]} />
        <meshStandardMaterial {...BLACK_PLASTIC} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.05, 0.006, 0.07]} rotation={[0, -side * 0.62, 0]} castShadow>
          <boxGeometry args={[0.022, 0.012, 0.17]} />
          <meshStandardMaterial {...BLACK_PLASTIC} />
        </mesh>
      ))}
      {/* Neck */}
      <mesh position={[0, 0.075, -0.004]} castShadow>
        <boxGeometry args={[0.03, 0.13, 0.014]} />
        <meshStandardMaterial {...BLACK_PLASTIC} />
      </mesh>
      {/* Panel */}
      <mesh position={[0, 0.27, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.025]} />
        <meshStandardMaterial color="#121212" roughness={0.5} />
      </mesh>
      {/* Screen */}
      <mesh position={s.center}>
        <planeGeometry args={[s.width, s.height]} />
        <meshStandardMaterial
          map={wallpaper}
          emissiveMap={wallpaper}
          emissive="#ffffff"
          emissiveIntensity={lightsOn ? 0.55 : 1.0}
          roughness={0.55}
        />
      </mesh>
      <PanelAnchor name={name} width={s.width} height={s.height} position={[s.center[0], s.center[1], s.center[2] + 0.001]} />
      {/* Power LED */}
      <mesh position={[0.22, 0.125, 0.0135]}>
        <circleGeometry args={[0.0025, 12]} />
        <meshStandardMaterial color="#2bd36a" emissive="#2bd36a" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

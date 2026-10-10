import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScene } from "./SceneContext";
import { seeded } from "./textures";

const COUNT = 140;
// A slanted box from the window down toward the desk: where the sunbeam lives.
const BOX = { x: [0.3, 1.25], y: [0.85, 1.9], z: [-0.28, 0.4] };

/** Faint dust motes drifting in the window light by day (clear or cloudy, motion allowed). */
export default function Atmosphere() {
  const { sky, weather, reducedMotion, lightsOn } = useScene();
  const points = useRef(null);
  const motes = useMemo(() => {
    const rand = seeded(99);
    const positions = new Float32Array(COUNT * 3);
    const drift = [];
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] = BOX.x[0] + rand() * (BOX.x[1] - BOX.x[0]);
      positions[i * 3 + 1] = BOX.y[0] + rand() * (BOX.y[1] - BOX.y[0]);
      positions[i * 3 + 2] = BOX.z[0] + rand() * (BOX.z[1] - BOX.z[0]);
      drift.push({ phase: rand() * Math.PI * 2, speed: 0.4 + rand() * 0.6 });
    }
    return { positions, drift };
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    const attr = points.current.geometry.attributes.position;
    for (let i = 0; i < COUNT; i += 1) {
      const d = motes.drift[i];
      attr.array[i * 3] += Math.sin(t * d.speed + d.phase) * 0.00012;
      attr.array[i * 3 + 1] += Math.cos(t * d.speed * 0.7 + d.phase) * 0.00008 - 0.00003;
      if (attr.array[i * 3 + 1] < BOX.y[0]) attr.array[i * 3 + 1] = BOX.y[1];
    }
    attr.needsUpdate = true;
  });

  const daytime = sky !== "night";
  const clearish = weather.state === "clear" || weather.state === "cloudy";
  if (!daytime || !clearish || reducedMotion) return null;

  return (
    <points ref={points} userData={{ noShadow: true }} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[motes.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.005} color="#fff1cf" transparent opacity={lightsOn ? 0.22 : 0.4} depthWrite={false} sizeAttenuation />
    </points>
  );
}

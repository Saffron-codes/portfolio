import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { seeded } from "./textures";
import { BACK_WALL_Z } from "./layout";
import { WINDOW } from "./Room";

const dummy = new THREE.Object3D();

/* ---------------- Clouds ---------------- */
const CLOUDS = (() => {
  const rand = seeded(23);
  const clouds = [];
  for (let i = 0; i < 7; i += 1) {
    const puffs = [];
    const count = 4 + Math.floor(rand() * 3);
    for (let j = 0; j < count; j += 1) {
      puffs.push({
        offset: [(j - count / 2) * 0.55 + rand() * 0.3, rand() * 0.25, rand() * 0.3],
        scale: 0.45 + rand() * 0.45,
      });
    }
    clouds.push({ x: -4 + i * 1.6 + rand(), y: 3.2 + rand() * 1.4, z: -5.5 - rand() * 1.5, speed: 0.04 + rand() * 0.03, puffs });
  }
  return clouds;
})();

/** Low-poly clouds drifting slowly behind the tree. Darker when it rains. */
function Clouds({ state }) {
  const { reducedMotion, isNight } = useScene();
  const groups = useRef([]);
  const dark = state === "rain" || state === "thunderstorm";
  const color = isNight ? (dark ? "#2a3144" : "#3b4360") : dark ? "#8a929b" : "#eef1f3";

  useFrame((_, delta) => {
    if (reducedMotion) return;
    groups.current.forEach((group, i) => {
      if (!group) return;
      group.position.x += CLOUDS[i].speed * delta;
      if (group.position.x > 7) group.position.x = -5;
    });
  });

  return (
    <group>
      {CLOUDS.map((cloud, i) => (
        <group
          key={i}
          ref={(el) => {
            groups.current[i] = el;
          }}
          position={[cloud.x, cloud.y, cloud.z]}
        >
          <Instances limit={8} frustumCulled={false}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={color} roughness={1} flatShading />
            {cloud.puffs.map((puff, j) => (
              <Instance key={j} position={puff.offset} scale={[puff.scale * 1.4, puff.scale * 0.8, puff.scale]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
}

/* ---------------- Rain ---------------- */
const RAIN_COUNT = 420;
const RAIN_BOX = { x: [-0.6, 2.2], y: [0.2, 3.4], z: [-0.6, -2.8] };

/** Instanced rain streaks falling outside the window. Static (hidden) under reduced motion. */
function Rain({ heavy }) {
  const { reducedMotion } = useScene();
  const mesh = useRef(null);
  const drops = useMemo(() => {
    const rand = seeded(77);
    return Array.from({ length: RAIN_COUNT }, () => ({
      x: RAIN_BOX.x[0] + rand() * (RAIN_BOX.x[1] - RAIN_BOX.x[0]),
      y: RAIN_BOX.y[0] + rand() * (RAIN_BOX.y[1] - RAIN_BOX.y[0]),
      z: RAIN_BOX.z[0] + rand() * (RAIN_BOX.z[1] - RAIN_BOX.z[0]),
      speed: 3 + rand() * 2.5,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current || reducedMotion) return;
    drops.forEach((drop, i) => {
      drop.y -= drop.speed * delta;
      if (drop.y < RAIN_BOX.y[0]) drop.y = RAIN_BOX.y[1];
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.rotation.set(0, 0, 0.08);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (reducedMotion) return null;
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, RAIN_COUNT]} frustumCulled={false} userData={{ noShadow: true }}>
      <boxGeometry args={[0.003, heavy ? 0.3 : 0.22, 0.003]} />
      <meshBasicMaterial color="#c9d3dc" transparent opacity={heavy ? 0.55 : 0.4} depthWrite={false} />
    </instancedMesh>
  );
}

/* ---------------- Droplets on the glass ---------------- */
const DROPLET_COUNT = 16;

function Droplets() {
  const { reducedMotion } = useScene();
  const mesh = useRef(null);
  const drops = useMemo(() => {
    const rand = seeded(5);
    return Array.from({ length: DROPLET_COUNT }, () => ({
      x: WINDOW.x0 + 0.08 + rand() * (WINDOW.x1 - WINDOW.x0 - 0.16),
      y: WINDOW.y0 + rand() * (WINDOW.y1 - WINDOW.y0),
      speed: 0.02 + rand() * 0.05,
      size: 0.6 + rand() * 0.6,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    drops.forEach((drop, i) => {
      if (!reducedMotion) {
        drop.y -= drop.speed * delta;
        if (drop.y < WINDOW.y0 + 0.08) drop.y = WINDOW.y1 - 0.08;
      }
      dummy.position.set(drop.x, drop.y, BACK_WALL_Z - 0.035);
      dummy.scale.setScalar(drop.size);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, DROPLET_COUNT]} frustumCulled={false} userData={{ noShadow: true }}>
      <sphereGeometry args={[0.006, 8, 8]} />
      <meshStandardMaterial color="#dfe9f2" transparent opacity={0.7} roughness={0.1} metalness={0.2} />
    </instancedMesh>
  );
}

/* ---------------- Lightning ---------------- */
/** Occasional flash through the window that briefly lights the room. */
function Lightning() {
  const { reducedMotion } = useScene();
  const light = useRef(null);
  const state = useRef({ next: 3 + Math.random() * 6, flashUntil: 0, second: 0 });

  useFrame(({ clock }) => {
    if (!light.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;
    if (t > s.next) {
      s.flashUntil = t + 0.14;
      s.second = Math.random() < 0.5 ? t + 0.25 : 0;
      s.next = t + 5 + Math.random() * 9;
    }
    let intensity = 0;
    if (t < s.flashUntil) intensity = 6;
    else if (s.second && t > s.second && t < s.second + 0.1) intensity = 4;
    light.current.intensity = intensity;
  });

  useEffect(() => {
    if (light.current) light.current.target.position.set(0, 0.9, 0.3);
  }, []);

  if (reducedMotion) return null;
  return <directionalLight ref={light} position={[0.8, 3, -2.5]} intensity={0} color="#dfe7ff" />;
}

/**
 * Everything weather-driven: clouds, rain, droplets, fog and lightning.
 * The sky colour and sun intensity respond in Backdrop and Lights.
 */
export default function Weather() {
  const { weather } = useScene();
  const { state } = weather;
  const raining = state === "rain" || state === "thunderstorm";
  // Rendered as a fragment so <fog attach="fog"> attaches to the scene, not a group.
  return (
    <>
      {(state === "cloudy" || raining) && <Clouds state={state} />}
      {raining && <Rain heavy={state === "thunderstorm"} />}
      {raining && <Droplets />}
      {state === "thunderstorm" && <Lightning />}
      {state === "fog" && <fog attach="fog" args={["#cfd3d6", 2.4, 6.5]} />}
      {raining && <fog attach="fog" args={["#9aa3ad", 3.5, 12]} />}
    </>
  );
}

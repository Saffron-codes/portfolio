import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { seeded } from "./textures";
import { BACK_WALL_Z } from "./layout";
import { WINDOW } from "./Room";
import { skyState, windFor } from "./Backdrop";

const dummy = new THREE.Object3D();

/** Rain look per intensity: Chennai monsoon rain is dense, fast and wind-slanted. */
const RAIN = {
  light: { count: 220, length: 0.16, speed: 2.6, slant: 0.08, opacity: 0.3 },
  medium: { count: 520, length: 0.26, speed: 4.5, slant: 0.18, opacity: 0.42 },
  heavy: { count: 900, length: 0.4, speed: 6.5, slant: 0.3, opacity: 0.55 },
};

function rainProfile(weather) {
  if (weather.state === "thunderstorm") return RAIN.heavy;
  return RAIN[weather.intensity] ?? RAIN.medium;
}

/* ---------------- Clouds ---------------- */
const CLOUDS = (() => {
  const rand = seeded(23);
  const clouds = [];
  for (let i = 0; i < 10; i += 1) {
    const puffs = [];
    const count = 4 + Math.floor(rand() * 3);
    for (let j = 0; j < count; j += 1) {
      puffs.push({
        offset: [(j - count / 2) * 0.6 + rand() * 0.3, rand() * 0.25, rand() * 0.3],
        scale: 0.5 + rand() * 0.5,
      });
    }
    clouds.push({ x: -6 + i * 1.5 + rand(), y: 3.0 + rand() * 1.5, z: -5.5 - rand() * 1.5, speed: 0.04 + rand() * 0.03, puffs });
  }
  return clouds;
})();

/** Low-poly clouds drifting behind the tree: bright and high when overcast, low slate when it rains. */
function Clouds() {
  const { reducedMotion, isNight, weather } = useScene();
  const groups = useRef([]);
  const wind = windFor(weather);
  const cover = Math.min(100, Math.max(0, weather.cloudCover ?? 0));
  const shown = Math.max(2, Math.round((CLOUDS.length * cover) / 100));
  const raining = weather.state === "rain" || weather.state === "thunderstorm";
  const heavy = weather.state === "thunderstorm" || weather.intensity === "heavy";
  const color = isNight ? (raining ? "#1a2029" : "#3b4360") : raining ? (heavy ? "#4a535d" : "#7d868f") : "#f2f4f6";
  const drop = raining ? -0.8 : 0;

  useFrame((_, delta) => {
    if (reducedMotion) return;
    groups.current.forEach((group, i) => {
      if (!group) return;
      group.position.x += CLOUDS[i].speed * wind * delta;
      if (group.position.x > 8) group.position.x = -7;
    });
  });

  return (
    <group>
      {CLOUDS.slice(0, shown).map((cloud, i) => (
        <group
          key={i}
          ref={(el) => {
            groups.current[i] = el;
          }}
          position={[cloud.x, cloud.y + drop, cloud.z]}
        >
          <Instances limit={8} frustumCulled={false}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={color} roughness={1} flatShading />
            {cloud.puffs.map((puff, j) => (
              <Instance key={j} position={puff.offset} scale={[puff.scale * 1.5, puff.scale * (raining ? 0.6 : 0.8), puff.scale]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
}

/* ---------------- Rain ---------------- */
const RAIN_BOX = { x: [-1.0, 2.6], y: [0.2, 3.6], z: [-0.6, -3.0] };

/** Instanced rain streaks outside the window, slanted by the wind. Hidden under reduced motion. */
function Rain({ profile }) {
  const { reducedMotion } = useScene();
  const mesh = useRef(null);
  const drops = useMemo(() => {
    const rand = seeded(77);
    return Array.from({ length: profile.count }, () => ({
      x: RAIN_BOX.x[0] + rand() * (RAIN_BOX.x[1] - RAIN_BOX.x[0]),
      y: RAIN_BOX.y[0] + rand() * (RAIN_BOX.y[1] - RAIN_BOX.y[0]),
      z: RAIN_BOX.z[0] + rand() * (RAIN_BOX.z[1] - RAIN_BOX.z[0]),
      speed: profile.speed * (0.8 + rand() * 0.5),
    }));
  }, [profile]);

  useFrame((_, delta) => {
    if (!mesh.current || reducedMotion) return;
    const driftX = Math.tan(profile.slant);
    drops.forEach((drop, i) => {
      drop.y -= drop.speed * delta;
      drop.x -= drop.speed * driftX * delta;
      if (drop.y < RAIN_BOX.y[0]) {
        drop.y = RAIN_BOX.y[1];
        drop.x = RAIN_BOX.x[0] + Math.random() * (RAIN_BOX.x[1] - RAIN_BOX.x[0]);
      }
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.rotation.set(0, 0, profile.slant);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (reducedMotion) return null;
  return (
    <instancedMesh key={profile.count} ref={mesh} args={[undefined, undefined, profile.count]} frustumCulled={false} userData={{ noShadow: true }}>
      <boxGeometry args={[0.0035, profile.length, 0.0035]} />
      <meshBasicMaterial color="#d6dee6" transparent opacity={profile.opacity} depthWrite={false} />
    </instancedMesh>
  );
}

/* ---------------- Droplets on the mesh/glass ---------------- */
function Droplets({ profile }) {
  const { reducedMotion } = useScene();
  const mesh = useRef(null);
  const count = profile === RAIN.light ? 10 : profile === RAIN.heavy ? 40 : 22;
  const drops = useMemo(() => {
    const rand = seeded(5);
    return Array.from({ length: count }, () => ({
      x: WINDOW.x0 + 0.08 + rand() * (WINDOW.x1 - WINDOW.x0 - 0.16),
      y: WINDOW.y0 + rand() * (WINDOW.y1 - WINDOW.y0),
      speed: (0.03 + rand() * 0.07) * (profile === RAIN.heavy ? 2 : 1),
      size: 0.6 + rand() * 0.7,
    }));
  }, [count, profile]);

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
    <instancedMesh key={count} ref={mesh} args={[undefined, undefined, count]} frustumCulled={false} userData={{ noShadow: true }}>
      <sphereGeometry args={[0.006, 8, 8]} />
      <meshStandardMaterial color="#dfe9f2" transparent opacity={0.7} roughness={0.1} metalness={0.2} />
    </instancedMesh>
  );
}

/* ---------------- Water sheeting off the sunshade ---------------- */
const DRIP_COUNT = 18;
const SHADE_EDGE = { x: [-0.35, 1.45], y: 1.56, z: -1.42 };

/** Drips falling from the outer edge of the sunshade, as they do in a Chennai downpour. */
function ShadeDrips({ heavy }) {
  const { reducedMotion } = useScene();
  const mesh = useRef(null);
  const drips = useMemo(() => {
    const rand = seeded(31);
    return Array.from({ length: DRIP_COUNT }, () => ({
      x: SHADE_EDGE.x[0] + rand() * (SHADE_EDGE.x[1] - SHADE_EDGE.x[0]),
      y: SHADE_EDGE.y - rand() * 1.5,
      speed: 2.2 + rand() * 1.2,
    }));
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current || reducedMotion) return;
    drips.forEach((drip, i) => {
      drip.y -= drip.speed * delta;
      if (drip.y < 0) drip.y = SHADE_EDGE.y;
      dummy.position.set(drip.x, drip.y, SHADE_EDGE.z);
      dummy.scale.set(1, heavy ? 2.4 : 1.6, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  if (reducedMotion) return null;
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, DRIP_COUNT]} frustumCulled={false} userData={{ noShadow: true }}>
      <sphereGeometry args={[0.007, 6, 6]} />
      <meshBasicMaterial color="#e3ebf2" transparent opacity={0.75} depthWrite={false} />
    </instancedMesh>
  );
}

/* ---------------- Lightning ---------------- */
/** Frequent monsoon lightning: a flash through the window that lights the room and whitens the sky. */
function Lightning() {
  const { reducedMotion } = useScene();
  const light = useRef(null);
  const state = useRef({ next: 2 + Math.random() * 4, flashUntil: 0, second: 0 });

  useFrame(({ clock }) => {
    if (!light.current) return;
    const t = clock.getElapsedTime();
    const s = state.current;
    if (t > s.next) {
      s.flashUntil = t + 0.12;
      s.second = Math.random() < 0.6 ? t + 0.22 : 0;
      s.next = t + 3 + Math.random() * 7;
    }
    let intensity = 0;
    if (t < s.flashUntil) intensity = 7;
    else if (s.second && t > s.second && t < s.second + 0.09) intensity = 5;
    light.current.intensity = intensity;
    if (skyState.material) skyState.material.uniforms.flash.value = intensity / 7;
  });

  useEffect(() => {
    if (light.current) light.current.target.position.set(0, 0.9, 0.3);
    return () => {
      if (skyState.material) skyState.material.uniforms.flash.value = 0;
    };
  }, []);

  if (reducedMotion) return null;
  return <directionalLight ref={light} position={[0.8, 3, -2.5]} intensity={0} color="#e4ebff" />;
}

/**
 * Everything weather-driven: clouds, rain, droplets, drips, fog, haze and lightning.
 * Sky colour, sun and wind respond in Backdrop and Lights.
 */
export default function Weather() {
  const { weather, isNight } = useScene();
  const { state } = weather;
  const raining = state === "rain" || state === "thunderstorm";
  const profile = raining ? rainProfile(weather) : null;
  const heavy = profile === RAIN.heavy;
  // Rendered as a fragment so <fog attach="fog"> attaches to the scene, not a group.
  return (
    <>
      {(raining || (weather.cloudCover ?? 0) > 15) && <Clouds />}
      {raining && <Rain profile={profile} />}
      {raining && <Droplets profile={profile} />}
      {raining && <ShadeDrips heavy={heavy} />}
      {state === "thunderstorm" && <Lightning />}
      {state === "fog" && <fog attach="fog" args={["#cfd3d6", 2.4, 6.5]} />}
      {raining && <fog attach="fog" args={[heavy ? "#6b7682" : "#9aa3ad", heavy ? 3 : 3.8, heavy ? 9 : 13]} />}
      {/* Humid haze on a clear or overcast day: far things go milky */}
      {!raining && state !== "fog" && !isNight && <fog attach="fog" args={[state === "cloudy" ? "#e4e8ea" : "#dfe8ee", 5.5, 24]} />}
    </>
  );
}

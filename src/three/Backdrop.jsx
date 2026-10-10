import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { seeded } from "./textures";

/** Sky colours per Chennai time-of-day phase (top, bottom). */
/**
 * Chennai skies: humid and hazy. Even a clear day fades to a milky white near the horizon,
 * overcast is bright white rather than gloomy, and monsoon rain is dark slate.
 */
export const SKY = {
  dawn: ["#f2a46c", "#fde6cf"],
  day: ["#5aa6dc", "#eaf0f3"],
  sunset: ["#6a4f8f", "#f8b27a"],
  night: ["#070c1e", "#1e2b55"],
};

/** Shared with Weather.jsx so lightning can flash the sky. */
export const skyState = { material: null };

const skyShader = {
  uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() }, flash: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform vec3 top; uniform vec3 bottom; uniform float flash; varying vec2 vUv;
    void main(){
      vec3 c = mix(bottom, top, pow(clamp(vUv.y, 0.0, 1.0), 0.75));
      c = mix(c, vec3(0.92, 0.94, 1.0), flash);
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

/** Greyer, flatter skies for cloud, rain and fog. */
export function skyColorsFor(sky, state, intensity = "none") {
  const night = sky === "night";
  if (state === "cloudy") return night ? ["#161c2c", "#2a3140"] : ["#c9d0d6", "#eef0f2"];
  if (state === "fog") return night ? ["#1a1f2a", "#2c323c"] : ["#c6ccd0", "#e3e6e8"];
  if (state === "rain" || state === "thunderstorm") {
    const heavy = state === "thunderstorm" || intensity === "heavy";
    if (night) return heavy ? ["#06080e", "#141a22"] : ["#0a0e16", "#1c222c"];
    if (heavy) return ["#2e3842", "#5b6671"];
    return intensity === "light" ? ["#7a8591", "#aab3bc"] : ["#4a5663", "#8b96a1"];
  }
  return SKY[sky] ?? SKY.day;
}

function Sky({ sky, state, intensity }) {
  const material = useMemo(() => new THREE.ShaderMaterial({ ...skyShader, uniforms: THREE.UniformsUtils.clone(skyShader.uniforms) }), []);
  const [top, bottom] = skyColorsFor(sky, state, intensity);
  material.uniforms.top.value.set(top);
  material.uniforms.bottom.value.set(bottom);
  useEffect(() => {
    skyState.material = material;
    return () => {
      if (skyState.material === material) skyState.material = null;
    };
  }, [material]);
  return (
    <mesh position={[0.5, 3.5, -7]} material={material} userData={{ noShadow: true }}>
      <planeGeometry args={[30, 14]} />
    </mesh>
  );
}

const LEAF_CLUSTERS = (() => {
  const rand = seeded(11);
  const clusters = [];
  for (let i = 0; i < 20; i += 1) {
    const angle = rand() * Math.PI * 2;
    const spread = 0.3 + rand() * 1.1;
    clusters.push({
      position: [Math.cos(angle) * spread, 1.5 + rand() * 1.4, Math.sin(angle) * spread * 0.7],
      radius: 0.36 + rand() * 0.34,
      color: i % 3 === 0 ? "#4f8a3c" : i % 3 === 1 ? "#6aa84f" : "#3f7a35",
      phase: rand() * Math.PI * 2,
    });
  }
  return clusters;
})();

const BRANCHES = [
  { rotation: [0, 0, 0.55], position: [0.12, 1.4, 0], length: 0.9 },
  { rotation: [0, 0, -0.6], position: [-0.12, 1.6, 0.05], length: 0.8 },
  { rotation: [0.5, 0, 0.1], position: [0.02, 1.8, 0.1], length: 0.7 },
  { rotation: [-0.5, 0, -0.15], position: [-0.03, 1.5, -0.1], length: 0.75 },
];

/** How hard the wind blows per weather state (monsoon rain comes with gusts). */
export function windFor(weather) {
  if (weather.state === "thunderstorm") return 4;
  if (weather.state === "rain") return weather.intensity === "heavy" ? 3.2 : weather.intensity === "light" ? 1.6 : 2.4;
  if (weather.state === "cloudy") return 1.4;
  return 1;
}

/** Stylised low-poly tree ~3 m behind the window; leaf clusters sway, harder in monsoon wind. */
function Tree({ position }) {
  const { reducedMotion, weather } = useScene();
  const leaves = useRef(null);
  const wind = windFor(weather);
  useFrame(({ clock }) => {
    if (reducedMotion || !leaves.current) return;
    const t = clock.getElapsedTime();
    const gust = wind > 1.5 ? Math.sin(t * 2.3) * Math.sin(t * 0.7) * 0.5 + 0.5 : 0;
    leaves.current.rotation.z = Math.sin(t * 0.5 * wind) * 0.02 * wind + gust * 0.03;
    leaves.current.rotation.x = Math.sin(t * 0.35 * wind + 1) * 0.015 * wind;
  });
  const bark = <meshStandardMaterial color="#5a3a22" roughness={0.9} />;
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]} userData={{ noShadow: true }}>
        <cylinderGeometry args={[0.09, 0.14, 1.8, 8]} />
        {bark}
      </mesh>
      {BRANCHES.map((branch, i) => (
        <group key={i} position={branch.position} rotation={branch.rotation}>
          <mesh position={[0, branch.length / 2, 0]} userData={{ noShadow: true }}>
            <cylinderGeometry args={[0.03, 0.06, branch.length, 6]} />
            {bark}
          </mesh>
        </group>
      ))}
      <group ref={leaves} position={[0, 2.0, 0]}>
        {LEAF_CLUSTERS.map((leaf, i) => (
          <mesh key={i} position={[leaf.position[0], leaf.position[1] - 2.0, leaf.position[2]]} userData={{ noShadow: true }}>
            <icosahedronGeometry args={[leaf.radius, 0]} />
            <meshStandardMaterial color={leaf.color} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Everything outside the window: sky, ground, tree, sunshade, moon and stars at night. */
export default function Backdrop() {
  const { sky, isNight, weather } = useScene();
  const overcast = weather.state !== "clear";
  const wet = weather.state === "rain" || weather.state === "thunderstorm";
  return (
    <group>
      <Sky sky={sky} state={weather.state} intensity={weather.intensity} />
      {/* Ground outside: dusty green when dry, dark and glossy when wet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, -0.02, -4]} userData={{ noShadow: true }}>
        <planeGeometry args={[24, 10]} />
        <meshStandardMaterial color={wet ? "#3f4a3c" : "#7a8460"} roughness={wet ? 0.25 : 1} metalness={wet ? 0.1 : 0} />
      </mesh>
      {/* Low wall / compound line in the distance */}
      <mesh position={[0.5, 0.45, -5.5]} userData={{ noShadow: true }}>
        <boxGeometry args={[24, 0.9, 0.2]} />
        <meshStandardMaterial color="#c9b9a2" roughness={1} />
      </mesh>
      <Tree position={[0.95, 0, -2.9]} />
      <Tree position={[-1.6, 0, -4.2]} />
      {/* Pink-red sunshade slab across the top outside the window */}
      <mesh position={[0.56, 1.72, -0.9]} rotation={[0.3, 0, 0]} userData={{ noShadow: true }}>
        <boxGeometry args={[2.0, 0.03, 1.1]} />
        <meshStandardMaterial color="#b94a52" roughness={0.8} />
      </mesh>
      {isNight && !overcast && (
        <group>
          <mesh position={[2.4, 2.5, -6.5]} userData={{ noShadow: true }}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial color="#f5efd6" emissive="#f5efd6" emissiveIntensity={1.4} />
          </mesh>
          <group position={[0.5, 1.5, -1]}>
            <Stars radius={5} depth={1.5} count={1200} factor={2.5} saturation={0} fade speed={0.3} />
          </group>
        </group>
      )}
    </group>
  );
}

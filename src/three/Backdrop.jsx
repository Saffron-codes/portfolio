import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useScene } from "./SceneContext";
import { seeded } from "./textures";

/** Sky colours per Chennai time-of-day phase (top, bottom). */
export const SKY = {
  dawn: ["#f6a76f", "#fde0c2"],
  day: ["#6fb6e6", "#d8ecf7"],
  sunset: ["#5b4b8a", "#f7a56b"],
  night: ["#070c1e", "#1e2b55"],
};

const skyShader = {
  uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform vec3 top; uniform vec3 bottom; varying vec2 vUv;
    void main(){
      vec3 c = mix(bottom, top, pow(clamp(vUv.y, 0.0, 1.0), 0.75));
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};

function Sky({ sky }) {
  const material = useMemo(() => new THREE.ShaderMaterial({ ...skyShader, uniforms: THREE.UniformsUtils.clone(skyShader.uniforms) }), []);
  const [top, bottom] = SKY[sky] ?? SKY.day;
  material.uniforms.top.value.set(top);
  material.uniforms.bottom.value.set(bottom);
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

/** Stylised low-poly tree ~3 m behind the window; leaf clusters sway gently. */
function Tree({ position }) {
  const { reducedMotion } = useScene();
  const leaves = useRef(null);
  useFrame(({ clock }) => {
    if (reducedMotion || !leaves.current) return;
    const t = clock.getElapsedTime();
    leaves.current.rotation.z = Math.sin(t * 0.5) * 0.02;
    leaves.current.rotation.x = Math.sin(t * 0.35 + 1) * 0.015;
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
  const { sky, isNight } = useScene();
  return (
    <group>
      <Sky sky={sky} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, -0.02, -4]} userData={{ noShadow: true }}>
        <planeGeometry args={[24, 10]} />
        <meshStandardMaterial color="#6f7d5a" roughness={1} />
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
      {isNight && (
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

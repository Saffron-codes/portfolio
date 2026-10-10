import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { RoundedBox } from "@react-three/drei";
import { useScene } from "../SceneContext";

/* eslint-disable no-unused-vars */
/** White switch plate with a rocker, a red LED, two sockets, and a round purple dial plate. Origin on the wall. */
export default function Switchboard({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn, reducedMotion } = useScene();
  const rocker = useRef(null);
  const white = <meshStandardMaterial color="#f1efe6" roughness={0.6} />;

  // Rocker: top pressed in = lights on, bottom pressed in = off.
  useFrame((_, delta) => {
    if (!rocker.current) return;
    const target = lightsOn ? -0.2 : 0.2;
    rocker.current.rotation.x = reducedMotion ? target : MathUtils.damp(rocker.current.rotation.x, target, 14, delta);
  });
  return (
    <group name={name} {...props}>
      <RoundedBox args={[0.09, 0.07, 0.01]} radius={0.004} smoothness={3} position={[-0.05, 0, 0.005]} castShadow>
        {white}
      </RoundedBox>
      {/* Rocker switch (the theme toggle) */}
      <group ref={rocker} name="rocker" position={[-0.07, 0.008, 0.01]}>
        <mesh castShadow>
          <boxGeometry args={[0.018, 0.026, 0.006]} />
          {white}
        </mesh>
      </group>
      {/* LED */}
      <mesh position={[-0.07, -0.02, 0.011]}>
        <sphereGeometry args={[0.0025, 10, 10]} />
        <meshStandardMaterial color="#ff2d2d" emissive="#ff2d2d" emissiveIntensity={lightsOn ? 2.5 : 0.4} />
      </mesh>
      {/* Sockets */}
      {[-0.036, -0.02].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.012, 0.0105]}>
            <circleGeometry args={[0.0022, 10]} />
            <meshStandardMaterial color="#222" roughness={1} />
          </mesh>
          <mesh position={[x, -0.006, 0.0105]}>
            <circleGeometry args={[0.0022, 10]} />
            <meshStandardMaterial color="#222" roughness={1} />
          </mesh>
        </group>
      ))}
      {/* Round purple dial plate */}
      <mesh position={[0.06, -0.02, 0.006]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.012, 32]} />
        <meshStandardMaterial color="#6b2f7c" roughness={0.5} />
      </mesh>
      <mesh position={[0.06, -0.02, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.006, 24]} />
        <meshStandardMaterial color="#f1efe6" roughness={0.5} />
      </mesh>
    </group>
  );
}

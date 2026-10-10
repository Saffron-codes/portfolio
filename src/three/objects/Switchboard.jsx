import { RoundedBox } from "@react-three/drei";

/* eslint-disable no-unused-vars */
/** White switch plate with a rocker, a red LED, two sockets, and a round purple dial plate. Origin on the wall. */
export default function Switchboard({ name, onSelect, hovered, active, ...props }) {
  const white = <meshStandardMaterial color="#f1efe6" roughness={0.6} />;
  return (
    <group name={name} {...props}>
      <RoundedBox args={[0.09, 0.07, 0.01]} radius={0.004} smoothness={3} position={[-0.05, 0, 0.005]} castShadow>
        {white}
      </RoundedBox>
      {/* Rocker switch (the theme toggle) */}
      <group name="rocker" position={[-0.07, 0.008, 0.01]}>
        <mesh rotation={[-0.18, 0, 0]} castShadow>
          <boxGeometry args={[0.018, 0.026, 0.006]} />
          {white}
        </mesh>
      </group>
      {/* LED */}
      <mesh position={[-0.07, -0.02, 0.011]}>
        <sphereGeometry args={[0.0025, 10, 10]} />
        <meshStandardMaterial color="#ff2d2d" emissive="#ff2d2d" emissiveIntensity={2.5} />
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

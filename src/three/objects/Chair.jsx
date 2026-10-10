import { RoundedBox } from "@react-three/drei";
import { BLACK_MATTE, DARK_METAL } from "../materials";

/* eslint-disable no-unused-vars */
/** Black office chair: rounded backrest, seat, loop armrests, gas lift, five-star base on castors. */
export default function Chair({ name, onSelect, hovered, active, ...props }) {
  const fabric = <meshStandardMaterial {...BLACK_MATTE} />;
  return (
    <group name={name} {...props}>
      {/* Base */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.05, 20]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5 + Math.PI / 5;
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[0, 0.04, 0.15]} rotation={[0.08, 0, 0]} castShadow>
              <boxGeometry args={[0.04, 0.025, 0.3]} />
              <meshStandardMaterial {...DARK_METAL} />
            </mesh>
            <mesh position={[0, 0.025, 0.29]} castShadow>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#111" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
      {/* Gas lift + mechanism */}
      <mesh position={[0, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.028, 0.33, 16]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      <mesh position={[0, 0.405, 0]} castShadow>
        <boxGeometry args={[0.26, 0.03, 0.26]} />
        <meshStandardMaterial {...DARK_METAL} />
      </mesh>
      {/* Seat */}
      <RoundedBox args={[0.48, 0.08, 0.46]} radius={0.03} smoothness={4} position={[0, 0.455, 0]} castShadow>
        {fabric}
      </RoundedBox>
      {/* Backrest */}
      <group position={[0, 0.49, 0.2]} rotation={[-0.12, 0, 0]}>
        <RoundedBox args={[0.46, 0.58, 0.07]} radius={0.05} smoothness={4} position={[0, 0.29, 0]} castShadow>
          {fabric}
        </RoundedBox>
        <mesh position={[0, 0.3, -0.036]}>
          <planeGeometry args={[0.36, 0.42]} />
          <meshStandardMaterial color="#262626" roughness={1} />
        </mesh>
      </group>
      {/* Loop armrests */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.265, 0.5, -0.02]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.11, 0.014, 10, 28]} />
          <meshStandardMaterial color="#111" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

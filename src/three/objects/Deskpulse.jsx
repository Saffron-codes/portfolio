import { useEffect, useMemo } from "react";
import { makeDeskpulseScreen } from "../textures";
import { getChennaiTime } from "../../lib/chennaiTime";
import { useScene } from "../SceneContext";
import PanelAnchor from "../PanelAnchor";

/* eslint-disable no-unused-vars */
const TILT = -0.32;
export const DESKPULSE_SCREEN = { width: 0.086, height: 0.062 };

function formatTime({ hour, minute }) {
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, "0")}`;
}

/** Deskpulse: wedge-shaped dark body with a ~3.5" screen showing a dashboard. */
export default function Deskpulse({ name, onSelect, hovered, active, ...props }) {
  const { lightsOn, weather, minute } = useScene();
  const screen = useMemo(
    () =>
      makeDeskpulseScreen({
        time: formatTime(getChennaiTime()),
        temperature: weather.temperature != null ? `${Math.round(weather.temperature)}°` : "--°",
        condition: weather.label,
        state: weather.state,
        isDay: weather.isDay,
      }),
    // `minute` ticks every minute so the clock stays right.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minute, weather],
  );
  useEffect(() => () => screen.dispose(), [screen]);
  return (
    <group name={name} {...props}>
      <mesh position={[0, 0.006, 0]} castShadow>
        <boxGeometry args={[0.11, 0.012, 0.05]} />
        <meshStandardMaterial color="#1b1d22" roughness={0.6} />
      </mesh>
      <group position={[0, 0.012, 0.01]} rotation={[TILT, 0, 0]}>
        <mesh position={[0, 0.038, 0]} castShadow>
          <boxGeometry args={[0.11, 0.078, 0.016]} />
          <meshStandardMaterial color="#1b1d22" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.04, 0.0081]}>
          <planeGeometry args={[DESKPULSE_SCREEN.width, DESKPULSE_SCREEN.height]} />
          <meshStandardMaterial map={screen} emissiveMap={screen} emissive="#ffffff" emissiveIntensity={lightsOn ? 0.6 : 1} roughness={0.3} />
        </mesh>
      </group>
      <PanelAnchor name={name} width={0.22} height={0.15} position={[0, 0.17, 0.05]} rotation={[-0.25, 0, 0]} />
    </group>
  );
}

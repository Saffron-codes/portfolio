import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import Backdrop from "./Backdrop";
import Weather from "./Weather";
import Atmosphere from "./Atmosphere";
import { CLEAR_WEATHER } from "./useChennaiWeather";
import Desk from "./objects/Desk";
import { OBJECT_COMPONENTS } from "./objects";
import { DESK_TOP, OBJECTS } from "./layout";
import { DEFAULT_POSE } from "./focus";
import CameraRig from "./CameraRig";
import Interactive from "./Interactive";
import OverlayTracker from "./OverlayTracker";
import { InteractionContext } from "./InteractionContext";
import { isInteractive, LABELS } from "./sections";
import { SceneContext } from "./SceneContext";
import { consumeShadowFrame, requestShadowUpdate } from "./shadows";

const deg = (d) => (d * Math.PI) / 180;

/** Sun through the window, per time-of-day phase. */
const SUN = {
  dawn: { color: "#ffb482", intensity: 1.6, position: [2.4, 1.3, -2.6] },
  day: { color: "#fff1d6", intensity: 2.2, position: [0.9, 2.7, -2.3] },
  sunset: { color: "#ff9a5c", intensity: 1.7, position: [-0.6, 1.1, -2.8] },
  night: { color: "#6f86c4", intensity: 0.12, position: [0.6, 2.4, -2.4] },
};

/** The sun through the window. Its shadow map is frozen; see shadows.js. */
function SunLight({ position, intensity, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(0, DESK_TOP, 0);
    light.target.updateMatrixWorld();
    requestShadowUpdate(12);
  }, [position]);
  return (
    <directionalLight
      ref={ref}
      position={position}
      intensity={intensity}
      color={color}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-1.7}
      shadow-camera-right={1.9}
      shadow-camera-top={2.4}
      shadow-camera-bottom={-1.2}
      shadow-camera-near={0.4}
      shadow-camera-far={8}
      shadow-bias={-0.0004}
      shadow-normalBias={0.015}
    />
  );
}

/**
 * Marks every mesh as a shadow caster/receiver (unless userData.noShadow) and freezes the
 * shadow map so it only re-renders when requested.
 */
function ShadowSetup({ sky, lightsOn }) {
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    scene.traverse((object) => {
      if (!object.isMesh || object.userData.noShadow) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    requestShadowUpdate(12);
  }, [scene, gl, sky, lightsOn]);
  useFrame(() => {
    if (consumeShadowFrame()) gl.shadowMap.needsUpdate = true;
  });
  return null;
}

/** How much the weather dims the sun. */
const SUN_FACTOR = { clear: 1, cloudy: 0.55, fog: 0.45, rain: 0.35, thunderstorm: 0.3 };

function Lights({ lightsOn, sky, weather }) {
  const sun = SUN[sky] ?? SUN.day;
  const isNight = sky === "night";
  const factor = SUN_FACTOR[weather.state] ?? 1;
  const sunColor = weather.state === "clear" ? sun.color : "#dfe6ee";
  return (
    <>
      <ambientLight intensity={lightsOn ? 0.45 : isNight ? 0.04 : 0.12} color={lightsOn ? "#fff4e0" : "#aab6d6"} />
      <hemisphereLight args={[isNight ? "#2b3a66" : "#dbeeff", "#8a4a35", lightsOn ? 0.35 : isNight ? 0.06 : 0.15]} />
      <SunLight position={sun.position} intensity={sun.intensity * factor} color={sunColor} />
      {/* Room light (off in dark mode) */}
      {lightsOn && <pointLight position={[0.2, 2.45, 0.9]} intensity={2.2} distance={3.6} decay={1.3} color="#ffe6bf" />}
      {/* Screen and keyboard glow onto the desk when the room is dark */}
      {(!lightsOn || isNight) && (
        <>
          <pointLight position={[-0.05, DESK_TOP + 0.3, 0.1]} intensity={0.5} distance={1.2} decay={2} color="#9fb6cc" />
          <pointLight position={[-0.12, DESK_TOP + 0.05, 0.15]} intensity={0.35} distance={0.6} decay={2} color="#6b7cff" />
        </>
      )}
    </>
  );
}

/** Image-based light from a few soft panels (no HDR download). Remounts when theme or sky changes. */
function RoomEnvironment({ lightsOn, sky }) {
  const isNight = sky === "night";
  return (
    <Environment key={`${lightsOn}-${sky}`} frames={1} resolution={128} background={false}>
      <Lightformer form="rect" intensity={isNight ? 0.6 : 1.5} color={isNight ? "#aab8e6" : "#ffe9cc"} position={[0.6, 1.6, -5]} scale={[5, 3, 1]} target={[0, 1, 0]} />
      <Lightformer form="rect" intensity={lightsOn ? 1.2 : 0.15} color="#fff6e6" position={[0, 4, 1]} rotation-x={Math.PI / 2} scale={[5, 5, 1]} />
      <Lightformer form="rect" intensity={lightsOn ? 0.5 : 0.1} color="#b4553a" position={[0, -2, 1]} rotation-x={-Math.PI / 2} scale={[5, 5, 1]} />
      <Lightformer form="rect" intensity={lightsOn ? 0.6 : 0.1} color="#e9e6ae" position={[-4, 1.3, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
    </Environment>
  );
}

const LABEL_OFFSETS = {
  monitor: [0, 0.5, 0],
  laptop: [0, 0.36, 0],
  keyboard: [0, 0.12, 0],
  phone: [0, 0.1, 0],
  notebook: [0, 0.1, 0],
  deskpulse: [0, 0.15, 0],
  certificate: [0, 0.17, 0.05],
  resumeSheet: [0, 0.2, 0.05],
  switchboard: [0, 0.09, 0.05],
};

function Objects({ hovered, active }) {
  return (
    <>
      {OBJECTS.map(({ name, position, rotation }) => {
        const Component = OBJECT_COMPONENTS[name];
        if (!isInteractive(name)) {
          return <Component key={name} name={name} position={position} rotation={rotation} />;
        }
        return (
          <Interactive key={name} name={name} label={LABELS[name]} labelOffset={LABEL_OFFSETS[name]} position={position} rotation={rotation}>
            <Component name={name} hovered={hovered === name} active={active === name} />
          </Interactive>
        );
      })}
    </>
  );
}

/** Calls onReady once the scene has actually rendered a couple of frames. */
function Ready({ onReady }) {
  useEffect(() => {
    let outer = 0;
    let inner = 0;
    outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => onReady?.());
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [onReady]);
  return null;
}

function useTabVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

/**
 * The 3D desk: Canvas, camera, lights and every object. Loaded lazily by DeskView.
 * Units are metres; see layout.js.
 */
export default function Experience({
  theme = "light",
  sky = "day",
  minute = 0,
  weather = CLEAR_WEATHER,
  reducedMotion = false,
  paused = false,
  hovered = null,
  active = null,
  onHover,
  onSelect,
  onArrive,
  onReady,
}) {
  const visible = useTabVisible();
  const lightsOn = theme !== "dark";
  const context = useMemo(
    () => ({ theme, lightsOn, sky, isNight: sky === "night", reducedMotion, weather, minute }),
    [theme, lightsOn, sky, reducedMotion, weather, minute],
  );
  const interaction = useMemo(
    () => ({ hovered, active, setHovered: onHover ?? (() => {}), select: onSelect ?? (() => {}) }),
    [hovered, active, onHover, onSelect],
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows="soft"
      frameloop={visible && !paused ? "always" : "never"}
      camera={{ fov: 42, near: 0.05, far: 60, position: DEFAULT_POSE.position }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneContext.Provider value={context}>
        <InteractionContext.Provider value={interaction}>
          <color attach="background" args={[lightsOn ? "#e9e6ae" : "#0d1020"]} />
          <Lights lightsOn={lightsOn} sky={sky} weather={weather} />
          <RoomEnvironment lightsOn={lightsOn} sky={sky} />
          <Backdrop />
          <Weather />
          <Atmosphere />
          <Room />
          <Desk />
          <Objects hovered={hovered} active={active} />
          <ShadowSetup sky={sky} lightsOn={lightsOn} />
          <CameraRig active={active} onArrive={onArrive} />
          <OverlayTracker />
          <Ready onReady={onReady} />
        </InteractionContext.Provider>
      </SceneContext.Provider>
    </Canvas>
  );
}

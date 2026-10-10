import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
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
import { DETAILS, INFO, isInteractive, LABELS } from "./sections";
import { SceneContext } from "./SceneContext";
import { consumeShadowFrame, requestShadowUpdate } from "./shadows";
import { sunPositionFor } from "./sun";

const deg = (d) => (d * Math.PI) / 180;

/**
 * Sun through the window. Chennai light is strong and white-hot by day; dawn and sunset go
 * golden; at night a faint blue moonlight. The sun's position follows the Chennai hour so
 * midday light comes in steeply and morning/evening light rakes across the desk.
 */
const SUN = {
  dawn: { color: "#ffb482", intensity: 1.7 },
  day: { color: "#fff7ea", intensity: 3.0 },
  sunset: { color: "#ff9a5c", intensity: 1.8 },
  night: { color: "#6f86c4", intensity: 0.12 },
};

/** The sun through the window. Its shadow map is frozen; see shadows.js. */
function SunLight({ position, intensity, color }) {
  const ref = useRef(null);
  const key = position.join(",");
  useEffect(() => {
    const light = ref.current;
    if (!light) return;
    light.target.position.set(0, DESK_TOP, 0);
    light.target.updateMatrixWorld();
    requestShadowUpdate(12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
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
/** Tone-mapping exposure: a touch harsher on a clear Chennai day, softer in the rain. */
function Exposure({ sky, weather }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const raining = weather.state === "rain" || weather.state === "thunderstorm";
    gl.toneMappingExposure = raining ? 0.92 : sky === "day" && weather.state === "clear" ? 1.1 : 1.0;
  }, [gl, sky, weather]);
  return null;
}

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

/** How much the weather dims the direct sun. Overcast stays bright but flat; monsoon rain is dim. */
function sunFactor(weather) {
  const cover = Math.min(100, Math.max(0, weather.cloudCover ?? 0)) / 100;
  if (weather.state === "clear" || weather.state === "cloudy") return 1 - 0.6 * cover ** 1.3;
  if (weather.state === "fog") return 0.4;
  if (weather.state === "thunderstorm") return 0.12;
  if (weather.state === "rain") return weather.intensity === "heavy" ? 0.15 : weather.intensity === "light" ? 0.45 : 0.28;
  return 1;
}

function Lights({ lightsOn, sky, weather, hour }) {
  const sun = SUN[sky] ?? SUN.day;
  const isNight = sky === "night";
  const raining = weather.state === "rain" || weather.state === "thunderstorm";
  const overcast = weather.state === "cloudy" || weather.state === "fog";
  const factor = sunFactor(weather);
  const sunColor = weather.state === "clear" ? sun.color : raining ? "#b9c6d6" : "#e9edf1";
  const position = useMemo(() => sunPositionFor(hour), [hour]);
  // Overcast light is diffuse: more sky light, less direct sun. Rain is simply dim and cool.
  const cover = Math.min(100, Math.max(0, weather.cloudCover ?? 0)) / 100;
  const skyLight = isNight ? 0.06 : raining ? 0.22 : weather.state === "fog" ? 0.75 : 0.3 + 0.45 * cover;
  return (
    <>
      <ambientLight intensity={lightsOn ? 0.45 : isNight ? 0.04 : raining ? 0.08 : 0.12} color={lightsOn ? "#fff4e0" : "#aab6d6"} />
      <hemisphereLight args={[isNight ? "#2b3a66" : raining ? "#8c98a6" : overcast ? "#e6eaee" : "#dbeeff", "#8a4a35", lightsOn ? Math.max(0.35, skyLight) : skyLight]} />
      <SunLight position={position} intensity={sun.intensity * factor} color={sunColor} />
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
  mouse: [0, 0.08, 0],
  earbudsCase: [0, 0.08, 0],
  glassesCase: [0, 0.1, 0],
  penHolder: [0, 0.22, 0],
  steelTin: [0, 0.18, 0],
  chair: [0, 1.25, 0.2],
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

function Objects({ hovered, active, seated }) {
  return (
    <>
      {OBJECTS.map(({ name, position, rotation }) => {
        const Component = OBJECT_COMPONENTS[name];
        const info = INFO[name];
        if (!isInteractive(name) && !info) {
          return <Component key={name} name={name} position={position} rotation={rotation} />;
        }
        return (
          <Interactive
            key={name}
            name={name}
            label={info ? info.label : LABELS[name]}
            detail={name === "chair" ? (seated ? "click to stand up" : "click to sit down") : info ? info.detail : DETAILS[name]}
            infoOnly={Boolean(info)}
            labelOffset={LABEL_OFFSETS[name]}
            position={position}
            rotation={rotation}
          >
            <Component name={name} hovered={hovered === name} active={active === name} />
          </Interactive>
        );
      })}
    </>
  );
}

/**
 * Issues every shader compile up front (the driver links them in parallel where
 * KHR_parallel_shader_compile exists), then polls the renderer's program list until they are
 * ready, with a time cap. three's own compileAsync is avoided: it keeps references to materials
 * that may unmount meanwhile (e.g. the sun disc hiding when live cloud cover arrives) and then
 * throws inside its timer and never resolves.
 */
function WarmUp({ onCompiled }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    try {
      gl.compile(scene, camera);
    } catch {
      /* fall through: programs compile lazily on first render instead */
    }
    const started = performance.now();
    const poll = () => {
      if (cancelled) return;
      const programs = gl.info?.programs ?? [];
      const ready = programs.every((program) => typeof program.isReady !== "function" || program.isReady());
      if (ready || performance.now() - started > 4000) onCompiled();
      else timer = setTimeout(poll, 16);
    };
    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [gl, scene, camera, onCompiled]);
  return null;
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
  hour = 12,
  weather = CLEAR_WEATHER,
  reducedMotion = false,
  paused = false,
  hovered = null,
  active = null,
  mobile = false,
  seated = false,
  doorOpen = false,
  preview = false,
  onHover,
  onSelect,
  onArrive,
  onReady,
}) {
  const visible = useTabVisible();
  const lightsOn = theme !== "dark";
  // Pixel ratio: start high, let PerformanceMonitor drop it on slow devices.
  const [dpr, setDpr] = useState(preview ? 1 : mobile ? 1.5 : 1.75);
  // The loop stays off until shaders are compiled; the 2D scene covers the wait.
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);
  const context = useMemo(
    () => ({ theme, lightsOn, sky, isNight: sky === "night", reducedMotion, weather, minute, hour, doorOpen }),
    [theme, lightsOn, sky, reducedMotion, weather, minute, hour, doorOpen],
  );
  const interaction = useMemo(
    () => ({ hovered, active, setHovered: onHover ?? (() => {}), select: onSelect ?? (() => {}) }),
    [hovered, active, onHover, onSelect],
  );

  return (
    <Canvas
      dpr={preview ? 1 : dpr}
      style={preview ? { pointerEvents: "none" } : undefined}
      shadows="soft"
      frameloop={compiled && visible && !paused ? "always" : "never"}
      camera={{ fov: mobile ? 56 : 42, near: 0.05, far: 60, position: DEFAULT_POSE.position }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneContext.Provider value={context}>
        <InteractionContext.Provider value={interaction}>
          {!preview && <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(mobile ? 1.5 : 1.75)} flipflops={2} onFallback={() => setDpr(1)} />}
          <color attach="background" args={[lightsOn ? "#e9e6ae" : "#0d1020"]} />
          <Lights lightsOn={lightsOn} sky={sky} weather={weather} hour={hour} />
          <Exposure sky={sky} weather={weather} />
          <RoomEnvironment lightsOn={lightsOn} sky={sky} />
          <Backdrop />
          <Weather />
          <Atmosphere />
          <Room />
          <Desk />
          <Objects hovered={hovered} active={active} seated={seated} />
          <ShadowSetup sky={sky} lightsOn={lightsOn} />
          <CameraRig active={active} onArrive={onArrive} fixed={mobile} seated={seated} preview={preview} />
          <OverlayTracker />
          <WarmUp onCompiled={onCompiled} />
          {compiled && <Ready onReady={onReady} />}
        </InteractionContext.Provider>
      </SceneContext.Provider>
    </Canvas>
  );
}

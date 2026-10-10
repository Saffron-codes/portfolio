import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import Backdrop from "./Backdrop";
import Desk from "./objects/Desk";
import { OBJECT_COMPONENTS } from "./objects";
import { DESK_TOP, OBJECTS } from "./layout";
import { DEFAULT_POSE } from "./focus";
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

function Controls() {
  const ref = useRef(null);
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__scene = scene;
      window.__gl = gl;
    }
    const controls = ref.current;
    if (!controls) return;
    const { position, target } = DEFAULT_POSE;
    controls.setLookAt(...position, ...target, false);
    // Dev aid: lets screenshots be taken from other poses (e.g. the photo's front view).
    if (import.meta.env.DEV) window.__cameraControls = controls;
  }, []);
  return (
    <CameraControls
      ref={ref}
      makeDefault
      minAzimuthAngle={-deg(25)}
      maxAzimuthAngle={deg(25)}
      minPolarAngle={deg(55)}
      maxPolarAngle={deg(88)}
      minDistance={1.2}
      maxDistance={2.2}
      truckSpeed={0}
      dollySpeed={0.4}
      smoothTime={0.4}
    />
  );
}

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

function Lights({ lightsOn, sky }) {
  const sun = SUN[sky] ?? SUN.day;
  const isNight = sky === "night";
  return (
    <>
      <ambientLight intensity={lightsOn ? 0.45 : isNight ? 0.04 : 0.12} color={lightsOn ? "#fff4e0" : "#aab6d6"} />
      <hemisphereLight args={[isNight ? "#2b3a66" : "#dbeeff", "#8a4a35", lightsOn ? 0.35 : isNight ? 0.06 : 0.15]} />
      <SunLight position={sun.position} intensity={sun.intensity} color={sun.color} />
      {/* Room light (off in dark mode) */}
      {lightsOn && <pointLight position={[0.2, 2.45, 0.9]} intensity={2.2} distance={3.6} decay={1.3} color="#ffe6bf" />}
      {/* Screen and keyboard glow onto the desk when the room is dark */}
      {!lightsOn && (
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

function Objects() {
  return (
    <>
      {OBJECTS.map(({ name, position, rotation }) => {
        const Component = OBJECT_COMPONENTS[name];
        return <Component key={name} name={name} position={position} rotation={rotation} />;
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
export default function Experience({ theme = "light", sky = "day", reducedMotion = false, paused = false, onReady }) {
  const visible = useTabVisible();
  const lightsOn = theme !== "dark";
  const context = useMemo(
    () => ({ theme, lightsOn, sky, isNight: sky === "night", reducedMotion }),
    [theme, lightsOn, sky, reducedMotion],
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
        <color attach="background" args={[lightsOn ? "#e9e6ae" : "#0d1020"]} />
        <Lights lightsOn={lightsOn} sky={sky} />
        <RoomEnvironment lightsOn={lightsOn} sky={sky} />
        <Backdrop />
        <Room />
        <Desk />
        <Objects />
        <ShadowSetup sky={sky} lightsOn={lightsOn} />
        <Controls />
        <Ready onReady={onReady} />
      </SceneContext.Provider>
    </Canvas>
  );
}

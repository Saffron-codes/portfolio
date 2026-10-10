import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";
import Desk from "./objects/Desk";
import { OBJECT_COMPONENTS } from "./objects";
import { OBJECTS } from "./layout";
import { DEFAULT_POSE } from "./focus";

const deg = (d) => (d * Math.PI) / 180;

function Controls() {
  const ref = useRef(null);
  useEffect(() => {
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

function Lights({ lightsOn }) {
  return (
    <>
      <ambientLight intensity={lightsOn ? 0.35 : 0.08} />
      <hemisphereLight args={["#cfe6ff", "#b4553a", lightsOn ? 0.5 : 0.25]} />
      {/* Sun through the window */}
      <directionalLight position={[0.8, 2.4, -2.2]} target-position={[0, 0.8, 0.2]} intensity={2.2} color="#fff1d6" />
      {/* Room light */}
      {lightsOn && <pointLight position={[0.2, 2.4, 0.8]} intensity={1.6} distance={6} decay={1.2} color="#ffe9c4" />}
    </>
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
export default function Experience({ theme = "light", sky = "day", paused = false, onReady }) {
  const visible = useTabVisible();
  const lightsOn = theme !== "dark";

  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={visible && !paused ? "always" : "never"}
      camera={{ fov: 42, near: 0.05, far: 40, position: DEFAULT_POSE.position }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <color attach="background" args={["#e9e6ae"]} />
      <Lights lightsOn={lightsOn} />
      <Room sky={sky} />
      <Desk />
      <Objects />
      <Controls />
      <Ready onReady={onReady} />
    </Canvas>
  );
}

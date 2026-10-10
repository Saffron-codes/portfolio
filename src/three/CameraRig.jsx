import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
import { DEFAULT_POSE, poseFor } from "./focus";
import { useScene } from "./SceneContext";

const deg = (d) => (d * Math.PI) / 180;

const LIMITS = {
  minAzimuthAngle: -deg(25),
  maxAzimuthAngle: deg(25),
  minPolarAngle: deg(55),
  maxPolarAngle: deg(88),
  minDistance: 1.2,
  maxDistance: 2.2,
};

const { ACTION } = CameraControlsImpl;
const NONE = ACTION.NONE;
const DEFAULT_INPUT = {
  mouseButtons: { left: ACTION.ROTATE, middle: ACTION.DOLLY, right: NONE, wheel: ACTION.DOLLY },
  touches: { one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_DOLLY, three: NONE },
};

/** Disable user input while a section is open. (controls.enabled=false would also freeze flights.) */
function lockInput(controls, locked) {
  const buttons = locked ? { left: NONE, middle: NONE, right: NONE, wheel: NONE } : DEFAULT_INPUT.mouseButtons;
  const touches = locked ? { one: NONE, two: NONE, three: NONE } : DEFAULT_INPUT.touches;
  Object.assign(controls.mouseButtons, buttons);
  Object.assign(controls.touches, touches);
}

function applyLimits(controls, relaxed) {
  controls.minAzimuthAngle = relaxed ? -Infinity : LIMITS.minAzimuthAngle;
  controls.maxAzimuthAngle = relaxed ? Infinity : LIMITS.maxAzimuthAngle;
  controls.minPolarAngle = relaxed ? 0 : LIMITS.minPolarAngle;
  controls.maxPolarAngle = relaxed ? Math.PI : LIMITS.maxPolarAngle;
  controls.minDistance = relaxed ? 0.05 : LIMITS.minDistance;
  controls.maxDistance = relaxed ? 10 : LIMITS.maxDistance;
}

/**
 * Owns the camera. Idle: limited orbit around the default view. When `active` names an object,
 * flies to that object's panel (~1.2 s, instant with reduced motion) and locks input; on
 * `active = null` flies back. Calls onArrive(name) when a flight settles.
 */
export default function CameraRig({ active, onArrive }) {
  const ref = useRef(null);
  const { reducedMotion } = useScene();
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    controls.setLookAt(...DEFAULT_POSE.position, ...DEFAULT_POSE.target, false);
    lockInput(controls, false);
    if (import.meta.env.DEV) {
      window.__cameraControls = controls;
      window.__scene = scene;
      window.__gl = gl;
    }
  }, [scene, gl]);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return undefined;
    let cancelled = false;
    const animate = !reducedMotion;
    controls.smoothTime = animate ? 0.55 : 0;

    const pose = active ? poseFor(active) : DEFAULT_POSE;
    if (!pose) return undefined;

    applyLimits(controls, Boolean(active));
    lockInput(controls, Boolean(active));
    const flight = controls.setLookAt(...pose.position, ...pose.target, animate);
    Promise.resolve(flight).then(() => {
      if (cancelled) return;
      controls.smoothTime = 0.4;
      onArrive?.(active ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion, onArrive]);

  return <CameraControls ref={ref} makeDefault {...LIMITS} truckSpeed={0} dollySpeed={0.4} smoothTime={0.4} />;
}

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
import { DEFAULT_POSE, MOBILE_POSE, poseFor } from "./focus";
import { useScene } from "./SceneContext";

const deg = (d) => (d * Math.PI) / 180;

/**
 * Look-around mode: the camera stands behind the chair and turns in place (the orbit pivot is
 * 12 cm in front of the lens, so turning never moves it through a wall). Full 360° yaw, from
 * the ceiling fan down to the floor. The wheel zooms the lens instead of walking.
 */
const LOOK_DISTANCE = 0.12;
const LIMITS = {
  minAzimuthAngle: -Infinity,
  maxAzimuthAngle: Infinity,
  // Polar is measured on the camera's offset from the pivot: small = camera above it (looking
  // down at the floor), large = camera below it (looking up at the ceiling).
  minPolarAngle: deg(14),
  maxPolarAngle: deg(172),
  minDistance: LOOK_DISTANCE,
  maxDistance: LOOK_DISTANCE,
  minZoom: 1,
  maxZoom: 2,
};

/** Same view direction as `pose`, but with the pivot just in front of the camera. */
function lookPose(pose) {
  const position = new THREE.Vector3(...pose.position);
  const direction = new THREE.Vector3(...pose.target).sub(position).normalize();
  return { position: pose.position, target: position.addScaledVector(direction, LOOK_DISTANCE).toArray() };
}

const { ACTION } = CameraControlsImpl;
const NONE = ACTION.NONE;
const DEFAULT_INPUT = {
  mouseButtons: { left: ACTION.ROTATE, middle: NONE, right: NONE, wheel: ACTION.ZOOM },
  touches: { one: ACTION.TOUCH_ROTATE, two: ACTION.TOUCH_ZOOM, three: NONE },
};

/** Disable user input while a section is open. (controls.enabled=false would also freeze flights.) */
function lockInput(controls, locked) {
  const buttons = locked ? { left: NONE, middle: NONE, right: NONE, wheel: NONE } : DEFAULT_INPUT.mouseButtons;
  const touches = locked ? { one: NONE, two: NONE, three: NONE } : DEFAULT_INPUT.touches;
  Object.assign(controls.mouseButtons, buttons);
  Object.assign(controls.touches, touches);
}

/**
 * camera-controls' setLookAt normalises the azimuth into [0, 2π). A view that sits slightly
 * left of centre becomes ~6.26 rad, which the ±25° limits then clamp to +25° on the next
 * rotate (user drag or idle drift). Wrap it back into [−π, π] after every setLookAt.
 */
function wrapAzimuth(controls) {
  const end = controls._sphericalEnd;
  const current = controls._spherical;
  if (!end || !current) return;
  while (end.theta > Math.PI) {
    end.theta -= Math.PI * 2;
    current.theta -= Math.PI * 2;
  }
  while (end.theta < -Math.PI) {
    end.theta += Math.PI * 2;
    current.theta += Math.PI * 2;
  }
}

function applyLimits(controls, relaxed) {
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;
  controls.minPolarAngle = relaxed ? 0 : LIMITS.minPolarAngle;
  controls.maxPolarAngle = relaxed ? Math.PI : LIMITS.maxPolarAngle;
  controls.minDistance = relaxed ? 0.05 : LIMITS.minDistance;
  controls.maxDistance = relaxed ? 10 : LIMITS.maxDistance;
  if (relaxed) controls.zoomTo(1, false);
}

/**
 * Owns the camera. Idle: limited orbit around the default view. When `active` names an object,
 * flies to that object's panel (~1.2 s, instant with reduced motion) and locks input; on
 * `active = null` flies back. Calls onArrive(name) when a flight settles.
 */
export default function CameraRig({ active, onArrive, fixed = false }) {
  const ref = useRef(null);
  const idle = useRef({ lastInput: 0, drift: 0 });
  const { reducedMotion } = useScene();
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    const start = lookPose(DEFAULT_POSE);
    controls.setLookAt(...start.position, ...start.target, false);
    wrapAzimuth(controls);
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

    const pose = active ? poseFor(active) : lookPose(fixed ? MOBILE_POSE : DEFAULT_POSE);
    if (!pose) return undefined;

    applyLimits(controls, Boolean(active));
    lockInput(controls, Boolean(active) || fixed);
    const flight = controls.setLookAt(...pose.position, ...pose.target, animate);
    Promise.resolve(flight).then(() => {
      if (cancelled) return;
      wrapAzimuth(controls);
      controls.smoothTime = 0.4;
      idle.current.drift = 0;
      onArrive?.(active ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [active, reducedMotion, onArrive, fixed]);

  // Idle drift: a very slow sway of the view after 5 s without interaction.
  useEffect(() => {
    const controls = ref.current;
    if (!controls) return undefined;
    const mark = () => {
      idle.current.lastInput = performance.now() / 1000;
    };
    controls.addEventListener("controlstart", mark);
    controls.addEventListener("control", mark);
    mark();
    return () => {
      controls.removeEventListener("controlstart", mark);
      controls.removeEventListener("control", mark);
    };
  }, []);
  useFrame(({ clock }) => {
    const controls = ref.current;
    if (!controls || reducedMotion || active || fixed) return;
    const now = performance.now() / 1000;
    if (now - idle.current.lastInput < 5) return;
    const target = Math.sin(clock.getElapsedTime() * 0.12) * 0.035;
    const delta = target - idle.current.drift;
    idle.current.drift = target;
    controls.rotate(delta, 0, false);
  });

  return (
    <CameraControls
      ref={ref}
      makeDefault
      {...LIMITS}
      truckSpeed={0}
      dollySpeed={0}
      // Negative: drag right looks right, like turning your head.
      azimuthRotateSpeed={-0.55}
      polarRotateSpeed={-0.55}
      smoothTime={0.4}
    />
  );
}

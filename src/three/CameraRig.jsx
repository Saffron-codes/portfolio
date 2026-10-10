import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
import { DEFAULT_POSE, MOBILE_POSE, poseFor } from "./focus";
import { useScene } from "./SceneContext";

const deg = (d) => (d * Math.PI) / 180;

// Asymmetric: the left wall is close, the right side of the room (door, shelf, bed) is worth a look.
const LIMITS = {
  minAzimuthAngle: -deg(22),
  maxAzimuthAngle: deg(42),
  minPolarAngle: deg(55),
  maxPolarAngle: deg(88),
  minDistance: 1.2,
  maxDistance: 2.3,
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
export default function CameraRig({ active, onArrive, fixed = false }) {
  const ref = useRef(null);
  const idle = useRef({ lastInput: 0, drift: 0 });
  const { reducedMotion } = useScene();
  const scene = useThree((state) => state.scene);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    controls.setLookAt(...DEFAULT_POSE.position, ...DEFAULT_POSE.target, false);
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

    const pose = active ? poseFor(active) : fixed ? MOBILE_POSE : DEFAULT_POSE;
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

  return <CameraControls ref={ref} makeDefault {...LIMITS} truckSpeed={0} dollySpeed={0.4} smoothTime={0.4} />;
}

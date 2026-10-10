/**
 * Camera poses: [position], [target]. Metres. Phase 5 flies between them.
 * The default view stands just behind and above the chair.
 */
export const DEFAULT_POSE = { position: [0, 1.33, 1.65], target: [0.05, 1.0, -0.2] };

export const FOCUS = {
  monitor: { position: [-0.05, 1.03, 0.45], target: [-0.05, 1.02, -0.17] },
  laptop: { position: [0.3, 1.0, 0.45], target: [0.4, 0.9, -0.04] },
  keyboard: { position: [-0.12, 1.15, 0.45], target: [-0.12, 0.77, 0.15] },
  phone: { position: [0.13, 1.05, 0.12], target: [0.13, 0.76, -0.02] },
  notebook: { position: [-0.38, 1.05, 0.25], target: [-0.38, 0.76, 0.05] },
  deskpulse: { position: [-0.31, 0.9, 0.1], target: [-0.31, 0.8, -0.18] },
  certificate: { position: [-0.62, 1.45, 0.3], target: [-0.62, 1.45, -0.31] },
  switchboard: { position: [-0.36, 0.95, 0.15], target: [-0.36, 0.88, -0.31] },
  window: { position: [0.3, 1.3, 0.6], target: [0.5, 1.45, -0.32] },
};

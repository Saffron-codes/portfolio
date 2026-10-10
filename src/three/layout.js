/**
 * Positions in metres. Floor y = 0, desktop surface y = 0.75, desk centred on x = 0,
 * back edge z = -0.30 (window wall), front edge z = +0.30.
 * Each object's origin is where it touches the surface it rests on.
 */
export const DESK_TOP = 0.75;
export const BACK_WALL_Z = -0.32;
export const LEFT_WALL_X = -0.85;

export const OBJECTS = [
  { name: "monitor", position: [-0.05, DESK_TOP, -0.17] },
  { name: "laptop", position: [0.4, DESK_TOP, -0.04], rotation: [0, -0.21, 0] },
  { name: "keyboard", position: [-0.12, DESK_TOP, 0.15] },
  { name: "mouse", position: [0.19, DESK_TOP, 0.17] },
  { name: "penHolder", position: [-0.5, DESK_TOP, -0.1] },
  { name: "steelTin", position: [-0.52, DESK_TOP, -0.23] },
  { name: "glassesCase", position: [-0.05, DESK_TOP, -0.03] },
  { name: "earbudsCase", position: [-0.46, DESK_TOP, 0.22] },
  { name: "phone", position: [0.13, DESK_TOP, -0.02], rotation: [0, 0.08, 0] },
  { name: "notebook", position: [-0.38, DESK_TOP, 0.05], rotation: [0, 0.14, 0] },
  { name: "deskpulse", position: [-0.31, DESK_TOP, -0.18] },
  { name: "certificate", position: [-0.62, 1.45, BACK_WALL_Z] },
  { name: "resumeSheet", position: [-0.62, 1.12, BACK_WALL_Z] },
  { name: "switchboard", position: [-0.38, 0.87, BACK_WALL_Z] },
  { name: "chair", position: [0, 0, 0.7] },
];

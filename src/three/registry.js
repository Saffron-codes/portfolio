/**
 * Module-level registries shared between the Canvas and the DOM layer.
 * - anchors: object name → the Object3D marking its screen/panel rect (see PanelAnchor).
 * - overlay: the DOM element that must follow the active panel, and its design size in px.
 */
export const anchors = new Map();

export const overlay = {
  el: null,
  name: null,
  design: { width: 1000, height: 600 },
};

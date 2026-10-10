/** Decide whether to run the 3D desk. False means: show the 2D SVG scene instead. */
export function detect3DSupport() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    const isMobile = window.innerWidth < 768;
    if (isMobile && typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4) return false;
    return true;
  } catch {
    return false;
  }
}

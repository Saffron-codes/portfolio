/**
 * Decide whether to run the 3D desk. False means: show the 2D SVG scene instead.
 * Falls back when WebGL is missing, when WebGL is only software-rendered (SwiftShader,
 * llvmpipe, headless/CI browsers, some VMs: every frame would be a long task), or on
 * low-memory phones. Dev: `?force3d=1` skips the renderer check.
 */
const SOFTWARE_RENDERERS = /swiftshader|llvmpipe|softpipe|software|basic render|mesa offscreen|microsoft basic/i;

export function describeRenderer(gl) {
  try {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    return info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
  } catch {
    return "";
  }
}

export function detect3DSupport() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    const force = import.meta.env.DEV && new URLSearchParams(window.location.search).get("force3d") === "1";
    if (!force && SOFTWARE_RENDERERS.test(describeRenderer(gl))) return false;
    const isMobile = window.innerWidth < 768;
    if (isMobile && typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4) return false;
    return true;
  } catch {
    return false;
  }
}

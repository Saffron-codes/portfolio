import Scene from "./Scene";
import { viewBoxFor } from "./layout";
import { useWindowSize } from "../hooks/useWindowSize";

/** The 2D SVG room, filling its container. Used as the loading placeholder and the no-WebGL fallback. */
export default function FallbackScene({ sky }) {
  const { width, height } = useWindowSize();
  return <Scene sky={sky} viewBox={viewBoxFor(width, height)} className="h-full w-full" />;
}

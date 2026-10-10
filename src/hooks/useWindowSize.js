import { useEffect, useState } from "react";

function read() {
  return { width: window.innerWidth, height: window.innerHeight };
}

/** Viewport size, updated on resize (throttled to animation frames). */
export function useWindowSize() {
  const [size, setSize] = useState(read);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSize(read()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

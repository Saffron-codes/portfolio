import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    try {
      return window.matchMedia(QUERY).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let media;
    try {
      media = window.matchMedia(QUERY);
    } catch {
      return undefined;
    }
    const onChange = (event) => setReduced(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

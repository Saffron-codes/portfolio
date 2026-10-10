import { useEffect, useState } from "react";

/** True while the media query matches (updates live). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    let media;
    try {
      media = window.matchMedia(query);
    } catch {
      return undefined;
    }
    const onChange = (event) => setMatches(event.matches);
    setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export const MOBILE_QUERY = "(max-width: 767px)";

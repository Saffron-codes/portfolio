import { useCallback, useEffect, useState } from "react";

function readHash() {
  return window.location.hash.replace(/^#/, "");
}

/** Current URL hash (without '#') and a setter that pushes a history entry. */
export function useHashRoute() {
  const [hash, setHash] = useState(readHash);

  useEffect(() => {
    const onChange = () => setHash(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next, { replace = false } = {}) => {
    const target = next ? `#${next}` : "";
    if (replace) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${target}`);
      setHash(next || "");
    } else if (readHash() !== (next || "")) {
      window.location.hash = target;
    }
  }, []);

  return [hash, navigate];
}

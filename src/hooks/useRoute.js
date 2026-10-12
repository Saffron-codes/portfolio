import { useCallback, useEffect, useState } from "react";

const NAVIGATE_EVENT = "app:navigate";

function read() {
  return { path: window.location.pathname, hash: window.location.hash.replace(/^#/, "") };
}

/** Push (or replace) a path such as "/blog/" without reloading, and tell every useRoute hook. */
export function navigateTo(path, { replace = false } = {}) {
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (!replace && current === path) return;
  history[replace ? "replaceState" : "pushState"](null, "", path);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

/**
 * The current route: `{ path, hash }` (hash without '#'), plus a navigate function.
 * `navigate("/blog/")` changes the path; `navigate("desk")` sets the hash and `navigate("")` clears it.
 */
export function useRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    window.addEventListener(NAVIGATE_EVENT, onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(NAVIGATE_EVENT, onChange);
    };
  }, []);

  const navigate = useCallback((next, { replace = false } = {}) => {
    if (next.startsWith("/")) {
      navigateTo(next, { replace });
      return;
    }
    const target = next ? `#${next}` : "";
    if (replace) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${target}`);
      setRoute(read());
    } else if (read().hash !== (next || "")) {
      window.location.hash = target;
    }
  }, []);

  return [route, navigate];
}

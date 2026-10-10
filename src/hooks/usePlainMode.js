import { useCallback, useEffect } from "react";
import { useHashRoute } from "./useHashRoute";

const STORAGE_KEY = "view";
export const PLAIN_HASH = "plain";

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Recruiter mode / plain view lives at #plain. A specific hash in the URL wins;
 * with no hash, a remembered preference for the plain view is applied.
 */
export function usePlainMode() {
  const [hash, navigate] = useHashRoute();

  useEffect(() => {
    if (!hash && readStored() === PLAIN_HASH) navigate(PLAIN_HASH, { replace: true });
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPlain = hash === PLAIN_HASH;

  const setPlain = useCallback(
    (next) => {
      try {
        localStorage.setItem(STORAGE_KEY, next ? PLAIN_HASH : "scene");
      } catch {
        /* ignore */
      }
      navigate(next ? PLAIN_HASH : "");
    },
    [navigate],
  );

  return { isPlain, setPlain, hash, navigate };
}

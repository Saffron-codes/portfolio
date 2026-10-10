import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import FallbackScene from "./scene/FallbackScene";
import ErrorBoundary from "./components/ErrorBoundary";
import { detect3DSupport } from "./three/support";
import { getChennaiSkyPhase } from "./lib/chennaiTime";
import { useReducedMotion } from "./hooks/useReducedMotion";

// The 3D bundle (three, R3F, drei) only loads when the device can run it.
const Experience = lazy(() => import("./three/Experience"));

const chromeButton =
  "inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/80 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm backdrop-blur transition-colors hover:bg-cream dark:border-cream/15 dark:bg-night-800/80 dark:text-cream dark:hover:bg-night-800";

/**
 * Home view: the 3D desk when supported, with the 2D SVG scene shown while it loads
 * and kept as the fallback when WebGL is missing or the 3D chunk fails.
 */
export default function DeskView({ theme, onToggleTheme, onShowPlain }) {
  const isDark = theme === "dark";
  const reducedMotion = useReducedMotion();
  const supports3D = useMemo(detect3DSupport, []);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallbackMounted, setFallbackMounted] = useState(true);
  // Phase 3: computed once. Phase 6 recomputes every minute with live weather.
  const sky = useMemo(() => getChennaiSkyPhase(), []);

  const use3D = supports3D && !failed;
  const onReady = useCallback(() => setReady(true), []);

  // Unmount the SVG once the crossfade has finished.
  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setFallbackMounted(false), reducedMotion ? 0 : 700);
    return () => clearTimeout(id);
  }, [ready, reducedMotion]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-cream dark:bg-night-900">
      {use3D && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <ErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Experience theme={theme} sky={sky} onReady={onReady} />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {(fallbackMounted || !use3D) && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready && use3D ? "pointer-events-none opacity-0" : "opacity-100"}`}
          aria-hidden={ready && use3D}
        >
          <FallbackScene sky={sky} />
        </div>
      )}

      <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-5">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={isDark}
          className={`${chromeButton} px-2.5`}
        >
          {isDark ? <FaSun size={15} aria-hidden="true" /> : <FaMoon size={15} aria-hidden="true" />}
        </button>
        <button type="button" onClick={onShowPlain} className={chromeButton}>
          Recruiter mode
        </button>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-sm text-ink/70 dark:text-cream/70">
        Click anything on the desk ✨
      </p>
    </div>
  );
}

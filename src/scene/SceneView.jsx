import { useMemo } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import Scene from "./Scene";
import { viewBoxFor } from "./layout";
import { useWindowSize } from "../hooks/useWindowSize";
import { getChennaiSkyPhase } from "../lib/chennaiTime";

const chromeButton =
  "inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/80 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm backdrop-blur transition-colors hover:bg-cream dark:border-cream/15 dark:bg-night-800/80 dark:text-cream dark:hover:bg-night-800";

/** Full-viewport desk scene plus the small UI chrome around it. */
export default function SceneView({ theme, onToggleTheme, onShowPlain }) {
  const isDark = theme === "dark";
  // Phase 2: computed once; Phase 4 recomputes every minute with live weather.
  const sky = useMemo(() => getChennaiSkyPhase(), []);
  const { width, height } = useWindowSize();
  const viewBox = viewBoxFor(width, height);

  return (
    <div className="fixed inset-0 overflow-hidden bg-cream dark:bg-night-900">
      <Scene sky={sky} viewBox={viewBox} className="h-full w-full" />

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

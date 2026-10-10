import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import ErrorBoundary from "../components/ErrorBoundary";
import WeatherCaption from "../components/WeatherCaption";
import { detect3DSupport } from "../three/support";
import { handoff } from "../three/handoff";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { MOBILE_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import { posterFor } from "./posters";

// The 3D chunk is never part of the initial bundle: it loads lazily, or on hover/focus of the card.
const Experience = lazy(() => import("../three/Experience"));
const prefetchExperience = () => import("../three/Experience");

const EXPAND_MS = 600;

function useIdle(timeout = 1500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const done = () => setIdle(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(done, { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(done, timeout);
    return () => clearTimeout(id);
  }, [timeout]);
  return idle;
}

function useTabVisible() {
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

/** Transform that maps the full viewport onto `rect` (for the FLIP expand/shrink). */
function rectTransform(rect) {
  const sx = rect.width / window.innerWidth;
  const sy = rect.height / window.innerHeight;
  return `translate(${rect.left}px, ${rect.top}px) scale(${sx}, ${sy})`;
}

/**
 * The "mini desk" card in the hero: a poster straight away, then (when the page is idle, the
 * card is on screen and the device can take it) a live, slowly swaying 3D preview. Clicking it
 * expands the card to fill the screen and hands over to the full desk at #desk.
 */
export default function DeskCard({ theme, sky, hour, minute, weather, onOpenDesk }) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const supports3D = useMemo(detect3DSupport, []);
  const idle = useIdle();
  const tabVisible = useTabVisible();
  const card = useRef(null);
  const [onScreen, setOnScreen] = useState(false);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [overlay, setOverlay] = useState(null); // { mode: "open" | "return" }
  const overlayRef = useRef(null);
  const poster = posterFor(theme);

  useEffect(() => {
    const el = card.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const capableMobile = !isMobile || (typeof navigator.deviceMemory !== "number" ? false : navigator.deviceMemory >= 4);
  const canLive = supports3D && !reducedMotion && !failed && capableMobile;
  useEffect(() => {
    if (idle && onScreen && canLive) setLive(true);
  }, [idle, onScreen, canLive]);

  const onReady = useCallback(() => setReady(true), []);

  // Shrink back into the card when returning from the desk.
  useLayoutEffect(() => {
    if (!handoff.returning) return;
    handoff.returning = false;
    setOverlay({ mode: "return" });
  }, []);

  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!overlay || !el || !card.current) return undefined;
    const rect = card.current.getBoundingClientRect();
    const full = "translate(0px, 0px) scale(1, 1)";
    const small = rectTransform(rect);
    const frames = overlay.mode === "open" ? [{ transform: small }, { transform: full }] : [{ transform: full }, { transform: small }];
    const duration = reducedMotion ? 200 : EXPAND_MS;
    const animation = reducedMotion
      ? el.animate(overlay.mode === "open" ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration, fill: "forwards" })
      : el.animate(frames, { duration, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", fill: "forwards" });
    if (overlay.mode === "open") document.documentElement.classList.add("leaving");
    else document.documentElement.classList.remove("leaving");
    animation.onfinish = () => {
      if (overlay.mode === "open") {
        handoff.opening = true;
        onOpenDesk();
      } else {
        setOverlay(null);
      }
    };
    return () => animation.cancel();
  }, [overlay, reducedMotion, onOpenDesk]);

  const open = () => {
    if (overlay) return;
    if (!supports3D) {
      onOpenDesk();
      return;
    }
    prefetchExperience();
    setOverlay({ mode: "open" });
  };

  const paused = !onScreen || !tabVisible || Boolean(overlay);
  const hint = !supports3D ? "3D needs a WebGL-capable browser" : isMobile ? "Interactive 3D · best on desktop" : "Interactive 3D";

  return (
    <div className="group relative" ref={card}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-ink/10 bg-night-900 shadow-xl shadow-ink/10 ring-1 ring-white/40 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:-translate-y-1 dark:border-cream/10 dark:ring-white/5">
        {/* Window frame strip */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent px-4 pb-6 pt-3 text-xs text-white/85">
          <span className="shrink-0 font-medium">My desk · live</span>
          <WeatherCaption weather={weather} className="min-w-0 truncate !text-white/75" />
        </div>

        {/* Poster, then the live preview */}
        <img
          src={poster}
          alt=""
          width="960"
          height="720"
          fetchpriority="high"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${live && ready ? "opacity-0" : "opacity-100"}`}
        />
        {live && (
          <div className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
            <ErrorBoundary onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <Experience preview theme={theme} sky={sky} hour={hour} minute={minute} weather={weather} reducedMotion={reducedMotion} paused={paused} onReady={onReady} />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}

        {/* One big button over the whole card */}
        <button
          type="button"
          onClick={open}
          onMouseEnter={supports3D ? prefetchExperience : undefined}
          onFocus={supports3D ? prefetchExperience : undefined}
          aria-label={supports3D ? "Explore my desk in 3D" : "See my desk as an illustration"}
          className="absolute inset-0 z-20 flex items-end justify-between p-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage-400/70"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink shadow-lg transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:translate-x-1">
            Step inside
            <FaArrowRight size={12} aria-hidden="true" className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1" />
          </span>
          <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur">{hint}</span>
        </button>
      </div>

      {/* Expand / shrink overlay (poster) */}
      {overlay && (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="fixed inset-0 z-50 origin-top-left overflow-hidden bg-night-900"
          style={{ transform: overlay.mode === "open" ? rectTransform(card.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 1, height: 1 }) : undefined }}
        >
          <img src={poster} alt="" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}

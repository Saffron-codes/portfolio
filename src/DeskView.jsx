import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaMoon, FaSun } from "react-icons/fa6";
import FallbackScene from "./scene/FallbackScene";
import ErrorBoundary from "./components/ErrorBoundary";
import { detect3DSupport } from "./three/support";
import { useSky } from "./three/useSky";
import { useChennaiWeather } from "./three/useChennaiWeather";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { MOBILE_QUERY, useMediaQuery } from "./hooks/useMediaQuery";
import MobileSheet from "./components/MobileSheet";
import MobileDock from "./components/MobileDock";
import WeatherCaption from "./components/WeatherCaption";
import { handoff } from "./three/handoff";
import { posterFor } from "./plain/posters";
import { overlay } from "./three/registry";
import { LABELS, SECTIONS, sectionById, sectionForObject, TAB_ORDER } from "./three/sections";
import { keyboardEvents, labelForKey } from "./three/keyboardStore";
import { PANELS } from "./panels";
import profile from "./data/profile";

// The 3D bundle (three, R3F, drei) only loads when the device can run it.
const Experience = lazy(() => import("./three/Experience"));

const HINT_KEY = "desk-hint-seen";

/** Sheet header tone per section, echoing the object it lives on. */
const SHEET_TONES = {
  projects: "desktop",
  experience: "editor",
  skills: "night",
  contact: "phone",
  about: "paper",
  deskpulse: "cream",
  education: "paper",
  chennai: "night",
};

const chromeButton =
  "inline-flex items-center gap-2 rounded-full border border-ink/15 bg-cream/80 px-3.5 py-1.5 text-sm font-medium text-ink shadow-sm backdrop-blur transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 dark:border-cream/15 dark:bg-night-800/80 dark:text-cream dark:hover:bg-night-800";

function readHintSeen() {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
}

function downloadResume() {
  const link = document.createElement("a");
  link.href = profile.resume;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Home view: the 3D desk when supported, with the 2D SVG scene shown while it loads
 * and kept as the fallback when WebGL is missing or the 3D chunk fails.
 * Owns the interaction state: hover, the open section (from the URL hash), focus and shortcuts.
 */
/**
 * The 3D desk at "#desk" (overview) and "#desk/<section>". Section routing is owned by the
 * parent (useViewMode); this component receives the open section and the navigation callbacks.
 */
export default function DeskView({ theme, onToggleTheme, section: sectionId, onOpenSection, onDeskOverview, onBackToPortfolio }) {
  const isDark = theme === "dark";
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  // Dev: `?og=1` hides every overlay so the default view can be captured for og-image.png.
  const ogCapture = import.meta.env.DEV && new URLSearchParams(window.location.search).get("og") === "1";
  const supports3D = useMemo(detect3DSupport, []);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [fallbackMounted, setFallbackMounted] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [arrived, setArrived] = useState(null);
  const [hintSeen, setHintSeen] = useState(readHintSeen);
  const [helpOpen, setHelpOpen] = useState(false);
  const [seated, setSeated] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  // Arrived via the hero card: keep its poster up (not the SVG) until the 3D is ready.
  const [fromCard] = useState(() => handoff.opening);
  useEffect(() => {
    if (ready) handoff.opening = false;
  }, [ready]);
  const backToPortfolio = useCallback(() => {
    handoff.opening = false;
    handoff.returning = true;
    onBackToPortfolio();
  }, [onBackToPortfolio]);
  const buttonRefs = useRef({});
  const panelRef = useRef(null);
  const lastObject = useRef(null);

  // Chennai time of day (recomputed every minute) and live weather (cached 15 min).
  const { sky, hour, minute } = useSky();
  const weather = useChennaiWeather();

  const use3D = supports3D && !failed;
  const onReady = useCallback(() => setReady(true), []);

  const section = sectionById(sectionId ?? "");
  const active = section?.object ?? null;
  const panel = section ? PANELS[section.id] : null;
  // Desktop waits for the camera to arrive; phones and the 2D fallback show the section at once.
  const panelVisible = Boolean(section && (use3D && !isMobile ? arrived === active : true));

  // Unmount the SVG once the crossfade has finished.
  useEffect(() => {
    if (!ready) return undefined;
    const id = setTimeout(() => setFallbackMounted(false), reducedMotion ? 0 : 700);
    return () => clearTimeout(id);
  }, [ready, reducedMotion]);

  const dismissHint = useCallback(() => {
    setHintSeen(true);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const openSection = useCallback(
    (id) => {
      dismissHint();
      onOpenSection(id);
    },
    [onOpenSection, dismissHint],
  );

  const goBack = useCallback(() => onDeskOverview(), [onDeskOverview]);

  /** Click/Enter on an object: open its section, or run its action. */
  const select = useCallback(
    (object) => {
      dismissHint();
      if (object === "switchboard") {
        onToggleTheme();
        return;
      }
      if (object === "resumeSheet") {
        downloadResume();
        return;
      }
      if (object === "chair") {
        setSeated((s) => !s);
        return;
      }
      if (object === "door") {
        setDoorOpen((d) => !d);
        return;
      }
      const target = sectionForObject(object);
      if (target) openSection(target.id);
    },
    [dismissHint, onToggleTheme, openSection],
  );

  const onArrive = useCallback((object) => setArrived(object), []);

  // Keep the overlay registry in sync with the open section.
  useEffect(() => {
    overlay.name = active;
    overlay.design = panel?.design ?? overlay.design;
    if (!active) setArrived(null);
  }, [active, panel]);

  // Focus management: into the panel when it opens, back to the object's button when it closes.
  useEffect(() => {
    if (panelVisible) {
      lastObject.current = active;
      panelRef.current?.focus({ preventScroll: true });
    } else if (!active && lastObject.current) {
      buttonRefs.current[lastObject.current]?.focus({ preventScroll: true });
      lastObject.current = null;
    }
  }, [panelVisible, active]);

  // Keyboard shortcuts: 1–8 sections, Esc back, P plain view, ? help. Typing presses 3D keycaps in Skills.
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target?.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (section?.id === "skills") {
        const label = labelForKey(event.key);
        if (label) keyboardEvents.press(label);
      }
      if (event.key === "Escape") {
        if (helpOpen) setHelpOpen(false);
        else if (section) goBack();
        else if (seated) setSeated(false);
        else backToPortfolio();
        return;
      }
      if (event.key === "?") {
        setHelpOpen((open) => !open);
        return;
      }
      if (event.key === "p" || event.key === "P") {
        backToPortfolio();
        return;
      }
      const match = SECTIONS.find((s) => s.shortcut === event.key);
      if (match) openSection(match.id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [section, helpOpen, seated, goBack, backToPortfolio, openSection]);

  const PanelContent = panel?.Component;

  return (
    <div className="fixed inset-0 overflow-hidden bg-cream dark:bg-night-900">
      {use3D && (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}>
          <ErrorBoundary onError={() => setFailed(true)}>
            <Suspense fallback={null}>
              <Experience
                theme={theme}
                sky={sky}
                hour={hour}
                minute={minute}
                weather={weather}
                reducedMotion={reducedMotion}
                hovered={hovered}
                active={isMobile ? null : active}
                mobile={isMobile}
                seated={seated && !isMobile}
                doorOpen={doorOpen}
                onHover={setHovered}
                onSelect={select}
                onArrive={onArrive}
                onReady={onReady}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      {fromCard && use3D && fallbackMounted && (
        <img
          src={posterFor(theme)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
        />
      )}
      {(fallbackMounted || !use3D) && !(fromCard && use3D) && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${ready && use3D ? "pointer-events-none opacity-0" : "opacity-100"}`}
          aria-hidden={ready && use3D}
        >
          <FallbackScene sky={sky} />
        </div>
      )}

      {/* Section panel: pinned to the object's screen (desktop 3D), centred (2D fallback), or a full-screen sheet (phones). */}
      {panel && isMobile && (
        <MobileSheet title={section.label} tone={SHEET_TONES[section.id]} onClose={goBack}>
          <section ref={panelRef} tabIndex={-1} aria-label={section.label} className="min-h-full focus:outline-none focus-visible:ring-0">
            <PanelContent onBackToPortfolio={backToPortfolio} weather={weather} />
          </section>
        </MobileSheet>
      )}
      {panel && !isMobile && (
        <div
          ref={(el) => {
            overlay.el = el;
          }}
          className={`absolute left-0 top-0 origin-top-left transition-opacity duration-300 ${panelVisible ? "opacity-100" : "pointer-events-none opacity-0"} ${use3D ? "" : "!left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !scale-[0.8]"}`}
          style={{ width: panel.design.width, height: panel.design.height }}
        >
          <section
            ref={panelRef}
            tabIndex={-1}
            aria-label={section.label}
            className="h-full w-full overflow-hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {panelVisible && <PanelContent onBackToPortfolio={backToPortfolio} weather={weather} />}
          </section>
        </div>
      )}

      {/* Chrome */}
      {!ogCapture && (
      <>
      <div className="absolute left-4 top-4 sm:left-6 sm:top-5">
        {section && !isMobile && (
          <button type="button" onClick={goBack} className={chromeButton}>
            <FaArrowLeft size={13} aria-hidden="true" /> Back to desk
          </button>
        )}
        {!section && seated && !isMobile && (
          <button type="button" onClick={() => setSeated(false)} className={chromeButton}>
            <FaArrowLeft size={13} aria-hidden="true" /> Stand up
          </button>
        )}
      </div>
      <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-5">
        <button type="button" onClick={() => setHelpOpen((open) => !open)} aria-expanded={helpOpen} aria-controls="shortcut-help" aria-label="Keyboard shortcuts" className={`${chromeButton} px-3`}>
          ?
        </button>
        <button type="button" onClick={onToggleTheme} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} className={`${chromeButton} px-2.5`}>
          {isDark ? <FaSun size={15} aria-hidden="true" /> : <FaMoon size={15} aria-hidden="true" />}
        </button>
        <button type="button" onClick={backToPortfolio} className={chromeButton}>
          <FaArrowLeft size={13} aria-hidden="true" /> Back to portfolio
        </button>
      </div>
      {helpOpen && (
        <div id="shortcut-help" role="dialog" aria-label="Keyboard shortcuts" className="absolute right-4 top-16 w-64 rounded-xl border border-ink/10 bg-cream/95 p-4 text-sm text-ink shadow-xl backdrop-blur dark:border-cream/10 dark:bg-night-800/95 dark:text-cream sm:right-6">
          <p className="mb-2 font-semibold">Shortcuts</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {SECTIONS.map((s) => (
              <div key={s.id} className="contents">
                <dt><kbd className="rounded border border-ink/20 px-1.5 font-mono text-xs dark:border-cream/20">{s.shortcut}</kbd></dt>
                <dd>{s.label}</dd>
              </div>
            ))}
            <dt><kbd className="rounded border border-ink/20 px-1.5 font-mono text-xs dark:border-cream/20">Esc</kbd></dt>
            <dd>Back to desk, or back to the portfolio</dd>
            <dt><kbd className="rounded border border-ink/20 px-1.5 font-mono text-xs dark:border-cream/20">P</kbd></dt>
            <dd>Back to portfolio</dd>
            <dt><kbd className="rounded border border-ink/20 px-1.5 font-mono text-xs dark:border-cream/20">?</kbd></dt>
            <dd>This help</dd>
          </dl>
        </div>
      )}

      {!hintSeen && !section && (
        <p className={`pointer-events-none absolute left-0 right-0 text-center text-sm text-ink/70 dark:text-cream/70 ${isMobile ? "bottom-20" : "bottom-4"}`}>
          {isMobile ? "Tap anything on the desk ✨" : "Click anything on the desk · drag to look around ✨"}
        </p>
      )}

      {!section && (
        <WeatherCaption weather={weather} className={`absolute right-4 sm:right-6 ${isMobile ? "bottom-20 left-4" : "bottom-4"}`} />
      )}

      {isMobile && <MobileDock onSelect={select} activeObject={active} isDark={isDark} buttonRefs={buttonRefs} />}

      {/* Accessible list of the desk objects: canvas objects cannot receive focus themselves. */}
      {!isMobile && (
      <nav aria-label="Desk objects" className="absolute bottom-4 left-4 flex flex-wrap gap-1">
        {TAB_ORDER.map((object) => (
          <button
            key={object}
            ref={(el) => {
              buttonRefs.current[object] = el;
            }}
            type="button"
            onClick={() => select(object)}
            onFocus={() => setHovered(object)}
            onBlur={() => setHovered((current) => (current === object ? null : current))}
            className="sr-only rounded-full border border-ink/15 bg-cream/90 px-3 py-1 text-sm font-medium text-ink focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-sage-600 dark:border-cream/15 dark:bg-night-800/90 dark:text-cream"
          >
            {object === "switchboard"
              ? isDark
                ? "Turn the lights on (switchboard)"
                : "Turn the lights off (switchboard)"
              : object === "chair"
                ? seated
                  ? "Stand up (chair)"
                  : "Sit down (chair)"
                : object === "door"
                  ? doorOpen
                    ? "Close the door"
                    : "Open the door"
              : object === "resumeSheet"
                ? "Download resume (printed sheet)"
                : `Open ${LABELS[object].toLowerCase()} (${object === "window" ? "window" : object.replace(/([A-Z])/g, " $1").toLowerCase()})`}
          </button>
        ))}
      </nav>
      )}
      </>
      )}
    </div>
  );
}
